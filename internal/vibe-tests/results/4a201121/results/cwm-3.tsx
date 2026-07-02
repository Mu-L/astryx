// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState} from 'react';

const emojis = ['📄', '🎯', '🚀', '💡', '📊', '🎨', '🔥', '⭐', '📝', '🏆', '💻', '🌍'];

export default function NotionPageHeader() {
  const [icon, setIcon] = useState('📄');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <div style={{border: '1px solid #e0e0e0', borderRadius: 8, overflow: 'hidden'}}>
      <img src="https://picsum.photos/id/100/1200/400" alt="Cover" style={{width: '100%', height: 200, objectFit: 'cover'}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: 16, position: 'relative'}}>
        <button
          onClick={() => setIsPickerOpen(!isPickerOpen)}
          style={{fontSize: 32, background: 'none', border: 'none', cursor: 'pointer'}}
          aria-label="Change icon"
        >
          {icon}
        </button>
        {isPickerOpen && (
          <div style={{position: 'absolute', top: 56, left: 16, background: 'white', border: '1px solid #ddd', borderRadius: 8, padding: 8, display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 4, zIndex: 10}}>
            {emojis.map((e) => (
              <button key={e} onClick={() => { setIcon(e); setIsPickerOpen(false); }} style={{fontSize: 20, background: 'none', border: 'none', cursor: 'pointer', padding: 4}}>
                {e}
              </button>
            ))}
          </div>
        )}
        <h1 style={{fontSize: 24, fontWeight: 700, margin: 0}}>Untitled Page</h1>
      </div>
    </div>
  );
}
