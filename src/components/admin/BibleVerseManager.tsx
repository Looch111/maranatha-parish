
'use client';
import { useState, useEffect, useRef } from 'react';
import { useFormState, useFormStatus, useTransition } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { saveBibleVerseAction, deleteBibleVerseAction, getBibleVerseAction } from '@/lib/actions';
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
import { PlusCircle, Edit, Trash2, Loader2, AlertCircle, Wand2, MinusCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Save</Button>;
}

function BibleVerseForm({ verse, onOpenChange }: { verse?: BibleVerse, onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useFormState(saveBibleVerseAction, { type: 'idle' });
  const [isFetching, startFetching] = useTransition();

  const [reference, setReference] = useState(verse?.reference || '');
  const [textParts, setTextParts] = useState<string[]>(verse ? (Array.isArray(verse.text) ? verse.text : [verse.text]) : ['']);

  const addPart = () => setTextParts([...textParts, '']);
  const removePart = (index: number) => setTextParts(textParts.filter((_, i) => i !== index));
  const updatePart = (index: number, value: string) => {
    const newParts = [...textParts];
    newParts[index] = value;
    setTextParts(newParts);
  };
  
  useEffect(() => {
    if (verse) {
        setReference(verse.reference);
        setTextParts(Array.isArray(verse.text) ? verse.text : [verse.text]);
    } else {
        setReference('');
        setTextParts(['']);
    }
  }, [verse]);

  useEffect(() => {
    if (state.type === 'success') {
      toast({ title: 'Success', description: state.message });
      onOpenChange(false);
      formRef.current?.reset();
    }
  }, [state, toast, onOpenChange]);

  const handleFetchVerse = () => {
    if (!reference) {
      toast({ title: 'Error', description: 'Please enter a verse reference first.', variant: 'destructive' });
      return;
    }
    startFetching(async () => {
      const result = await getBibleVerseAction(reference);
      if (result.type === 'success' && result.text) {
        setTextParts(result.text);
        if (result.correctedReference) {
          setReference(result.correctedReference);
        }
        toast({ title: 'Verse Fetched!', description: 'The verse text has been automatically split.' });
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };
  
  return (
    <form ref={formRef} action={formAction}>
      <input type="hidden" name="id" value={verse?.id || ''} />
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="reference">Reference</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="reference" 
              name="reference" 
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g., John 3:16" 
              required 
            />
            <Button type="button" variant="outline" size="icon" onClick={handleFetchVerse} disabled={isFetching}>
              {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              <span className="sr-only">Fetch Verse Text</span>
            </Button>
          </div>
          {state?.type === 'error' && state.errors?.reference && <p className="text-sm font-medium text-destructive">{state.errors.reference.join(', ')}</p>}
        </div>
        <div className="grid gap-2">
          <Label>Text (split into parts)</Label>
          <div className="space-y-2">
            {textParts.map((part, index) => (
              <div key={index} className="flex items-center gap-2">
                 <Textarea 
                   name={`text[${index}]`} 
                   value={part}
                   onChange={(e) => updatePart(index, e.target.value)}
                   placeholder={`Part ${index + 1}`} 
                   required 
                   rows={2} 
                 />
                 <Button type="button" variant="ghost" size="icon" onClick={() => removePart(index)} disabled={textParts.length <= 1}>
                   <MinusCircle className="h-4 w-4 text-destructive" />
                 </Button>
              </div>
            ))}
          </div>
           {state?.type === 'error' && state.errors?.text && <p className="text-sm font-medium text-destructive pt-2">{state.errors.text.join(', ')}</p>}
          <Button type="button" variant="outline" size="sm" onClick={addPart} className="mt-2">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Part
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

export function BibleVerseManager({ data }: { data: BibleVerse[] }) {
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
          <DialogContent className="sm:max-w-lg">
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
            {data.map((verse) => (
              <TableRow key={verse.id}>
                <TableCell className="font-medium">{verse.reference}</TableCell>
                <TableCell className="max-w-xs sm:max-w-sm truncate">
                  {Array.isArray(verse.text) ? verse.text.join(' ') : verse.text}
                </TableCell>
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
             {data.length === 0 && (
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
