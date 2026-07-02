// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/**
 * @file useTableTreeState.tsx
 * @input React, tree plugin config types
 * @output Exports useTableTreeState hook and config/result types
 * @position Tree state helper; owns the expanded set (controlled or
 *   uncontrolled) and flattens nested data into the visible row array.
 *   Pairs with useTableTreeData (the headless tree plugin).
 *
 * Modeled after useTableSortableState — a convenience layer that owns state,
 * shapes the data outside the render pipeline (Table always receives exactly
 * the rows it renders), and produces a ready-to-use config for the headless
 * plugin.
 *
 * Collapsed rows are excluded from `visibleData` entirely (unmounted, not
 * hidden) so the `<tbody>` DOM count equals the visible row count and
 * `:nth-child` striping stays correct.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Table/plugins/tree/index.ts (exports)
 * - /packages/core/src/Table/Table.doc.mjs (tree documentation)
 * - /packages/core/src/Table/useTableTreeState.doc.mjs
 */

import {useCallback, useMemo, useRef, useState} from 'react';
import type {
  TableTreeIndent,
  TableTreeRowMeta,
  UseTableTreeDataConfig,
} from './useTableTreeData';

// =============================================================================
// Config Type
// =============================================================================

/**
 * Configuration for useTableTreeState.
 *
 * @template T - The row data type
 *
 * @example
 * ```
 * const {visibleData, treeConfig} = useTableTreeState({
 *   data: rows,
 *   idKey: 'id',
 *   defaultExpandedIds: ['root-a'],
 * });
 * const treePlugin = useTableTreeData(treeConfig);
 * <Table data={visibleData} columns={columns} idKey="id" plugins={{tree: treePlugin}} />
 * ```
 */
export interface UseTableTreeStateConfig<T extends Record<string, unknown>> {
  /**
   * The nested data array (root rows). Rows may carry child rows in an
   * array under `childrenKey` (default `'children'`).
   */
  data: T[];

  /**
   * Key extractor — returns a unique ID for each row across all levels.
   * Property name or function, mirroring Table's `idKey`. IDs are
   * normalized to strings for the expanded set.
   */
  idKey: (keyof T & string) | ((item: T) => string | number);

  /**
   * Property name holding each row's child rows.
   * @default 'children'
   */
  childrenKey?: string;

  /**
   * Initially expanded row IDs for uncontrolled mode.
   * Ignored when `expandedIds` is provided.
   */
  defaultExpandedIds?: Iterable<string>;

  /**
   * Controlled expanded row IDs. When provided, the hook uses this instead
   * of internal state. Must be paired with `onExpandedIdsChange`.
   */
  expandedIds?: ReadonlySet<string>;

  /**
   * Called with the complete new expanded set when the user toggles a row
   * (or `expandAll`/`collapseAll` is invoked). Required when `expandedIds`
   * is provided.
   */
  onExpandedIdsChange?: (expandedIds: ReadonlySet<string>) => void;

  /**
   * Override which rows show an expander. Defaults to rows whose children
   * array is non-empty. Return `true` for rows whose children are loaded
   * lazily (fetch them in `onExpandedIdsChange`).
   */
  isItemExpandable?: (item: T) => boolean;

  /**
   * Sort applied independently to each sibling group during flattening,
   * so ordering never crosses tree levels. Pass `applySort` from
   * `useTableSortableState` to compose tree rows with column sorting.
   */
  sortSiblings?: (siblings: T[]) => T[];

  /**
   * Indent step per tree level, in spacing tokens.
   * Passed through to the plugin config.
   * @default 'md'
   */
  indent?: TableTreeIndent;

  /**
   * Key of the column that renders the indent + expander.
   * Passed through to the plugin config.
   * @default the first column
   */
  treeColumnKey?: string;
}

// =============================================================================
// Result Type
// =============================================================================

export interface UseTableTreeStateResult<T extends Record<string, unknown>> {
  /**
   * Flattened array of currently visible rows (roots plus descendants of
   * expanded rows, depth-first). Pass to `<Table data={...}>`.
   */
  visibleData: T[];

  /** Current expanded row IDs. */
  expandedIds: ReadonlySet<string>;

  /** Ready-to-use config for useTableTreeData. */
  treeConfig: UseTableTreeDataConfig<T>;

  /** Toggle a single row's expansion by ID. */
  toggleId: (id: string) => void;

  /** Expand every expandable row. */
  expandAll: () => void;

  /** Collapse every row. */
  collapseAll: () => void;
}

// =============================================================================
// Flatten
// =============================================================================

interface FlattenResult<T> {
  visible: T[];
  metaByItem: Map<T, TableTreeRowMeta>;
  /** IDs of every expandable row in the full tree (for expandAll). */
  expandableIds: Set<string>;
  hasExpandableRows: boolean;
}

function getChildrenOf<T extends Record<string, unknown>>(
  item: T,
  childrenKey: string,
): T[] | null {
  const value = item[childrenKey];
  return Array.isArray(value) ? (value as T[]) : null;
}

function flattenTree<T extends Record<string, unknown>>(
  data: T[],
  expandedIds: ReadonlySet<string>,
  getId: (item: T) => string,
  childrenKey: string,
  isItemExpandable: ((item: T) => boolean) | undefined,
  sortSiblings: ((siblings: T[]) => T[]) | undefined,
): FlattenResult<T> {
  const visible: T[] = [];
  const metaByItem = new Map<T, TableTreeRowMeta>();
  const expandableIds = new Set<string>();

  // Walks the entire tree so `expandableIds` covers collapsed subtrees too;
  // only pushes to `visible` while every ancestor is expanded.
  function walk(siblings: T[], level: number, isVisible: boolean): void {
    const ordered = sortSiblings ? sortSiblings(siblings) : siblings;
    for (const item of ordered) {
      const id = getId(item);
      const children = getChildrenOf(item, childrenKey);
      const hasChildren =
        isItemExpandable?.(item) ?? (children != null && children.length > 0);
      const isExpanded = hasChildren && expandedIds.has(id);

      if (hasChildren) {
        expandableIds.add(id);
      }
      if (isVisible) {
        visible.push(item);
        metaByItem.set(item, {id, level, hasChildren, isExpanded});
      }
      if (children != null && children.length > 0) {
        walk(children, level + 1, isVisible && isExpanded);
      }
    }
  }

  walk(data, 0, true);

  return {
    visible,
    metaByItem,
    expandableIds,
    hasExpandableRows: expandableIds.size > 0,
  };
}

// =============================================================================
// Hook
// =============================================================================

/**
 * useTableTreeState — manages tree expansion state and flattens nested data
 * into the visible row array for Table.
 *
 * Convenience layer over useTableTreeData. Owns the expanded set internally
 * (or accepts controlled state), flattens the tree depth-first excluding
 * collapsed subtrees, and produces a ready-to-use config for the headless
 * tree plugin.
 *
 * @example
 * ```
 * const {visibleData, treeConfig} = useTableTreeState({
 *   data: departments,
 *   idKey: 'id',
 *   defaultExpandedIds: ['engineering'],
 * });
 * const treePlugin = useTableTreeData(treeConfig);
 * <Table data={visibleData} columns={columns} idKey="id" plugins={{tree: treePlugin}} />
 * ```
 */
export function useTableTreeState<T extends Record<string, unknown>>(
  config: UseTableTreeStateConfig<T>,
): UseTableTreeStateResult<T> {
  const {
    data,
    idKey,
    childrenKey = 'children',
    defaultExpandedIds,
    expandedIds: controlledExpandedIds,
    onExpandedIdsChange: controlledOnExpandedIdsChange,
    isItemExpandable,
    sortSiblings,
    indent,
    treeColumnKey,
  } = config;

  const getId = useCallback(
    (item: T): string =>
      typeof idKey === 'function' ? String(idKey(item)) : String(item[idKey]),
    [idKey],
  );

  // Internal state (used in uncontrolled mode)
  const [internalExpandedIds, setInternalExpandedIds] = useState<
    ReadonlySet<string>
  >(() => new Set(defaultExpandedIds));

  // Resolve controlled vs uncontrolled (mirrors useTableSortableState)
  const isControlled = controlledExpandedIds !== undefined;
  const expandedIds = isControlled
    ? controlledExpandedIds
    : internalExpandedIds;
  const onExpandedIdsChange = isControlled
    ? (controlledOnExpandedIdsChange ?? (() => {}))
    : setInternalExpandedIds;

  // Flatten — memoized on data + expansion + accessors
  const flattened = useMemo(
    () =>
      flattenTree(
        data,
        expandedIds,
        getId,
        childrenKey,
        isItemExpandable,
        sortSiblings,
      ),
    [data, expandedIds, getId, childrenKey, isItemExpandable, sortSiblings],
  );

  // Refs so the state-updating callbacks stay stable
  const expandedIdsRef = useRef(expandedIds);
  expandedIdsRef.current = expandedIds;
  const flattenedRef = useRef(flattened);
  flattenedRef.current = flattened;
  const onExpandedIdsChangeRef = useRef(onExpandedIdsChange);
  onExpandedIdsChangeRef.current = onExpandedIdsChange;

  const toggleId = useCallback((id: string) => {
    const next = new Set(expandedIdsRef.current);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onExpandedIdsChangeRef.current(next);
  }, []);

  const expandAll = useCallback(() => {
    onExpandedIdsChangeRef.current(new Set(flattenedRef.current.expandableIds));
  }, []);

  const collapseAll = useCallback(() => {
    onExpandedIdsChangeRef.current(new Set());
  }, []);

  const onToggleItem = useCallback(
    (item: T) => {
      const meta = flattenedRef.current.metaByItem.get(item);
      if (meta == null || !meta.hasChildren) {
        return;
      }
      toggleId(meta.id);
    },
    [toggleId],
  );

  const getRowMeta = useCallback(
    (item: T): TableTreeRowMeta | undefined =>
      flattenedRef.current.metaByItem.get(item),
    [],
  );

  // Config ready for useTableTreeData
  const treeConfig = useMemo(
    (): UseTableTreeDataConfig<T> => ({
      getRowMeta,
      onToggleItem,
      hasExpandableRows: flattened.hasExpandableRows,
      indent,
      treeColumnKey,
    }),
    [
      getRowMeta,
      onToggleItem,
      flattened.hasExpandableRows,
      indent,
      treeColumnKey,
    ],
  );

  return {
    visibleData: flattened.visible,
    expandedIds,
    treeConfig,
    toggleId,
    expandAll,
    collapseAll,
  };
}
