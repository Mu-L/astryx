// Copyright (c) Meta Platforms, Inc. and affiliates.

import React from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';

export default function AdminPanel() {
  return (
    <div className="flex h-screen flex-col">
      <header className="border-b px-4 py-3 flex items-center justify-between bg-background sticky top-0 z-10">
        <h1 className="text-lg font-semibold">Admin Panel</h1>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 border-r p-4 hidden md:block overflow-y-auto">
          <nav className="space-y-1">
            <a href="#" className="block rounded px-3 py-2 bg-accent font-medium">Dashboard</a>
            <a href="#" className="block rounded px-3 py-2 hover:bg-accent">Analytics</a>
            <a href="#" className="block rounded px-3 py-2 hover:bg-accent">Users</a>
            <a href="#" className="block rounded px-3 py-2 hover:bg-accent">Roles</a>
            <a href="#" className="block rounded px-3 py-2 hover:bg-accent">Settings</a>
          </nav>
        </aside>
        <main className="flex-1 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Dashboard</h2>
          <Card>
            <CardContent className="p-4">
              Main content area with metrics, charts, and data tables.
            </CardContent>
          </Card>
        </main>
        <aside className="w-72 border-l p-4 hidden lg:block overflow-y-auto">
          <h3 className="text-lg font-semibold mb-3">Details</h3>
          <Card>
            <CardContent className="p-4">
              Right panel for context, detail views, or quick actions.
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
