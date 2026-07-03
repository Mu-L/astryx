import {useState, useEffect} from 'react';

export default function DashboardWidget() {
  const [state, setState] = useState<'loading' | 'error' | 'success'>('loading');

  useEffect(() => {
    const timer = setTimeout(() => {
      Math.random() > 0.7 ? setState('error') : setState('success');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{border: '1px solid #eee', borderRadius: 8, padding: 24, maxWidth: 300}}>
      <h3 style={{margin: '0 0 12px', fontSize: 14, color: '#666'}}>Active Users</h3>
      {state === 'loading' && (
        <div>
          <div style={{width: 80, height: 32, background: '#f0f0f0', borderRadius: 4, animation: 'pulse 1.5s infinite'}} />
          <div style={{width: 120, height: 16, background: '#f0f0f0', borderRadius: 4, marginTop: 8}} />
        </div>
      )}
      {state === 'error' && (
        <div>
          <p style={{color: '#dc3545', margin: '0 0 8px'}}>Failed to load data.</p>
          <button onClick={() => setState('loading')} style={{padding: '4px 12px', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer'}}>Retry</button>
        </div>
      )}
      {state === 'success' && (
        <div>
          <p style={{fontSize: 36, fontWeight: 700, margin: 0}}>42</p>
          <p style={{color: '#666', margin: '4px 0 0'}}>Current active users</p>
        </div>
      )}
    </div>
  );
}