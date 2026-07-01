// Copyright (c) Meta Platforms, Inc. and affiliates.
/** @type {import('../docs-types').ComponentDoc} */

export const docs = {
  name: 'Drawer',
  displayName: 'Drawer',
  group: 'Drawer',
  category: 'Overlay',
  keywords: ["drawer","side panel","panel","inspector","detail view","overlay","slide","sheet","sidebar","dialog"],
  theming: {
    targets: [
      {className: 'astryx-drawer', visualProps: ['side']},
    ],
  },
  description: 'Full-height side-panel overlay using the native <dialog> element. Slides in from the logical end (right in LTR) or start edge.',
  props: [
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the drawer is open. Fully controlled — pair with onClose.',
      required: true,
    },
    {
      name: 'onClose',
      type: '() => void',
      description: 'Called when the drawer requests to be closed (Escape key, scrim click). The caller owns the open state.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the drawer. Required — the drawer has no built-in heading to derive a name from.',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Drawer content, rendered inside a full-height scrollable area. Compose your own header/body/footer; an element with data-autofocus is focused on open.',
      required: true,
    },
    {
      name: 'side',
      type: "'end' | 'start'",
      description: "Logical edge the drawer slides from: 'end' is right in LTR (the inspector convention), 'start' is left.",
      default: "'end'",
    },
    {
      name: 'width',
      type: 'number',
      description: 'Width budget of the panel in pixels. On viewports narrower than this the drawer becomes a full-width overlay.',
      default: '400',
    },
    {
      name: 'hasScrim',
      type: 'boolean',
      description: 'Modal scrim behind the drawer. true uses showModal() (top layer, focus trap, scroll lock, click-outside closes); false uses show() for a non-modal overlay that keeps the page behind interactive.',
      default: 'true',
    },
  ],
  usage: {
    description: 'A side-panel overlay for inspectors and detail views — the "click a table row, see its details" pattern. Escape closes the drawer and focus returns to the element that opened it. Entry/exit slide animation respects prefers-reduced-motion.',
    bestPractices: [
      { guidance: true, description: 'Use for contextual detail views (row inspectors, entity details) where the user should keep the underlying list in sight.' },
      { guidance: true, description: 'Keep the caller as the source of truth: derive isOpen from selection state and clear the selection in onClose.' },
      { guidance: true, description: 'Use hasScrim={false} for master-detail flows where the user keeps interacting with the list behind the drawer.' },
      { guidance: false, description: 'Use a Drawer for short confirmations or small forms — use Dialog or AlertDialog instead.' },
      { guidance: false, description: 'Nest a Drawer inside another Drawer; flatten the navigation instead.' },
    ],
  },
};

/** @type {import('../docs-types').TranslationDoc} */
export const docsZh = {
  usage: {
    description: '用于检查器和详情视图的侧边面板浮层——"点击表格行查看详情"的模式。按 Escape 关闭抽屉，焦点返回到打开它的元素。滑入/滑出动画遵循 prefers-reduced-motion。',
    bestPractices: [
      { guidance: true, description: '用于上下文详情视图（行检查器、实体详情），让用户保持对底层列表的可见性。' },
      { guidance: true, description: '让调用方作为唯一数据源：从选中状态派生 isOpen，并在 onClose 中清除选中。' },
      { guidance: true, description: '在主从流程中使用 hasScrim={false}，让用户可继续操作抽屉后面的列表。' },
      { guidance: false, description: '用 Drawer 做简短确认或小表单——请改用 Dialog 或 AlertDialog。' },
      { guidance: false, description: '在 Drawer 中嵌套另一个 Drawer；应扁平化导航。' },
    ],
  },
};

/** @type {import('../docs-types').TranslationDoc} */
export const docsDense = {
  description: 'full-height side-panel overlay (native <dialog>), slides from end/start edge',
  usage: {
    description: 'Side-panel overlay for inspectors and detail views. Escape closes; focus restores to the opener. Slide animation respects prefers-reduced-motion.',
    bestPractices: [
      { guidance: true, description: 'Use for row inspectors and entity detail views.' },
      { guidance: true, description: 'Derive isOpen from selection state; clear it in onClose.' },
      { guidance: true, description: 'Use hasScrim={false} for non-modal master-detail flows.' },
      { guidance: false, description: 'Use for confirmations or small forms — use Dialog instead.' },
      { guidance: false, description: 'Nest Drawers.' },
    ],
  },
};
