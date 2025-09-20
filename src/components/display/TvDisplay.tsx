'use client';

import { useFirestore } from '@/hooks/use-firestore';
import type { Announcement, Event, WelcomeMessage } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { Megaphone } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function WelcomeSection() {
    const welcomeData = useFirestore<WelcomeMessage>('content/welcome');
    const welcomeImage = PlaceHolderImages.find(img => img.id === 'church-welcome');

    return (
        <Card className="col-span-1 lg:col-span-2 row-span-1 relative overflow-hidden flex items-center justify-center text-center p-0 min-h-[300px]">
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
                            <h1 className="font-headline text-4xl md:text-6xl font-bold drop-shadow-lg">
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

function AnnouncementsSection() {
    const announcements = useFirestore<Announcement>('announcements', 'createdAt');
    return (
         <Card className="col-span-1 lg:col-span-2 row-span-1 flex flex-col min-h-[400px]">
            <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2 font-headline text-2xl"><Megaphone /> Announcements</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow overflow-y-auto space-y-4">
                <AnimatePresence>
                    {announcements && announcements.length > 0 ? announcements.slice(0, 5).map((ann, i) => (
                         <motion.div
                            key={ann.id}
                            layout
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                            className="p-4 rounded-lg border bg-card"
                         >
                            <h3 className="font-bold text-lg text-primary">{ann.title}</h3>
                            <p className="text-muted-foreground">{ann.content}</p>
                         </motion.div>
                    )) : (
                      announcements ? (
                         <div className="text-center text-muted-foreground h-full flex items-center justify-center">No current announcements.</div>
                      ) : Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="p-4 rounded-lg border space-y-2">
                           <Skeleton className="h-5 w-1/2" />
                           <Skeleton className="h-4 w-full" />
                           <Skeleton className="h-4 w-3/4" />
                        </div>
                      ))
                    )}
                </AnimatePresence>
            </CardContent>
        </Card>
    )
}

export function TvDisplay() {
    return (
        <div className="h-full p-4 lg:p-6 bg-background">
            <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-4 lg:gap-6 h-full">
                <WelcomeSection />
                <AnnouncementsSection />
            </div>
        </div>
    );
}
