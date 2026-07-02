// Copyright (c) Meta Platforms, Inc. and affiliates.

import React from 'react';
import {Card, CardContent} from '@/components/ui/card';

export default function MetricsDashboardCard() {
  return (
    <Card className="w-72">
      <CardContent className="p-4 space-y-1">
        <p className="text-sm text-muted-foreground">Total Revenue</p>
        <p className="text-3xl font-bold tabular-nums">$12,340.56</p>
        <p className="text-xs text-muted-foreground">+12% from last month</p>
      </CardContent>
    </Card>
  );
}
