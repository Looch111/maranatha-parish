
import type { BibleVerse } from '@/lib/types';
import { BookOpen } from 'lucide-react';

export function BibleVerseCard({ data }: { data: BibleVerse }) {
    return (
        <div className="w-full max-w-5xl bg-black/30 backdrop-blur-sm rounded-2xl p-12 border border-white/20 shadow-2xl text-center flex flex-col items-center">
            <div className="flex items-center gap-4 mb-8">
                <BookOpen className="h-12 w-12 text-white" />
                <h1 className="text-5xl font-headline text-white drop-shadow-lg">Verse of the Day</h1>
            </div>
            <div className="flex-grow flex items-center justify-center">
                <blockquote className="text-5xl leading-tight font-serif text-white italic">
                    &ldquo;{data.text}&rdquo;
                </blockquote>
            </div>
            <cite className="mt-8 text-3xl font-bold text-amber-400 not-italic drop-shadow-md">
                &mdash; {data.reference}
            </cite>
        </div>
    );
}
