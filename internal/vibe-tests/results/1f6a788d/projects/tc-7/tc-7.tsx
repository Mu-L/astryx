export default function NestedThemes() {
  return (
    <div style={{display: 'flex', height: '100vh'}}>
      <aside style={{width: 240, backgroundColor: '#1a1a2e', color: 'white', padding: 16}}>
        <nav>
          <a href="#" style={{display: 'block', padding: '8px 12px', borderRadius: 6, color: 'white', textDecoration: 'none', background: 'rgba(255,255,255,0.1)', marginBottom: 4}}>Dashboard</a>
          <a href="#" style={{display: 'block', padding: '8px 12px', borderRadius: 6, color: '#ccc', textDecoration: 'none', marginBottom: 4}}>Analytics</a>
          <a href="#" style={{display: 'block', padding: '8px 12px', borderRadius: 6, color: '#ccc', textDecoration: 'none'}}>Reports</a>
        </nav>
      </aside>
      <main style={{flex: 1, padding: 24, backgroundColor: '#fff'}}>
        <h1 style={{fontSize: 24, fontWeight: 700, marginTop: 0}}>Light Content Area</h1>
        <div style={{border: '1px solid #eee', borderRadius: 8, padding: 16}}>
          <p style={{color: '#666', margin: 0}}>This content uses the light theme while the sidebar has a dark theme.</p>
        </div>
      </main>
    </div>
  );
}