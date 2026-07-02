// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState} from 'react';

const images = [
  {src: 'https://picsum.photos/id/10/400/300', caption: 'Mountain landscape'},
  {src: 'https://picsum.photos/id/20/400/300', caption: 'Coastal sunset'},
  {src: 'https://picsum.photos/id/30/400/300', caption: 'Forest path'},
  {src: 'https://picsum.photos/id/40/400/300', caption: 'Urban skyline'},
  {src: 'https://picsum.photos/id/50/400/300', caption: 'Desert dunes'},
  {src: 'https://picsum.photos/id/60/400/300', caption: 'Lake reflection'},
];

export default function ImageGrid() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: 16}}>
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'none'}}
          >
            <img src={img.src} alt={img.caption} style={{width: '100%', aspectRatio: '1', objectFit: 'cover'}} />
          </button>
        ))}
      </div>
      {selected !== null && (
        <div
          style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            style={{position: 'absolute', top: 16, right: 16, background: 'white', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 20, cursor: 'pointer'}}
            aria-label="Close"
          >
            &times;
          </button>
          <img src={images[selected].src} alt={images[selected].caption} style={{maxWidth: '90%', maxHeight: '70vh', objectFit: 'contain'}} />
          <p style={{color: 'white', marginTop: 12, fontSize: 14}}>{images[selected].caption}</p>
        </div>
      )}
    </>
  );
}
