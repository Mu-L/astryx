export default function SettingsDashboard() {
  const navItems = ['General', 'Account', 'Notifications', 'Security', 'Integrations'];

  return (
    <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
      <header style={{height: 56, borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', padding: '0 16px'}}>
        <h1 style={{fontSize: 18, fontWeight: 600, margin: 0}}>My App</h1>
      </header>
      <div style={{display: 'flex', flex: 1}}>
        <aside style={{width: 240, borderRight: '1px solid #eee', padding: 16}}>
          <nav>
            {navItems.map((item, i) => (
              <a key={item} href="#" style={{display: 'block', padding: '8px 12px', borderRadius: 6, textDecoration: 'none', color: '#333', background: i === 0 ? '#f0f0f0' : 'transparent', fontWeight: i === 0 ? 600 : 400}}>{item}</a>
            ))}
          </nav>
        </aside>
        <main style={{flex: 1, padding: 24}}>
          <h2 style={{fontSize: 24, fontWeight: 700, marginTop: 0}}>General Settings</h2>
          <div style={{border: '1px solid #eee', borderRadius: 8, padding: 16, marginTop: 16}}>
            <h3 style={{margin: '0 0 4px'}}>Application Name</h3>
            <p style={{margin: 0, color: '#666'}}>Configure your preferences.</p>
          </div>
          <div style={{border: '1px solid #eee', borderRadius: 8, padding: 16, marginTop: 12}}>
            <h3 style={{margin: '0 0 4px'}}>Language</h3>
            <p style={{margin: 0, color: '#666'}}>Choose your preferred language.</p>
          </div>
        </main>
      </div>
    </div>
  );
}