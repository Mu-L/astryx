// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState} from 'react';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';

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
      <div className="grid grid-cols-3 gap-4 p-4">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className="overflow-hidden rounded-lg border hover:ring-2 hover:ring-primary"
          >
            <img src={img.src} alt={img.caption} className="aspect-square w-full object-cover" />
          </button>
        ))}
      </div>
      <Dialog open={selected !== null} onOpenChange={(open) => { if (!open) {setSelected(null);} }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selected !== null ? images[selected].caption : ''}</DialogTitle>
          </DialogHeader>
          {selected !== null && (
            <div className="flex flex-col items-center gap-4">
              <img src={images[selected].src} alt={images[selected].caption} className="max-h-[70vh] object-contain" />
              <p className="text-sm text-muted-foreground">{images[selected].caption}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
