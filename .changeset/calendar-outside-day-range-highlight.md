---
'@astryxdesign/core': patch
---

[fix] Calendar: stop range-highlighting adjacent-month (outside) days. In the two-month range view the same date renders in both panes, so the spillover copy on the neighbouring month's pane was drawn as part of the selection; outside days now never receive selection, range, or preview state. (#2715)
@cixzhang
