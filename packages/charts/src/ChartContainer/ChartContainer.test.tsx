// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, it, expect} from 'vitest';
import {render, renderHook, screen} from '@testing-library/react';

import {ChartContainer, useChartConfig} from './ChartContainer';
import type {ChartConfig} from '../types';

const config: ChartConfig = {
  revenue: {label: 'Revenue', color: 'var(--astryx-color-accent)'},
  expenses: {label: 'Expenses', color: 'var(--astryx-color-warning)'},
  count: {label: 'Count'},
};

describe('ChartContainer', () => {
  it('renders its children', () => {
    render(
      <ChartContainer config={config}>
        <div data-testid="chart-body">chart</div>
      </ChartContainer>,
    );
    expect(screen.getByTestId('chart-body')).toBeInTheDocument();
  });

  it('bridges each configured color to a scoped --color-{key} custom property', () => {
    render(
      <ChartContainer config={config}>
        <div data-testid="chart-body" />
      </ChartContainer>,
    );
    const root = screen.getByTestId('chart-body').parentElement as HTMLElement;
    expect(root.style.getPropertyValue('--color-revenue')).toBe(
      'var(--astryx-color-accent)',
    );
    expect(root.style.getPropertyValue('--color-expenses')).toBe(
      'var(--astryx-color-warning)',
    );
  });

  it('omits a --color var for keys without a color', () => {
    render(
      <ChartContainer config={config}>
        <div data-testid="chart-body" />
      </ChartContainer>,
    );
    const root = screen.getByTestId('chart-body').parentElement as HTMLElement;
    expect(root.style.getPropertyValue('--color-count')).toBe('');
  });

  it('renders a stable astryx-chart-container class', () => {
    render(
      <ChartContainer config={config}>
        <div data-testid="chart-body" />
      </ChartContainer>,
    );
    const root = screen.getByTestId('chart-body').parentElement as HTMLElement;
    expect(root.className).toContain('astryx-chart-container');
  });

  it('forwards a ref to the root element', () => {
    let node: HTMLDivElement | null = null;
    render(
      <ChartContainer
        config={config}
        ref={n => {
          node = n;
        }}>
        <div data-testid="chart-body" />
      </ChartContainer>,
    );
    expect(node).toBeInstanceOf(HTMLDivElement);
  });
});

describe('useChartConfig', () => {
  it('returns the config from the nearest ChartContainer', () => {
    const {result} = renderHook(() => useChartConfig(), {
      wrapper: ({children}) => (
        <ChartContainer config={config}>{children}</ChartContainer>
      ),
    });
    expect(result.current.revenue?.label).toBe('Revenue');
  });

  it('returns an empty config outside a ChartContainer', () => {
    const {result} = renderHook(() => useChartConfig());
    expect(result.current).toEqual({});
  });
});
