'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WelcomeForm } from '@/components/admin/WelcomeForm';
import { AnnouncementsManager } from '@/components/admin/AnnouncementsManager';
import { EventsManager } from '@/components/admin/EventsManager';
import type { Announcement, Event, WelcomeMessage } from '@/lib/types';
import { MessageSquare, Calendar, Megaphone } from 'lucide-react';

interface AdminDashboardProps {
    initialWelcomeMessage: WelcomeMessage;
    initialAnnouncements: Announcement[];
    initialEvents: Event[];
}

export function AdminDashboard({
    initialWelcomeMessage,
    initialAnnouncements,
    initialEvents
}: AdminDashboardProps) {

    return (
        <Tabs defaultValue="welcome" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
                <TabsTrigger value="welcome"><MessageSquare className="mr-2" /> Welcome Message</TabsTrigger>
                <TabsTrigger value="announcements"><Megaphone className="mr-2" /> Announcements</TabsTrigger>
                <TabsTrigger value="events"><Calendar className="mr-2" /> Events</TabsTrigger>
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
        </Tabs>
    );
}
