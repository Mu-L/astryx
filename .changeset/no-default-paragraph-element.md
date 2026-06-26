---
'@astryxdesign/core': patch
---

[fix] Core components no longer render a `<p>` element by default
@cixzhang

`<p>` is phrasing-content-only in HTML — it cannot legally contain block-level
children (`<div>`, popovers/layers, block images, etc.). When block content
lands inside a `<p>`, the HTML parser reparents it and closes the `<p>` early,
so server-rendered markup and the hydrated DOM disagree and React reports a
hydration mismatch. Because components accept arbitrary content into their text
slots, any component that emits a `<p>` can be handed block content and break.

Affected components now render `<div>` (styled to preserve the previous
appearance — margins and typography were already set explicitly, so the visual
result is unchanged):

- `Banner` — `title` and `description` slots.
- `EmptyState` — `description` slot.
- `Markdown` — rendered paragraphs and image blocks. A markdown paragraph maps
  to a block `<div>` rather than `<p>`; spacing already comes from tokens. Pass
  `components={{paragraph: 'p'}}` to opt back into `<p>` semantics.

`Text` is unaffected — it already defaults to `<span>` and keeps `as="p"` as an
opt-in. No public API changes: this only changes the default rendered element.
Consumers who relied on a `<p>` tag (for example CSS selectors targeting `p`
inside these components) should update their selectors or opt in to `<p>` where
an override exists.
