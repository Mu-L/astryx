// Copyright (c) Meta Platforms, Inc. and affiliates.

import React from 'react';

const sharedStyle = {fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, lineHeight: 1.5};

export default function DualThemeDemo() {
  return (
    <div style={{display: 'flex', gap: 24, padding: 24, ...sharedStyle}}>
      <div style={{flex: 1}}>
        <h2 style={{fontSize: 20, fontWeight: 700, color: '#0077B6', marginBottom: 12}}>Ocean Theme</h2>
        <div style={{background: '#f0f8ff', border: '1px solid #b8d4e8', borderRadius: 8, padding: 16}}>
          <p style={{margin: '0 0 12px'}}>Blue-toned accent with shared spacing and typography.</p>
          <button style={{padding: '8px 16px', background: '#0077B6', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600}}>Primary Action</button>
        </div>
      </div>
      <div style={{flex: 1}}>
        <h2 style={{fontSize: 20, fontWeight: 700, color: '#E76F51', marginBottom: 12}}>Sunset Theme</h2>
        <div style={{background: '#fff5f0', border: '1px solid #e8c4b8', borderRadius: 8, padding: 16}}>
          <p style={{margin: '0 0 12px'}}>Warm orange accent with the same shared tokens.</p>
          <button style={{padding: '8px 16px', background: '#E76F51', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600}}>Primary Action</button>
        </div>
      </div>
    </div>
  );
}
