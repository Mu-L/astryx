---
'@astryxdesign/core': patch
---

[feat] Button: add isInterruptible to keep the button clickable while loading
@cixzhang

New `isInterruptible` prop on `Button`. When set, the loading state still
renders the spinner and `aria-busy`, but the button is not disabled — so
clicks keep landing and can interrupt an in-flight action. Defaults to
`false`, so existing `isLoading` behavior (spinner + disabled) is unchanged.
This is what lets `ToggleButton` show a pending spinner while remaining
interruptible.
