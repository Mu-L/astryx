// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/**
 * @file ChartContainer.tsx
 * @input Uses React (useId, useMemo, createContext), stylex, color/spacing/
 *   typography tokens from @astryxdesign/core, ChartConfig
 * @output Exports ChartContainer, ChartContainerProps, useChartConfig
 * @position Core implementation; consumed by index.ts
 *
 * ChartContainer is the root wrapper for a chart. It establishes two things:
 *   1. A React context carrying the ChartConfig (labels + colors), so tooltip
 *      and legend components can read a series' label/color by data key.
 *   2. A CSS-variable bridge: for each configured key with a `color`, it emits
 *      a scoped `--color-{key}` custom property on the wrapper. The charting
 *      engine then references `var(--color-{key})` on fill/stroke — resolved at
 *      render time — so it never needs to parse a design-token reference itself.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/charts/src/ChartContainer/ChartContainer.doc.mjs (props, features)
 * - /packages/charts/src/ChartContainer/ChartContainer.test.tsx (behavior tests)
 * - /packages/charts/src/ChartContainer/index.ts (exports if types change)
 * - /packages/charts/README.md (usage)
 */

import {
  createContext,
  useContext,
  useId,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from 'react';
import * as stylex from '@stylexjs/stylex';

import {
  colorVars,
  spacingVars,
  typeScaleVars,
} from '@astryxdesign/core/theme/tokens.stylex';
import {mergeProps, themeProps} from '@astryxdesign/core/utils';
import type {BaseProps} from '@astryxdesign/core';

import type {ChartConfig} from '../types';

const ChartConfigContext = createContext<ChartConfig | null>(null);

/**
 * Read the ChartConfig from the nearest ChartContainer.
 *
 * Returns an empty config when called outside a container so consumers never
 * have to null-check.
 */
export function useChartConfig(): ChartConfig {
  return useContext(ChartConfigContext) ?? {};
}

export interface ChartContainerProps extends BaseProps<HTMLDivElement> {
  /** Ref forwarded to the root element. */
  ref?: React.Ref<HTMLDivElement>;
  /** Maps data keys to their label and color. */
  config: ChartConfig;
  /** Chart content (typically the charting engine's responsive container). */
  children: ReactNode;
}

const styles = stylex.create({
  root: {
    display: 'flex',
    width: '100%',
    justifyContent: 'center',
    color: colorVars['--color-text-secondary'],
    fontSize: typeScaleVars['--text-supporting-size'],
    lineHeight: typeScaleVars['--text-supporting-leading'],
    padding: spacingVars['--spacing-0'],
  },
});

/**
 * Root wrapper for an Astryx chart.
 *
 * Provides the ChartConfig via context and bridges each series' `color` to a
 * scoped `--color-{key}` custom property for the charting engine to consume.
 */
export function ChartContainer({
  config,
  children,
  xstyle,
  className,
  style,
  ref,
  ...rest
}: ChartContainerProps) {
  const reactId = useId();
  const chartId = `astryx-chart-${reactId.replace(/[:]/g, '')}`;

  const colorVarStyle = useMemo(() => {
    const vars: Record<string, string> = {};
    for (const [key, series] of Object.entries(config)) {
      if (series.color) {
        vars[`--color-${key}`] = series.color;
      }
    }
    return vars as CSSProperties;
  }, [config]);

  const mergedStyle = style ? {...colorVarStyle, ...style} : colorVarStyle;

  return (
    <ChartConfigContext.Provider value={config}>
      <div
        ref={ref}
        {...mergeProps(
          themeProps('chart-container'),
          stylex.props(styles.root, xstyle),
          className,
          mergedStyle,
        )}
        data-chart={chartId}
        {...rest}>
        {children}
      </div>
    </ChartConfigContext.Provider>
  );
}
