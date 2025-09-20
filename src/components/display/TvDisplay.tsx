
'use client';

import type { WelcomeMessage, Announcement, Event, Hymn, BibleVerse, WhatsNext, DisplayItem, LiveDisplayItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel"
import { AnnouncementsCard } from '@/components/display/AnnouncementsCard';
import { EventsCard } from '@/components/display/EventsCard';
import { HymnCard } from '@/components/display/HymnCard';
import { BibleVerseCard } from '@/components/display/BibleVerseCard';
import { WhatsNextCard } from '@/components/display/WhatsNextCard';
import Autoplay from "embla-carousel-autoplay";
import { useFirestore } from '@/hooks/use-firestore';
import { getCollection, getDocument } from '@/hooks/use-firestore';


function WelcomeCard({ data }: { data: WelcomeMessage }) {
    const welcomeImage = PlaceHolderImages.find(img => img.id === 'church-welcome');
    
    return (
        <div className="h-full w-full relative overflow-hidden flex items-center justify-center text-center p-0">
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
            <div className="relative z-10 text-white p-8">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={data.message}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div>
                            <h1 className="font-headline text-7xl md:text-9xl font-bold drop-shadow-lg">
                                {data.message}
                            </h1>
                            {data.subtitle && (
                                <p className="text-xl md:text-3xl mt-4 font-light drop-shadow-md">
                                    {data.subtitle}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}


function DefaultCarouselDisplay() {
    const [displayItems, setDisplayItems] = useState<DisplayItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    
    useEffect(() => {
        const fetchAllContent = async () => {
            setLoading(true);
            const [
                welcome,
                announcements,
                events,
                hymns,
                bibleVerses,
                whatsNext
            ] = await Promise.all([
                getDocument<WelcomeMessage>('content/welcome'),
                getCollection<Announcement>('announcements'),
                getCollection<Event>('events'),
                getCollection<Hymn>('hymns'),
                getCollection<BibleVerse>('bible-verses'),
                getDocument<WhatsNext>('content/whats-next'),
            ]);

            const items: DisplayItem[] = [];
            if (welcome) items.push({ type: 'welcome', data: welcome });
            if (announcements?.length > 0) items.push({ type: 'announcements', data: announcements });
            if (events?.length > 0) items.push({ type: 'events', data: events });
            if (hymns?.length > 0) {
                 hymns.forEach(hymn => items.push({ type: 'hymn', data: hymn }));
            }
            if (bibleVerses?.length > 0) {
                bibleVerses.forEach(verse => items.push({ type: 'bible-verse', data: verse }));
            }
            if (whatsNext) items.push({ type: 'whats-next', data: whatsNext });

            setDisplayItems(items);
            setLoading(false);
        }

        fetchAllContent();
    }, []);

    useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap() + 1);
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    if (loading) {
        return (
             <div className="h-full w-full flex items-center justify-center bg-background">
                <Skeleton className="h-full w-full" />
             </div>
        )
    }

    if (displayItems.length === 0) {
        const defaultWelcome: WelcomeMessage = { id: 'welcome', message: 'Welcome To Church', subtitle: 'We Are Glad To Have You Here' };
        return <WelcomeCard data={defaultWelcome} />
    }

    return (
        <div className="h-full w-full relative">
            <Carousel 
                setApi={setApi}
                className="h-full w-full"
                plugins={[
                    Autoplay({
                        delay: 10000,
                        stopOnInteraction: true,
                    }),
                ]}
           >
                <CarouselContent className="h-full">
                    {displayItems.map((item, index) => (
                        <CarouselItem key={index} className="h-full">
                            {item.type === 'welcome' && <WelcomeCard data={item.data as WelcomeMessage} />}
                            {item.type === 'announcements' && <AnnouncementsCard data={item.data as Announcement[]} />}
                            {item.type === 'events' && <EventsCard data={item.data as Event[]} />}
                            {item.type === 'hymn' && <HymnCard data={item.data as Hymn} />}
                            {item.type === 'bible-verse' && <BibleVerseCard data={item.data as BibleVerse} />}
                            {item.type === 'whats-next' && <WhatsNextCard data={item.data as WhatsNext} />}
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="absolute bottom-4 right-4 text-white/70 text-xs font-mono z-10">
                {current} / {displayItems.length}
            </div>
        </div>
    )
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
            return <DefaultCarouselDisplay />;
        default:
            return (
                <div className="h-full w-full flex items-center justify-center bg-background">
                   <p>Waiting for content...</p>
                </div>
           );
    }
}


export function TvDisplay() {
    const liveDisplayItem = useFirestore<LiveDisplayItem>('live/current');

    return (
        <div className="h-full bg-background relative">
            <AnimatePresence>
                <motion.div
                    key={liveDisplayItem ? `${liveDisplayItem.type}-${(liveDisplayItem.data as any)?.id}-${liveDisplayItem.currentVerseIndex}` : 'loading'}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full"
                >
                    {liveDisplayItem ? (
                        <LiveItemDisplay item={liveDisplayItem} />
                    ) : (
                        <DefaultCarouselDisplay />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
