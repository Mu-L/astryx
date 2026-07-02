// Copyright (c) Meta Platforms, Inc. and affiliates.

import {useState} from 'react';
import type {Meta, StoryObj} from '@storybook/react';
import {
  Table,
  useTableTreeData,
  useTableTreeState,
  proportional,
  pixel,
} from '@astryxdesign/core/Table';
import type {TableColumn} from '@astryxdesign/core/Table';
import {Badge} from '@astryxdesign/core/Badge';
import {Button} from '@astryxdesign/core/Button';
import {HStack} from '@astryxdesign/core/Layout';

// =============================================================================
// Sample Data
// =============================================================================

interface OrgRow extends Record<string, unknown> {
  id: string;
  name: string;
  role: string;
  headcount: number;
  status: 'active' | 'hiring';
  children?: OrgRow[];
}

const orgTree: OrgRow[] = [
  {
    id: 'eng',
    name: 'Engineering',
    role: 'Organization',
    headcount: 42,
    status: 'hiring',
    children: [
      {
        id: 'platform',
        name: 'Platform',
        role: 'Team',
        headcount: 12,
        status: 'active',
        children: [
          {
            id: 'alice',
            name: 'Alice Johnson',
            role: 'Engineer',
            headcount: 1,
            status: 'active',
          },
          {
            id: 'bob',
            name: 'Bob Smith',
            role: 'Engineer',
            headcount: 1,
            status: 'active',
          },
        ],
      },
      {
        id: 'product-eng',
        name: 'Product Engineering',
        role: 'Team',
        headcount: 18,
        status: 'hiring',
        children: [
          {
            id: 'carol',
            name: 'Carol Wu',
            role: 'Tech Lead',
            headcount: 1,
            status: 'active',
          },
        ],
      },
    ],
  },
  {
    id: 'design',
    name: 'Design',
    role: 'Organization',
    headcount: 9,
    status: 'active',
    children: [
      {
        id: 'diana',
        name: 'Diana Prince',
        role: 'Designer',
        headcount: 1,
        status: 'active',
      },
    ],
  },
  {
    id: 'ops',
    name: 'Operations',
    role: 'Organization',
    headcount: 5,
    status: 'active',
  },
];

const columns: TableColumn<OrgRow>[] = [
  {key: 'name', header: 'Name', width: proportional(2)},
  {key: 'role', header: 'Role', width: proportional(1)},
  {key: 'headcount', header: 'Headcount', width: pixel(110), align: 'end'},
  {
    key: 'status',
    header: 'Status',
    width: pixel(110),
    renderCell: item => (
      <Badge
        variant={item.status === 'hiring' ? 'success' : 'neutral'}
        label={item.status === 'hiring' ? 'Hiring' : 'Active'}
      />
    ),
  },
];

// =============================================================================
// Stories
// =============================================================================

const meta: Meta = {
  title: 'Core/TableTreeData',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

/**
 * Nested rows render collapsed by default. Click a row's chevron (or focus
 * it and press Enter/Space) to expand its children one indent level deeper.
 */
export const Default: Story = {
  render: () => {
    const {visibleData, treeConfig} = useTableTreeState<OrgRow>({
      data: orgTree,
      idKey: 'id',
    });
    const treePlugin = useTableTreeData(treeConfig);

    return (
      <Table
        data={visibleData}
        columns={columns}
        idKey="id"
        hasHover
        plugins={{tree: treePlugin}}
      />
    );
  },
};

/**
 * Seed initial expansion with `defaultExpandedIds`, and drive it in bulk
 * with the `expandAll` / `collapseAll` helpers.
 */
export const InitiallyExpanded: Story = {
  render: () => {
    const {visibleData, treeConfig, expandAll, collapseAll} =
      useTableTreeState<OrgRow>({
        data: orgTree,
        idKey: 'id',
        defaultExpandedIds: ['eng', 'platform'],
      });
    const treePlugin = useTableTreeData(treeConfig);

    return (
      <>
        <HStack gap={2}>
          <Button label="Expand all" variant="secondary" onClick={expandAll} />
          <Button
            label="Collapse all"
            variant="secondary"
            onClick={collapseAll}
          />
        </HStack>
        <Table
          data={visibleData}
          columns={columns}
          idKey="id"
          plugins={{tree: treePlugin}}
        />
      </>
    );
  },
};

/**
 * Controlled mode — the consumer owns the expanded set, so expansion can be
 * persisted (URL, storage) or driven externally.
 */
export const Controlled: Story = {
  render: () => {
    const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
      () => new Set(['design']),
    );

    const {visibleData, treeConfig} = useTableTreeState<OrgRow>({
      data: orgTree,
      idKey: 'id',
      expandedIds,
      onExpandedIdsChange: setExpandedIds,
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
  },
};
