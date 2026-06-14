// Copyright (c) Meta Platforms, Inc. and affiliates.

// Minimal ambient declaration for the o200k_base encoding entry so the
// playground typechecks whether or not gpt-tokenizer is installed yet; the
// real types come from the package once installed.
declare module 'gpt-tokenizer/encoding/o200k_base' {
  export function countTokens(text: string): number;
  export function encode(text: string): number[];
}
