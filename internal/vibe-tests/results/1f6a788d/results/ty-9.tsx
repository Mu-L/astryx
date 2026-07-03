export default function ComparisonHeader() {
  const plans = [
    {name: 'Starter', price: '$9/mo', featured: false},
    {name: 'Pro', price: '$29/mo', featured: false},
    {name: 'Enterprise', price: '$99/mo', featured: true},
  ];

  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16}}>
      {plans.map(plan => (
        <div key={plan.name} style={{textAlign: 'center', padding: 24, borderRadius: 8, border: plan.featured ? '2px solid #0066cc' : '1px solid #eee'}}>
          <h2 style={{margin: 0, fontSize: plan.featured ? 36 : 24, fontWeight: 700}}>{plan.name}</h2>
          <p style={{margin: '8px 0 0', color: '#666', fontSize: plan.featured ? 20 : 16}}>{plan.price}</p>
        </div>
      ))}
    </div>
  );
}