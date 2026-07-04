# @astryxdesign/charts

Astryx chart components. This package provides thin, themeable wrappers over a peer charting engine — it owns the design-system surface (config-driven labels + colors, a CSS-variable color bridge, and themed chart chrome) while leaving the rendering engine as a peer dependency the consumer manages.

It ships to npm **only under the `@canary` dist-tag** — there is never a stable (`latest`) release yet.

## Status

**Bootstrapping.** The public API is not finalized. Today the package ships:

- **`ChartContainer`** — the root wrapper. Provides a `ChartConfig` via context and bridges each series' color to a scoped `--color-{key}` custom property.
- **`ChartConfig` / `ChartSeriesConfig`** — the config contract mapping data keys to a label and color.
- **`useChartConfig()`** — read the active config from within a container.

More components (tooltip, legend, and the data-viz color token system) will land incrementally. The color token taxonomy is intentionally **not** committed yet — it is still under discussion.

## The color bridge

Charting engines generally can't parse a CSS-variable reference like `var(--astryx-color-accent)` inside their internal color math. `ChartContainer` solves this the industry-standard way: for each configured key with a `color`, it emits a scoped `--color-{key}` custom property on the wrapper. The engine then references `var(--color-{key})` on `fill`/`stroke`, resolved at render time.

```tsx
import {ChartContainer, type ChartConfig} from '@astryxdesign/charts';

const config: ChartConfig = {
  revenue: {label: 'Revenue', color: 'var(--astryx-color-accent)'},
  expenses: {label: 'Expenses', color: 'var(--astryx-color-warning)'},
};

<ChartContainer config={config}>
  {/* charting engine here; series use fill="var(--color-revenue)" */}
</ChartContainer>;
```

## Usage

Inside the monorepo (storybook/sandbox), imports resolve via pnpm workspaces:

```tsx
import {ChartContainer} from '@astryxdesign/charts';
```

### Trying charts in your own project (canary)

`@astryxdesign/charts` is published **only** under the `@canary` dist-tag, so you must request that tag explicitly. There is no `latest` version to install.

```bash
npm install @astryxdesign/charts@canary @astryxdesign/core@canary
```

```tsx
import {ChartContainer} from '@astryxdesign/charts';
import '@astryxdesign/core/astryx.css';
import '@astryxdesign/charts/charts.css';
```

> Canary builds track the latest commit on `main` (`0.x.y-canary.<sha>`). They can break between any two versions — pin an exact version if you need stability.

## Why no stable release?

`package.json` keeps `"private": true` plus an `"astryx": { "canaryOnly": true }` marker. The release workflow's stable (`latest`) job skips both private and `canaryOnly` packages, while the canary job strips `private` in its ephemeral CI checkout only (never in git) to publish the `@canary` tag. The committed `private: true` is npm's hard guarantee that no stable publish can ever happen — **do not remove it.**
