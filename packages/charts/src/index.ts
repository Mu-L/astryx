// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @astryxdesign/charts — Astryx chart components
 *
 * Thin, themeable wrappers over a peer charting engine. The package owns the
 * design-system surface (config-driven labels + colors, a CSS-variable color
 * bridge, and themed tooltip/legend chrome) while leaving the rendering engine
 * as a peer dependency the consumer manages.
 *
 * This package is published to npm ONLY under the @canary dist-tag
 * (npm install @astryxdesign/charts@canary). It is never released as a
 * stable (latest) version.
 */

export {ChartContainer, useChartConfig} from './ChartContainer';
export type {ChartContainerProps} from './ChartContainer';
export type {ChartConfig, ChartSeriesConfig} from './types';
