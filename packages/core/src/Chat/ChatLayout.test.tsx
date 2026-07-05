// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {ChatLayout} from './ChatLayout';

describe('ChatLayout', () => {
  it('renders children in the message area', () => {
    render(
      <ChatLayout composer={<div>composer</div>}>
        <div>Hello message</div>
      </ChatLayout>,
    );
    expect(screen.getByText('Hello message')).toBeTruthy();
  });

  it('renders composer in dock', () => {
    render(
      <ChatLayout composer={<div data-testid="composer">Compose</div>}>
        <div>msg</div>
      </ChatLayout>,
    );
    expect(screen.getByTestId('composer')).toBeTruthy();
  });

  it('renders empty state when children is empty array', () => {
    render(
      <ChatLayout
        composer={<div>composer</div>}
        emptyState={<div>No messages yet</div>}>
        {[]}
      </ChatLayout>,
    );
    expect(screen.getByText('No messages yet')).toBeTruthy();
  });

  it('prefers children over empty state when both present', () => {
    render(
      <ChatLayout
        composer={<div>composer</div>}
        emptyState={<div>No messages yet</div>}>
        <div>A message</div>
      </ChatLayout>,
    );
    expect(screen.getByText('A message')).toBeTruthy();
    expect(screen.queryByText('No messages yet')).toBeNull();
  });

  it('applies density attribute to root element', () => {
    const {rerender} = render(
      <ChatLayout
        composer={<div>composer</div>}
        data-testid="layout"
        density="compact">
        <div>msg</div>
      </ChatLayout>,
    );
    const root = screen.getByTestId('layout');
    expect(root.className).toContain('compact');

    rerender(
      <ChatLayout
        composer={<div>composer</div>}
        data-testid="layout"
        density="spacious">
        <div>msg</div>
      </ChatLayout>,
    );
    expect(root.className).toContain('spacious');
  });

  it('defaults density to balanced', () => {
    render(
      <ChatLayout composer={<div>composer</div>} data-testid="layout">
        <div>msg</div>
      </ChatLayout>,
    );
    const root = screen.getByTestId('layout');
    expect(root.className).toContain('balanced');
  });

  it('renders custom scrollButton slot', () => {
    render(
      <ChatLayout
        composer={<div>composer</div>}
        scrollButton={<button type="button">Scroll down</button>}>
        <div>msg</div>
      </ChatLayout>,
    );
    expect(screen.getByRole('button', {name: /Scroll down/})).toBeTruthy();
  });

  it('hides scrollButton when null', () => {
    render(
      <ChatLayout composer={<div>composer</div>} scrollButton={null}>
        <div>msg</div>
      </ChatLayout>,
    );
    expect(screen.queryByRole('button')).toBeNull();
  });
});

describe('ChatLayout self-scroll overflow (#2573)', () => {
  it('does not force the message area to stack full height on top of the dock', () => {
    const {container} = render(
      <ChatLayout composer={<div data-testid="composer">c</div>}>
        <div>short message</div>
      </ChatLayout>,
    );
    const root = container.firstElementChild as HTMLElement;
    const messageArea = root.firstElementChild as HTMLElement;
    const dock = root.children[1] as HTMLElement;

    // Self-scroll mode: root is the scroll container.
    expect(getComputedStyle(root).overflowY).toBe('auto');
    // The dock stays sticky so the composer pins to the bottom on scroll.
    expect(getComputedStyle(dock).position).toBe('sticky');

    // The message area and the dock share a single grid cell (both grid-row/
    // column: 1), so the dock overlaps the message tail instead of adding its
    // own flow height. Previously the message area was min-height:100% AND the
    // dock added its height on top, overflowing by exactly the dock height.
    expect(getComputedStyle(messageArea).gridRow).toBe('1');
    expect(getComputedStyle(messageArea).gridColumn).toBe('1');
    expect(getComputedStyle(dock).gridRow).toBe('1');
    expect(getComputedStyle(dock).gridColumn).toBe('1');
  });

  it('overlaps the sticky dock in a single grid cell so the composer stays at the bottom', () => {
    const {container} = render(
      <ChatLayout composer={<div>c</div>}>
        <div>short message</div>
      </ChatLayout>,
    );
    const root = container.firstElementChild as HTMLElement;
    const messageArea = root.firstElementChild as HTMLElement;
    const dock = root.children[1] as HTMLElement;

    // Root is a single-cell grid in self-scroll mode.
    expect(getComputedStyle(root).display).toBe('grid');
    // Message area fills the cell so short content still pushes the composer to
    // the bottom (empty space sits above it), keeping the composer position
    // stable as messages stream in.
    expect(getComputedStyle(messageArea).minHeight).toBe('100%');
    // The dock aligns to the bottom of the shared cell and overlaps the tail.
    expect(getComputedStyle(dock).alignSelf).toBe('end');
  });
});
