---
'@astryxdesign/core': patch
---

[fix] Fix HoverCard SSR hydration mismatch by rendering its layer inline (#3107)
@cixzhang

HoverCard previously portaled its floating layer into `document.body` behind a
`typeof document` check. During server rendering nothing was emitted, but the
first client render produced the portaled popover, so the server and client
trees disagreed and React reported a hydration mismatch when a HoverCard was
used inside a Client Component on an SSR page.

The layer no longer uses a portal. Its `popover` element is opened with the
Popover API, which promotes it to the browser top layer — that already escapes
ancestor clipping, stacking, and transform containing-block traps, and CSS
anchor positioning resolves the trigger reference regardless of where the
element sits in the DOM. The layer is now rendered inline with inline-safe
phrasing markup (a `span`), identically on the server and the client, so there
is nothing for hydration to mismatch. Rendering inline also lets the card
inherit the trigger's theme cascade and keeps its content in natural focus
order — both of which the portal silently broke.

No API change. Note that a HoverCard whose content includes block elements
should not be placed directly inside phrasing-only contexts such as a `p`,
`label`, or heading; wrap the surrounding text in a block element instead.
