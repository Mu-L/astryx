import {useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group';
import {Separator} from '@/components/ui/separator';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';

export default function CheckoutFlow() {
  const [step, setStep] = useState('cart');

  return (
    <Tabs value={step} onValueChange={setStep} className="w-full max-w-2xl">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="cart">Cart</TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
        <TabsTrigger value="payment">Payment</TabsTrigger>
        <TabsTrigger value="confirmation">Confirm</TabsTrigger>
      </TabsList>
      <TabsContent value="cart">
        <Card>
          <CardHeader><CardTitle>Your Cart</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <p>Cart items here</p>
            <Separator />
            <Button onClick={() => setStep('shipping')}>Continue</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="shipping">
        <Card>
          <CardHeader><CardTitle>Shipping</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" placeholder="123 Main St" />
            </div>
            <RadioGroup defaultValue="standard">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard">Standard (5-7 days)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="express" id="express" />
                <Label htmlFor="express">Express (2-3 days)</Label>
              </div>
            </RadioGroup>
            <Button onClick={() => setStep('payment')}>Continue</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="payment">
        <Card>
          <CardHeader><CardTitle>Payment</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="card">Card Number</Label>
              <Input id="card" placeholder="4242 4242 4242 4242" />
            </div>
            <Button onClick={() => setStep('confirmation')}>Place Order</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="confirmation">
        <Card>
          <CardHeader><CardTitle>Order Confirmed!</CardTitle></CardHeader>
          <CardContent>
            <p>Thank you for your purchase.</p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}