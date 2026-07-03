import {useState, useEffect} from 'react';

export default function AutocompleteInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!query) { setResults([]); return; }
    const timer = setTimeout(() => {
      fetch(`/api/suggest?q=${encodeURIComponent(query)}`)
        .then(r => r.json())
        .then(d => setResults(d.suggestions || []))
        .catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div style={{position: 'relative', maxWidth: 400}}>
      <input
        value={query}
        onChange={e => { setQuery(e.target.value); setIsOpen(true); }}
        placeholder="Type to search..."
        style={{width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 6}}
      />
      {isOpen && results.length > 0 && (
        <ul style={{position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid #ccc', borderRadius: 6, listStyle: 'none', padding: 4, margin: '4px 0 0', zIndex: 10}}>
          {results.map(r => (
            <li key={r} onClick={() => { setQuery(r); setIsOpen(false); }}
              style={{padding: '6px 8px', cursor: 'pointer', borderRadius: 4}}>{r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}