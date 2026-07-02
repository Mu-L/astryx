// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('../docs-types').ComponentDoc} */

export const docs = {
  name: 'useTableTreeState',
  subComponentOf: 'Table',
  displayName: 'useTableTreeState',
  description:
    'State helper for tree rows. Owns the expanded set (controlled or uncontrolled), flattens nested data depth-first into the visible row array (collapsed subtrees are excluded — unmounted, not hidden), and returns a ready-to-use config for useTableTreeData plus toggleId/expandAll/collapseAll helpers.',
  props: [
    {
      name: 'data',
      type: 'T[]',
      description:
        'Nested root rows. Child rows live in an array under childrenKey (default "children").',
      required: true,
    },
    {
      name: 'idKey',
      type: '(keyof T & string) | ((item: T) => string | number)',
      description:
        'Unique row ID across all levels — property name or function, mirroring Table idKey. IDs are normalized to strings.',
      required: true,
    },
    {
      name: 'childrenKey',
      type: 'string',
      description: 'Property name holding each row’s child rows.',
      default: "'children'",
    },
    {
      name: 'defaultExpandedIds',
      type: 'Iterable<string>',
      description: 'Initially expanded row IDs for uncontrolled mode. Ignored when expandedIds is provided.',
    },
    {
      name: 'expandedIds',
      type: 'ReadonlySet<string>',
      description: 'Controlled expanded row IDs. Pair with onExpandedIdsChange.',
    },
    {
      name: 'onExpandedIdsChange',
      type: '(ids: ReadonlySet<string>) => void',
      description: 'Called with the complete new expanded set on toggle/expandAll/collapseAll. Required in controlled mode.',
    },
    {
      name: 'isItemExpandable',
      type: '(item: T) => boolean',
      description:
        'Overrides which rows show an expander. Return true for rows whose children load lazily; fetch in onExpandedIdsChange.',
      default: 'children array is non-empty',
    },
    {
      name: 'sortSiblings',
      type: '(siblings: T[]) => T[]',
      description:
        'Sort applied to each sibling group independently during flattening — ordering never crosses levels. Pass applySort from useTableSortableState to compose with column sorting.',
    },
    {
      name: 'indent',
      type: "'sm' | 'md' | 'lg'",
      description: 'Indent step per tree level. Passed through to the plugin config.',
      default: "'md'",
    },
    {
      name: 'treeColumnKey',
      type: 'string',
      description: 'Column carrying the indent + expander. Passed through to the plugin config.',
    },
  ],
};

export const docsZh = {
  name: 'useTableTreeState',
  displayName: 'useTableTreeState',
  description:
    '树形行的状态辅助 Hook。持有展开集合（受控或非受控），将嵌套数据深度优先展平为可见行数组（折叠的子树被排除——卸载而非隐藏），并返回可直接用于 useTableTreeData 的配置以及 toggleId/expandAll/collapseAll 辅助方法。',
  props: [
    {
      name: 'data',
      type: 'T[]',
      description: '嵌套的根行。子行位于 childrenKey（默认 "children"）指定的数组中。',
      required: true,
    },
    {
      name: 'idKey',
      type: '(keyof T & string) | ((item: T) => string | number)',
      description: '所有层级中唯一的行 ID——属性名或函数，与 Table 的 idKey 一致。ID 会被规范化为字符串。',
      required: true,
    },
    {
      name: 'childrenKey',
      type: 'string',
      description: '保存子行的属性名。',
      default: "'children'",
    },
    {
      name: 'defaultExpandedIds',
      type: 'Iterable<string>',
      description: '非受控模式下初始展开的行 ID。提供 expandedIds 时忽略。',
    },
    {
      name: 'expandedIds',
      type: 'ReadonlySet<string>',
      description: '受控的展开行 ID 集合。需与 onExpandedIdsChange 配对使用。',
    },
    {
      name: 'onExpandedIdsChange',
      type: '(ids: ReadonlySet<string>) => void',
      description: '在切换/expandAll/collapseAll 时以完整的新集合调用。受控模式下必需。',
    },
    {
      name: 'isItemExpandable',
      type: '(item: T) => boolean',
      description: '覆盖哪些行显示展开按钮。对懒加载子行的行返回 true；在 onExpandedIdsChange 中获取数据。',
      default: 'children 数组非空',
    },
    {
      name: 'sortSiblings',
      type: '(siblings: T[]) => T[]',
      description: '在展平期间独立应用于每个同级组的排序——排序不会跨层级。传入 useTableSortableState 的 applySort 以与列排序组合。',
    },
    {
      name: 'indent',
      type: "'sm' | 'md' | 'lg'",
      description: '每个树层级的缩进步长。透传给插件配置。',
      default: "'md'",
    },
    {
      name: 'treeColumnKey',
      type: 'string',
      description: '承载缩进和展开按钮的列。透传给插件配置。',
    },
  ],
};

export const docsDense = {
  name: 'useTableTreeState',
  displayName: 'useTableTreeState',
  description:
    'Tree state helper: owns expanded set (controlled/uncontrolled), flattens nested data DFS into visibleData (collapsed subtrees excluded/unmounted), returns treeConfig for useTableTreeData + toggleId/expandAll/collapseAll.',
  propDescriptions: {
    data: 'Nested root rows; children under childrenKey.',
    idKey: 'Unique row ID across levels; property name or fn; normalized to string.',
    childrenKey: "Property holding child rows. Default 'children'.",
    defaultExpandedIds: 'Uncontrolled initial expanded IDs.',
    expandedIds: 'Controlled expanded IDs; pair w/ onExpandedIdsChange.',
    onExpandedIdsChange: 'Called w/ complete new set on any expansion change.',
    isItemExpandable: 'Override expander visibility; return true for lazy-loaded parents.',
    sortSiblings: 'Per-sibling-group sort during flatten; pass applySort from useTableSortableState.',
    indent: "Indent step per level: 'sm'|'md'|'lg' (pass-through).",
    treeColumnKey: 'Column carrying indent+expander (pass-through).',
  },
};
