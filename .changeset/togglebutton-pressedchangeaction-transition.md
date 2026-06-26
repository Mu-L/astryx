---
'@astryxdesign/core': patch
---

[fix] ToggleButton runs pressedChangeAction in an interruptible transition with optimistic state
@cixzhang

`pressedChangeAction` was fired as a non-awaited promise, so the documented
loading spinner never appeared and the toggle ignored the action's lifecycle.
It now runs inside a transition with an optimistic pressed state, matching
`Switch`:

- The optimistic pressed state flips immediately on click, and a spinner shows
  while the action is pending.
- The action is interruptible — the button stays clickable while pending, so
  clicking again starts a new transition with the next optimistic state (e.g.
  true -> false -> true) instead of being dropped or blocked behind a disabled
  spinner.
- Synchronous handlers are supported too: a `pressedChangeAction` (or
  `onPressedChange`) that synchronously triggers a suspending update, such as
  a router navigation that suspends on data, also drives the pending state.
  `pressedChangeAction` now accepts `void | Promise<void>`.
