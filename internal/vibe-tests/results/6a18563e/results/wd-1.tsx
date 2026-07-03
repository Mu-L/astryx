import {useState} from 'react';
import {Card} from '@astryxdesign/core/Card';
import {Button} from '@astryxdesign/core/Button';
import {Text} from '@astryxdesign/core/Text';
import {Stack} from '@astryxdesign/core/Stack';
import {TabList} from '@astryxdesign/core/TabList';
import {Tab} from '@astryxdesign/core/TabList';
import {Divider} from '@astryxdesign/core/Divider';
import {TextInput} from '@astryxdesign/core/TextInput';
import {RadioList} from '@astryxdesign/core/RadioList';
import {RadioListItem} from '@astryxdesign/core/RadioList';

type Step = 'cart' | 'shipping' | 'payment' | 'confirmation';

export default function CheckoutFlow() {
  const [step, setStep] = useState<Step>('cart');
  const [shippingMethod, setShippingMethod] = useState('standard');

  return (
    <Stack gap={4}>
      <TabList value={step} onChange={(v) => setStep(v as Step)}>
        <Tab value="cart">Cart</Tab>
        <Tab value="shipping">Shipping</Tab>
        <Tab value="payment">Payment</Tab>
        <Tab value="confirmation">Confirmation</Tab>
      </TabList>
      <Card>
        {step === 'cart' && (
          <Stack gap={3}>
            <Text>Your cart items will appear here.</Text>
            <Divider />
            <Button variant="filled" onPress={() => setStep('shipping')}>
              Continue to Shipping
            </Button>
          </Stack>
        )}
        {step === 'shipping' && (
          <Stack gap={3}>
            <TextInput label="Address" value="" onChange={() => {}} />
            <TextInput label="City" value="" onChange={() => {}} />
            <RadioList label="Shipping method" value={shippingMethod} onChange={setShippingMethod}>
              <RadioListItem value="standard">Standard (5-7 days)</RadioListItem>
              <RadioListItem value="express">Express (2-3 days)</RadioListItem>
            </RadioList>
            <Button variant="filled" onPress={() => setStep('payment')}>
              Continue to Payment
            </Button>
          </Stack>
        )}
        {step === 'payment' && (
          <Stack gap={3}>
            <TextInput label="Card number" value="" onChange={() => {}} />
            <TextInput label="Expiry" value="" onChange={() => {}} />
            <Button variant="filled" onPress={() => setStep('confirmation')}>
              Place Order
            </Button>
          </Stack>
        )}
        {step === 'confirmation' && (
          <Stack gap={3}>
            <Text>Order confirmed! Thank you for your purchase.</Text>
          </Stack>
        )}
      </Card>
    </Stack>
  );
}