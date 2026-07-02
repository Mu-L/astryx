// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState, useEffect} from 'react';
import {Card} from '@astryxdesign/core/Card';
import {Spinner} from '@astryxdesign/core/Spinner';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Banner} from '@astryxdesign/core/Banner';
import stylex from '@stylexjs/stylex';

const styles = stylex.create({
  container: {
    maxWidth: 400,
    padding: 16,
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 120,
  },
  data: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
});

type State = 'loading' | 'error' | 'data';

export default function DashboardWidget() {
  const [state, setState] = useState<State>('loading');

  useEffect(() => {
    const timer = setTimeout(() => {
      setState(Math.random() > 0.3 ? 'data' : 'error');
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const retry = () => {
    setState('loading');
    setTimeout(() => setState('data'), 1500);
  };

  return (
    <div {...stylex.props(styles.container)}>
      <Card padding={4}>
        <Text type="display-3">Active Users</Text>
        {state === 'loading' && (
          <div {...stylex.props(styles.centered)}>
            <Spinner label="Loading data..." />
          </div>
        )}
        {state === 'error' && (
          <div {...stylex.props(styles.data)}>
            <Banner variant="error" title="Failed to load widget data" />
            <Button label="Retry" variant="secondary" onClick={retry} />
          </div>
        )}
        {state === 'data' && (
          <div {...stylex.props(styles.data)}>
            <Text type="display-1">2,847</Text>
            <Text type="supporting" color="secondary">+12% from yesterday</Text>
          </div>
        )}
      </Card>
    </div>
  );
}
