---
'@astryxdesign/core': patch
---

[refactor] `useGridFocus` gains `hasRovingTabIndex`, `handleFocus`, and `isRtl`, matching the `useListFocus` API. Calendar now uses `useGridFocus` to own its roving tab stop instead of the separate `useCalendarRovingTabindex` hook.
@cixzhang
