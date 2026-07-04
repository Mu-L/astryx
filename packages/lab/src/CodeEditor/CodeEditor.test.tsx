// Copyright (c) Meta Platforms, Inc. and affiliates.

import {describe, it, expect} from 'vitest';
import {render, screen} from '@testing-library/react';
import {CodeEditor} from './CodeEditor';

describe('CodeEditor', () => {
  it('gives the editable region an accessible name derived from language', () => {
    render(
      <CodeEditor value="" onChange={() => {}} language="typescript" />,
    );
    expect(
      screen.getByRole('textbox', {name: 'typescript code editor'}),
    ).toBeInTheDocument();
  });

  it('honors an explicit ariaLabel over the language-derived name', () => {
    render(
      <CodeEditor
        value=""
        onChange={() => {}}
        language="typescript"
        ariaLabel="Edit snippet"
      />,
    );
    expect(
      screen.getByRole('textbox', {name: 'Edit snippet'}),
    ).toBeInTheDocument();
  });
});
