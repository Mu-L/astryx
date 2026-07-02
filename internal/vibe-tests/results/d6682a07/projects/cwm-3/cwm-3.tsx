// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState} from 'react';
import {Card} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';

const emojis = ['📄', '🎯', '🚀', '💡', '📊', '🎨', '🔥', '⭐', '📝', '🏆', '💻', '🌍'];

export default function NotionPageHeader() {
  const [icon, setIcon] = useState('📄');
  const coverUrl = 'https://picsum.photos/id/100/1200/400';

  return (
    <Card className="overflow-hidden">
      <img src={coverUrl} alt="Page cover" className="h-48 w-full object-cover" />
      <div className="flex items-center gap-3 p-4">
        <Popover>
          <PopoverTrigger asChild>
            <button className="text-3xl hover:bg-accent rounded p-1">{icon}</button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <div className="grid grid-cols-6 gap-1">
              {emojis.map((e) => (
                <button key={e} className="p-1 text-xl hover:bg-accent rounded" onClick={() => setIcon(e)}>{e}</button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <h1 className="text-2xl font-bold">Untitled Page</h1>
      </div>
    </Card>
  );
}
