import {useState} from 'react';

const emails = [
  {id: '1', sender: 'Alice', subject: 'Project Update', date: '2024-01-15', preview: 'Sprint results...'},
  {id: '2', sender: 'Bob', subject: 'Meeting', date: '2024-01-14', preview: 'Reschedule?'},
  {id: '3', sender: 'Carol', subject: 'Design Review', date: '2024-01-13', preview: 'Mockups...'},
  {id: '4', sender: 'Dave', subject: 'Invoice', date: '2024-01-12', preview: 'Attached...'},
];

export default function EmailInbox() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = (id: string) => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  return (
    <div>
      {selected.size > 0 && (
        <div style={{padding: 8, background: '#f5f5f5', borderRadius: 6, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12}}>
          <span>{selected.size} selected</span>
          <button style={{padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4}}>Archive</button>
          <button style={{padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4}}>Delete</button>
        </div>
      )}
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr style={{borderBottom: '1px solid #eee'}}>
            <th style={{width: 40, padding: 8}}><input type="checkbox" onChange={() => {
              selected.size === emails.length ? setSelected(new Set()) : setSelected(new Set(emails.map(e => e.id)));
            }} /></th>
            <th style={{padding: 8, textAlign: 'left'}}>Sender</th>
            <th style={{padding: 8, textAlign: 'left'}}>Subject</th>
            <th style={{padding: 8, textAlign: 'left'}}>Date</th>
            <th style={{padding: 8, textAlign: 'left'}}>Preview</th>
          </tr>
        </thead>
        <tbody>
          {emails.map(e => (
            <tr key={e.id} style={{borderBottom: '1px solid #f0f0f0'}}>
              <td style={{padding: 8}}><input type="checkbox" checked={selected.has(e.id)} onChange={() => toggle(e.id)} /></td>
              <td style={{padding: 8}}>{e.sender}</td>
              <td style={{padding: 8}}>{e.subject}</td>
              <td style={{padding: 8}}>{e.date}</td>
              <td style={{padding: 8, color: '#888'}}>{e.preview}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}