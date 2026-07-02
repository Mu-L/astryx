// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/**
 * @file useTableTreeData.tsx
 * @input React, StyleX, Table plugin types, Icon registry, theme tokens
 * @output Exports useTableTreeData hook, TableTreeRowMeta, TableTreeIndent,
 *   UseTableTreeDataConfig types
 * @position Tree plugin; consumed by Table via plugins prop. Pairs with
 *   useTableTreeState (the state/flattening helper).
 *
 * ## Architecture (mirrors useTableSelection)
 *
 * The indent + expander affordance is injected by wrapping the tree column's
 * cell renderer via `transformColumns` (default: the first column), so it
 * flows through the normal cell pipeline and respects component overrides.
 * Wrapped columns are cached by source-column identity so the resolved
 * column array stays referentially stable across renders.
 *
 * Expansion state lives outside this plugin (consumer or useTableTreeState).
 * A lightweight external store lets each tree cell subscribe independently
 * via useSyncExternalStore — toggling one row re-renders only that row's
 * tree cell, not the entire body. Row-level ARIA (aria-level, aria-expanded)
 * uses imperative DOM updates via a ref callback on each <tr>, exactly like
 * the selection plugin's row styling, because memoized rows don't re-render
 * when only expansion state changes.
 *
 * When `hasExpandableRows` is false (flat data), the plugin is a no-op:
 * no cell wrapper, no expanders, no ARIA attributes — adopting it ahead of
 * hierarchical data changes nothing.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Table/Table.doc.mjs (tree documentation)
 * - /packages/core/src/Table/useTableTreeData.doc.mjs
 * - /packages/core/src/Table/index.ts (exports)
 */

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react';
import * as stylex from '@stylexjs/stylex';
import {
  colorVars,
  durationVars,
  easeVars,
  radiusVars,
  spacingVars,
} from '../../../theme/tokens.stylex';
import {Icon} from '../../../Icon';
import {mergeRefs} from '../../../utils';
import {defaultCellRenderer} from '../../columnUtils';
import type {TablePlugin, TableColumn, BodyRowRenderProps} from '../../types';

// =============================================================================
// Types
// =============================================================================

/** Indent step per tree level, mapped to spacing tokens. */
export type TableTreeIndent = 'sm' | 'md' | 'lg';

/** Per-row tree metadata resolved by `getRowMeta`. */
export interface TableTreeRowMeta {
  /** Stable row ID (stringified). */
  id: string;
  /** 0-based depth. Roots are level 0; rendered as `aria-level={level + 1}`. */
  level: number;
  /** Whether the row shows an expander (has or can load children). */
  hasChildren: boolean;
  /** Whether the row is currently expanded. Always false for leaves. */
  isExpanded: boolean;
}

/**
 * Configuration for useTableTreeData.
 *
 * Follows Astryx headless plugin conventions: the consumer (usually
 * useTableTreeState) owns expansion state and data flattening; the plugin
 * only renders the affordance and ARIA from per-row metadata.
 *
 * @template T - The row data type
 */
export interface UseTableTreeDataConfig<T extends Record<string, unknown>> {
  /**
   * Resolve tree metadata for a visible row. Rows without metadata render
   * unchanged. Provided by useTableTreeState, or hand-built for
   * server-driven / custom-flattened trees.
   */
  getRowMeta: (item: T) => TableTreeRowMeta | undefined;

  /** Called when the user activates a row's expander. */
  onToggleItem: (item: T) => void;

  /**
   * Whether the current dataset contains any expandable rows. When false
   * the plugin is a complete no-op (migration guarantee for flat data).
   */
  hasExpandableRows: boolean;

  /**
   * Indent step per tree level, in spacing tokens:
   * 'sm' = spacing-3, 'md' = spacing-4, 'lg' = spacing-6.
   * @default 'md'
   */
  indent?: TableTreeIndent;

  /**
   * Key of the column that renders the indent + expander.
   * @default the first column
   */
  treeColumnKey?: string;
}

// =============================================================================
// Tree Store (external store for fine-grained cell/row subscriptions)
// =============================================================================

/**
 * Lightweight external store letting each tree cell and row subscribe to
 * expansion changes independently — same pattern as the selection plugin's
 * SelectionStore. Holds no state itself; reads the latest config via ref.
 */
interface TreeStore<T extends Record<string, unknown>> {
  subscribe: (listener: () => void) => () => void;
  notify: () => void;
  getConfig: () => UseTableTreeDataConfig<T>;
}

function createTreeStore<T extends Record<string, unknown>>(
  configRef: React.RefObject<UseTableTreeDataConfig<T>>,
): TreeStore<T> {
  const listeners = new Set<() => void>();
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    notify() {
      for (const listener of listeners) {
        listener();
      }
    },
    getConfig() {
      return configRef.current;
    },
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TreeStoreContext = createContext<TreeStore<any> | null>(null);
TreeStoreContext.displayName = 'TableTreeStoreContext';

// =============================================================================
// Row ARIA (imperative, mirrors selection's applyRowSelectionStyle)
// =============================================================================

/**
 * Apply or remove tree ARIA attributes on a `<tr>` element.
 * `aria-level` is 1-based per the ARIA spec; expander rows also carry
 * `aria-expanded` so assistive tech announces their state.
 */
function applyRowTreeAttrs<T extends Record<string, unknown>>(
  el: HTMLTableRowElement,
  config: UseTableTreeDataConfig<T>,
  item: T,
): void {
  const meta = config.hasExpandableRows ? config.getRowMeta(item) : undefined;
  if (meta == null) {
    el.removeAttribute('aria-level');
    el.removeAttribute('aria-expanded');
    return;
  }
  el.setAttribute('aria-level', String(meta.level + 1));
  if (meta.hasChildren) {
    el.setAttribute('aria-expanded', meta.isExpanded ? 'true' : 'false');
  } else {
    el.removeAttribute('aria-expanded');
  }
}

// =============================================================================
// Styles
// =============================================================================

const INDENT_STEP: Record<TableTreeIndent, string> = {
  sm: spacingVars['--spacing-3'],
  md: spacingVars['--spacing-4'],
  lg: spacingVars['--spacing-6'],
};

const treeStyles = stylex.create({
  cell: {
    display: 'flex',
    alignItems: 'center',
    gap: spacingVars['--spacing-1'],
    minWidth: 0,
  },
  indent: (width: string) => ({
    width,
    flexShrink: 0,
  }),
  expander: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: spacingVars['--spacing-4'],
    height: spacingVars['--spacing-4'],
    flexShrink: 0,
    background: 'none',
    border: 'none',
    padding: 0,
    margin: 0,
    cursor: 'pointer',
    color: colorVars['--color-icon-secondary'],
    borderRadius: radiusVars['--radius-inner'],
    outline: {
      default: 'none',
      ':focus-visible': `2px solid ${colorVars['--color-accent']}`,
    },
    outlineOffset: '1px',
  },
  /** Keeps leaf-row content aligned with sibling expander rows. */
  leafSpacer: {
    width: spacingVars['--spacing-4'],
    flexShrink: 0,
  },
  chevron: {
    display: 'flex',
    transitionProperty: 'transform',
    transitionDuration: durationVars['--duration-fast'],
    transitionTimingFunction: easeVars['--ease-standard'],
    transform: 'rotate(0deg)',
  },
  chevronExpanded: {
    transform: 'rotate(90deg)',
  },
  content: {
    minWidth: 0,
    flexGrow: 1,
  },
});

// =============================================================================
// Tree Cell Components
// =============================================================================

function TreeCellContent<T extends Record<string, unknown>>({
  item,
  children,
}: {
  item: T;
  children: ReactNode;
}) {
  const store = use(TreeStoreContext);
  if (!store) {
    return <>{children}</>;
  }
  return (
    <TreeCellContentInner store={store} item={item}>
      {children}
    </TreeCellContentInner>
  );
}

/**
 * Inner component that subscribes to this row's tree metadata. Separated
 * so hooks aren't called conditionally after the null-store guard.
 * The snapshot is a cheap string encoding of the fields that affect render,
 * so only the toggled row's cell re-renders on expansion changes.
 */
function TreeCellContentInner<T extends Record<string, unknown>>({
  store,
  item,
  children,
}: {
  store: TreeStore<T>;
  item: T;
  children: ReactNode;
}) {
  const getSnapshot = useCallback(() => {
    const config = store.getConfig();
    if (!config.hasExpandableRows) {
      return '';
    }
    const meta = config.getRowMeta(item);
    if (meta == null) {
      return '';
    }
    return `${meta.level}:${meta.hasChildren ? 1 : 0}:${meta.isExpanded ? 1 : 0}:${config.indent ?? 'md'}`;
  }, [store, item]);

  const snapshot = useSyncExternalStore(
    store.subscribe,
    getSnapshot,
    getSnapshot,
  );

  if (snapshot === '') {
    // Flat data or no metadata — render the original content untouched.
    return <>{children}</>;
  }

  const config = store.getConfig();
  const meta = config.getRowMeta(item);
  if (meta == null) {
    return <>{children}</>;
  }

  const indentToken = INDENT_STEP[config.indent ?? 'md'];

  return (
    <div {...stylex.props(treeStyles.cell)}>
      {meta.level > 0 && (
        <span
          aria-hidden="true"
          {...stylex.props(
            treeStyles.indent(`calc(${meta.level} * ${indentToken})`),
          )}
        />
      )}
      {meta.hasChildren ? (
        <button
          type="button"
          aria-expanded={meta.isExpanded}
          aria-label={meta.isExpanded ? 'Collapse row' : 'Expand row'}
          onClick={() => store.getConfig().onToggleItem(item)}
          {...stylex.props(treeStyles.expander)}>
          <span
            {...stylex.props(
              treeStyles.chevron,
              meta.isExpanded && treeStyles.chevronExpanded,
            )}>
            <Icon
              icon="chevronRight"
              size="xsm"
              color="secondary"
              aria-hidden
            />
          </span>
        </button>
      ) : (
        <span aria-hidden="true" {...stylex.props(treeStyles.leafSpacer)} />
      )}
      <span {...stylex.props(treeStyles.content)}>{children}</span>
    </div>
  );
}

// =============================================================================
// Hook
// =============================================================================

/**
 * useTableTreeData — table plugin for tree rows (indent + expand/collapse).
 *
 * Returns a stable TablePlugin<T> that wraps the tree column's cell renderer
 * with per-level indentation and a keyboard-activatable expander button, and
 * adds `aria-level` / `aria-expanded` to body rows. Follows the headless
 * pattern: consumer owns expansion state (usually via useTableTreeState),
 * plugin provides UI and interaction.
 *
 * Pair with useTableTreeState, which flattens nested data into the visible
 * row array — collapsed rows are unmounted, not hidden.
 *
 * @example
 * ```
 * const {visibleData, treeConfig} = useTableTreeState({
 *   data: rows,
 *   idKey: 'id',
 * });
 * const treePlugin = useTableTreeData(treeConfig);
 * <Table
 *   data={visibleData}
 *   columns={columns}
 *   idKey="id"
 *   plugins={{tree: treePlugin}}
 * />
 * ```
 */
export function useTableTreeData<T extends Record<string, unknown>>(
  config: UseTableTreeDataConfig<T>,
): TablePlugin<T> {
  const configRef = useRef(config);
  configRef.current = config;

  const storeRef = useRef<TreeStore<T> | null>(null);
  if (storeRef.current == null) {
    storeRef.current = createTreeStore(configRef);
  }
  const store = storeRef.current;

  // Notify subscribers on every render — useSyncExternalStore only
  // re-renders cells whose snapshot actually changed, and row ref
  // subscribers update ARIA imperatively.
  useEffect(() => {
    store.notify();
  });

  return useMemo((): TablePlugin<T> => {
    // Cache wrapped columns by source-column identity so transformColumns
    // returns referentially stable column objects — BaseTable shallow-compares
    // the resolved column array to skip re-rendering memoized rows.
    const wrappedColumnCache = new WeakMap<TableColumn<T>, TableColumn<T>>();

    const wrapColumn = (column: TableColumn<T>): TableColumn<T> => {
      let wrapped = wrappedColumnCache.get(column);
      if (wrapped == null) {
        const originalRenderCell = column.renderCell;
        wrapped = {
          ...column,
          renderCell: (item: T) => (
            <TreeCellContent item={item}>
              {originalRenderCell
                ? originalRenderCell(item)
                : defaultCellRenderer(item, column.key)}
            </TreeCellContent>
          ),
        };
        wrappedColumnCache.set(column, wrapped);
      }
      return wrapped;
    };

    return {
      transformTableContext(children: ReactNode) {
        return <TreeStoreContext value={store}>{children}</TreeStoreContext>;
      },

      transformColumns(columns: TableColumn<T>[]) {
        const cfg = configRef.current;
        if (!cfg.hasExpandableRows || columns.length === 0) {
          return columns;
        }
        const targetIndex = cfg.treeColumnKey
          ? Math.max(
              0,
              columns.findIndex(col => col.key === cfg.treeColumnKey),
            )
          : 0;
        return columns.map((col, index) =>
          index === targetIndex ? wrapColumn(col) : col,
        );
      },

      transformBodyRow(props: BodyRowRenderProps, item: T) {
        // Attach a ref that subscribes to the store for imperative ARIA
        // updates — memoized rows don't re-render on expansion changes,
        // so attributes are managed on the DOM node directly (same
        // pattern as the selection plugin's row styling).
        const treeRef: React.RefCallback<HTMLTableRowElement> = el => {
          if (!el) {
            return;
          }
          applyRowTreeAttrs(el, store.getConfig(), item);
          const unsub = store.subscribe(() => {
            if (!el.isConnected) {
              unsub();
              return;
            }
            applyRowTreeAttrs(el, store.getConfig(), item);
          });
        };

        return {
          ...props,
          ref: props.ref ? mergeRefs(props.ref, treeRef) : treeRef,
        };
      },
    };
  }, [store]);
}
