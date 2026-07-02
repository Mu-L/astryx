// Copyright (c) Meta Platforms, Inc. and affiliates.

import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';

export default function DualThemeDemo() {
  return (
    <div className="flex gap-6 p-6">
      <div className="flex-1 space-y-4" style={{'--accent': '#0077B6'} as React.CSSProperties}>
        <h2 className="text-xl font-bold" style={{color: '#0077B6'}}>Ocean Theme</h2>
        <Card className="border" style={{backgroundColor: '#f0f8ff'}}>
          <CardContent className="p-4 space-y-3">
            <p className="text-sm">Blue-toned accent with shared spacing and typography.</p>
            <Button style={{backgroundColor: '#0077B6', color: 'white'}}>Primary Action</Button>
          </CardContent>
        </Card>
      </div>
      <div className="flex-1 space-y-4" style={{'--accent': '#E76F51'} as React.CSSProperties}>
        <h2 className="text-xl font-bold" style={{color: '#E76F51'}}>Sunset Theme</h2>
        <Card className="border" style={{backgroundColor: '#fff5f0'}}>
          <CardContent className="p-4 space-y-3">
            <p className="text-sm">Warm orange accent with the same shared tokens.</p>
            <Button style={{backgroundColor: '#E76F51', color: 'white'}}>Primary Action</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
