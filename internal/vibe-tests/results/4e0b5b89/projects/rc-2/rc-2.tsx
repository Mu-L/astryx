import {Sheet, SheetContent, SheetTrigger} from '@/components/ui/sheet';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';

const navItems = ['Home', 'Dashboard', 'Projects', 'Account', 'Settings'];

export default function ResponsiveNav() {
  return (
    <div className="flex h-screen">
      <aside className="hidden md:flex md:w-64 md:flex-col border-r p-4">
        <nav className="space-y-2">
          {navItems.map(item => (
            <a key={item} href="#" className="block px-3 py-2 rounded hover:bg-muted">{item}</a>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <div className="md:hidden mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Menu</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[50vh]">
              <nav className="space-y-2 pt-4">
                {navItems.map(item => (
                  <a key={item} href="#" className="block px-3 py-2 rounded hover:bg-muted">{item}</a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
        <p>Main content. Sidebar on desktop, bottom sheet on mobile.</p>
      </main>
    </div>
  );
}