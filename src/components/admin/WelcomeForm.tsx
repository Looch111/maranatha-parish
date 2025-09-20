
'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useActionState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateWelcomeMessageAction } from '@/lib/actions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { WelcomeMessage } from '@/lib/types';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Input } from '../ui/input';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Message'}</Button>;
}

export function WelcomeForm({ initialData }: { initialData: WelcomeMessage }) {
  const { toast } = useToast();
  const [state, formAction] = useActionState(updateWelcomeMessageAction, { type: 'idle' });

  useEffect(() => {
    if (state.type === 'success') {
      toast({
        title: 'Success!',
        description: state.message,
      });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      <Card>
        <CardHeader>
          <CardTitle>Welcome Message</CardTitle>
          <CardDescription>This message will be prominently displayed on the TV screen.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="message">Main Message</Label>
            <Textarea
              id="message"
              name="message"
              placeholder="Type your welcome message here..."
              defaultValue={initialData.message}
              rows={3}
              required
            />
            {state?.type === 'error' && state.errors?.message && (
              <p className="text-sm font-medium text-destructive pt-2">{state.errors.message.join(', ')}</p>
            )}
          </div>
           <div className="grid gap-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              name="subtitle"
              placeholder="A short, friendly subtitle..."
              defaultValue={initialData.subtitle}
            />
            {state?.type === 'error' && state.errors?.subtitle && (
              <p className="text-sm font-medium text-destructive pt-2">{state.errors.subtitle.join(', ')}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
           {state?.type === 'error' && !state.errors && (
             <Alert variant="destructive" className="w-full">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{state.message}</AlertDescription>
            </Alert>
           )}
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
