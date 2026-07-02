// Copyright (c) Meta Platforms, Inc. and affiliates.

import React, {useState} from 'react';
import {TextInput} from '@astryxdesign/core/TextInput';
import {Button} from '@astryxdesign/core/Button';
import {Card} from '@astryxdesign/core/Card';
import {Text} from '@astryxdesign/core/Text';
import {Banner} from '@astryxdesign/core/Banner';
import stylex from '@stylexjs/stylex';

const styles = stylex.create({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    maxWidth: 400,
    padding: 16,
  },
});

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const validateEmail = (value: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
  };

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
      if (!res.ok) {throw new Error('Subscription failed');}
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <Card padding={4}>
        <Banner variant="success" title="Subscribed!" description="Check your inbox for a confirmation email." />
      </Card>
    );
  }

  return (
    <Card padding={4}>
      <div {...stylex.props(styles.form)}>
        <Text type="display-3">Subscribe to updates</Text>
        <TextInput
          label="Email address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          status={errorMsg ? {type: 'error', message: errorMsg} : undefined}
          isRequired
        />
        <Button
          label="Subscribe"
          variant="primary"
          isLoading={status === 'loading'}
          onClick={handleSubmit}
        />
      </div>
    </Card>
  );
}
