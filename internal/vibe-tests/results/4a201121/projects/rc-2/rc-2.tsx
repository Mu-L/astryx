// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState, useEffect} from 'react';

function NavContent() {
  return (
    <nav>
      <h2 style={{fontSize: 16, fontWeight: 600, margin: '0 0 12px'}}>Navigation</h2>
      <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
        <li><a href="#" style={{display: 'block', padding: '8px 12px', background: '#f0f0f0', borderRadius: 4, textDecoration: 'none', color: '#333', marginBottom: 4}}>Dashboard</a></li>
        <li><a href="#" style={{display: 'block', padding: '8px 12px', borderRadius: 4, textDecoration: 'none', color: '#333', marginBottom: 4}}>Projects</a></li>
        <li><a href="#" style={{display: 'block', padding: '8px 12px', borderRadius: 4, textDecoration: 'none', color: '#333', marginBottom: 4}}>Tasks</a></li>
      </ul>
      <h3 style={{fontSize: 13, color: '#666', margin: '16px 0 8px'}}>Settings</h3>
      <ul style={{listStyle: 'none', padding: 0, margin: 0}}>
        <li><a href="#" style={{display: 'block', padding: '8px 12px', borderRadius: 4, textDecoration: 'none', color: '#333', marginBottom: 4}}>Profile</a></li>
        <li><a href="#" style={{display: 'block', padding: '8px 12px', borderRadius: 4, textDecoration: 'none', color: '#333'}}>Preferences</a></li>
      </ul>
    </nav>
  );
}

export default function ResponsiveSidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (isMobile) {
    return (
      <div style={{padding: 16}}>
        <h1 style={{fontSize: 20, fontWeight: 700}}>Page Content</h1>
        <p style={{color: '#666'}}>Resize below 768px to see the bottom sheet.</p>
        {isOpen && (
          <>
            <div onClick={() => setIsOpen(false)} style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99}} />
            <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderRadius: '16px 16px 0 0', padding: 16, maxHeight: '60vh', overflowY: 'auto', zIndex: 100}}>
              <NavContent />
            </div>
          </>
        )}
        <button onClick={() => setIsOpen(!isOpen)} style={{position: 'fixed', bottom: 16, right: 16, padding: '10px 20px', background: '#0066cc', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', zIndex: 50}}>Menu</button>
      </div>
    );
  }

  return (
    <div style={{display: 'flex', height: '100vh'}}>
      <aside style={{width: 240, borderRight: '1px solid #e0e0e0', padding: 16}}>
        <NavContent />
      </aside>
      <main style={{flex: 1, padding: 24}}>
        <h1 style={{fontSize: 20, fontWeight: 700}}>Page Content</h1>
        <p style={{color: '#666'}}>Resize below 768px to see the bottom sheet.</p>
      </main>
    </div>
  );
}
