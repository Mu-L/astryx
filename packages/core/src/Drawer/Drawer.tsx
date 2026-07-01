// Copyright (c) Meta Platforms, Inc. and affiliates.

'use client';

/**
 * @file Drawer.tsx
 * @input Uses React, StyleX, theme tokens, useScrollLock, BaseProps, mergeProps/mergeRefs, themeProps
 * @output Exports Drawer component and DrawerProps
 * @position Core implementation; consumed by index.ts, tested by Drawer.test.tsx
 *
 * Full-height side-panel overlay for inspectors and detail views — the
 * "click a table row, see its details" pattern. Slides in from the logical
 * end (right in LTR) or start edge.
 *
 * Uses the native `<dialog>` element (same precedent as Dialog/MobileNav):
 * - `showModal()` when `hasScrim` (default) — top-layer rendering, focus
 *   trapping, `::backdrop`, no z-index management.
 * - `show()` when `hasScrim={false}` — non-modal overlay; the page behind
 *   stays interactive (e.g. master-detail inspectors).
 *
 * Entry animation uses `@starting-style` + `transition-behavior:
 * allow-discrete` (see CLAUDE.md dialog-entry pattern); exit slides out
 * before a delayed `dialog.close()` releases the top layer and restores
 * focus to the element that opened the drawer.
 *
 * SYNC: When modified, update these files to stay in sync:
 * - /packages/core/src/Drawer/Drawer.doc.mjs (props table, features, usage)
 * - /packages/core/src/Drawer/Drawer.test.tsx (tests for new/changed behavior)
 * - /packages/core/src/Drawer/index.ts (exports if types change)
 * - /packages/cli/templates/blocks/components/Drawer/ (showcase blocks)
 */

import {useCallback, useEffect, useRef, type ReactNode} from 'react';
import * as stylex from '@stylexjs/stylex';
import type {BaseProps} from '../BaseProps';
import {
  borderVars,
  colorVars,
  durationVars,
  easeVars,
  shadowVars,
} from '../theme/tokens.stylex';
import {useScrollLock} from '../hooks/useScrollLock';
import {mergeProps, mergeRefs} from '../utils';
import {themeProps} from '../utils/themeProps';

// =============================================================================
// Styles
// =============================================================================

const styles = stylex.create({
  dialog: {
    // Reset native <dialog> defaults — the dialog element IS the panel.
    position: 'fixed',
    margin: 0,
    padding: 0,
    border: 'none',
    maxWidth: 'none',
    maxHeight: 'none',
    insetBlock: 0,
    height: '100dvh',
    boxSizing: 'border-box',
    flexDirection: 'column',
    backgroundColor: colorVars['--color-background-surface'],
    boxShadow: shadowVars['--shadow-high'],
    overflow: 'hidden',
    overscrollBehavior: 'contain',
    outline: 'none',
    // Closed state. `display` participates in the transition with
    // allow-discrete so it flips to none only after the slide-out finishes
    // (@starting-style covers the none -> flex entry).
    display: 'none',
    transitionProperty: 'transform, display',
    transitionDuration: durationVars['--duration-medium'],
    transitionTimingFunction: easeVars['--ease-standard'],
    transitionBehavior: 'allow-discrete',
    '@media (prefers-reduced-motion: reduce)': {
      transitionDuration: '0.01s',
    },
  },
  // Open state applied via isOpen prop, not :where([open]) — attribute
  // selectors have zero specificity and can lose to default styles
  // depending on CSS source order (same rationale as Dialog/MobileNav).
  open: {
    display: 'flex',
  },
  // Without the top layer (hasScrim={false} uses show(), not showModal())
  // the panel needs explicit stacking. No z-index token exists in the theme;
  // 1000 matches the app-level drawer convention.
  nonModal: {
    zIndex: 1000,
  },
  end: {
    insetInlineEnd: 0,
    insetInlineStart: 'auto',
    borderInlineStartWidth: borderVars['--border-width'],
    borderInlineStartStyle: 'solid',
    borderInlineStartColor: colorVars['--color-border'],
    transform: {
      default: 'translateX(100%)',
      ':is([dir="rtl"] *)': 'translateX(-100%)',
    },
  },
  endOpen: {
    transform: {
      default: 'translateX(0)',
      '@starting-style': {
        default: 'translateX(100%)',
        ':is([dir="rtl"] *)': 'translateX(-100%)',
      },
    },
  },
  start: {
    insetInlineStart: 0,
    insetInlineEnd: 'auto',
    borderInlineEndWidth: borderVars['--border-width'],
    borderInlineEndStyle: 'solid',
    borderInlineEndColor: colorVars['--color-border'],
    transform: {
      default: 'translateX(-100%)',
      ':is([dir="rtl"] *)': 'translateX(100%)',
    },
  },
  startOpen: {
    transform: {
      default: 'translateX(0)',
      '@starting-style': {
        default: 'translateX(-100%)',
        ':is([dir="rtl"] *)': 'translateX(100%)',
      },
    },
  },
  // Scrim via the browser's ::backdrop pseudo-element (top layer).
  scrim: {
    '::backdrop': {
      backgroundColor: colorVars['--color-overlay'],
      backdropFilter: 'blur(2px)',
      opacity: 0,
      transitionProperty: 'opacity',
      transitionDuration: durationVars['--duration-medium'],
      transitionTimingFunction: easeVars['--ease-standard'],
    },
    '@media (prefers-reduced-motion: reduce)': {
      '::backdrop': {
        transitionDuration: '0.01s',
      },
    },
  },
  scrimOpen: {
    '::backdrop': {
      opacity: {
        default: 1,
        '@starting-style': 0,
      },
    },
  },
  // Scrollable content area — full-bleed; consumers compose their own
  // header/body/footer padding (see Drawer blocks for the pattern).
  content: {
    flexGrow: 1,
    minHeight: 0,
    width: '100%',
    overflowY: 'auto',
    overflowX: 'hidden',
    overscrollBehavior: 'contain',
    touchAction: 'pan-y',
    outline: 'none',
  },
});

const dynamicStyles = stylex.create({
  width: (w: number) => ({
    // Full width on viewports narrower than the budget (reference drawers
    // collapse to a full overlay on small screens).
    width: '100dvw',
    maxWidth: `${w}px`,
  }),
});

// =============================================================================
// Types
// =============================================================================

export interface DrawerProps extends BaseProps<HTMLDialogElement> {
  /** Ref forwarded to the root <dialog> element */
  ref?: React.Ref<HTMLDialogElement>;

  /**
   * Whether the drawer is open. Fully controlled — pair with `onClose`.
   */
  isOpen: boolean;

  /**
   * Called when the drawer requests to be closed
   * (Escape key, scrim click). The caller owns the open state.
   */
  onClose: () => void;

  /**
   * Which logical edge the drawer slides from.
   * - `'end'` — inline-end edge (right in LTR) — the inspector convention
   * - `'start'` — inline-start edge (left in LTR)
   * @default 'end'
   */
  side?: 'end' | 'start';

  /**
   * Width budget of the panel in pixels. On viewports narrower than this
   * the drawer becomes a full-width overlay.
   * @default 400
   */
  width?: number;

  /**
   * Accessible label for the drawer (required — the drawer has no
   * built-in heading to derive a name from).
   */
  label: string;

  /**
   * Whether to render a modal scrim behind the drawer.
   * - `true` (default) — `showModal()`: top layer, focus trap, body scroll
   *   lock, click-outside-to-close.
   * - `false` — `show()`: non-modal overlay; the page behind stays
   *   interactive. Escape still closes while focus is inside the drawer.
   * @default true
   */
  hasScrim?: boolean;

  /**
   * Drawer content. Rendered inside a full-height scrollable area.
   * Focus the element with `data-autofocus` on open, if present.
   */
  children: ReactNode;

  /**
   * Test ID for the root element.
   */
  'data-testid'?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * A full-height side-panel overlay for inspectors and detail views.
 *
 * Slides in from the logical end (right in LTR) or start edge using the
 * native `<dialog>` element: modal with a scrim by default, or a non-modal
 * inline overlay with `hasScrim={false}`. Escape closes; focus returns to
 * the element that opened the drawer.
 *
 * @example
 * ```
 * const [selected, setSelected] = useState(null);
 * <Drawer
 *   isOpen={selected != null}
 *   onClose={() => setSelected(null)}
 *   label={`Details: ${selected?.name}`}>
 *   <HostDetails host={selected} />
 * </Drawer>
 * ```
 */
export function Drawer({
  isOpen,
  onClose,
  side = 'end',
  width = 400,
  label,
  hasScrim = true,
  children,
  xstyle,
  className,
  style,
  ref,
  ...props
}: DrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
  // Element focused when the drawer opened — restored on close.
  const triggerElementRef = useRef<HTMLElement | null>(null);

  // Open/close the native dialog. close() is delayed so the slide-out
  // transition can play; focus restore happens after close() because a
  // modal dialog makes the rest of the document inert (focus() on the
  // trigger would silently fail while the dialog is still open).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }

    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }

    if (isOpen) {
      if (!dialog.open) {
        triggerElementRef.current =
          document.activeElement as HTMLElement | null;
        if (hasScrim) {
          dialog.showModal();
        } else {
          dialog.show();
        }
        // React's autoFocus calls .focus() during commit, before the dialog
        // is shown, so it silently fails — honor data-autofocus instead
        // (same contract as Dialog).
        const autofocusTarget =
          dialog.querySelector<HTMLElement>('[data-autofocus]');
        if (autofocusTarget) {
          autofocusTarget.focus();
        }
      }
    } else if (dialog.open) {
      const duration = window.matchMedia('(prefers-reduced-motion: reduce)')
        .matches
        ? 10
        : 250;
      closeTimeoutRef.current = setTimeout(() => {
        dialog.close();
        // Return focus to the element that opened the drawer.
        triggerElementRef.current?.focus();
        triggerElementRef.current = null;
      }, duration);
    }

    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
    };
  }, [isOpen, hasScrim]);

  // Close the native dialog on unmount if it's still open. When the drawer
  // is mounted inside an <Activity> that flips to mode="hidden", React runs
  // effect cleanups (with a stale isOpen) instead of re-running the effect
  // with isOpen=false — leaving the <dialog> `open` would skip showModal()
  // on the next open and the drawer could never be re-opened (see
  // MobileNavReopen.test.tsx for the original repro). This must be a
  // separate unmount-only effect: putting it in the open/close effect above
  // would close the dialog on every isOpen flip and cut off the delayed
  // slide-out close.
  useEffect(() => {
    const dialog = dialogRef.current;
    return () => {
      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);

  // Lock body scroll while a modal drawer is open (iOS Safari workaround).
  useScrollLock(isOpen && hasScrim);

  // Escape closes. The native `cancel` event only fires for showModal();
  // this keydown handler covers the non-modal show() path too.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };

    dialog.addEventListener('keydown', handleKeyDown);
    return () => dialog.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Native cancel event (browser Escape handling) — prevent the browser
  // from closing the dialog directly and route through onClose so the
  // caller's state stays the source of truth.
  const handleCancel = useCallback(
    (event: React.SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault();
      onClose();
    },
    [onClose],
  );

  // Clicks on the ::backdrop target the <dialog> element itself; clicks on
  // drawer content always target a child (the content area fills the panel).
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLDialogElement>) => {
      if (event.target === event.currentTarget && hasScrim) {
        onClose();
      }
    },
    [hasScrim, onClose],
  );

  const isEnd = side === 'end';

  // Filter out native `open` to prevent InvalidStateError when passed
  const {open: _open, ...safeProps} = props as Record<string, unknown>;

  return (
    <dialog
      ref={mergeRefs(ref, dialogRef)}
      aria-label={label}
      aria-modal={hasScrim ? 'true' : undefined}
      onClick={handleClick}
      onCancel={handleCancel}
      {...mergeProps(
        themeProps('drawer', {side}),
        stylex.props(
          styles.dialog,
          dynamicStyles.width(width),
          isEnd ? styles.end : styles.start,
          isOpen && styles.open,
          isOpen && (isEnd ? styles.endOpen : styles.startOpen),
          hasScrim ? styles.scrim : styles.nonModal,
          hasScrim && isOpen && styles.scrimOpen,
          xstyle,
        ),
        className,
        style,
      )}
      {...safeProps}>
      {/* Scrollable content area — tabIndex so the dialog's focusing steps
          land on the panel body rather than the first button inside. */}
      <div tabIndex={-1} {...stylex.props(styles.content)}>
        {children}
      </div>
    </dialog>
  );
}

Drawer.displayName = 'Drawer';
