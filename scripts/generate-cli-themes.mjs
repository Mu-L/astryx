// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file generate-cli-themes.mjs
 *
 * Bundles theme *source* into the CLI so `astryx theme add <slug> <dest>` can
 * scaffold a theme file into a consumer's project WITHOUT requiring the theme
 * package to be installed. This mirrors how page templates are shipped under
 * `packages/cli/templates/pages/` — the CLI carries the source it scaffolds.
 *
 * For each theme package in `packages/themes/<slug>/`:
 *   - copies its `src/<slug>Theme.ts` (the defineTheme source) and the
 *     `src/icons.tsx` it imports into `packages/cli/templates/themes/<slug>/`
 *   - records metadata (display name, description, the maintained flag, the
 *     entry file, and the list of files) into a single `manifest.json`
 *
 * The maintained theme (Neutral) is included too: `theme add neutral` works,
 * even though the docsite nudges people to `npm install` it instead.
 *
 * Run from the repo root: `node scripts/generate-cli-themes.mjs`
 * Kept in sync by the CLI's prepare-ish flow / CI; commit the output so the
 * published package contains it.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, '..');
const THEMES_SRC_ROOT = path.join(REPO_ROOT, 'packages', 'themes');
const CLI_THEMES_OUT = path.join(
  REPO_ROOT,
  'packages',
  'cli',
  'templates',
  'themes',
);

// The one theme the design team maintains as an installable package. Every
// other theme is an example users copy into their own file. Keep in sync with
// MAINTAINED_THEME_PACKAGE in apps/docsite/src/components/ThemePackagePage.tsx.
const MAINTAINED_SLUG = 'neutral';

/** kebab/lowercase slug → camelCase identifier (matches the source files). */
function toIdentifier(slug) {
  return slug.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

/** Title-case a slug for display ("y2k" → "Y2K" is special-cased). */
function toDisplayName(slug) {
  if (slug === 'y2k') return 'Y2K';
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

function listThemeSlugs() {
  if (!fs.existsSync(THEMES_SRC_ROOT)) return [];
  return fs
    .readdirSync(THEMES_SRC_ROOT, {withFileTypes: true})
    .filter(e => e.isDirectory())
    .map(e => e.name)
    .filter(slug => {
      // A theme dir must have a package.json + a src/<slug>Theme.ts to qualify.
      const pkg = path.join(THEMES_SRC_ROOT, slug, 'package.json');
      const themeFile = path.join(
        THEMES_SRC_ROOT,
        slug,
        'src',
        `${toIdentifier(slug)}Theme.ts`,
      );
      return fs.existsSync(pkg) && fs.existsSync(themeFile);
    })
    .sort();
}

function main() {
  const slugs = listThemeSlugs();
  if (slugs.length === 0) {
    console.warn('generate-cli-themes: no theme packages found — skipping.');
    return;
  }

  // Reset the output dir so removed themes don't linger.
  fs.rmSync(CLI_THEMES_OUT, {recursive: true, force: true});
  fs.mkdirSync(CLI_THEMES_OUT, {recursive: true});

  const entries = [];

  for (const slug of slugs) {
    const id = toIdentifier(slug);
    const srcDir = path.join(THEMES_SRC_ROOT, slug, 'src');
    const themeFileName = `${id}Theme.ts`;
    const themeFile = path.join(srcDir, themeFileName);

    // The theme file imports './icons' — copy that too so the scaffold is a
    // working unit. If a theme ever drops the icons file, skip it gracefully.
    const iconsFile = path.join(srcDir, 'icons.tsx');
    const hasIcons = fs.existsSync(iconsFile);

    const outDir = path.join(CLI_THEMES_OUT, slug);
    fs.mkdirSync(outDir, {recursive: true});

    const files = [themeFileName];
    fs.copyFileSync(themeFile, path.join(outDir, themeFileName));
    if (hasIcons) {
      files.push('icons.tsx');
      fs.copyFileSync(iconsFile, path.join(outDir, 'icons.tsx'));
    }

    // Pull the human description from the package.json (falls back to empty).
    let description = '';
    try {
      const pkg = readJSON(path.join(THEMES_SRC_ROOT, slug, 'package.json'));
      description = pkg.description || '';
    } catch {
      /* best-effort */
    }

    entries.push({
      slug,
      displayName: toDisplayName(slug),
      description,
      maintained: slug === MAINTAINED_SLUG,
      // The file a consumer renames to make the theme theirs.
      entry: themeFileName,
      exportName: `${id}Theme`,
      files,
    });

    console.log(`  bundled theme "${slug}" (${files.length} files)`);
  }

  const manifest = {
    // Bump if the on-disk shape changes so the reader can guard against drift.
    version: 1,
    generatedBy: 'scripts/generate-cli-themes.mjs',
    themes: entries,
  };
  fs.writeFileSync(
    path.join(CLI_THEMES_OUT, 'manifest.json'),
    JSON.stringify(manifest, null, 2) + '\n',
  );

  console.log(
    `generate-cli-themes: wrote ${entries.length} themes + manifest to ${path.relative(REPO_ROOT, CLI_THEMES_OUT)}`,
  );
}

main();
