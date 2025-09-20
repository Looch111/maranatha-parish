
'use client';
import { useState, useEffect } from 'react';
import type { Hymn } from '@/lib/types';
import { Music } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function HymnCard({ data, currentVerseIndex }: { data: Hymn, currentVerseIndex?: number }) {
    const [currentVerse, setCurrentVerse] = useState(0);

    useEffect(() => {
        if (currentVerseIndex !== undefined) {
            setCurrentVerse(currentVerseIndex);
        }
    }, [currentVerseIndex]);

    useEffect(() => {
        if (currentVerseIndex !== undefined) return;

        const interval = setInterval(() => {
            setCurrentVerse(prev => (prev + 1) % data.lyrics.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [data.lyrics.length, currentVerseIndex]);


    return (
        <div className="w-full max-w-5xl bg-black/30 backdrop-blur-sm rounded-2xl p-12 border border-white/20 shadow-2xl text-center flex flex-col">
            <div className="flex items-center justify-center gap-4 mb-8">
                <Music className="h-12 w-12 text-white" />
                <h1 className="text-5xl font-headline text-white drop-shadow-lg">{data.title}</h1>
            </div>
            <div className="flex-grow flex items-center justify-center min-h-[300px]">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={currentVerse}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl leading-tight whitespace-pre-wrap font-serif text-white"
                    >
                        {data.lyrics[currentVerse]}
                    </motion.div>
                </AnimatePresence>
            </div>
             <div className="mt-8 text-lg text-white/70">
                Verse {currentVerse + 1} of {data.lyrics.length}
            </div>
        </div>
    );
}
