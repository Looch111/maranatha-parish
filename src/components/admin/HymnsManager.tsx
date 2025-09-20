
'use client';
import { useState, useEffect, useRef, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { saveHymnAction, deleteHymnAction } from '@/lib/actions';
import type { Hymn } from '@/lib/types';
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
import { PlusCircle, Edit, Trash2, Loader2, AlertCircle, MinusCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save</Button>;
}

function HymnForm({ hymn, onOpenChange }: { hymn?: Hymn, onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(saveHymnAction, { type: 'idle' });
  const [verses, setVerses] = useState<string[]>(hymn?.lyrics || ['']);

  const addVerse = () => setVerses([...verses, '']);
  const removeVerse = (index: number) => setVerses(verses.filter((_, i) => i !== index));
  const updateVerse = (index: number, value: string) => {
    const newVerses = [...verses];
    newVerses[index] = value;
    setVerses(newVerses);
  };
  
  useEffect(() => {
    if (state.type === 'success') {
      toast({ title: 'Success', description: state.message });
      onOpenChange(false);
      formRef.current?.reset();
    }
  }, [state, toast, onOpenChange]);
  
  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="id" value={hymn?.id || ''} />
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={hymn?.title} placeholder="e.g., Amazing Grace" required />
          {state?.type === 'error' && state.errors?.title && <p className="text-sm font-medium text-destructive">{state.errors.title.join(', ')}</p>}
        </div>
        <div className="grid gap-2">
          <Label>Lyrics (Verse by Verse)</Label>
          <div className="space-y-2">
            {verses.map((verse, index) => (
              <div key={index} className="flex items-center gap-2">
                 <Textarea 
                   name={`lyrics[${index}]`} 
                   value={verse}
                   onChange={(e) => updateVerse(index, e.target.value)}
                   placeholder={`Verse ${index + 1}`} 
                   required 
                   rows={2} 
                 />
                 <Button type="button" variant="ghost" size="icon" onClick={() => removeVerse(index)} disabled={verses.length <= 1}>
                   <MinusCircle className="h-4 w-4 text-destructive" />
                 </Button>
              </div>
            ))}
          </div>
           {state?.type === 'error' && state.errors?.lyrics && <p className="text-sm font-medium text-destructive pt-2">{state.errors.lyrics.join(', ')}</p>}
          <Button type="button" variant="outline" size="sm" onClick={addVerse} className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Verse
          </Button>
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

export function HymnsManager({ initialData }: { initialData: Hymn[] }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Hymn | undefined>(undefined);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hymn?')) {
        const result = await deleteHymnAction(id);
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
            <Button onClick={() => setSelected(undefined)}><PlusCircle className="mr-2" /> Add Hymn</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>{selected ? 'Edit' : 'Add'} Hymn</DialogTitle>
              <DialogDescription>
                {selected ? 'Make changes to your hymn here.' : 'Add a new hymn to the list.'}
              </DialogDescription>
            </DialogHeader>
            <HymnForm hymn={selected} onOpenChange={setOpen} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Lyrics</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.map((hymn) => (
              <TableRow key={hymn.id}>
                <TableCell className="font-medium">{hymn.title}</TableCell>
                <TableCell className="max-w-sm truncate">{hymn.lyrics.join(' ')}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setSelected(hymn); setOpen(true); }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(hymn.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
             {initialData.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">No hymns found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
