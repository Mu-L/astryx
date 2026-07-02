// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState} from 'react';
import {Dialog} from '@astryxdesign/core/Dialog';
import {DialogHeader} from '@astryxdesign/core/Dialog';
import {DialogBody} from '@astryxdesign/core/Dialog';
import {Thumbnail} from '@astryxdesign/core/Thumbnail';
import {IconButton} from '@astryxdesign/core/IconButton';
import {Text} from '@astryxdesign/core/Text';
import stylex from '@stylexjs/stylex';

const styles = stylex.create({
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: 8,
    padding: 16,
  },
  lightbox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  image: {
    maxWidth: '100%',
    maxHeight: '70vh',
    objectFit: 'contain',
  },
});

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
      <div {...stylex.props(styles.grid)}>
        {images.map((img, i) => (
          <Thumbnail
            key={i}
            src={img.src}
            alt={img.caption}
            label={img.caption}
            onClick={() => setSelected(i)}
          />
        ))}
      </div>
      <Dialog
        isOpen={selected !== null}
        onOpenChange={(open) => { if (!open) {setSelected(null);} }}
        variant="fullscreen"
      >
        <DialogHeader title={selected !== null ? images[selected].caption : ''} />
        <DialogBody>
          {selected !== null && (
            <div {...stylex.props(styles.lightbox)}>
              <img
                src={images[selected].src}
                alt={images[selected].caption}
                {...stylex.props(styles.image)}
              />
              <Text type="body">{images[selected].caption}</Text>
            </div>
          )}
        </DialogBody>
      </Dialog>
    </>
  );
}
