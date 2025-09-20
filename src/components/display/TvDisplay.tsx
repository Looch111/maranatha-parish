'use client';

import { useFirestore } from '@/hooks/use-firestore';
import type { WelcomeMessage } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function WelcomeSection() {
    const welcomeData = useFirestore<WelcomeMessage>('content/welcome');
    const welcomeImage = PlaceHolderImages.find(img => img.id === 'church-welcome');

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
                            <h1 className="font-headline text-5xl md:text-7xl font-bold drop-shadow-lg">
                                {welcomeData.message}
                            </h1>
                        ) : (
                            <div className="space-y-4">
                               <Skeleton className="h-16 w-full max-w-[600px] bg-white/20 mx-auto" />
                               <Skeleton className="h-16 w-full max-w-[450px] mx-auto bg-white/20" />
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
