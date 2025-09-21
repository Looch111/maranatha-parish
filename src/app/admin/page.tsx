
'use client';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Announcement, Event, WelcomeMessage, Hymn, BibleVerse, WhatsNext, ClosingMessage } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore } from '@/hooks/use-firestore';
import { SeedDatabase } from '@/components/admin/SeedDatabase';
import { useState, useEffect } from 'react';

export default function AdminPage() {
    const [loading, setLoading] = useState(true);
    const welcomeMessage = useFirestore<WelcomeMessage>('content/welcome');
    const announcements = useFirestore<Announcement>('announcements', 'createdAt', 'desc');
    const events = useFirestore<Event>('events', 'date', 'asc');
    const hymns = useFirestore<Hymn>('hymns', 'title', 'asc');
    const bibleVerses = useFirestore<BibleVerse>('bible-verses', 'reference', 'asc');
    const whatsNext = useFirestore<WhatsNext>('content/whats-next');
    const closingMessage = useFirestore<ClosingMessage>('content/closing');

    // Check if any of the data is still loading (i.e., is undefined)
    const dataSources = [welcomeMessage, announcements, events, hymns, bibleVerses, whatsNext, closingMessage];
    useEffect(() => {
        // We are done loading once all sources are no longer undefined
        const allLoaded = dataSources.every(source => source !== undefined);
        if (allLoaded) {
            setLoading(false);
        }
    }, dataSources);
    
    // Check if essential content is empty after loading.
    const isDataEmpty = !loading && (announcements === null || announcements.length === 0) && (events === null || events.length === 0) && (hymns === null || hymns.length === 0);

    // Default values for initialization, used as fallbacks.
    const defaultWelcomeMessage: WelcomeMessage = { id: 'welcome', message: 'Welcome To Church', subtitle: 'We Are Glad To Have You Here' };
    const defaultWhatsNext: WhatsNext = { id: 'whats-next', message: 'Up next: Sermon by Pastor John' };
    const defaultClosingMessage: ClosingMessage = { id: 'closing', message: 'Service has ended. God bless!' };


    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Admin Panel</CardTitle>
                    <CardDescription>Manage your church's display content here.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-6">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                    ) : isDataEmpty ? (
                         <SeedDatabase />
                    ) : (
                        <AdminDashboard
                            welcomeMessage={welcomeMessage || defaultWelcomeMessage}
                            announcements={announcements || []}
                            events={events || []}
                            hymns={hymns || []}
                            bibleVerses={bibleVerses || []}
                            whatsNext={whatsNext || defaultWhatsNext}
                            closingMessage={closingMessage || defaultClosingMessage}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
