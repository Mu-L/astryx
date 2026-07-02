// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';

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
    <Card className="w-96">
      <CardHeader>
        <CardTitle>Active Users</CardTitle>
      </CardHeader>
      <CardContent>
        {state === 'loading' && (
          <div className="flex h-24 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        )}
        {state === 'error' && (
          <div className="space-y-3">
            <p className="text-destructive">Failed to load widget data</p>
            <Button variant="secondary" onClick={retry}>Retry</Button>
          </div>
        )}
        {state === 'data' && (
          <div className="space-y-1">
            <p className="text-4xl font-bold">2,847</p>
            <p className="text-sm text-muted-foreground">+12% from yesterday</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
