
import type { BibleVerse } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export function BibleVerseCard({ data }: { data: BibleVerse }) {
    return (
        <Card className="w-full shadow-lg flex flex-col">
             <CardHeader>
                <div className="flex items-center gap-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                    <CardTitle className="text-3xl font-headline">Verse of the Day</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-center justify-center text-center p-8">
                <p className="text-3xl leading-relaxed font-serif">&quot;{data.text}&quot;</p>
            </CardContent>
            <CardFooter className="flex justify-end">
                <p className="text-2xl font-bold text-primary">{data.reference}</p>
            </CardFooter>
        </Card>
    );
}
