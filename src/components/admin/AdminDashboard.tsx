
'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WelcomeForm } from '@/components/admin/WelcomeForm';
import { AnnouncementsManager } from '@/components/admin/AnnouncementsManager';
import { EventsManager } from '@/components/admin/EventsManager';
import { HymnsManager } from '@/components/admin/HymnsManager';
import { BibleVerseManager } from '@/components/admin/BibleVerseManager';
import { WhatsNextForm } from '@/components/admin/WhatsNextForm';
import { ClosingForm } from '@/components/admin/ClosingForm';
import { LiveControlManager } from '@/components/admin/LiveControlManager';
import type { Announcement, Event, WelcomeMessage, Hymn, BibleVerse, WhatsNext, ClosingMessage } from '@/lib/types';
import { MessageSquare, Calendar, Megaphone, Music, BookOpen, Forward, Tv, LogOut } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface AdminDashboardProps {
    welcomeMessage: WelcomeMessage;
    announcements: Announcement[];
    events: Event[];
    hymns: Hymn[];
    bibleVerses: BibleVerse[];
    whatsNext: WhatsNext;
    closingMessage: ClosingMessage;
}

export function AdminDashboard({
    welcomeMessage,
    announcements,
    events,
    hymns,
    bibleVerses,
    whatsNext,
    closingMessage
}: AdminDashboardProps) {

    return (
        <Tabs defaultValue="live-control" className="w-full">
            <div className="sm:hidden">
                 <ScrollArea className="w-full whitespace-nowrap">
                    <TabsList>
                        <TabsTrigger value="live-control"><Tv className="mr-2" /> Live Control</TabsTrigger>
                        <TabsTrigger value="welcome"><MessageSquare className="mr-2" /> Welcome</TabsTrigger>
                        <TabsTrigger value="announcements"><Megaphone className="mr-2" /> Announcements</TabsTrigger>
                        <TabsTrigger value="events"><Calendar className="mr-2" /> Events</TabsTrigger>
                        <TabsTrigger value="hymns"><Music className="mr-2" /> Hymns</TabsTrigger>
                        <TabsTrigger value="bible-verses"><BookOpen className="mr-2" /> Bible Verses</TabsTrigger>
                        <TabsTrigger value="whats-next"><Forward className="mr-2" /> What's Next</TabsTrigger>
                        <TabsTrigger value="closing"><LogOut className="mr-2" /> Closing</TabsTrigger>
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
            <div className="hidden sm:block">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-4 lg:grid-cols-8">
                    <TabsTrigger value="live-control"><Tv className="mr-2" /> Live Control</TabsTrigger>
                    <TabsTrigger value="welcome"><MessageSquare className="mr-2" /> Welcome</TabsTrigger>
                    <TabsTrigger value="announcements"><Megaphone className="mr-2" /> Announcements</TabsTrigger>
                    <TabsTrigger value="events"><Calendar className="mr-2" /> Events</TabsTrigger>
                    <TabsTrigger value="hymns"><Music className="mr-2" /> Hymns</TabsTrigger>
                    <TabsTrigger value="bible-verses"><BookOpen className="mr-2" /> Bible Verses</TabsTrigger>
                    <TabsTrigger value="whats-next"><Forward className="mr-2" /> What's Next</TabsTrigger>
                    <TabsTrigger value="closing"><LogOut className="mr-2" /> Closing</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="live-control" className="mt-4">
                <LiveControlManager 
                    welcomeMessage={welcomeMessage}
                    announcements={announcements}
                    events={events}
                    hymns={hymns}
                    bibleVerses={bibleVerses}
                    whatsNext={whatsNext}
                    closingMessage={closingMessage}
                />
            </TabsContent>
            <TabsContent value="welcome" className="mt-4">
                <WelcomeForm initialData={welcomeMessage} />
            </TabsContent>
            <TabsContent value="announcements" className="mt-4">
                <AnnouncementsManager data={announcements} />
            </TabsContent>
            <TabsContent value="events" className="mt-4">
                <EventsManager data={events} />
            </TabsContent>
            <TabsContent value="hymns" className="mt-4">
                <HymnsManager data={hymns} />
            </TabsContent>
            <TabsContent value="bible-verses" className="mt-4">
                <BibleVerseManager data={bibleVerses} />
            </TabsContent>
            <TabsContent value="whats-next" className="mt-4">
                <WhatsNextForm initialData={whatsNext} />
            </TabsContent>
            <TabsContent value="closing" className="mt-4">
                <ClosingForm initialData={closingMessage} />
            </TabsContent>
        </Tabs>
    );
}
