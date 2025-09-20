'use client';
import { useState, useEffect } from 'react';
import type { Announcement, Event, WelcomeMessage, Hymn, BibleVerse, WhatsNext, ClosingMessage } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tv, MessageSquare, Megaphone, Calendar, Music, BookOpen, Forward, ArrowLeft, ArrowRight, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setLiveDisplayAction, stopLiveDisplayAction } from '@/lib/actions';
import { useFirestore } from '@/hooks/use-firestore';
import type { LiveDisplayItem } from '@/lib/types';

interface LiveControlManagerProps {
    initialWelcomeMessage: WelcomeMessage;
    initialAnnouncements: Announcement[];
    initialEvents: Event[];
    initialHymns: Hymn[];
    initialBibleVerses: BibleVerse[];
    initialWhatsNext: WhatsNext;
    initialClosingMessage: ClosingMessage;
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
        case 'Closing': return <LogOut className="h-5 w-5 text-muted-foreground" />;
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
        case 'closing': return item.data.message;
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
        case 'closing': return 'Closing';
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
    initialClosingMessage,
}: LiveControlManagerProps) {
    const { toast } = useToast();
    const liveDisplay = useFirestore<LiveDisplayItem>('live/current');
    
    // We keep a local state for hymn verse to react instantly in the UI
    const [hymnVerseState, setHymnVerseState] = useState<{ [key: string]: number }>({});
    
    useEffect(() => {
        if (liveDisplay && liveDisplay.type === 'hymn' && liveDisplay.currentVerseIndex !== undefined) {
             const hymnId = (liveDisplay.data as Hymn).id;
             setHymnVerseState(prev => ({...prev, [hymnId]: liveDisplay.currentVerseIndex!}));
        }
    }, [liveDisplay]);


    const nowPlaying = liveDisplay && liveDisplay.type !== 'none' ? liveDisplay : null;

    const allContent: DisplayItem[] = [
        { type: 'welcome', data: initialWelcomeMessage },
        ...(initialAnnouncements.length > 0 ? [{ type: 'announcements', data: initialAnnouncements }] : []),
        ...(initialEvents.length > 0 ? [{ type: 'events', data: initialEvents }] : []),
        ...initialHymns.map(h => ({ type: 'hymn', data: h, id: h.id })),
        ...initialBibleVerses.map(b => ({ type: 'bible-verse', data: b, id: b.id })),
        { type: 'whats-next', data: initialWhatsNext },
        { type: 'closing', data: initialClosingMessage }
    ].filter(item => item && item.data);

    const handleDisplay = async (item: DisplayItem) => {
        let verseIndex: number | undefined = undefined;
        if (item.type === 'hymn') {
            verseIndex = 0;
            setHymnVerseState(prev => ({ ...prev, [item.id!]: 0 }));
        }
        const result = await setLiveDisplayAction(item, verseIndex);
        if (result.type === 'success') {
            toast({
                title: "Display Sent",
                description: `"${getTitle(item)}" is now live.`,
            });
        } else {
             toast({
                title: "Error",
                description: result.message,
                variant: 'destructive',
            });
        }
    }

    const handleStop = async () => {
        const stoppedItem = nowPlaying;
        const result = await stopLiveDisplayAction();
        if (result.type === 'success') {
            if (stoppedItem) {
                 toast({
                    title: "Display Stopped",
                    description: `"${getTitle(stoppedItem as DisplayItem)}" is no longer live.`,
                    variant: 'destructive',
                });
            }
        } else {
             toast({
                title: "Error",
                description: result.message,
                variant: 'destructive',
            });
        }
    }

    const changeVerse = async (direction: 'next' | 'prev') => {
        if (nowPlaying?.type === 'hymn') {
            const hymn = nowPlaying.data as Hymn;
            const hymnId = hymn.id;
            
            // Use local state for immediate UI feedback, but get current index from DB if not in local state
            const currentVerse = hymnVerseState[hymnId] ?? nowPlaying.currentVerseIndex ?? 0;

            const newVerseIndex = direction === 'next'
                ? (currentVerse + 1) % hymn.lyrics.length
                : (currentVerse - 1 + hymn.lyrics.length) % hymn.lyrics.length;

            setHymnVerseState(prev => ({ ...prev, [hymnId]: newVerseIndex }));
            
            const result = await setLiveDisplayAction(nowPlaying as DisplayItem, newVerseIndex);
             if (result.type === 'success') {
                toast({
                    title: "Verse Changed",
                    description: `Now showing verse ${newVerseIndex + 1}.`,
                });
            } else {
                toast({
                    title: "Error",
                    description: result.message,
                    variant: 'destructive',
                });
                 // Revert local state if DB update fails
                setHymnVerseState(prev => ({ ...prev, [hymnId]: currentVerse }));
            }
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
                                const isPlaying = nowPlaying?.type === item.type && (item.type !== 'hymn' && item.type !== 'bible-verse' || (nowPlaying.data as any).id === item.id);
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
                                           {isPlaying && item.type === 'hymn' && (
                                                <>
                                                    <Button variant="outline" size="sm" onClick={() => changeVerse('prev')}>
                                                        <ArrowLeft className="mr-2 h-4 w-4" /> Prev Verse
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => changeVerse('next')}>
                                                        Next Verse <ArrowRight className="ml-2 h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                             <Button variant={isPlaying ? 'destructive' : 'outline'} size="sm" onClick={isPlaying ? handleStop : () => handleDisplay(item)}>
                                                {isPlaying ? 'Stop' : <><Tv className="mr-2 h-4 w-4" /> Display Now</>}
                                            </Button>
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
