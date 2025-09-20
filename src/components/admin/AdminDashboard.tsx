'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WelcomeForm } from '@/components/admin/WelcomeForm';
import { AnnouncementsManager } from '@/components/admin/AnnouncementsManager';
import { EventsManager } from '@/components/admin/EventsManager';
import { HymnsManager } from '@/components/admin/HymnsManager';
import { BibleVerseManager } from '@/components/admin/BibleVerseManager';
import { WhatsNextForm } from '@/components/admin/WhatsNextForm';
import type { Announcement, Event, WelcomeMessage, Hymn, BibleVerse, WhatsNext } from '@/lib/types';
import { MessageSquare, Calendar, Megaphone, Music, BookOpen, Forward } from 'lucide-react';

interface AdminDashboardProps {
    initialWelcomeMessage: WelcomeMessage;
    initialAnnouncements: Announcement[];
    initialEvents: Event[];
    initialHymns: Hymn[];
    initialBibleVerses: BibleVerse[];
    initialWhatsNext: WhatsNext;
}

export function AdminDashboard({
    initialWelcomeMessage,
    initialAnnouncements,
    initialEvents,
    initialHymns,
    initialBibleVerses,
    initialWhatsNext
}: AdminDashboardProps) {

    return (
        <Tabs defaultValue="welcome" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 lg:grid-cols-6">
                <TabsTrigger value="welcome"><MessageSquare className="mr-2" /> Welcome</TabsTrigger>
                <TabsTrigger value="announcements"><Megaphone className="mr-2" /> Announcements</TabsTrigger>
                <TabsTrigger value="events"><Calendar className="mr-2" /> Events</TabsTrigger>
                <TabsTrigger value="hymns"><Music className="mr-2" /> Hymns</TabsTrigger>
                <TabsTrigger value="bible-verses"><BookOpen className="mr-2" /> Bible Verses</TabsTrigger>
                <TabsTrigger value="whats-next"><Forward className="mr-2" /> What's Next</TabsTrigger>
            </TabsList>
            <TabsContent value="welcome" className="mt-4">
                <WelcomeForm initialData={initialWelcomeMessage} />
            </TabsContent>
            <TabsContent value="announcements" className="mt-4">
                <AnnouncementsManager initialData={initialAnnouncements} />
            </TabsContent>
            <TabsContent value="events" className="mt-4">
                <EventsManager initialData={initialEvents} />
            </TabsContent>
            <TabsContent value="hymns" className="mt-4">
                <HymnsManager initialData={initialHymns} />
            </TabsContent>
            <TabsContent value="bible-verses" className="mt-4">
                <BibleVerseManager initialData={initialBibleVerses} />
            </TabsContent>
            <TabsContent value="whats-next" className="mt-4">
                <WhatsNextForm initialData={initialWhatsNext} />
            </TabsContent>
        </Tabs>
    );
}
