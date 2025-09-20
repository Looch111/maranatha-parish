
'use client';
import { useState, useEffect } from 'react';
import type { BibleVerse } from '@/lib/types';
import { BookOpen } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function BibleVerseCard({ data, currentVerseIndex }: { data: BibleVerse, currentVerseIndex?: number }) {
    const [currentPart, setCurrentPart] = useState(0);

    const textParts = Array.isArray(data.text) ? data.text : [data.text];

    useEffect(() => {
        if (currentVerseIndex !== undefined) {
            setCurrentPart(currentVerseIndex);
        }
    }, [currentVerseIndex]);

    // If navigation is not controlled from admin, auto-advance
    useEffect(() => {
        if (currentVerseIndex !== undefined || textParts.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentPart(prev => (prev + 1) % textParts.length);
        }, 5000); // Auto-advance every 5 seconds if not controlled

        return () => clearInterval(interval);
    }, [textParts.length, currentVerseIndex]);


    return (
        <div className="w-full max-w-5xl bg-black/30 backdrop-blur-sm rounded-2xl p-12 border border-white/20 shadow-2xl text-center flex flex-col items-center">
            <h1 className="text-4xl font-bold text-amber-400 not-italic drop-shadow-md mb-8">
                {data.reference}
            </h1>
            <div className="flex-grow flex items-center justify-center min-h-[300px]">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={currentPart}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5 }}
                         className="text-5xl leading-tight font-serif text-white italic"
                    >
                         &ldquo;{textParts[currentPart]}&rdquo;
                    </motion.div>
                </AnimatePresence>
            </div>
            {textParts.length > 1 && (
                <div className="mt-8 text-lg text-white/70">
                    Part {currentPart + 1} of {textParts.length}
                </div>
            )}
        </div>
    );
}
