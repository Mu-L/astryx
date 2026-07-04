// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file types.ts
 * @input None (pure type definitions)
 * @output Exports ChartConfig and ChartSeriesConfig — the config contract that
 *   maps data keys to their label and color for the CSS-variable bridge
 * @position Type foundation for @astryxdesign/charts; consumed by ChartContainer
 *   and index.ts
 *
 * SYNC: When modified, update this header and /packages/charts/README.md
 */

import type {ReactNode} from 'react';

/**
 * Configuration for a single data series (one key in your data).
 *
 * `color` is any CSS color value and is typically a design token reference —
 * e.g. `var(--astryx-color-accent)`. ChartContainer resolves it into a scoped
 * `--color-{key}` custom property so the charting engine can reference it as
 * `var(--color-{key})` on `fill`/`stroke` without needing to parse the token.
 */
export interface ChartSeriesConfig {
  /** Human-readable label shown in tooltips and legends. */
  label?: ReactNode;
  /**
   * Any CSS color value. Prefer a design-token reference
   * (e.g. `var(--astryx-color-accent)`) over a raw hex/rgb value.
   */
  color?: string;
}

/**
 * Maps each data key to its display label and color.
 *
 * @example
 * ```
 * const config: ChartConfig = {
 *   revenue: {label: 'Revenue', color: 'var(--astryx-color-accent)'},
 *   expenses: {label: 'Expenses', color: 'var(--astryx-color-warning)'},
 * };
 * ```
 */
export type ChartConfig = Record<string, ChartSeriesConfig>;
