// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file Programmatic API for `astryx theme add`.
 *
 * Scaffolds a theme's *source* into a consumer's project so they can own and
 * customize it — the copy-and-keep counterpart to installing a maintained
 * theme package. The theme sources are bundled into the CLI under
 * `templates/themes/` (see scripts/generate-cli-themes.mjs), so this works
 * without the theme package being installed, exactly like page templates.
 *
 * A theme is a small unit of files: the `defineTheme` source plus the
 * `icons.tsx` it imports. We copy the whole unit so the scaffolded theme
 * renders without further setup; the consumer renames/edits from there.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import {CLI_ROOT} from '../utils/paths.mjs';
import {assertWithin, PathSafetyError} from '../utils/path-safety.mjs';
import {AstryxError} from './error.mjs';
import {ERROR_CODES} from '../lib/error-codes.mjs';

const THEMES_DIR = path.join(CLI_ROOT, 'templates', 'themes');
const MANIFEST_PATH = path.join(THEMES_DIR, 'manifest.json');

// Repo-only copyright header. Stripped from scaffolded files so the theme the
// consumer now owns doesn't carry our internal boilerplate (mirrors how the
// docsite strips it from copied/rendered examples). Preserves any leading BOM
// or shebang, like stripCodeExampleCopyrightHeader in the docsite.
const META_COPYRIGHT_HEADER_RE =
  /^(\uFEFF?(?:#![^\r\n]*(?:\r?\n))?)\/\/ Copyright \(c\) Meta Platforms, Inc\. and affiliates\.\r?\n(?:\r?\n)*/;

/** Strip the repo copyright header from a scaffolded file's contents. */
function stripCopyrightHeader(source) {
  return source.replace(META_COPYRIGHT_HEADER_RE, '$1');
}

/**
 * Load the bundled-theme manifest. Returns the parsed `themes` array, or an
 * empty array if the bundle is missing (e.g. generator never ran). Throws only
 * on a corrupt manifest, since that signals a real packaging bug.
 *
 * @returns {Array<{slug: string, displayName: string, description: string, maintained: boolean, entry: string, exportName: string, files: string[]}>}
 */
export function listThemes() {
  if (!fs.existsSync(MANIFEST_PATH)) return [];
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } catch (err) {
    throw new AstryxError(
      `Theme bundle manifest is unreadable (${MANIFEST_PATH}): ${err.message}`,
      undefined,
      ERROR_CODES.ERR_NO_SOURCE,
    );
  }
  return Array.isArray(manifest.themes) ? manifest.themes : [];
}

/** Find one theme entry by slug (case-insensitive), or undefined. */
function findTheme(slug) {
  if (!slug) return undefined;
  const lc = String(slug).toLowerCase();
  return listThemes().find(t => t.slug.toLowerCase() === lc);
}

/**
 * Default scaffold destination for a theme when the user omits a path. Mirrors
 * the convention the docsite shows (`./src/themes/<slug>.ts`). Returns a
 * directory the theme's files land in, plus the suggested entry rename.
 */
function defaultTargetDir(slug) {
  return path.join('src', 'themes', slug);
}

/**
 * Resolve the scaffold plan for `theme add`.
 *
 * Behaviors:
 *   - no slug, or `list` → returns the theme list
 *   - slug only (no targetPath) → defaults the destination to
 *     `src/themes/<slug>/`
 *   - copies every file in the theme unit into the destination directory
 *
 * @param {string} [slug] - Theme slug (e.g. "matcha").
 * @param {object} [options]
 * @param {boolean} [options.list] - Force the list view.
 * @param {string} [options.targetPath] - Destination directory (relative to cwd).
 * @param {boolean} [options.overwrite] - Allow clobbering existing files.
 * @param {string} [options.cwd]
 * @returns {Promise<{type: string, data: unknown}>}
 */
export async function themeAdd(slug, options = {}) {
  const {list = false, targetPath, overwrite = false, cwd = process.cwd()} =
    options;
  const themes = listThemes();

  if (list || !slug) {
    return {
      type: 'theme.list',
      data: themes.map(t => ({
        slug: t.slug,
        displayName: t.displayName,
        description: t.description,
        maintained: t.maintained,
      })),
    };
  }

  const match = findTheme(slug);
  if (!match) {
    throw new AstryxError(
      `Unknown theme "${slug}"`,
      themes.map(t => ({
        name: t.slug,
        reason: t.maintained ? 'maintained theme' : 'example theme',
      })),
      ERROR_CODES.ERR_UNKNOWN_THEME,
    );
  }

  const themeSrcDir = path.join(THEMES_DIR, match.slug);

  // Resolve the destination dir (path-safe). Default to the conventional
  // location when the user omits it so `theme add matcha` "just works".
  const rawTarget = targetPath || defaultTargetDir(match.slug);
  let resolvedDir;
  try {
    resolvedDir = assertWithin(rawTarget, cwd, {label: 'theme target path'});
  } catch (err) {
    if (err instanceof PathSafetyError) {
      throw new AstryxError(
        err.message,
        undefined,
        ERROR_CODES.ERR_PATH_TRAVERSAL,
      );
    }
    throw err;
  }

  // Verify every source file exists before writing anything.
  const writes = match.files.map(name => ({
    name,
    src: path.join(themeSrcDir, name),
    dest: path.join(resolvedDir, name),
  }));
  for (const w of writes) {
    if (!fs.existsSync(w.src)) {
      throw new AstryxError(
        `Theme "${match.slug}" is missing bundled file "${w.name}". ` +
          `Re-run \`node scripts/generate-cli-themes.mjs\` to rebuild the bundle.`,
        undefined,
        ERROR_CODES.ERR_NO_SOURCE,
      );
    }
  }

  // Collision detection: refuse to clobber unless --overwrite. Report the
  // first existing file (the caller surfaces a friendly message / prompt).
  if (!overwrite) {
    const existing = writes.find(w => fs.existsSync(w.dest));
    if (existing) {
      const rel = path.relative(cwd, existing.dest) || existing.dest;
      throw new AstryxError(
        `Refusing to overwrite existing file ${rel}. ` +
          `Re-run with --overwrite (or -f) to replace it.`,
        undefined,
        ERROR_CODES.ERR_FILE_EXISTS,
      );
    }
  }

  // Stage-then-commit write: copy to temp files, then rename into place. If
  // any copy fails we roll back partial temps so we never leave a half-written
  // theme behind.
  fs.mkdirSync(resolvedDir, {recursive: true});
  const staged = [];
  try {
    for (const w of writes) {
      const tmp = `${w.dest}.${process.pid}.tmp`;
      // Read + strip the repo header so the user's copy is clean, then write.
      const contents = stripCopyrightHeader(fs.readFileSync(w.src, 'utf-8'));
      fs.writeFileSync(tmp, contents);
      staged.push({tmp, dest: w.dest});
    }
    for (const s of staged) {
      fs.renameSync(s.tmp, s.dest);
    }
  } catch (err) {
    for (const s of staged) {
      try {
        fs.rmSync(s.tmp, {force: true});
      } catch {
        /* best-effort */
      }
    }
    throw new AstryxError(
      `Failed to write theme files: ${err.message}`,
      undefined,
      ERROR_CODES.ERR_WRITE_FAILED,
    );
  }

  const relDir = path.relative(cwd, resolvedDir) || '.';
  return {
    type: 'theme.add',
    data: {
      slug: match.slug,
      displayName: match.displayName,
      maintained: match.maintained,
      outputDir: relDir,
      entry: match.entry,
      exportName: match.exportName,
      files: match.files,
    },
  };
}
