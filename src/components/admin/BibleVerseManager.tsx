
'use client';
import { useState, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { saveBibleVerseAction, deleteBibleVerseAction } from '@/lib/actions';
import type { BibleVerse } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save</Button>;
}

function BibleVerseForm({ verse, onOpenChange }: { verse?: BibleVerse, onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(saveBibleVerseAction, { type: 'idle' });

  useEffect(() => {
    if (state.type === 'success') {
      toast({ title: 'Success', description: state.message });
      onOpenChange(false);
      formRef.current?.reset();
    }
  }, [state, toast, onOpenChange]);
  
  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="id" value={verse?.id || ''} />
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="reference">Reference</Label>
          <Input id="reference" name="reference" defaultValue={verse?.reference} placeholder="e.g., John 3:16" required />
          {state?.type === 'error' && state.errors?.reference && <p className="text-sm font-medium text-destructive">{state.errors.reference.join(', ')}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="text">Text</Label>
          <Textarea id="text" name="text" defaultValue={verse?.text} placeholder="For God so loved the world..." required rows={5} />
          {state?.type === 'error' && state.errors?.text && <p className="text-sm font-medium text-destructive">{state.errors.text.join(', ')}</p>}
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

export function BibleVerseManager({ initialData }: { initialData: BibleVerse[] }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<BibleVerse | undefined>(undefined);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this Bible verse?')) {
        const result = await deleteBibleVerseAction(id);
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
            <Button onClick={() => setSelected(undefined)}><PlusCircle className="mr-2" /> Add Bible Verse</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selected ? 'Edit' : 'Add'} Bible Verse</DialogTitle>
              <DialogDescription>
                {selected ? 'Make changes to the verse here.' : 'Add a new Bible verse to display.'}
              </DialogDescription>
            </DialogHeader>
            <BibleVerseForm verse={selected} onOpenChange={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Text</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((verse) => (
              <TableRow key={verse.id}>
                <TableCell className="font-medium">{verse.reference}</TableCell>
                <TableCell className="max-w-sm truncate">{verse.text}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setSelected(verse); setOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(verse.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {initialData.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">No Bible verses found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
