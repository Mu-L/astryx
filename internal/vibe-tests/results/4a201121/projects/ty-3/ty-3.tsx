// Copyright (c) Meta Platforms, Inc. and affiliates.

import React from 'react';

export default function MetricsDashboardCard() {
  return (
    <div style={{border: '1px solid #e0e0e0', borderRadius: 8, padding: 16, maxWidth: 280}}>
      <p style={{fontSize: 13, color: '#666', margin: '0 0 4px'}}>Total Revenue</p>
      <p style={{fontSize: 32, fontWeight: 700, margin: '0 0 4px', fontVariantNumeric: 'tabular-nums'}}>$12,340.56</p>
      <p style={{fontSize: 12, color: '#666', margin: 0}}>+12% from last month</p>
    </div>
  );
}
