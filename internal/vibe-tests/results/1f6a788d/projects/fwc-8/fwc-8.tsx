import {useState} from 'react';

export default function HotelDatePicker() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const today = new Date().toISOString().split('T')[0];

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 400}}>
      <h2 style={{margin: 0, fontSize: 18, fontWeight: 600}}>Book Your Stay</h2>
      <div style={{display: 'flex', gap: 12}}>
        <div style={{flex: 1}}>
          <label style={{display: 'block', marginBottom: 4, fontSize: 14}}>Check-in</label>
          <input
            type="date"
            value={checkIn}
            min={today}
            onChange={e => setCheckIn(e.target.value)}
            style={{width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 6}}
          />
        </div>
        <div style={{flex: 1}}>
          <label style={{display: 'block', marginBottom: 4, fontSize: 14}}>Check-out</label>
          <input
            type="date"
            value={checkOut}
            min={checkIn || today}
            onChange={e => setCheckOut(e.target.value)}
            style={{width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 6}}
          />
        </div>
      </div>
    </div>
  );
}