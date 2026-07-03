import {useState} from 'react';

const navItems = ['Home', 'Dashboard', 'Projects', 'Account', 'Settings'];

export default function ResponsiveNav() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <div style={{display: 'flex', height: '100vh'}}>
      <aside style={{width: 240, borderRight: '1px solid #eee', padding: 16, display: 'none'}} className="desktop-only">
        <nav>
          {navItems.map(item => (
            <a key={item} href="#" style={{display: 'block', padding: '8px 12px', textDecoration: 'none', color: '#333', borderRadius: 4}}>{item}</a>
          ))}
        </nav>
      </aside>
      <main style={{flex: 1, padding: 24}}>
        <button onClick={() => setIsSheetOpen(true)} style={{padding: '8px 16px', border: '1px solid #ccc', borderRadius: 6, marginBottom: 16}}>Menu</button>
        <p>Main content. Sidebar on desktop, bottom sheet on mobile.</p>
      </main>
      {isSheetOpen && (
        <>
          <div onClick={() => setIsSheetOpen(false)} style={{position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 100}} />
          <div style={{position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', borderTopLeftRadius: 12, borderTopRightRadius: 12, padding: 24, zIndex: 101, maxHeight: '50vh'}}>
            <nav>
              {navItems.map(item => (
                <a key={item} href="#" style={{display: 'block', padding: '12px 16px', textDecoration: 'none', color: '#333'}}>{item}</a>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}