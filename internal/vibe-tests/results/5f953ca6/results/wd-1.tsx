// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Text} from '@astryxdesign/core/Text';
import {TextInput} from '@astryxdesign/core/TextInput';
import stylex from '@stylexjs/stylex';

const styles = stylex.create({
  container: {
    maxWidth: 600,
    margin: '0 auto',
    padding: 24,
  },
  step: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  summary: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
});

type Step = 'cart' | 'shipping' | 'payment' | 'confirmation';

export default function CheckoutFlow() {
  const [step, setStep] = useState<Step>('cart');
  const [shipping, setShipping] = useState({name: '', address: '', city: ''});
  const [payment, setPayment] = useState({card: '', expiry: '', cvv: ''});

  return (
    <div {...stylex.props(styles.container)}>
      <Card padding={4}>
        {step === 'cart' && (
          <div {...stylex.props(styles.step)}>
            <Text type="display-3">Cart Summary</Text>
            <div {...stylex.props(styles.summary)}>
              <Text type="body">React Handbook - $29.99</Text>
              <Text type="body">TypeScript Guide - $24.99</Text>
              <Text type="large" weight="semibold">Total: $54.98</Text>
            </div>
            <div {...stylex.props(styles.actions)}>
              <span />
              <Button label="Continue to Shipping" variant="primary" onClick={() => setStep('shipping')} />
            </div>
          </div>
        )}
        {step === 'shipping' && (
          <div {...stylex.props(styles.step)}>
            <Text type="display-3">Shipping</Text>
            <TextInput label="Full Name" value={shipping.name} onChange={(v) => setShipping({...shipping, name: v})} />
            <TextInput label="Address" value={shipping.address} onChange={(v) => setShipping({...shipping, address: v})} />
            <TextInput label="City" value={shipping.city} onChange={(v) => setShipping({...shipping, city: v})} />
            <div {...stylex.props(styles.actions)}>
              <Button label="Back" variant="ghost" onClick={() => setStep('cart')} />
              <Button label="Continue to Payment" variant="primary" onClick={() => setStep('payment')} />
            </div>
          </div>
        )}
        {step === 'payment' && (
          <div {...stylex.props(styles.step)}>
            <Text type="display-3">Payment</Text>
            <TextInput label="Card Number" value={payment.card} onChange={(v) => setPayment({...payment, card: v})} />
            <TextInput label="Expiry" value={payment.expiry} onChange={(v) => setPayment({...payment, expiry: v})} />
            <TextInput label="CVV" value={payment.cvv} onChange={(v) => setPayment({...payment, cvv: v})} />
            <div {...stylex.props(styles.actions)}>
              <Button label="Back" variant="ghost" onClick={() => setStep('shipping')} />
              <Button label="Place Order" variant="primary" onClick={() => setStep('confirmation')} />
            </div>
          </div>
        )}
        {step === 'confirmation' && (
          <div {...stylex.props(styles.step)}>
            <Text type="display-3">Order Confirmed</Text>
            <Text type="body">Your order has been placed. A confirmation email will be sent shortly.</Text>
          </div>
        )}
      </Card>
    </div>
  );
}
