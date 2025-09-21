
'use client';

import type { WelcomeMessage, Announcement, Event, Hymn, BibleVerse, WhatsNext, LiveDisplayItem, ClosingMessage } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { AnnouncementsCard } from '@/components/display/AnnouncementsCard';
import { EventsCard } from '@/components/display/EventsCard';
import { HymnCard } from '@/components/display/HymnCard';
import { BibleVerseCard } from '@/components/display/BibleVerseCard';
import { WhatsNextCard } from '@/components/display/WhatsNextCard';
import { ClosingCard } from '@/components/display/ClosingCard';
import { useFirestore, getDocument } from '@/hooks/use-firestore';
import Link from 'next/link';
import { PlaceHolderImages, type ImagePlaceholder } from '@/lib/placeholder-images';
import { Expand, Shrink } from 'lucide-react';
import { Button } from '@/components/ui/button';

function Clock() {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    // This code now runs only on the client, after the component has mounted.
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    setDate(new Date()); // Set initial time
    return () => clearInterval(timer);
  }, []);

  if (!date) {
    // Render a placeholder on the server and initial client render
    return <div className="text-right text-white" style={{width: '250px'}}>&nbsp;</div>;
  }
  
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="text-right text-white drop-shadow-md">
      <div className="text-3xl font-semibold">{time}</div>
      <div className="text-base">{dateString}</div>
    </div>
  );
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
        opacity: 1,
        transition: { staggerChildren: 0.06, delayChildren: i * 0.04 },
    }),
    exit: {
      opacity: 0,
      transition: { duration: 0.5 }
    }
};

const childVariants = {
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            damping: 12,
            stiffness: 100,
        },
    },
    hidden: {
        opacity: 0,
        y: 20,
        transition: {
            type: 'spring',
            damping: 12,
            stiffness: 100,
        },
    },
};

const AnimatedText = ({ text, el: Wrapper = 'p', className, delay = 0, keyAffix }: { text: string, el?: React.ElementType, className?: string, delay?: number, keyAffix: string }) => {
    const letters = Array.from(text);
    return (
        <motion.div
            key={keyAffix}
            style={{ display: 'flex', overflow: 'hidden' }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            custom={delay}
        >
            <Wrapper className={className}>
                {letters.map((letter, index) => (
                    <motion.span key={`${keyAffix}-${index}`} variants={childVariants}>
                        {letter === ' ' ? '\u00A0' : letter}
                    </motion.span>
                ))}
            </Wrapper>
        </motion.div>
    );
};

function WelcomeCard({ data }: { data: WelcomeMessage }) {
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        const titleDuration = (data.message.length * 0.06) * 1000;
        const subtitleDelay = 500;
        const subtitleDuration = (data.subtitle?.length || 0) * 0.06 * 1000;
        const pauseAfter = 4000;
        const totalDuration = titleDuration + subtitleDelay + subtitleDuration + pauseAfter;

        const interval = setInterval(() => {
            setAnimationKey(prev => prev + 1);
        }, totalDuration);

        return () => clearInterval(interval);
    }, [data]);

    const subtitleDelayInSeconds = (data.message.length * 0.04) + 0.5;

    return (
        <div className="relative z-10 text-center">
            <div className='text-white'>
                <AnimatePresence>
                    <AnimatedText keyAffix={`title-${animationKey}`} text={data.message} el="h1" className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold drop-shadow-lg flex" />
                </AnimatePresence>
                <AnimatePresence>
                    {data.subtitle && (
                         <AnimatedText keyAffix={`subtitle-${animationKey}`} text={data.subtitle} el="p" className="text-lg sm:text-xl md:text-3xl mt-4 font-light drop-shadow-md flex" delay={subtitleDelayInSeconds} />
                    )}
                </AnimatePresence>
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
                <Skeleton className="h-96 w-full max-w-2xl bg-white/10" />
             </div>
        );
    }

    const displayMessage = welcomeMessage || { id: 'welcome', message: 'Welcome To Maranatha', subtitle: 'We Are Glad You Have Joined Us' };

    return <WelcomeCard data={displayMessage} />;
}

const ImageSlideshow = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % PlaceHolderImages.length);
        }, 7000);
        return () => clearInterval(interval);
    }, []);

    return (
         <AnimatePresence initial={false} mode="wait">
            {PlaceHolderImages.map((image, index) => (
                index === currentImageIndex && (
                <motion.div
                    key={image.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={image.imageUrl}
                        alt={image.description}
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>
                )
            ))}
        </AnimatePresence>
    )
}

function FullscreenToggle() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    return (
        <Button onClick={toggleFullscreen} variant="ghost" size="icon" className="text-white hover:text-white hover:bg-white/20 z-20">
            {isFullscreen ? <Shrink /> : <Expand />}
            <span className="sr-only">{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
        </Button>
    );
}


const DisplayWrapper = ({ children, backgroundType }: { children: React.ReactNode, backgroundType: 'image' | 'video' }) => {
    return (
        <div className="relative w-full h-screen flex items-center justify-center overflow-hidden text-white p-8">
            <div className="absolute inset-0">
                {backgroundType === 'video' ? (
                     <video
                        src="https://i.imgur.com/txtUi6G.mp4"
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <ImageSlideshow />
                )}
            </div>
            <div className="absolute inset-0 bg-black/50" />

            <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start">
                 <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-white z-20">
                    <Image src="https://i.imgur.com/YryK4qj.png" alt="Maranatha Parish Logo" width={50} height={50} className="h-12 w-12 bg-white rounded-full p-1" />
                    <span className="font-headline text-5xl drop-shadow-md">Maranatha Parish</span>
                </Link>
                <div className="flex items-center gap-4">
                  <Clock />
                  <FullscreenToggle />
                </div>
            </header>

            <div className="relative z-10 w-full h-full flex items-center justify-center">
                 {children}
            </div>
        </div>
    );
};


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
            return <BibleVerseCard data={item.data as BibleVerse} currentVerseIndex={item.currentVerseIndex} />;
        case 'whats-next':
            return <WhatsNextCard data={item.data as WhatsNext} />;
        case 'closing':
            return <ClosingCard data={item.data as ClosingMessage} />;
        case 'none':
            return <DefaultDisplay />;
        default:
            return <DefaultDisplay />;
    }
}


export function TvDisplay() {
    const liveDisplayItem = useFirestore<LiveDisplayItem>('live/current');
    
    const animationKey = liveDisplayItem 
        ? `${liveDisplayItem.type}-${(liveDisplayItem.data as any)?.id}-${liveDisplayItem.currentVerseIndex}` 
        : 'loading';

    const backgroundType = (liveDisplayItem?.type === 'closing' || (liveDisplayItem?.type === 'none' && !liveDisplayItem?.data)) ? 'video' : 'image';

    return (
        <DisplayWrapper backgroundType={backgroundType}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={animationKey}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className={'w-full h-full flex items-center justify-center'}
                >
                    {liveDisplayItem ? (
                        <LiveItemDisplay item={liveDisplayItem} />
                    ) : (
                        <DefaultDisplay />
                    )}
                </motion.div>
            </AnimatePresence>
        </DisplayWrapper>
    );
}
