// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState} from 'react';
import {Card} from '@astryxdesign/core/Card';
import {Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Popover} from '@astryxdesign/core/Popover';
import stylex from '@stylexjs/stylex';

const styles = stylex.create({
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  coverImage: {
    width: '100%',
    height: 200,
    objectFit: 'cover',
    borderRadius: 8,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: 16,
  },
  icon: {
    fontSize: 32,
    cursor: 'pointer',
  },
  emojiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: 4,
    padding: 8,
  },
  emojiBtn: {
    fontSize: 24,
    cursor: 'pointer',
    padding: 4,
    borderRadius: 4,
    border: 'none',
    background: 'transparent',
  },
});

const emojis = ['📄', '🎯', '🚀', '💡', '📊', '🎨', '🔥', '⭐', '📝', '🏆', '💻', '🌍'];

export default function NotionPageHeader() {
  const [icon, setIcon] = useState('📄');
  const [coverUrl] = useState('https://picsum.photos/id/100/1200/400');
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  return (
    <Card padding={0}>
      <div {...stylex.props(styles.header)}>
        <img src={coverUrl} alt="Page cover" {...stylex.props(styles.coverImage)} />
        <div {...stylex.props(styles.titleRow)}>
          <Popover
            isOpen={isPickerOpen}
            onOpenChange={setIsPickerOpen}
            trigger={
              <button {...stylex.props(styles.icon)} aria-label="Change icon">
                {icon}
              </button>
            }
            placement="below-start"
          >
            <div {...stylex.props(styles.emojiGrid)}>
              {emojis.map((e) => (
                <button
                  key={e}
                  {...stylex.props(styles.emojiBtn)}
                  onClick={() => { setIcon(e); setIsPickerOpen(false); }}
                >
                  {e}
                </button>
              ))}
            </div>
          </Popover>
          <Text type="display-2">Untitled Page</Text>
        </div>
      </div>
    </Card>
  );
}
