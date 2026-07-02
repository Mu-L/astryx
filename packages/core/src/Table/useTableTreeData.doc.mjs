// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('../docs-types').ComponentDoc} */

export const docs = {
  name: 'useTableTreeData',
  subComponentOf: 'Table',
  displayName: 'useTableTreeData',
  description:
    'Hook that returns a TablePlugin rendering tree rows: per-level indentation and a keyboard-activatable expand/collapse button on the tree column, plus aria-level/aria-expanded on body rows. Headless — expansion state is owned by the consumer, usually via useTableTreeState. A no-op when the data has no expandable rows.',
  props: [
    {
      name: 'getRowMeta',
      type: '(item: T) => TableTreeRowMeta | undefined',
      description:
        'Resolves tree metadata ({id, level, hasChildren, isExpanded}) for a visible row. Provided by useTableTreeState, or hand-built for server-driven trees.',
      required: true,
    },
    {
      name: 'onToggleItem',
      type: '(item: T) => void',
      description: 'Called when the user activates a row expander (click, Enter, or Space).',
      required: true,
    },
    {
      name: 'hasExpandableRows',
      type: 'boolean',
      description:
        'Whether the dataset contains any expandable rows. When false the plugin renders nothing extra — flat data is unchanged.',
      required: true,
    },
    {
      name: 'indent',
      type: "'sm' | 'md' | 'lg'",
      description:
        'Indent step per tree level, in spacing tokens (spacing-3 / spacing-4 / spacing-6).',
      default: "'md'",
    },
    {
      name: 'treeColumnKey',
      type: 'string',
      description:
        'Key of the column that renders the indent and expander. Defaults to the first column.',
    },
  ],
};

export const docsZh = {
  name: 'useTableTreeData',
  displayName: 'useTableTreeData',
  description:
    '返回 TablePlugin 的 Hook，渲染树形行：在树列上按层级缩进并提供可键盘操作的展开/折叠按钮，同时在行上设置 aria-level/aria-expanded。无头模式——展开状态由消费者持有，通常通过 useTableTreeState。数据没有可展开行时不产生任何效果。',
  props: [
    {
      name: 'getRowMeta',
      type: '(item: T) => TableTreeRowMeta | undefined',
      description:
        '解析可见行的树元数据（{id, level, hasChildren, isExpanded}）。由 useTableTreeState 提供，或为服务端驱动的树手动构建。',
      required: true,
    },
    {
      name: 'onToggleItem',
      type: '(item: T) => void',
      description: '用户激活行展开按钮（点击、Enter 或空格）时调用。',
      required: true,
    },
    {
      name: 'hasExpandableRows',
      type: 'boolean',
      description: '数据是否包含可展开的行。为 false 时插件不渲染任何额外内容——扁平数据保持不变。',
      required: true,
    },
    {
      name: 'indent',
      type: "'sm' | 'md' | 'lg'",
      description: '每个树层级的缩进步长，使用间距令牌（spacing-3 / spacing-4 / spacing-6）。',
      default: "'md'",
    },
    {
      name: 'treeColumnKey',
      type: 'string',
      description: '渲染缩进和展开按钮的列的 key。默认为第一列。',
    },
  ],
};

export const docsDense = {
  name: 'useTableTreeData',
  displayName: 'useTableTreeData',
  description:
    'Hook returning TablePlugin for tree rows: per-level indent + expander button on tree column, aria-level/aria-expanded on rows. Headless — pair w/ useTableTreeState which flattens nested data (collapsed rows unmounted). No-op on flat data.',
  propDescriptions: {
    getRowMeta:
      'Resolves {id, level, hasChildren, isExpanded} per visible row; provided by useTableTreeState.',
    onToggleItem: 'Called on expander activation (click/Enter/Space).',
    hasExpandableRows: 'False => plugin is a no-op (flat-data migration guarantee).',
    indent: "Indent step per level in spacing tokens: 'sm'|'md'|'lg'.",
    treeColumnKey: 'Column key carrying indent+expander; default first column.',
  },
};
