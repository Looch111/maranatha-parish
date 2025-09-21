
'use client';
import { useState, useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { saveAnnouncementAction, deleteAnnouncementAction } from '@/lib/actions';
import type { Announcement } from '@/lib/types';
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

function AnnouncementForm({ announcement, onOpenChange }: { announcement?: Announcement, onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(saveAnnouncementAction, { type: 'idle' });

  useEffect(() => {
    if (state.type === 'success') {
      toast({ title: 'Success', description: state.message });
      onOpenChange(false);
      formRef.current?.reset();
    }
  }, [state, toast, onOpenChange]);
  
  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="id" value={announcement?.id || ''} />
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={announcement?.title} placeholder="e.g., Sunday Service" required />
          {state?.type === 'error' && state.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title.join(', ')}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="content">Content</Label>
          <Textarea id="content" name="content" defaultValue={announcement?.content} placeholder="Details about the announcement..." required />
          {state?.type === 'error' && state.errors?.content && <p className="text-sm font-medium text-destructive">{state.errors.content.join(', ')}</p>}
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

export function AnnouncementsManager({ data }: { data: Announcement[] }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Announcement | undefined>(undefined);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this announcement?')) {
        const result = await deleteAnnouncementAction(id);
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
            <Button onClick={() => setSelected(undefined)}><PlusCircle className="mr-2" /> Add Announcement</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{selected ? 'Edit' : 'Add'} Announcement</DialogTitle>
              <DialogDescription>
                {selected ? 'Make changes to your announcement here.' : 'Create a new announcement to display.'}
              </DialogDescription>
            </DialogHeader>
            <AnnouncementForm announcement={selected} onOpenChange={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((ann) => (
              <TableRow key={ann.id}>
                <TableCell className="font-medium">{ann.title}</TableCell>
                <TableCell className="max-w-xs sm:max-w-sm truncate">{ann.content}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setSelected(ann); setOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(ann.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">No announcements found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
