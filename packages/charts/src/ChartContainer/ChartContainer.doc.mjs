// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('../docs-types').ComponentDoc} */

export const docs = {
  name: 'ChartContainer',
  displayName: 'Chart Container',
  category: 'Data Visualization',
  keywords: [
    'chart',
    'charts',
    'container',
    'data',
    'visualization',
    'config',
    'color',
    'legend',
    'tooltip',
  ],
  props: [
    {
      name: 'config',
      type: 'ChartConfig',
      description:
        'Maps each data key to its label and color. Each color is bridged to a scoped --color-{key} custom property for the charting engine to reference.',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Chart content — typically the charting engine\u2019s responsive container.',
      required: true,
    },
  ],
  features: [
    'Provides ChartConfig via React context (read it with useChartConfig).',
    'Bridges each series color to a scoped --color-{key} CSS custom property so the charting engine can use var(--color-{key}) on fill/stroke without parsing design tokens.',
    'Themeable through Astryx color and typography tokens — no hardcoded values.',
  ],
  examples: [
    {
      title: 'Basic usage',
      code: `import {ChartContainer, type ChartConfig} from '@astryxdesign/charts';

const config: ChartConfig = {
  revenue: {label: 'Revenue', color: 'var(--astryx-color-accent)'},
  expenses: {label: 'Expenses', color: 'var(--astryx-color-warning)'},
};

<ChartContainer config={config}>
  {/* charting engine goes here; series use fill="var(--color-revenue)" */}
</ChartContainer>;`,
    },
  ],
};
