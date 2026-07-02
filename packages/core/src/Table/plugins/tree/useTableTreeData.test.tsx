// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file useTableTreeData.test.tsx
 * @input useTableTreeData, useTableTreeState, Table, React testing utilities
 * @output Functional tests for the tree plugin
 * @position Test file; validates tree rendering, ARIA, keyboard, controlled
 *   and uncontrolled expansion, and composition with other plugins
 */

import {describe, it, expect, vi} from 'vitest';
import {useState} from 'react';
import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {Table} from '../../Table';
import {useTableSelection} from '../selection/useTableSelection';
import {useTableTreeData} from './useTableTreeData';
import {useTableTreeState} from './useTableTreeState';
import type {UseTableTreeStateConfig} from './useTableTreeState';
import type {TableColumn} from '../../types';

// =============================================================================
// Test Data
// =============================================================================

interface FileRow extends Record<string, unknown> {
  id: string;
  name: string;
  kind: string;
  children?: FileRow[];
}

const fileTree: FileRow[] = [
  {
    id: 'src',
    name: 'src',
    kind: 'folder',
    children: [
      {id: 'app', name: 'App.tsx', kind: 'file'},
      {
        id: 'components',
        name: 'components',
        kind: 'folder',
        children: [{id: 'button', name: 'Button.tsx', kind: 'file'}],
      },
    ],
  },
  {id: 'readme', name: 'README.md', kind: 'file'},
];

const flatFiles: FileRow[] = [
  {id: 'a', name: 'a.txt', kind: 'file'},
  {id: 'b', name: 'b.txt', kind: 'file'},
];

const columns: TableColumn<FileRow>[] = [
  {key: 'name', header: 'Name'},
  {key: 'kind', header: 'Kind'},
];

// =============================================================================
// Test Harness
// =============================================================================

function TreeTable({
  data = fileTree,
  hasHover = false,
  withSelection = false,
  ...treeOptions
}: Partial<UseTableTreeStateConfig<FileRow>> & {
  hasHover?: boolean;
  withSelection?: boolean;
}) {
  const {visibleData, treeConfig} = useTableTreeState<FileRow>({
    data,
    idKey: 'id',
    ...treeOptions,
  });
  const treePlugin = useTableTreeData(treeConfig);

  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const selectionPlugin = useTableSelection<FileRow>({
    getIsItemSelected: item => selectedKeys.has(item.id),
    onSelectItem: ({item, isSelected}) => {
      setSelectedKeys(prev => {
        const next = new Set(prev);
        if (isSelected) {
          next.add(item.id);
        } else {
          next.delete(item.id);
        }
        return next;
      });
    },
    onSelectAll: () => {},
    getIsAllSelected: () => false,
  });

  return (
    <Table
      data={visibleData}
      columns={columns}
      idKey="id"
      hasHover={hasHover}
      plugins={
        withSelection
          ? {tree: treePlugin, selection: selectionPlugin}
          : {tree: treePlugin}
      }
    />
  );
}

/** Controlled harness — expansion state lives outside the hooks. */
function ControlledTreeTable({
  expandedIds,
  onExpandedIdsChange,
}: {
  expandedIds: ReadonlySet<string>;
  onExpandedIdsChange: (ids: ReadonlySet<string>) => void;
}) {
  const {visibleData, treeConfig} = useTableTreeState<FileRow>({
    data: fileTree,
    idKey: 'id',
    expandedIds,
    onExpandedIdsChange,
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

function getBodyRows(): HTMLElement[] {
  // Skip the header row
  return screen.getAllByRole('row').slice(1);
}

// =============================================================================
// Tests
// =============================================================================

describe('useTableTreeData', () => {
  it('renders only root rows initially', () => {
    render(<TreeTable />);
    expect(getBodyRows()).toHaveLength(2);
    expect(screen.getByText('src')).toBeInTheDocument();
    expect(screen.getByText('README.md')).toBeInTheDocument();
    expect(screen.queryByText('App.tsx')).not.toBeInTheDocument();
  });

  it('renders an expander button only on rows with children', () => {
    render(<TreeTable />);
    expect(screen.getAllByLabelText('Expand row')).toHaveLength(1);
    const readmeRow = getBodyRows()[1];
    expect(within(readmeRow).queryByRole('button')).not.toBeInTheDocument();
  });

  it('expands children on expander click and unmounts them on collapse', async () => {
    const user = userEvent.setup();
    render(<TreeTable />);

    await user.click(screen.getByLabelText('Expand row'));
    expect(screen.getByText('App.tsx')).toBeInTheDocument();
    expect(screen.getByText('components')).toBeInTheDocument();
    // Grandchild stays unmounted while its parent is collapsed
    expect(screen.queryByText('Button.tsx')).not.toBeInTheDocument();
    expect(getBodyRows()).toHaveLength(4);

    await user.click(screen.getByLabelText('Collapse row'));
    expect(screen.queryByText('App.tsx')).not.toBeInTheDocument();
    expect(getBodyRows()).toHaveLength(2);
  });

  it('sets aria-level and aria-expanded on body rows', async () => {
    const user = userEvent.setup();
    render(<TreeTable />);

    const [srcRow, readmeRow] = getBodyRows();
    expect(srcRow).toHaveAttribute('aria-level', '1');
    expect(srcRow).toHaveAttribute('aria-expanded', 'false');
    // Leaf rows carry a level but no aria-expanded
    expect(readmeRow).toHaveAttribute('aria-level', '1');
    expect(readmeRow).not.toHaveAttribute('aria-expanded');

    await user.click(screen.getByLabelText('Expand row'));

    const rows = getBodyRows();
    expect(rows[0]).toHaveAttribute('aria-expanded', 'true');
    expect(rows[1]).toHaveAttribute('aria-level', '2');
    expect(rows[2]).toHaveAttribute('aria-level', '2');
  });

  it('sets aria-level for deeply nested rows', async () => {
    const user = userEvent.setup();
    render(<TreeTable defaultExpandedIds={['src', 'components']} />);

    const buttonRow = screen.getByText('Button.tsx').closest('tr');
    expect(buttonRow).toHaveAttribute('aria-level', '3');
    expect(getBodyRows()).toHaveLength(5);

    // Collapsing the middle level unmounts the deep leaf
    const collapseButtons = screen.getAllByLabelText('Collapse row');
    await user.click(collapseButtons[1]);
    expect(screen.queryByText('Button.tsx')).not.toBeInTheDocument();
  });

  it('reflects expansion state on the expander button', async () => {
    const user = userEvent.setup();
    render(<TreeTable />);

    const expander = screen.getByLabelText('Expand row');
    expect(expander).toHaveAttribute('aria-expanded', 'false');

    await user.click(expander);
    const collapse = screen.getByLabelText('Collapse row');
    expect(collapse).toHaveAttribute('aria-expanded', 'true');
  });

  it('toggles expansion with Enter and Space on the focused expander', async () => {
    const user = userEvent.setup();
    render(<TreeTable />);

    screen.getByLabelText('Expand row').focus();
    await user.keyboard('{Enter}');
    expect(screen.getByText('App.tsx')).toBeInTheDocument();

    screen.getByLabelText('Collapse row').focus();
    await user.keyboard(' ');
    expect(screen.queryByText('App.tsx')).not.toBeInTheDocument();
  });

  it('honors defaultExpandedIds in uncontrolled mode', () => {
    render(<TreeTable defaultExpandedIds={['src']} />);
    expect(screen.getByText('App.tsx')).toBeInTheDocument();
    expect(getBodyRows()).toHaveLength(4);
  });

  it('supports controlled expansion', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function Harness() {
      const [expanded, setExpanded] = useState<ReadonlySet<string>>(new Set());
      return (
        <ControlledTreeTable
          expandedIds={expanded}
          onExpandedIdsChange={ids => {
            onChange(ids);
            setExpanded(ids);
          }}
        />
      );
    }

    render(<Harness />);
    await user.click(screen.getByLabelText('Expand row'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toEqual(new Set(['src']));
    expect(screen.getByText('App.tsx')).toBeInTheDocument();
  });

  it('does not expand when the controlled owner ignores the change', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ControlledTreeTable
        expandedIds={new Set()}
        onExpandedIdsChange={onChange}
      />,
    );

    await user.click(screen.getByLabelText('Expand row'));
    expect(onChange).toHaveBeenCalledWith(new Set(['src']));
    expect(screen.queryByText('App.tsx')).not.toBeInTheDocument();
  });

  it('treats empty children arrays as leaves', () => {
    render(
      <TreeTable
        data={[{id: 'x', name: 'empty', kind: 'folder', children: []}]}
      />,
    );
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(getBodyRows()[0]).not.toHaveAttribute('aria-expanded');
  });

  it('is a no-op for flat data (no expanders, no aria-level)', () => {
    render(<TreeTable data={flatFiles} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    for (const row of getBodyRows()) {
      expect(row).not.toHaveAttribute('aria-level');
      expect(row).not.toHaveAttribute('aria-expanded');
    }
    expect(screen.getByText('a.txt')).toBeInTheDocument();
  });

  it('places the expander in the column named by treeColumnKey', () => {
    render(<TreeTable treeColumnKey="kind" />);
    const srcRow = getBodyRows()[0];
    const cells = within(srcRow).getAllByRole('cell');
    expect(within(cells[0]).queryByRole('button')).not.toBeInTheDocument();
    expect(within(cells[1]).getByLabelText('Expand row')).toBeInTheDocument();
  });

  it('composes with the selection plugin (checkbox column stays first)', async () => {
    const user = userEvent.setup();
    render(<TreeTable withSelection />);

    const srcRow = getBodyRows()[0];
    const cells = within(srcRow).getAllByRole('cell');
    expect(cells).toHaveLength(3);
    // Checkbox column is prepended; expander lands on the first data column
    expect(within(cells[0]).getByRole('checkbox')).toBeInTheDocument();
    expect(within(cells[1]).getByLabelText('Expand row')).toBeInTheDocument();

    // Both plugins stay functional together
    await user.click(within(cells[0]).getByRole('checkbox'));
    expect(getBodyRows()[0]).toHaveAttribute('aria-selected', 'true');
    await user.click(screen.getByLabelText('Expand row'));
    expect(screen.getByText('App.tsx')).toBeInTheDocument();
  });

  it('keeps working when hasHover row styling is enabled', async () => {
    const user = userEvent.setup();
    render(<TreeTable hasHover />);

    // Rows still render through TableRow (hover styling source) with tree ARIA
    const srcRow = getBodyRows()[0];
    expect(srcRow).toHaveAttribute('aria-level', '1');
    expect(srcRow.className).not.toBe('');

    await user.click(screen.getByLabelText('Expand row'));
    expect(getBodyRows()).toHaveLength(4);
  });
});
