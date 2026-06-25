---
'@astryxdesign/core': patch
---

[fix] Make `Pagination`'s `changeAction` interruptible with optimistic state.
Page changes now run inside a transition and track the target page
optimistically, so the controls (indicator, active page, prev/next enablement)
reflect the page being navigated to while the action is pending. Rapid prev/next
clicks now advance through pages instead of being dropped by a re-entry guard,
and a synchronous handler that suspends (e.g. a router navigation) also drives
the pending state — matching `ToggleButton`'s action behavior. `Button`'s
`clickAction` keeps its single-fire guard (a re-click is a duplicate submit, not
new intent) and now documents why.
@cixzhang
