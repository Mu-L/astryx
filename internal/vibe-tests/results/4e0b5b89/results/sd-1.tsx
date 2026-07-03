import {useState, useEffect} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Skeleton} from '@/components/ui/skeleton';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {Button} from '@/components/ui/button';

export default function DashboardWidget() {
  const [state, setState] = useState<'loading' | 'error' | 'success'>('loading');
  const [value, setValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (Math.random() > 0.7) setState('error');
      else { setValue(42); setState('success'); }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Card>
      <CardHeader><CardTitle>Active Users</CardTitle></CardHeader>
      <CardContent>
        {state === 'loading' && (
          <div className="space-y-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        )}
        {state === 'error' && (
          <div className="space-y-2">
            <Alert variant="destructive">
              <AlertDescription>Failed to load data.</AlertDescription>
            </Alert>
            <Button variant="outline" onClick={() => setState('loading')}>Retry</Button>
          </div>
        )}
        {state === 'success' && (
          <div>
            <p className="text-3xl font-bold">{value}</p>
            <p className="text-muted-foreground">Current active users</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}