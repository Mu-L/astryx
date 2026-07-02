// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState} from 'react';

export default function AdminPanel() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
      <header style={{borderBottom: '1px solid #e0e0e0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, background: 'white', zIndex: 10}}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{background: 'none', border: 'none', cursor: 'pointer', fontSize: 20}}>☰</button>
        <h1 style={{fontSize: 18, fontWeight: 600, margin: 0}}>Admin Panel</h1>
      </header>
      <div style={{display: 'flex', flex: 1, overflow: 'hidden'}}>
        {sidebarOpen && (
          <aside style={{width: 220, borderRight: '1px solid #e0e0e0', padding: 16, overflowY: 'auto'}}>
            <nav>
              <a href="#" style={{display: 'block', padding: '8px 12px', background: '#f0f0f0', borderRadius: 4, textDecoration: 'none', color: '#333', marginBottom: 4, fontWeight: 500}}>Dashboard</a>
              <a href="#" style={{display: 'block', padding: '8px 12px', borderRadius: 4, textDecoration: 'none', color: '#333', marginBottom: 4}}>Analytics</a>
              <a href="#" style={{display: 'block', padding: '8px 12px', borderRadius: 4, textDecoration: 'none', color: '#333', marginBottom: 4}}>Users</a>
              <a href="#" style={{display: 'block', padding: '8px 12px', borderRadius: 4, textDecoration: 'none', color: '#333', marginBottom: 4}}>Roles</a>
              <a href="#" style={{display: 'block', padding: '8px 12px', borderRadius: 4, textDecoration: 'none', color: '#333'}}>Settings</a>
            </nav>
          </aside>
        )}
        <main style={{flex: 1, padding: 24, overflowY: 'auto'}}>
          <h2 style={{fontSize: 20, fontWeight: 700, marginBottom: 16}}>Dashboard</h2>
          <div style={{border: '1px solid #e0e0e0', borderRadius: 8, padding: 16}}>
            Main content area with metrics, charts, and data tables.
          </div>
        </main>
        <aside style={{width: 280, borderLeft: '1px solid #e0e0e0', padding: 16, overflowY: 'auto'}}>
          <h3 style={{fontSize: 16, fontWeight: 600, marginBottom: 12}}>Details</h3>
          <div style={{border: '1px solid #e0e0e0', borderRadius: 8, padding: 12}}>
            Right panel for context, detail views, or quick actions.
          </div>
        </aside>
      </div>
    </div>
  );
}
