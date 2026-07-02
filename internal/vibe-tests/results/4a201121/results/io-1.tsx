// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState} from 'react';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async () => {
    if (!validateEmail(email)) {
      setErrorMsg('Please enter a valid email address');
      return;
    }
    setErrorMsg('');
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({email}),
      });
      if (!res.ok) {throw new Error('Failed');}
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div style={{border: '1px solid #e0e0e0', borderRadius: 8, padding: 24, maxWidth: 400}}>
        <p style={{color: '#16a34a', fontWeight: 500}}>Subscribed! Check your inbox for a confirmation email.</p>
      </div>
    );
  }

  return (
    <div style={{border: '1px solid #e0e0e0', borderRadius: 8, padding: 24, maxWidth: 400}}>
      <h2 style={{margin: '0 0 16px', fontSize: 18, fontWeight: 600}}>Subscribe to updates</h2>
      <div style={{marginBottom: 12}}>
        <label style={{display: 'block', fontSize: 14, fontWeight: 500, marginBottom: 4}}>Email address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          style={{width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4}}
        />
        {errorMsg && <p style={{color: '#dc2626', fontSize: 13, marginTop: 4}}>{errorMsg}</p>}
      </div>
      <button
        onClick={handleSubmit}
        disabled={status === 'loading'}
        style={{padding: '10px 20px', background: '#0066cc', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600}}
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
    </div>
  );
}
