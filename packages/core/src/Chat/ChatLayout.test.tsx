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
  it('does not force the message area to full container height', () => {
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
    // The dock sits in normal flow (sticky), so it occupies layout height.
    expect(getComputedStyle(dock).position).toBe('sticky');

    // Bug: message area is forced to 100% of the scroll container while the
    // in-flow sticky dock adds its full height on top, guaranteeing overflow
    // by the dock height even when content is short. The message area should
    // instead flex to fill the space left after the dock.
    expect(getComputedStyle(messageArea).minHeight).not.toBe('100%');
  });

  it('lays the self-scroll root out as a flex column so the dock shares height', () => {
    const {container} = render(
      <ChatLayout composer={<div>c</div>}>
        <div>short message</div>
      </ChatLayout>,
    );
    const root = container.firstElementChild as HTMLElement;
    const messageArea = root.firstElementChild as HTMLElement;

    // Root must be a flex column in self-scroll mode so the message area can
    // flex-grow into the leftover space rather than overflowing.
    expect(getComputedStyle(root).display).toBe('flex');
    expect(getComputedStyle(root).flexDirection).toBe('column');
    // Message area grows to fill remaining space and can shrink to 0.
    expect(getComputedStyle(messageArea).flexGrow).toBe('1');
    expect(parseInt(getComputedStyle(messageArea).minHeight, 10)).toBe(0);
  });
});
