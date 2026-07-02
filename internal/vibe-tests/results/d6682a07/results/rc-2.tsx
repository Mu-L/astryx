// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';

function NavContent() {
  return (
    <nav className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">Navigation</h2>
      <div className="space-y-1">
        <a href="#" className="block rounded px-3 py-2 bg-accent">Dashboard</a>
        <a href="#" className="block rounded px-3 py-2 hover:bg-accent">Projects</a>
        <a href="#" className="block rounded px-3 py-2 hover:bg-accent">Tasks</a>
      </div>
      <h3 className="text-sm font-medium text-muted-foreground pt-4">Settings</h3>
      <div className="space-y-1">
        <a href="#" className="block rounded px-3 py-2 hover:bg-accent">Profile</a>
        <a href="#" className="block rounded px-3 py-2 hover:bg-accent">Preferences</a>
      </div>
    </nav>
  );
}

export default function ResponsiveSidebar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (isMobile) {
    return (
      <div className="p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="fixed bottom-4 right-4 z-50">Menu</Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-2xl max-h-[60vh]">
            <NavContent />
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-bold">Page Content</h1>
        <p className="text-muted-foreground">Resize below 768px to see the bottom sheet.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r">
        <NavContent />
      </aside>
      <main className="flex-1 p-6">
        <h1 className="text-xl font-bold">Page Content</h1>
        <p className="text-muted-foreground">Resize below 768px to see the bottom sheet.</p>
      </main>
    </div>
  );
}
