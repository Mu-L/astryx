import {useState, useEffect} from 'react';
import {Card} from '@astryxdesign/core/Card';
import {Spinner} from '@astryxdesign/core/Spinner';
import {Text} from '@astryxdesign/core/Text';
import {Banner} from '@astryxdesign/core/Banner';
import {Stack} from '@astryxdesign/core/Stack';
import {Button} from '@astryxdesign/core/Button';

type State = 'loading' | 'error' | 'success';
type Data = {value: number; label: string};

export default function DashboardWidget() {
  const [state, setState] = useState<State>('loading');
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const shouldError = Math.random() > 0.7;
      if (shouldError) {
        setState('error');
      } else {
        setData({value: 42, label: 'Active Users'});
        setState('success');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card>
      <Stack gap={3}>
        {state === 'loading' && <Spinner label="Loading dashboard data..." />}
        {state === 'error' && (
          <Stack gap={2}>
            <Banner variant="error">Failed to load data. Please try again.</Banner>
            <Button variant="outlined" onPress={() => setState('loading')}>
              Retry
            </Button>
          </Stack>
        )}
        {state === 'success' && data && (
          <Stack gap={1}>
            <Text variant="display">{data.value}</Text>
            <Text color="secondary">{data.label}</Text>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}