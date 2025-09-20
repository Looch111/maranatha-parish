
import type { BibleVerse } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

export function BibleVerseCard({ data }: { data: BibleVerse }) {
    return (
        <div className="h-full w-full flex items-center justify-center p-8 bg-gradient-to-br from-amber-500 to-orange-600">
            <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-2xl flex flex-col">
                 <CardHeader>
                    <div className="flex items-center gap-4">
                        <BookOpen className="h-10 w-10 text-primary" />
                        <CardTitle className="text-5xl font-headline">Verse of the Day</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center text-center">
                    <p className="text-4xl leading-relaxed font-serif">&quot;{data.text}&quot;</p>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <p className="text-3xl font-bold text-primary">{data.reference}</p>
                </CardFooter>
            </Card>
        </div>
    );
}
