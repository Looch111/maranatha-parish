
'use client';

import type { WelcomeMessage, Announcement, Event, Hymn, BibleVerse, WhatsNext, DisplayItem } from '@/lib/types';
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

// Mock Data since Firebase is disconnected
const mockWelcomeMessage: WelcomeMessage = { id: 'welcome', message: 'Welcome To Church', subtitle: 'We Are Glad To Have You Here' };
const mockAnnouncements: Announcement[] = [
    { id: '1', title: 'Sunday Service', content: 'Join us for our weekly Sunday service at 10:00 AM.', createdAt: new Date() },
    { id: '2', title: 'Bake Sale', content: 'Support our youth group by buying some delicious baked goods after the service.', createdAt: new Date() },
];
const mockEvents: Event[] = [
    { id: '1', name: 'Youth Group Meeting', date: '2024-08-15', time: '18:00', location: 'Parish Hall' },
    { id: '2', name: 'Charity Drive', date: '2024-08-20', time: '09:00', location: 'Church Parking Lot' },
];
const mockHymns: Hymn[] = [
    { id: '1', title: 'Amazing Grace', lyrics: ['Amazing grace! How sweet the sound,', 'That saved a wretch like me.'] },
    { id: '2', title: 'How Great Thou Art', lyrics: ['O Lord my God, when I in awesome wonder,', 'Consider all the worlds Thy Hands have made;'] },
];
const mockBibleVerses: BibleVerse[] = [
    { id: '1', reference: 'John 3:16', text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.' },
];
const mockWhatsNext: WhatsNext = { id: 'whats-next', message: 'Up next: Sermon by Pastor John' };


function TypingEffect({ text, className }: { text: string, className: string }) {
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loopNum, setLoopNum] = useState(0);
    const typingSpeed = 150;
    const deletingSpeed = 100;
    const delay = 2000;

    useEffect(() => {
        const handleTyping = () => {
            const currentText = text;
            const isComplete = !isDeleting && displayedText === currentText;
            const isEmpty = isDeleting && displayedText === '';

            if (isComplete) {
                setTimeout(() => setIsDeleting(true), delay);
            } else if (isEmpty) {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            } else if (isDeleting) {
                setDisplayedText(currentText.substring(0, displayedText.length - 1));
            } else {
                setDisplayedText(currentText.substring(0, displayedText.length + 1));
            }
        };

        const typingTimeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
        return () => clearTimeout(typingTimeout);

    }, [displayedText, isDeleting, text, loopNum]);


    return (
        <h1 className={className}>
            {displayedText}
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                className="inline-block w-1 h-full bg-white ml-2"
            >
                &nbsp;
            </motion.span>
        </h1>
    )
}

function WelcomeCard({ data }: { data: WelcomeMessage }) {
    const welcomeImage = PlaceHolderImages.find(img => img.id === 'church-welcome');
    
    return (
        <Card className="h-full w-full relative overflow-hidden flex items-center justify-center text-center p-0 rounded-none border-0">
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
                        key={data.message}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div>
                            <TypingEffect 
                                text={data.message}
                                className="font-headline text-7xl md:text-9xl font-bold drop-shadow-lg"
                            />
                            {data.subtitle && (
                                <p className="text-xl md:text-3xl mt-4 font-light drop-shadow-md">
                                    {data.subtitle}
                                </p>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </CardContent>
        </Card>
    );
}

export function TvDisplay() {
    const [displayItems, setDisplayItems] = useState<DisplayItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        // Simulate fetching data
        const timer = setTimeout(() => {
            const items: DisplayItem[] = [];
            if (mockWelcomeMessage) items.push({ type: 'welcome', data: mockWelcomeMessage });
            if (mockAnnouncements?.length > 0) items.push({ type: 'announcements', data: mockAnnouncements });
            if (mockEvents?.length > 0) items.push({ type: 'events', data: mockEvents });
            if (mockHymns?.length > 0) {
                 mockHymns.forEach(hymn => items.push({ type: 'hymn', data: hymn }));
            }
            if (mockBibleVerses?.length > 0) {
                mockBibleVerses.forEach(verse => items.push({ type: 'bible-verse', data: verse }));
            }
            if (mockWhatsNext) items.push({ type: 'whats-next', data: mockWhatsNext });

            setDisplayItems(items);
            setLoading(false);
        }, 1000); // Simulate network delay

        return () => clearTimeout(timer);
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

    return (
        <div className="h-full bg-background relative">
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
                            {item.type === 'welcome' && <WelcomeCard data={item.data} />}
                            {item.type === 'announcements' && <AnnouncementsCard data={item.data} />}
                            {item.type === 'events' && <EventsCard data={item.data} />}
                            {item.type === 'hymn' && <HymnCard data={item.data} />}
                            {item.type === 'bible-verse' && <BibleVerseCard data={item.data} />}
                            {item.type === 'whats-next' && <WhatsNextCard data={item.data} />}
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
             <div className="absolute bottom-4 right-4 text-white/70 text-xs font-mono z-10">
                {current} / {displayItems.length}
            </div>
        </div>
    );
}

