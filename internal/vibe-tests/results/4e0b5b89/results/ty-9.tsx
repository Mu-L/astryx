export default function ComparisonHeader() {
  const plans = [
    {name: 'Starter', price: '$9/mo', featured: false},
    {name: 'Pro', price: '$29/mo', featured: false},
    {name: 'Enterprise', price: '$99/mo', featured: true},
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {plans.map(plan => (
        <div key={plan.name} className={`text-center p-6 rounded-lg ${plan.featured ? 'border-2 border-primary' : ''}`}>
          <h2 className={`font-bold ${plan.featured ? 'text-4xl' : 'text-2xl'}`}>{plan.name}</h2>
          <p className={`text-muted-foreground ${plan.featured ? 'text-xl mt-2' : 'mt-1'}`}>{plan.price}</p>
        </div>
      ))}
    </div>
  );
}