// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file useTableTreeState.test.tsx
 * @input useTableTreeState, useTableTreeData, Table, React testing utilities
 * @output Unit tests for the tree state hook
 * @position Test file; validates flattening, expand/collapse helpers,
 *   sibling sorting, custom children keys, and lazy-loading overrides
 */

import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Table} from '../../Table';
import {useTableTreeData} from './useTableTreeData';
import {useTableTreeState} from './useTableTreeState';
import type {UseTableTreeStateConfig} from './useTableTreeState';
import type {TableColumn} from '../../types';

// =============================================================================
// Test Data
// =============================================================================

interface Node extends Record<string, unknown> {
  id: string;
  name: string;
  children?: Node[];
}

const tree: Node[] = [
  {
    id: 'b-root',
    name: 'Bravo',
    children: [
      {id: 'b-2', name: 'Zulu'},
      {id: 'b-1', name: 'Alpha', children: [{id: 'b-1-1', name: 'Mike'}]},
    ],
  },
  {id: 'a-root', name: 'Echo'},
];

const columns: TableColumn<Node>[] = [{key: 'name', header: 'Name'}];

// =============================================================================
// Test Harness
// =============================================================================

function TreeStateTable(props: Partial<UseTableTreeStateConfig<Node>>) {
  const {
    visibleData,
    treeConfig,
    expandedIds,
    toggleId,
    expandAll,
    collapseAll,
  } = useTableTreeState<Node>({
    data: tree,
    idKey: 'id',
    ...props,
  });
  const treePlugin = useTableTreeData(treeConfig);

  return (
    <div>
      <button type="button" onClick={expandAll}>
        expand all
      </button>
      <button type="button" onClick={collapseAll}>
        collapse all
      </button>
      <button type="button" onClick={() => toggleId('b-root')}>
        toggle b-root
      </button>
      <output data-testid="expanded-count">{expandedIds.size}</output>
      <Table
        data={visibleData}
        columns={columns}
        idKey="id"
        plugins={{tree: treePlugin}}
      />
    </div>
  );
}

function getRenderedNames(): string[] {
  return screen
    .getAllByRole('cell')
    .map(cell => cell.textContent?.trim() ?? '');
}

// =============================================================================
// Tests
// =============================================================================

describe('useTableTreeState', () => {
  it('flattens visible rows depth-first, preserving source order', () => {
    render(<TreeStateTable defaultExpandedIds={['b-root', 'b-1']} />);
    expect(getRenderedNames()).toEqual([
      'Bravo',
      'Zulu',
      'Alpha',
      'Mike',
      'Echo',
    ]);
  });

  it('excludes descendants of collapsed rows from visibleData', () => {
    render(<TreeStateTable defaultExpandedIds={['b-1']} />);
    // b-1 is expanded but hidden under collapsed b-root — nothing leaks out
    expect(getRenderedNames()).toEqual(['Bravo', 'Echo']);
  });

  it('expandAll expands every expandable row, including collapsed subtrees', async () => {
    const user = userEvent.setup();
    render(<TreeStateTable />);

    await user.click(screen.getByText('expand all'));
    expect(getRenderedNames()).toEqual([
      'Bravo',
      'Zulu',
      'Alpha',
      'Mike',
      'Echo',
    ]);
    // Only rows with children land in the expanded set
    expect(screen.getByTestId('expanded-count')).toHaveTextContent('2');
  });

  it('collapseAll returns to root rows only', async () => {
    const user = userEvent.setup();
    render(<TreeStateTable defaultExpandedIds={['b-root', 'b-1']} />);

    await user.click(screen.getByText('collapse all'));
    expect(getRenderedNames()).toEqual(['Bravo', 'Echo']);
    expect(screen.getByTestId('expanded-count')).toHaveTextContent('0');
  });

  it('toggleId toggles a row by ID', async () => {
    const user = userEvent.setup();
    render(<TreeStateTable />);

    await user.click(screen.getByText('toggle b-root'));
    expect(getRenderedNames()).toEqual(['Bravo', 'Zulu', 'Alpha', 'Echo']);

    await user.click(screen.getByText('toggle b-root'));
    expect(getRenderedNames()).toEqual(['Bravo', 'Echo']);
  });

  it('applies sortSiblings within each sibling group, never across levels', () => {
    const byName = (siblings: Node[]) =>
      [...siblings].sort((a, b) => a.name.localeCompare(b.name));

    render(
      <TreeStateTable
        defaultExpandedIds={['b-root', 'b-1']}
        sortSiblings={byName}
      />,
    );

    // Roots sorted (Bravo before Echo), children sorted (Alpha before Zulu),
    // but children always stay directly under their parent.
    expect(getRenderedNames()).toEqual([
      'Bravo',
      'Alpha',
      'Mike',
      'Zulu',
      'Echo',
    ]);
  });

  it('reads children from a custom childrenKey', async () => {
    const user = userEvent.setup();
    const items: Node[] = [
      {
        id: 'p',
        name: 'Parent',
        items: [{id: 'c', name: 'Child'}],
      },
    ];

    function CustomKeyTable() {
      const {visibleData, treeConfig} = useTableTreeState<Node>({
        data: items,
        idKey: 'id',
        childrenKey: 'items',
      });
      const treePlugin = useTableTreeData(treeConfig);
      return (
        <Table
          data={visibleData}
          columns={columns}
          idKey="id"
          plugins={{tree: treePlugin}}
        />
      );
    }

    render(<CustomKeyTable />);
    expect(screen.queryByText('Child')).not.toBeInTheDocument();

    await user.click(screen.getByLabelText('Expand row'));
    expect(screen.getByText('Child')).toBeInTheDocument();
  });

  it('isItemExpandable forces an expander for lazy-loaded rows', () => {
    render(
      <TreeStateTable
        isItemExpandable={item => item.id === 'a-root' || item.children != null}
      />,
    );
    // Echo has no children yet but is marked expandable (lazy loading)
    expect(screen.getAllByLabelText('Expand row')).toHaveLength(2);
  });
});
