---
'@astryxdesign/core': patch
---

[fix] ChatLayout: remove the phantom scrollbar in self-scroll mode without unpinning the composer. The message area was forced to the scroll container's full height while the in-flow dock added its own height on top, so the container always overflowed by the composer height even when messages were short. The self-scroll root is now a single-cell grid: the message area and the sticky dock share one cell, so the dock overlaps the message tail instead of adding flow height. The composer stays docked at the bottom for both short and long content and its position stays stable as messages stream in. (#2573)

@cixzhang
