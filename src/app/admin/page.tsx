'use client';
import { useState, useEffect } from 'react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Announcement, Event, WelcomeMessage, Hymn, BibleVerse, WhatsNext } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

// Mock Data since Firebase is disconnected
const mockWelcomeMessage: WelcomeMessage = { id: 'welcome', message: 'Welcome To Church', subtitle: 'We Are Glad To Have You Here' };
const mockAnnouncements: Announcement[] = [
    { id: '1', title: 'Sunday Service', content: 'Join us for our weekly Sunday service at 10:00 AM.', createdAt: new Date().toISOString() as any },
    { id: '2', title: 'Bake Sale', content: 'Support our youth group by buying some delicious baked goods after the service.', createdAt: new Date().toISOString() as any },
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
    { id: '1', reference: 'John 3:16', text: 'For God so loved the world, that he gave his only Son...' },
];
const mockWhatsNext: WhatsNext = { id: 'whats-next', message: 'Up next: Sermon by Pastor John' };


export default function AdminPage() {
    const [welcomeMessage, setWelcomeMessage] = useState<WelcomeMessage | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
    const [events, setEvents] = useState<Event[] | null>(null);
    const [hymns, setHymns] = useState<Hymn[] | null>(null);
    const [bibleVerses, setBibleVerses] = useState<BibleVerse[] | null>(null);
    const [whatsNext, setWhatsNext] = useState<WhatsNext | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data
        const timer = setTimeout(() => {
            setWelcomeMessage(mockWelcomeMessage);
            setAnnouncements(mockAnnouncements);
            setEvents(mockEvents);
            setHymns(mockHymns);
            setBibleVerses(mockBibleVerses);
            setWhatsNext(mockWhatsNext);
            setLoading(false);
        }, 1000); // Simulate network delay

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Admin Panel</CardTitle>
                    <CardDescription>Manage your church's display content here.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading || !welcomeMessage || !announcements || !events || !hymns || !bibleVerses || !whatsNext ? (
                        <div className="space-y-6">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                    ) : (
                        <AdminDashboard
                            initialWelcomeMessage={welcomeMessage}
                            initialAnnouncements={announcements}
                            initialEvents={events}
                            initialHymns={hymns}
                            initialBibleVerses={bibleVerses}
                            initialWhatsNext={whatsNext}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
