
'use client';
import { useState, useEffect } from 'react';
import type { Announcement, Event, WelcomeMessage, Hymn, BibleVerse, WhatsNext, ClosingMessage, LiveDisplayRef, DisplayItemType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tv, MessageSquare, Megaphone, Calendar, Music, BookOpen, Forward, ArrowLeft, ArrowRight, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { setLiveDisplayAction, stopLiveDisplayAction } from '@/lib/actions';
import { useFirestore } from '@/hooks/use-firestore';

interface LiveControlManagerProps {
    welcomeMessage: WelcomeMessage;
    announcements: Announcement[];
    events: Event[];
    hymns: Hymn[];
    bibleVerses: BibleVerse[];
    whatsNext: WhatsNext;
    closingMessage: ClosingMessage;
}

type DisplayRowItem = {
    type: DisplayItemType;
    ref: string | null;
    title: string;
    item: any;
}

const ItemIcon = ({ type }: { type: string }) => {
    switch (type) {
        case 'Welcome': return <MessageSquare className="h-5 w-5 text-muted-foreground" />;
        case 'Announcements': return <Megaphone className="h-5 w.5 text-muted-foreground" />;
        case 'Events': return <Calendar className="h-5 w-5 text-muted-foreground" />;
        case 'Hymn': return <Music className="h-5 w-5 text-muted-foreground" />;
        case 'Bible Verse': return <BookOpen className="h-5 w-5 text-muted-foreground" />;
        case 'What\'s Next': return <Forward className="h-5 w-5 text-muted-foreground" />;
        case 'Closing': return <LogOut className="h-5 w-5 text-muted-foreground" />;
        default: return null;
    }
};

const getTypeString = (type: DisplayItemType): string => {
     switch(type) {
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
    welcomeMessage,
    announcements,
    events,
    hymns,
    bibleVerses,
    whatsNext,
    closingMessage,
}: LiveControlManagerProps) {
    const { toast } = useToast();
    const liveDisplayRef = useFirestore<LiveDisplayRef>('live/current');
    
    // We keep a local state for verse/part index to react instantly in the UI
    const [verseState, setVerseState] = useState<{ [key: string]: number }>({});
    
    useEffect(() => {
        if (liveDisplayRef && (liveDisplayRef.type === 'hymn' || liveDisplayRef.type === 'bible-verse') && liveDisplayRef.currentVerseIndex !== undefined && liveDisplayRef.ref) {
             const itemId = liveDisplayRef.ref;
             setVerseState(prev => ({...prev, [itemId]: liveDisplayRef.currentVerseIndex!}));
        }
    }, [liveDisplayRef]);


    const nowPlaying = liveDisplayRef && liveDisplayRef.type !== 'none' ? liveDisplayRef : null;

    const allContent: DisplayRowItem[] = [
        { type: 'welcome', ref: 'content/welcome', title: welcomeMessage.message, item: welcomeMessage },
        ...(announcements.length > 0 ? [{ type: 'announcements', ref: 'announcements', title: 'All Announcements', item: announcements }] : []),
        ...(events.length > 0 ? [{ type: 'events', ref: 'events', title: 'All Events', item: events }] : []),
        ...hymns.map(h => ({ type: 'hymn' as DisplayItemType, ref: `hymns/${h.id}`, title: h.title, item: h })),
        ...bibleVerses.map(b => ({ type: 'bible-verse' as DisplayItemType, ref: `bible-verses/${b.id}`, title: b.reference, item: b })),
        { type: 'whats-next', ref: 'content/whats-next', title: whatsNext.message, item: whatsNext },
        { type: 'closing', ref: 'content/closing', title: closingMessage.message, item: closingMessage }
    ].filter(item => item && item.item);

    const handleDisplay = async (item: DisplayRowItem) => {
        let verseIndex: number | undefined = undefined;
        if (item.type === 'hymn' || item.type === 'bible-verse') {
            verseIndex = 0;
            if (item.ref) {
              setVerseState(prev => ({ ...prev, [item.ref!]: 0 }));
            }
        }
        const result = await setLiveDisplayAction(item.type, item.ref, verseIndex);
        if (result.type === 'success') {
            toast({
                title: "Display Sent",
                description: `"${item.title}" is now live.`,
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
        const stoppedItem = allContent.find(c => c.ref === nowPlaying?.ref);
        const result = await stopLiveDisplayAction();
        if (result.type === 'success') {
            if (stoppedItem) {
                 toast({
                    title: "Display Stopped",
                    description: `"${stoppedItem.title}" is no longer live.`,
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
        if (!nowPlaying || !nowPlaying.ref || (nowPlaying.type !== 'hymn' && nowPlaying.type !== 'bible-verse')) return;
        
        const item = allContent.find(c => c.ref === nowPlaying.ref)?.item as Hymn | BibleVerse | undefined;
        if (!item) return;
        const itemId = nowPlaying.ref;
        const parts = 'lyrics' in item ? item.lyrics : item.text;
        
        const currentVerse = verseState[itemId] ?? nowPlaying.currentVerseIndex ?? 0;

        const newVerseIndex = direction === 'next'
            ? (currentVerse + 1) % parts.length
            : (currentVerse - 1 + parts.length) % parts.length;

        setVerseState(prev => ({ ...prev, [itemId]: newVerseIndex }));
        
        const result = await setLiveDisplayAction(nowPlaying.type, nowPlaying.ref, newVerseIndex);
            if (result.type === 'success') {
            toast({
                title: "Display Changed",
                description: `Now showing part ${newVerseIndex + 1}.`,
            });
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: 'destructive',
            });
            // Revert local state if DB update fails
            setVerseState(prev => ({ ...prev, [itemId]: currentVerse }));
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
                                const isPlaying = nowPlaying?.type === item.type && nowPlaying?.ref === item.ref;
                                return (
                                    <TableRow key={`${item.type}-${item.ref || index}`} className={isPlaying ? 'bg-accent/50' : ''}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <ItemIcon type={getTypeString(item.type)} />
                                                <span>{getTypeString(item.type)}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-sm truncate">{item.title}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                           {isPlaying && (item.type === 'hymn' || (item.type === 'bible-verse' && Array.isArray(item.item.text) && item.item.text.length > 1)) && (
                                                <>
                                                    <Button variant="outline" size="sm" onClick={() => changeVerse('prev')}>
                                                        <ArrowLeft className="mr-2 h-4 w-4" /> Prev
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => changeVerse('next')}>
                                                        Next <ArrowRight className="ml-2 h-4 w-4" />
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
