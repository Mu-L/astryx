---
'@astryxdesign/core': patch
'@astryxdesign/cli': patch
'@astryxdesign/build': patch
---

[breaking] Remove the daily, brutalist, and default themes; neutral is the new baseline
@cixzhang

Three theme packages are removed from the repo and will no longer be published:

- `@astryxdesign/theme-daily`
- `@astryxdesign/theme-brutalist`
- `@astryxdesign/theme-default`

Consumers importing any of these must switch to a maintained theme. The
recommended replacement is `@astryxdesign/theme-neutral`:

```
- import {defaultTheme} from '@astryxdesign/theme-default/built';
+ import {neutralTheme} from '@astryxdesign/theme-neutral/built';

- <Theme theme={defaultTheme}>...</Theme>
+ <Theme theme={neutralTheme}>...</Theme>
```

All in-repo references (example apps, docs, CLI scaffolding/doctor, build
transpile list, Storybook stories, sandbox, and docsite registries) now point
at `@astryxdesign/theme-neutral`. The CLI `init` flow and example apps default
to neutral.

Note: the last published versions of these three packages remain available on
npm (`@astryxdesign/theme-default`, and the `0.0.0-bootstrap.0` builds of
`theme-daily` / `theme-brutalist`); they are now orphaned and will receive no
further updates. They can be deprecated on npm separately if desired.
