'use client';
import { useState, useEffect } from 'react';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query, onSnapshot } from 'firebase/firestore';
import type { Announcement, Event, WelcomeMessage } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
    const [welcomeMessage, setWelcomeMessage] = useState<WelcomeMessage | null>(null);
    const [announcements, setAnnouncements] = useState<Announcement[] | null>(null);
    const [events, setEvents] = useState<Event[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const welcomeUnsub = onSnapshot(doc(db, 'content', 'welcome'), (doc) => {
            setWelcomeMessage(doc.exists() ? { id: doc.id, ...doc.data() } as WelcomeMessage : { id: 'welcome', message: 'Welcome to our Parish!' });
        });

        const announcementsQuery = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
        const announcementsUnsub = onSnapshot(announcementsQuery, (snapshot) => {
            setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Announcement[]);
        });

        const eventsQuery = query(collection(db, 'events'), orderBy('date', 'asc'));
        const eventsUnsub = onSnapshot(eventsQuery, (snapshot) => {
            setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[]);
        });
        
        // This is a simple way to wait for all initial data, you might want a more robust solution for production
        Promise.all([
            getDoc(doc(db, 'content', 'welcome')),
            getDocs(announcementsQuery),
            getDocs(eventsQuery)
        ]).then(() => {
            setLoading(false);
        });


        return () => {
            welcomeUnsub();
            announcementsUnsub();
            eventsUnsub();
        };
    }, []);

    return (
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-3xl">Admin Panel</CardTitle>
                    <CardDescription>Manage your church's display content here.</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading || !welcomeMessage || !announcements || !events ? (
                        <div className="space-y-6">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-64 w-full" />
                        </div>
                    ) : (
                        <AdminDashboard
                            initialWelcomeMessage={welcomeMessage}
                            initialAnnouncements={announcements}
                            initialEvents={events}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}