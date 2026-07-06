---
'@astryxdesign/core': patch
---

[feat] Markdown: support CommonMark link reference definitions. Reference-style "footer" links — full `[text][label]`, collapsed `[text][]`, and shortcut `[text]` (plus their `![alt]` image forms) — now resolve against a `[label]: destination "title"` block, which is stripped from the output instead of leaking as a visible paragraph. Labels match case-insensitively with collapsed whitespace; top-level definitions are collected across the document (so a reference can precede its definition, including in the streaming/incremental parser, whose settled-block cache invalidates when definitions change). Footnotes (`[^1]`) are intentionally left untouched. Known limit: a definition nested inside a blockquote/list resolves within that container but is not yet exposed document-wide. (#3621)
@lexs
