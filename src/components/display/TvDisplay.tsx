
'use client';

import type { WelcomeMessage, Announcement, Event, Hymn, BibleVerse, WhatsNext, LiveDisplayItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';
import { AnnouncementsCard } from '@/components/display/AnnouncementsCard';
import { EventsCard } from '@/components/display/EventsCard';
import { HymnCard } from '@/components/display/HymnCard';
import { BibleVerseCard } from '@/components/display/BibleVerseCard';
import { WhatsNextCard } from '@/components/display/WhatsNextCard';
import { useFirestore } from '@/hooks/use-firestore';
import { getDocument } from '@/hooks/use-firestore';


function WelcomeCard({ data }: { data: WelcomeMessage }) {
    const welcomeImage = PlaceHolderImages.find(img => img.id === 'church-welcome');
    
    return (
        <div className="relative w-full h-full min-h-[calc(100vh-10rem)] flex items-center justify-center">
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
            <div className="relative z-10 text-center p-4">
                <div className='text-white'>
                    <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold drop-shadow-lg">
                        {data.message}
                    </h1>
                    {data.subtitle && (
                        <p className="text-lg sm:text-xl md:text-3xl mt-4 font-light drop-shadow-md">
                            {data.subtitle}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function DefaultDisplay() {
    const [welcomeMessage, setWelcomeMessage] = useState<WelcomeMessage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWelcome = async () => {
            setLoading(true);
            const welcome = await getDocument<WelcomeMessage>('content/welcome');
            setWelcomeMessage(welcome);
            setLoading(false);
        }
        fetchWelcome();
    }, []);

    if (loading) {
        return <Skeleton className="h-96 w-full" />;
    }

    if (!welcomeMessage) {
        const defaultWelcome: WelcomeMessage = { id: 'welcome', message: 'Welcome To Church', subtitle: 'We Are Glad To Have You Here' };
        return <WelcomeCard data={defaultWelcome} />
    }

    return <WelcomeCard data={welcomeMessage} />;
}


function LiveItemDisplay({ item }: { item: LiveDisplayItem }) {
    switch (item.type) {
        case 'welcome':
            return <WelcomeCard data={item.data as WelcomeMessage} />;
        case 'announcements':
            return <AnnouncementsCard data={item.data as Announcement[]} />;
        case 'events':
            return <EventsCard data={item.data as Event[]} />;
        case 'hymn':
            return <HymnCard data={item.data as Hymn} currentVerseIndex={item.currentVerseIndex} />;
        case 'bible-verse':
            return <BibleVerseCard data={item.data as BibleVerse} />;
        case 'whats-next':
            return <WhatsNextCard data={item.data as WhatsNext} />;
        case 'none':
            return <DefaultDisplay />;
        default:
            return (
                <Card>
                    <CardContent className="p-8">
                         <p>Waiting for content...</p>
                    </CardContent>
                </Card>
           );
    }
}


export function TvDisplay() {
    const liveDisplayItem = useFirestore<LiveDisplayItem>('live/current');

    return (
        <div className="container mx-auto py-8 px-4">
            <AnimatePresence mode="wait">
                <motion.div
                    key={liveDisplayItem ? `${liveDisplayItem.type}-${(liveDisplayItem.data as any)?.id}-${liveDisplayItem.currentVerseIndex}` : 'loading'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="h-full"
                >
                    {liveDisplayItem ? (
                        <LiveItemDisplay item={liveDisplayItem} />
                    ) : (
                        <DefaultDisplay />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
