import {useState} from 'react';

type Step = 'cart' | 'shipping' | 'payment' | 'confirmation';

export default function CheckoutFlow() {
  const [step, setStep] = useState<Step>('cart');

  const tabStyle = (s: Step) => ({
    padding: '8px 16px',
    border: 'none',
    borderBottom: step === s ? '2px solid #0066cc' : '2px solid transparent',
    background: 'none',
    cursor: 'pointer',
    fontWeight: step === s ? 600 : 400,
  });

  return (
    <div style={{maxWidth: 600}}>
      <div style={{display: 'flex', borderBottom: '1px solid #eee', marginBottom: 24}}>
        {(['cart', 'shipping', 'payment', 'confirmation'] as Step[]).map(s => (
          <button key={s} style={tabStyle(s)} onClick={() => setStep(s)}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
      <div style={{padding: 16, border: '1px solid #eee', borderRadius: 8}}>
        {step === 'cart' && (
          <div>
            <p>Your cart items</p>
            <button onClick={() => setStep('shipping')} style={{marginTop: 16, padding: '8px 16px', background: '#0066cc', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer'}}>Continue</button>
          </div>
        )}
        {step === 'shipping' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            <input placeholder="Address" style={{padding: 8, border: '1px solid #ccc', borderRadius: 4}} />
            <input placeholder="City" style={{padding: 8, border: '1px solid #ccc', borderRadius: 4}} />
            <button onClick={() => setStep('payment')} style={{padding: '8px 16px', background: '#0066cc', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer'}}>Continue</button>
          </div>
        )}
        {step === 'payment' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
            <input placeholder="Card number" style={{padding: 8, border: '1px solid #ccc', borderRadius: 4}} />
            <button onClick={() => setStep('confirmation')} style={{padding: '8px 16px', background: '#0066cc', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer'}}>Place Order</button>
          </div>
        )}
        {step === 'confirmation' && <p>Order confirmed! Thank you.</p>}
      </div>
    </div>
  );
}