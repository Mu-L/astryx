// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file useListFocus.test.tsx
 * @input Uses vitest, @testing-library/react, useListFocus hook
 * @output Unit tests for useListFocus disabled-item skipping + navigation
 * @position Testing; validates useListFocus.ts keyboard navigation
 *
 * SYNC: When useListFocus.ts changes, update tests to match new behavior
 */

import {describe, it, expect} from 'vitest';
import {render, screen, fireEvent} from '@testing-library/react';
import {useListFocus} from './useListFocus';

const NO_DISABLED: string[] = [];

function Menu({
  wrap = true,
  disabledLabels = NO_DISABLED,
}: {
  wrap?: boolean;
  disabledLabels?: string[];
}) {
  const {listRef, handleKeyDown} = useListFocus<HTMLDivElement>({wrap});
  const items = ['One', 'Two', 'Three', 'Four'];
  return (
    <div ref={listRef} role="menu" onKeyDown={handleKeyDown}>
      {items.map(label => {
        const disabled = disabledLabels.includes(label);
        return (
          <div
            key={label}
            role="menuitem"
            tabIndex={disabled ? undefined : -1}
            aria-disabled={disabled || undefined}
            data-testid={label}>
            {label}
          </div>
        );
      })}
    </div>
  );
}

describe('useListFocus disabled-item skipping', () => {
  it('ArrowDown skips a disabled item instead of stalling on it', () => {
    render(<Menu disabledLabels={['Two']} />);
    const menu = screen.getByRole('menu');
    screen.getByTestId('One').focus();

    fireEvent.keyDown(menu, {key: 'ArrowDown'});
    // Should skip disabled "Two" and land on "Three".
    expect(screen.getByTestId('Three')).toHaveFocus();
  });

  it('ArrowUp skips a disabled item', () => {
    render(<Menu disabledLabels={['Three']} />);
    const menu = screen.getByRole('menu');
    screen.getByTestId('Four').focus();

    fireEvent.keyDown(menu, {key: 'ArrowUp'});
    // Should skip disabled "Three" and land on "Two".
    expect(screen.getByTestId('Two')).toHaveFocus();
  });

  it('does not freeze at a leading disabled item (regression: menus-4)', () => {
    render(<Menu disabledLabels={['One']} />);
    const menu = screen.getByRole('menu');
    // Focus starts nowhere; ArrowDown should reach the first ENABLED item.
    fireEvent.keyDown(menu, {key: 'ArrowDown'});
    expect(screen.getByTestId('Two')).toHaveFocus();
  });

  it('wraps past a disabled item at the end', () => {
    render(<Menu disabledLabels={['Four']} wrap />);
    const menu = screen.getByRole('menu');
    screen.getByTestId('Three').focus();

    fireEvent.keyDown(menu, {key: 'ArrowDown'});
    // "Four" is disabled, wrap to "One".
    expect(screen.getByTestId('One')).toHaveFocus();
  });

  it('does not wrap when wrap is false', () => {
    render(<Menu disabledLabels={['Four']} wrap={false} />);
    const menu = screen.getByRole('menu');
    screen.getByTestId('Three').focus();

    fireEvent.keyDown(menu, {key: 'ArrowDown'});
    // "Four" disabled, no wrap -> focus stays on "Three".
    expect(screen.getByTestId('Three')).toHaveFocus();
  });

  it('Home focuses the first enabled item, End the last enabled item', () => {
    render(<Menu disabledLabels={['One', 'Four']} />);
    const menu = screen.getByRole('menu');
    screen.getByTestId('Two').focus();

    fireEvent.keyDown(menu, {key: 'End'});
    expect(screen.getByTestId('Three')).toHaveFocus();

    fireEvent.keyDown(menu, {key: 'Home'});
    expect(screen.getByTestId('Two')).toHaveFocus();
  });
});
