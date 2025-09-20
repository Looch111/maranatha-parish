
'use client';
import { useState } from 'react';
import type { Announcement, Event, WelcomeMessage, Hymn, BibleVerse, WhatsNext } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tv, MessageSquare, Megaphone, Calendar, Music, BookOpen, Forward, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LiveControlManagerProps {
    initialWelcomeMessage: WelcomeMessage;
    initialAnnouncements: Announcement[];
    initialEvents: Event[];
    initialHymns: Hymn[];
    initialBibleVerses: BibleVerse[];
    initialWhatsNext: WhatsNext;
}

type DisplayItem = {
    type: string;
    data: any;
    id?: string;
}

const ItemIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'Welcome': return <MessageSquare className="h-5 w-5 text-muted-foreground" />;
        case 'Announcements': return <Megaphone className="h-5 w-5 text-muted-foreground" />;
        case 'Events': return <Calendar className="h-5 w-5 text-muted-foreground" />;
        case 'Hymn': return <Music className="h-5 w-5 text-muted-foreground" />;
        case 'Bible Verse': return <BookOpen className="h-5 w-5 text-muted-foreground" />;
        case 'What\'s Next': return <Forward className="h-5 w-5 text-muted-foreground" />;
        default: return null;
    }
};

const getTitle = (item: DisplayItem): string => {
    switch(item.type) {
        case 'welcome': return item.data.message;
        case 'announcements': return 'All Announcements';
        case 'events': return 'All Events';
        case 'hymn': return item.data.title;
        case 'bible-verse': return item.data.reference;
        case 'whats-next': return item.data.message;
        default: return 'Unknown';
    }
}

const getTypeString = (item: DisplayItem): string => {
     switch(item.type) {
        case 'welcome': return 'Welcome';
        case 'announcements': return 'Announcements';
        case 'events': return 'Events';
        case 'hymn': return 'Hymn';
        case 'bible-verse': return 'Bible Verse';
        case 'whats-next': return 'What\'s Next';
        default: return 'Unknown';
    }
}


export function LiveControlManager({
    initialWelcomeMessage,
    initialAnnouncements,
    initialEvents,
    initialHymns,
    initialBibleVerses,
    initialWhatsNext,
}: LiveControlManagerProps) {
    const { toast } = useToast();
    const [nowPlaying, setNowPlaying] = useState<DisplayItem | null>(null);
    const [currentVerse, setCurrentVerse] = useState(0);

    const allContent: DisplayItem[] = [
        { type: 'welcome', data: initialWelcomeMessage },
        ...(initialAnnouncements.length > 0 ? [{ type: 'announcements', data: initialAnnouncements }] : []),
        ...(initialEvents.length > 0 ? [{ type: 'events', data: initialEvents }] : []),
        ...initialHymns.map(h => ({ type: 'hymn', data: h, id: h.id })),
        ...initialBibleVerses.map(b => ({ type: 'bible-verse', data: b, id: b.id })),
        { type: 'whats-next', data: initialWhatsNext }
    ].filter(item => item && item.data);

    const handleDisplay = (item: DisplayItem) => {
        setNowPlaying(item);
        setCurrentVerse(0); // Reset verse on new item
        console.log('Displaying:', item);
        toast({
            title: "Display Sent",
            description: `"${getTitle(item)}" is now live. (This is a simulation)`,
        });
    }

    const handleStop = () => {
        const stoppedItem = nowPlaying;
        setNowPlaying(null);
        if (stoppedItem) {
            toast({
                title: "Display Stopped",
                description: `"${getTitle(stoppedItem)}" is no longer live.`,
                variant: 'destructive',
            });
        }
    }

    const changeVerse = (direction: 'next' | 'prev') => {
        if (nowPlaying?.type === 'hymn') {
            const hymn = nowPlaying.data as Hymn;
            const newVerseIndex = direction === 'next'
                ? (currentVerse + 1) % hymn.lyrics.length
                : (currentVerse - 1 + hymn.lyrics.length) % hymn.lyrics.length;
            setCurrentVerse(newVerseIndex);
            console.log(`Displaying Verse ${newVerseIndex + 1} of "${hymn.title}"`);
            toast({
                title: "Verse Changed",
                description: `Now showing verse ${newVerseIndex + 1}.`,
            });
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Tv /> Live Display Control</CardTitle>
                <CardDescription>
                    Select an item to display it on the main screen. The screen will update in real-time.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Content</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allContent.map((item, index) => {
                                const isPlaying = nowPlaying?.type === item.type && nowPlaying?.id === item.id;
                                return (
                                    <TableRow key={index} className={isPlaying ? 'bg-accent/50' : ''}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <ItemIcon type={getTypeString(item)} />
                                                <span>{getTypeString(item)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-sm truncate">{getTitle(item)}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            {isPlaying ? (
                                                <>
                                                    {item.type === 'hymn' && (
                                                        <>
                                                            <Button variant="outline" size="sm" onClick={() => changeVerse('prev')}>
                                                                <ArrowLeft className="mr-2 h-4 w-4" /> Prev Verse
                                                            </Button>
                                                            <Button variant="outline" size="sm" onClick={() => changeVerse('next')}>
                                                                Next Verse <ArrowRight className="ml-2 h-4 w-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                    <Button variant="destructive" size="sm" onClick={handleStop}>Stop</Button>
                                                </>
                                            ) : (
                                                <Button variant="outline" size="sm" onClick={() => handleDisplay(item)} disabled={!!nowPlaying}>
                                                    <Tv className="mr-2 h-4 w-4" /> Display Now
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
