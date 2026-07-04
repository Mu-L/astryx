// Copyright (c) Meta Platforms, Inc. and affiliates.

import type {PlainDate} from '../utils/plainDate';
import {plainDateIsEqual, plainDateIsInRange} from '../utils/plainDate';

export interface DayCellState {
  effectivelyDisabled: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isInPreview: boolean;
  isPreviewStart: boolean;
  isPreviewEnd: boolean;
  isFirstColumn: boolean;
  isLastColumn: boolean;
}

export interface DayCellStateInput {
  date: PlainDate;
  dayIndex: number;
  mode: 'single' | 'range';
  selectedDate: PlainDate | null;
  rangeStart: PlainDate | null;
  rangeEnd: PlainDate | null;
  previewStart: PlainDate | null;
  previewEnd: PlainDate | null;
  today: PlainDate;
  isDisabled: boolean;
  isOutside: boolean;
}

/**
 * Derives all visual/interaction states for a single day cell.
 *
 * Outside (adjacent-month) days never receive selection, range, or preview
 * state: in the two-month layout the same date renders in both panes, and
 * highlighting the spillover copy would duplicate the selection onto the wrong
 * month's pane (#2715).
 */
export function computeDayCellState(input: DayCellStateInput): DayCellState {
  const {
    date,
    dayIndex,
    mode,
    selectedDate,
    rangeStart,
    rangeEnd,
    previewStart,
    previewEnd,
    today,
    isDisabled,
    isOutside,
  } = input;

  return {
    effectivelyDisabled: isDisabled || isOutside,
    isToday: plainDateIsEqual(date, today),
    isSelected: !!(
      !isOutside &&
      mode === 'single' &&
      selectedDate &&
      plainDateIsEqual(date, selectedDate)
    ),
    isInRange: !!(
      !isOutside &&
      mode === 'range' &&
      rangeStart &&
      rangeEnd &&
      plainDateIsInRange(date, [rangeStart, rangeEnd])
    ),
    isRangeStart: !!(
      !isOutside &&
      mode === 'range' &&
      rangeStart &&
      plainDateIsEqual(date, rangeStart)
    ),
    isRangeEnd: !!(
      !isOutside &&
      mode === 'range' &&
      rangeEnd &&
      plainDateIsEqual(date, rangeEnd)
    ),
    isInPreview: !!(
      !isOutside &&
      previewStart &&
      previewEnd &&
      plainDateIsInRange(date, [previewStart, previewEnd])
    ),
    isPreviewStart: !!(
      !isOutside &&
      previewStart &&
      plainDateIsEqual(date, previewStart)
    ),
    isPreviewEnd: !!(
      !isOutside &&
      previewEnd &&
      plainDateIsEqual(date, previewEnd)
    ),
    isFirstColumn: dayIndex === 0,
    isLastColumn: dayIndex === 6,
  };
}

/**
 * Rounding for the range background.
 *
 * Rounds at the range endpoints and the grid row edges, and also caps the
 * highlight where the range meets a break in continuity — a neighbouring cell
 * that is disabled or an adjacent-month (outside) day. Without a cap the
 * highlight would run with a hard square edge straight into the disabled/gap
 * cell; capping it reads as a proper end of the highlighted run (#2715).
 *
 * `neighbors` describes whether the day immediately before/after (in the same
 * week row) continues the highlighted range. When omitted, only the endpoint
 * and grid-edge rounding applies (backwards compatible).
 */
export function computeRangeRounding(
  state: DayCellState,
  neighbors?: {prevInRange?: boolean; nextInRange?: boolean},
) {
  const prevBreaks = neighbors ? neighbors.prevInRange === false : false;
  const nextBreaks = neighbors ? neighbors.nextInRange === false : false;
  return {
    roundLeft: state.isRangeStart || state.isFirstColumn || prevBreaks,
    roundRight: state.isRangeEnd || state.isLastColumn || nextBreaks,
  };
}

/** Edge rounding for preview background. */
export function computePreviewRounding(state: DayCellState) {
  return {
    roundLeft: state.isPreviewStart || state.isFirstColumn,
    roundRight: state.isPreviewEnd || state.isLastColumn,
  };
}

/** Whether a day is a selection endpoint (selected, range start, or range end). */
export function isEndpoint(state: DayCellState): boolean {
  return state.isSelected || state.isRangeStart || state.isRangeEnd;
}

/**
 * Whether a day participates in the continuous range highlight — i.e. it is a
 * range day whose background actually paints. Outside (adjacent-month) and
 * disabled days break the run, so the highlighted day beside them gets an end
 * cap (see `computeRangeRounding`). Used to derive a neighbour's continuity.
 */
export function isRangeHighlighted(input: {
  date: PlainDate;
  mode: 'single' | 'range';
  rangeStart: PlainDate | null;
  rangeEnd: PlainDate | null;
  isDisabled: boolean;
  isOutside: boolean;
}): boolean {
  const {date, mode, rangeStart, rangeEnd, isDisabled, isOutside} = input;
  return !!(
    mode === 'range' &&
    !isOutside &&
    !isDisabled &&
    rangeStart &&
    rangeEnd &&
    plainDateIsInRange(date, [rangeStart, rangeEnd])
  );
}
