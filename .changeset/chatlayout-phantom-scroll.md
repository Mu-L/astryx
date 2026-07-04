---
'@astryxdesign/core': patch
---

[fix] ChatLayout: remove the phantom scrollbar in self-scroll mode. The message area was forced to the scroll container's full height while the in-flow dock added its own height on top, so the container always overflowed by the composer height even when messages were short. The self-scroll root is now a flex column and the message area grows into the remaining space instead. (#2573)

@cixzhang
