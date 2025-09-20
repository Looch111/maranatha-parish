'use client';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Announcement, Event, WelcomeMessage, Hymn, BibleVerse, WhatsNext } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useFirestore } from '@/hooks/use-firestore';

export default function AdminPage() {
    const welcomeMessage = useFirestore<WelcomeMessage>('content/welcome');
    const announcements = useFirestore<Announcement>('announcements', 'createdAt', 'desc');
    const events = useFirestore<Event>('events', 'date', 'asc');
    const hymns = useFirestore<Hymn>('hymns', 'title', 'asc');
    const bibleVerses = useFirestore<BibleVerse>('bible-verses', 'reference', 'asc');
    const whatsNext = useFirestore<WhatsNext>('content/whats-next');

    const loading = !welcomeMessage || !announcements || !events || !hymns || !bibleVerses || !whatsNext;

    // Default values for initialization
    const defaultWelcomeMessage: WelcomeMessage = { id: 'welcome', message: 'Welcome To Church', subtitle: 'We Are Glad To Have You Here' };
    const defaultWhatsNext: WhatsNext = { id: 'whats-next', message: 'Up next: Sermon by Pastor John' };

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
                    ) : (
                        <AdminDashboard
                            initialWelcomeMessage={welcomeMessage || defaultWelcomeMessage}
                            initialAnnouncements={announcements || []}
                            initialEvents={events || []}
                            initialHymns={hymns || []}
                            initialBibleVerses={bibleVerses || []}
                            initialWhatsNext={whatsNext || defaultWhatsNext}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
