// Copyright (c) Meta Platforms, Inc. and affiliates.

import React from 'react';
import {Theme} from '@astryxdesign/core/theme';
import {defineTheme} from '@astryxdesign/core/theme';
import {Card} from '@astryxdesign/core/Card';
import {Button} from '@astryxdesign/core/Button';
import {Text} from '@astryxdesign/core/Text';
import stylex from '@stylexjs/stylex';

const styles = stylex.create({
  container: {
    display: 'flex',
    gap: 24,
    padding: 24,
  },
  section: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
});

const sharedTokens = {
  '--spacing-1': '4px',
  '--spacing-2': '8px',
  '--spacing-3': '12px',
  '--spacing-4': '16px',
  '--font-family': 'Inter, system-ui, sans-serif',
  '--font-size-body': '14px',
  '--font-size-heading': '20px',
  '--line-height-body': '1.5',
};

const oceanTheme = defineTheme({
  name: 'ocean',
  tokens: {
    ...sharedTokens,
    '--color-accent': '#0077B6',
    '--color-accent-hover': '#005f8a',
    '--color-background-surface': '#f0f8ff',
    '--color-background-wash': '#e6f2fa',
  },
});

const sunsetTheme = defineTheme({
  name: 'sunset',
  tokens: {
    ...sharedTokens,
    '--color-accent': '#E76F51',
    '--color-accent-hover': '#c45a3f',
    '--color-background-surface': '#fff5f0',
    '--color-background-wash': '#fae8e0',
  },
});

export default function DualThemeDemo() {
  return (
    <div {...stylex.props(styles.container)}>
      <Theme theme={oceanTheme} mode="light">
        <div {...stylex.props(styles.section)}>
          <Text type="display-3">Ocean Theme</Text>
          <Card padding={4}>
            <Text type="body">Blue-toned accent with shared spacing and typography.</Text>
            <Button label="Primary Action" variant="primary" />
          </Card>
        </div>
      </Theme>
      <Theme theme={sunsetTheme} mode="light">
        <div {...stylex.props(styles.section)}>
          <Text type="display-3">Sunset Theme</Text>
          <Card padding={4}>
            <Text type="body">Warm orange accent with the same shared tokens.</Text>
            <Button label="Primary Action" variant="primary" />
          </Card>
        </div>
      </Theme>
    </div>
  );
}
