
'use client';
import { useState } from 'react';
import type { Hymn } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Music, ArrowLeft, ArrowRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function HymnCard({ data }: { data: Hymn }) {
    const [currentVerse, setCurrentVerse] = useState(0);

    const nextVerse = () => setCurrentVerse(prev => (prev + 1) % data.lyrics.length);
    const prevVerse = () => setCurrentVerse(prev => (prev - 1 + data.lyrics.length) % data.lyrics.length);

    return (
        <div className="h-full w-full flex items-center justify-center p-8 bg-gradient-to-br from-green-500 to-teal-600">
            <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-2xl flex flex-col">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Music className="h-10 w-10 text-primary" />
                        <CardTitle className="text-5xl font-headline">{data.title}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center text-center">
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
                 <CardFooter className="flex justify-between items-center">
                    <Button onClick={prevVerse} variant="outline" size="lg" className="bg-white/50">
                        <ArrowLeft className="mr-2"/> Previous
                    </Button>
                    <p className="text-muted-foreground">Verse {currentVerse + 1} of {data.lyrics.length}</p>
                    <Button onClick={nextVerse} variant="outline" size="lg" className="bg-white/50">
                        Next <ArrowRight className="ml-2"/>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
