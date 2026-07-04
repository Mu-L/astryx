---
'@astryxdesign/core': patch
---

[fix] Citation: only apply `role="doc-noteref"` on the linked (anchor) form. On a plain unlinked span the role is not permitted (axe: aria-allowed-role), so it is omitted there while the `aria-label` still names the citation. (#3343)

@cixzhang
