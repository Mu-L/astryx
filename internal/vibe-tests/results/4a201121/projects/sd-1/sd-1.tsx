// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState, useEffect} from 'react';

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
    <div style={{border: '1px solid #e0e0e0', borderRadius: 8, padding: 20, maxWidth: 360}}>
      <h3 style={{margin: '0 0 12px', fontSize: 16, fontWeight: 600}}>Active Users</h3>
      {state === 'loading' && (
        <div style={{display: 'flex', justifyContent: 'center', padding: 32}}>
          <div style={{width: 32, height: 32, border: '3px solid #e0e0e0', borderTopColor: '#0066cc', borderRadius: '50%', animation: 'spin 1s linear infinite'}} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}
      {state === 'error' && (
        <div>
          <p style={{color: '#dc2626', marginBottom: 8}}>Failed to load widget data</p>
          <button onClick={retry} style={{padding: '6px 12px', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer'}}>Retry</button>
        </div>
      )}
      {state === 'data' && (
        <div>
          <p style={{fontSize: 36, fontWeight: 700, margin: 0}}>2,847</p>
          <p style={{fontSize: 13, color: '#666', margin: '4px 0 0'}}>+12% from yesterday</p>
        </div>
      )}
    </div>
  );
}
