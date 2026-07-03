import {Text} from '@astryxdesign/core/Text';
import {Stack} from '@astryxdesign/core/Stack';
import {Grid} from '@astryxdesign/core/Grid';
import stylex from '@stylexjs/stylex';

const styles = stylex.create({
  columnHeader: {
    textAlign: 'center',
    padding: 16,
  },
  featured: {
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'var(--color-accent)',
    borderRadius: 8,
    padding: 24,
  },
  regular: {
    padding: 24,
  },
});

interface Plan {
  name: string;
  price: string;
  isFeatured?: boolean;
}

const plans: Plan[] = [
  {name: 'Starter', price: '$9/mo'},
  {name: 'Pro', price: '$29/mo'},
  {name: 'Enterprise', price: '$99/mo', isFeatured: true},
];

export default function ComparisonHeader() {
  return (
    <Grid columns={3} gap={4}>
      {plans.map(plan => (
        <div key={plan.name} {...stylex.props(plan.isFeatured ? styles.featured : styles.regular)}>
          <Stack gap={2} align="center">
            {plan.isFeatured ? (
              <Text variant="display" size="lg">{plan.name}</Text>
            ) : (
              <Text variant="heading" size="md">{plan.name}</Text>
            )}
            <Text color="secondary" size={plan.isFeatured ? 'lg' : 'md'}>
              {plan.price}
            </Text>
          </Stack>
        </div>
      ))}
    </Grid>
  );
}