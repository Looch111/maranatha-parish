
'use client';
import { useState, useEffect } from 'react';
import type { Hymn } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Music } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function HymnCard({ data, currentVerseIndex }: { data: Hymn, currentVerseIndex?: number }) {
    const [currentVerse, setCurrentVerse] = useState(0);

    useEffect(() => {
        if (currentVerseIndex !== undefined) {
            setCurrentVerse(currentVerseIndex);
        }
    }, [currentVerseIndex]);

    // If no verse index is passed, we can cycle through them for preview
     useEffect(() => {
        if (currentVerseIndex !== undefined) return;

        const interval = setInterval(() => {
            setCurrentVerse(prev => (prev + 1) % data.lyrics.length);
        }, 5000); // Change verse every 5 seconds for preview

        return () => clearInterval(interval);
    }, [data.lyrics.length, currentVerseIndex]);


    return (
        <div className="h-full w-full flex items-center justify-center p-8 bg-gradient-to-br from-green-500 to-teal-600">
            <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-2xl flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Music className="h-10 w-10 text-primary" />
                        <CardTitle className="text-5xl font-headline">{data.title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center text-center min-h-[200px]">
                     <AnimatePresence mode="wait">
                        <motion.div
                            key={currentVerse}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.4 }}
                            className="text-4xl leading-relaxed whitespace-pre-wrap font-serif"
                        >
                            {data.lyrics[currentVerse]}
                        </motion.div>
                    </AnimatePresence>
                </CardContent>
                 <CardFooter className="flex justify-end items-center">
                    <p className="text-muted-foreground">Verse {currentVerse + 1} of {data.lyrics.length}</p>
                </CardFooter>
            </Card>
        </div>
    );
}
