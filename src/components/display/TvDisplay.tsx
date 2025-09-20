'use client';

import type { WelcomeMessage } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';

// Mock Data since Firebase is disconnected
const mockWelcomeMessage: WelcomeMessage = { id: 'welcome', message: 'Welcome to church', subtitle: 'we are glad to have you here' };

function WelcomeSection() {
    const [welcomeData, setWelcomeData] = useState<WelcomeMessage | null>(null);
    const welcomeImage = PlaceHolderImages.find(img => img.id === 'church-welcome');
    
    useEffect(() => {
        // Simulate fetching data
        const timer = setTimeout(() => {
            setWelcomeData(mockWelcomeMessage);
        }, 1000); // Simulate network delay
        return () => clearTimeout(timer);
    }, []);


    return (
        <Card className="h-full relative overflow-hidden flex items-center justify-center text-center p-0 rounded-none border-0">
            {welcomeImage && (
                 <Image
                    src={welcomeImage.imageUrl}
                    alt={welcomeImage.description}
                    fill
                    className="object-cover"
                    data-ai-hint={welcomeImage.imageHint}
                    priority
                />
            )}
            <div className="absolute inset-0 bg-black/50" />
            <CardContent className="relative z-10 text-white p-8">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={welcomeData?.message || 'loading'}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        {welcomeData ? (
                            <div>
                                <h1 className="font-headline text-7xl md:text-9xl font-bold drop-shadow-lg">
                                    {welcomeData.message}
                                </h1>
                                {welcomeData.subtitle && (
                                    <p className="text-xl md:text-3xl mt-4 font-light drop-shadow-md">
                                        {welcomeData.subtitle}
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-4">
                               <Skeleton className="h-24 w-full max-w-[800px] bg-white/20 mx-auto" />
                               <Skeleton className="h-24 w-full max-w-[600px] mx-auto bg-white/20" />
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}

export function TvDisplay() {
    return (
        <div className="h-full bg-background">
            <WelcomeSection />
        </div>
    );
}
