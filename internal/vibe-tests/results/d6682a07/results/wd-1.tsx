// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';

type Step = 'cart' | 'shipping' | 'payment' | 'confirmation';

export default function CheckoutFlow() {
  const [step, setStep] = useState<Step>('cart');
  const [shipping, setShipping] = useState({name: '', address: '', city: ''});
  const [payment, setPayment] = useState({card: '', expiry: '', cvv: ''});

  return (
    <div className="mx-auto max-w-lg p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {step === 'cart' && 'Cart Summary'}
            {step === 'shipping' && 'Shipping'}
            {step === 'payment' && 'Payment'}
            {step === 'confirmation' && 'Order Confirmed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'cart' && (
            <>
              <p>React Handbook - $29.99</p>
              <p>TypeScript Guide - $24.99</p>
              <p className="font-semibold">Total: $54.98</p>
              <Button onClick={() => setStep('shipping')}>Continue to Shipping</Button>
            </>
          )}
          {step === 'shipping' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={shipping.name} onChange={(e) => setShipping({...shipping, name: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={shipping.address} onChange={(e) => setShipping({...shipping, address: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={shipping.city} onChange={(e) => setShipping({...shipping, city: e.target.value})} />
              </div>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep('cart')}>Back</Button>
                <Button onClick={() => setStep('payment')}>Continue to Payment</Button>
              </div>
            </>
          )}
          {step === 'payment' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="card">Card Number</Label>
                <Input id="card" value={payment.card} onChange={(e) => setPayment({...payment, card: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry</Label>
                <Input id="expiry" value={payment.expiry} onChange={(e) => setPayment({...payment, expiry: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input id="cvv" value={payment.cvv} onChange={(e) => setPayment({...payment, cvv: e.target.value})} />
              </div>
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setStep('shipping')}>Back</Button>
                <Button onClick={() => setStep('confirmation')}>Place Order</Button>
              </div>
            </>
          )}
          {step === 'confirmation' && (
            <p>Your order has been placed. A confirmation email will be sent shortly.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
