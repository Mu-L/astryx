// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState} from 'react';

type Step = 'cart' | 'shipping' | 'payment' | 'confirmation';

export default function CheckoutFlow() {
  const [step, setStep] = useState<Step>('cart');
  const [shipping, setShipping] = useState({name: '', address: '', city: ''});
  const [payment, setPayment] = useState({card: '', expiry: '', cvv: ''});

  const cardStyle: React.CSSProperties = {border: '1px solid #e0e0e0', borderRadius: 8, padding: 24, maxWidth: 500, margin: '0 auto'};
  const inputStyle: React.CSSProperties = {width: '100%', padding: '8px 12px', border: '1px solid #ccc', borderRadius: 4, marginTop: 4};
  const btnStyle: React.CSSProperties = {padding: '10px 20px', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600};
  const primaryBtn: React.CSSProperties = {...btnStyle, background: '#0066cc', color: 'white'};
  const ghostBtn: React.CSSProperties = {...btnStyle, background: 'transparent', color: '#666'};

  return (
    <div style={cardStyle}>
      {step === 'cart' && (
        <div>
          <h2 style={{margin: '0 0 16px'}}>Cart Summary</h2>
          <p>React Handbook - $29.99</p>
          <p>TypeScript Guide - $24.99</p>
          <p style={{fontWeight: 600, marginTop: 8}}>Total: $54.98</p>
          <div style={{marginTop: 16, textAlign: 'right'}}>
            <button style={primaryBtn} onClick={() => setStep('shipping')}>Continue to Shipping</button>
          </div>
        </div>
      )}
      {step === 'shipping' && (
        <div>
          <h2 style={{margin: '0 0 16px'}}>Shipping</h2>
          <label>Full Name<input style={inputStyle} value={shipping.name} onChange={(e) => setShipping({...shipping, name: e.target.value})} /></label>
          <label style={{display: 'block', marginTop: 12}}>Address<input style={inputStyle} value={shipping.address} onChange={(e) => setShipping({...shipping, address: e.target.value})} /></label>
          <label style={{display: 'block', marginTop: 12}}>City<input style={inputStyle} value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} /></label>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16}}>
            <button style={ghostBtn} onClick={() => setStep('cart')}>Back</button>
            <button style={primaryBtn} onClick={() => setStep('payment')}>Continue to Payment</button>
          </div>
        </div>
      )}
      {step === 'payment' && (
        <div>
          <h2 style={{margin: '0 0 16px'}}>Payment</h2>
          <label>Card Number<input style={inputStyle} value={payment.card} onChange={(e) => setPayment({...payment, card: e.target.value})} /></label>
          <label style={{display: 'block', marginTop: 12}}>Expiry<input style={inputStyle} value={payment.expiry} onChange={(e) => setPayment({...payment, expiry: e.target.value})} /></label>
          <label style={{display: 'block', marginTop: 12}}>CVV<input style={inputStyle} value={payment.cvv} onChange={(e) => setPayment({...payment, cvv: e.target.value})} /></label>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 16}}>
            <button style={ghostBtn} onClick={() => setStep('shipping')}>Back</button>
            <button style={primaryBtn} onClick={() => setStep('confirmation')}>Place Order</button>
          </div>
        </div>
      )}
      {step === 'confirmation' && (
        <div>
          <h2 style={{margin: '0 0 16px'}}>Order Confirmed</h2>
          <p>Your order has been placed. A confirmation email will be sent shortly.</p>
        </div>
      )}
    </div>
  );
}
