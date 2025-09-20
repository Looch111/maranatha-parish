
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
import Link from 'next/link';

function Clock() {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    const updateClock = () => {
      setDate(new Date());
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  
  const time = date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
  const dateString = date ? date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : null;

  if (date === null) {
    return <div className="text-right text-white" style={{width: '250px'}}>&nbsp;</div>;
  }

  return (
    <div className="text-right text-white drop-shadow-md">
      <div className="text-3xl font-semibold">{time}</div>
      <div className="text-base">{dateString}</div>
    </div>
  );
}


function WelcomeCard({ data }: { data: WelcomeMessage }) {
    const welcomeImage = PlaceHolderImages.find(img => img.id === 'church-welcome');
    
    return (
        <div className="relative w-full h-screen flex items-center justify-center">
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

            <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start">
                 <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-white">
                    <Image src="https://i.imgur.com/YryK4qj.png" alt="Maranatha Parish Logo" width={50} height={50} className="h-12 w-12 bg-white rounded-full p-1" />
                    <span className="font-headline text-5xl drop-shadow-md">Maranatha Parish</span>
                </Link>
                <Clock />
            </header>

            <div className="relative z-10 text-center">
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
        return (
             <div className="w-full h-screen flex items-center justify-center">
                <Skeleton className="h-96 w-full max-w-2xl" />
             </div>
        );
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
    const isWelcomeScreen = !liveDisplayItem || liveDisplayItem.type === 'none' || liveDisplayItem.type === 'welcome';
    
    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={liveDisplayItem ? `${liveDisplayItem.type}-${(liveDisplayItem.data as any)?.id}-${liveDisplayItem.currentVerseIndex}` : 'loading'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className={isWelcomeScreen ? 'h-screen' : ''}
            >
                {liveDisplayItem ? (
                    <LiveItemDisplay item={liveDisplayItem} />
                ) : (
                    <DefaultDisplay />
                )}
            </motion.div>
        </AnimatePresence>
    );
}
