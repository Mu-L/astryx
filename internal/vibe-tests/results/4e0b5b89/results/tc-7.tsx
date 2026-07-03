import {ThemeProvider} from '@/components/ui/theme-provider';

export default function NestedThemes() {
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-slate-900 text-white p-4">
        <nav className="space-y-2">
          <a href="#" className="block px-3 py-2 rounded bg-slate-800">Dashboard</a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-slate-800">Analytics</a>
          <a href="#" className="block px-3 py-2 rounded hover:bg-slate-800">Reports</a>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-background">
        <h1 className="text-2xl font-bold mb-4">Light Content Area</h1>
        <div className="border rounded-lg p-4">
          <p className="text-muted-foreground">
            This area uses the light theme while the sidebar has a dark theme.
            In shadcn, nested themes require separate ThemeProvider contexts or direct CSS class application.
          </p>
        </div>
      </main>
    </div>
  );
}