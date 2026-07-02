// Copyright (c) Meta Platforms, Inc. and affiliates.

import React from 'react';
import {Card} from '@astryxdesign/core/Card';
import {Text} from '@astryxdesign/core/Text';
import stylex from '@stylexjs/stylex';

const styles = stylex.create({
  container: {
    maxWidth: 300,
  },
  stack: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
});

export default function MetricsDashboardCard() {
  return (
    <div {...stylex.props(styles.container)}>
      <Card padding={4}>
        <div {...stylex.props(styles.stack)}>
          <Text type="label" color="secondary">Total Revenue</Text>
          <Text type="display-1" hasTabularNumbers>$12,340.56</Text>
          <Text type="supporting" color="secondary">+12% from last month</Text>
        </div>
      </Card>
    </div>
  );
}
