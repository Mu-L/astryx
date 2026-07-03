import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Separator} from '@/components/ui/separator';

const navItems = ['General', 'Account', 'Notifications', 'Security', 'Integrations'];

export default function SettingsDashboard() {
  return (
    <div className="flex h-screen">
      <header className="fixed top-0 left-0 right-0 h-14 border-b flex items-center px-4 bg-background z-10">
        <h1 className="text-lg font-semibold">My App</h1>
      </header>
      <aside className="fixed top-14 left-0 bottom-0 w-64 border-r p-4">
        <nav className="space-y-1">
          {navItems.map((item, i) => (
            <a key={item} href="#" className={`block px-3 py-2 rounded ${i === 0 ? 'bg-muted font-medium' : 'hover:bg-muted'}`}>
              {item}
            </a>
          ))}
        </nav>
      </aside>
      <main className="ml-64 mt-14 p-6 space-y-6">
        <h2 className="text-2xl font-bold">General Settings</h2>
        <Card>
          <CardHeader><CardTitle>Application Name</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">Configure your application preferences.</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Language</CardTitle></CardHeader>
          <CardContent><p className="text-muted-foreground">Choose your preferred language.</p></CardContent>
        </Card>
      </main>
    </div>
  );
}