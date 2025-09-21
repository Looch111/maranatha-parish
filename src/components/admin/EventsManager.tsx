
'use client';
import { useState, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { saveEventAction, deleteEventAction } from '@/lib/actions';
import type { Event } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription } from '../ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save</Button>;
}

function EventForm({ event, onOpenChange }: { event?: Event, onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(saveEventAction, { type: 'idle' });

  useEffect(() => {
    if (state.type === 'success') {
      toast({ title: 'Success', description: state.message });
      onOpenChange(false);
      formRef.current?.reset();
    }
  }, [state, toast, onOpenChange]);
  
  const defaultDate = event ? format(new Date(event.date), 'yyyy-MM-dd') : '';

  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="id" value={event?.id || ''} />
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Event Name</Label>
          <Input id="name" name="name" defaultValue={event?.name} placeholder="e.g., Youth Group Meeting" required />
          {state?.type === 'error' && state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name.join(', ')}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" defaultValue={defaultDate} required />
                {state?.type === 'error' && state.errors?.date && <p className="text-sm font-medium text-destructive">{state.errors.date.join(', ')}</p>}
            </div>
            <div className="grid gap-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" name="time" type="time" defaultValue={event?.time} required />
                {state?.type === 'error' && state.errors?.time && <p className="text-sm font-medium text-destructive">{state.errors.time.join(', ')}</p>}
            </div>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="location">Location</Label>
          <Input id="location" name="location" defaultValue={event?.location} placeholder="e.g., Parish Hall" required />
          {state?.type === 'error' && state.errors?.location && <p className="text-sm font-medium text-destructive">{state.errors.location.join(', ')}</p>}
        </div>
        {state?.type === 'error' && !state.errors && <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertDescription>{state.message}</AlertDescription></Alert>}
      </div>
      <DialogFooter>
        <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
        <SubmitButton />
      </DialogFooter>
    </form>
  );
}

export function EventsManager({ data }: { data: Event[] }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Event | undefined>(undefined);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
        const result = await deleteEventAction(id);
        if (result.type === 'success') {
            toast({ title: 'Deleted', description: result.message });
        } else {
            toast({ title: 'Error', description: result.message, variant: 'destructive' });
        }
    }
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={(o) => { if(!o) setSelected(undefined); setOpen(o); }}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelected(undefined)}><PlusCircle className="mr-2" /> Add Event</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selected ? 'Edit' : 'Add'} Event</DialogTitle>
              <DialogDescription>
                {selected ? 'Make changes to your event here.' : 'Create a new event for the schedule.'}
              </DialogDescription>
            </DialogHeader>
            <EventForm event={selected} onOpenChange={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((evt) => (
              <TableRow key={evt.id}>
                <TableCell className="font-medium">{evt.name}</TableCell>
                <TableCell>{format(new Date(evt.date), 'EEE, MMM d, yyyy')} at {evt.time}</TableCell>
                <TableCell>{evt.location}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setSelected(evt); setOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(evt.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">No events found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
