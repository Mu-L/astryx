import {useState} from 'react';

const labels = [
  {name: 'bug', color: '#d73a4a'},
  {name: 'enhancement', color: '#a2eeef'},
  {name: 'documentation', color: '#0075ca'},
  {name: 'good first issue', color: '#7057ff'},
  {name: 'help wanted', color: '#008672'},
];

export default function LabelPicker() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<typeof labels>([]);
  const [isOpen, setIsOpen] = useState(false);

  const filtered = labels.filter(l => l.name.includes(query.toLowerCase()) && !selected.some(s => s.name === l.name));

  return (
    <div style={{maxWidth: 400}}>
      <div style={{position: 'relative'}}>
        <input
          value={query}
          onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search labels..."
          style={{width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 6}}
        />
        {isOpen && filtered.length > 0 && (
          <ul style={{position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ccc', borderRadius: 6, listStyle: 'none', padding: 4, margin: 0, zIndex: 10}}>
            {filtered.map(label => (
              <li key={label.name} onClick={() => { setSelected(p => [...p, label]); setQuery(''); setIsOpen(false); }}
                style={{padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 4}}>
                <span style={{width: 12, height: 12, borderRadius: '50%', backgroundColor: label.color}} />
                {label.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12}}>
        {selected.map(label => (
          <span key={label.name} style={{display: 'flex', alignItems: 'center', gap: 4, padding: '2px 8px', borderRadius: 12, background: '#f0f0f0', fontSize: 13}}>
            <span style={{width: 8, height: 8, borderRadius: '50%', backgroundColor: label.color}} />
            {label.name}
          </span>
        ))}
      </div>
    </div>
  );
}