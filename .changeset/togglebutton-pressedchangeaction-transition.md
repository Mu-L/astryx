---
'@astryxdesign/core': patch
---

[fix] ToggleButton runs pressedChangeAction in a transition so it shows a pending state
@cixzhang

`pressedChangeAction` was fired as a non-awaited promise, so the documented
loading spinner never appeared and rapid clicks could fire the action multiple
times. It is now wrapped in a transition: the button shows its loading state
(disabled + `aria-busy`) while the async action is in flight, and re-entrant
clicks are ignored until it settles — matching `Button`'s `clickAction`.
