import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import type { Announcement, Event, WelcomeMessage } from '@/lib/types';

async function getData() {
  const welcomeSnap = await getDoc(doc(db, 'content', 'welcome'));
  
  const announcementsQuery = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
  const announcementsSnap = await getDocs(announcementsQuery);
  
  const eventsQuery = query(collection(db, 'events'), orderBy('date', 'asc'));
  const eventsSnap = await getDocs(eventsQuery);

  const welcomeMessage = welcomeSnap.exists() ? { id: welcomeSnap.id, ...welcomeSnap.data() } as WelcomeMessage : { id: 'welcome', message: 'Welcome to our Parish!' };
  const announcements = announcementsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Announcement[];
  const events = eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Event[];
  
  return { welcomeMessage, announcements, events };
}

export default async function AdminPage() {
  const { welcomeMessage, announcements, events } = await getData();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Admin Panel</CardTitle>
          <CardDescription>Manage your church's display content here.</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminDashboard
            initialWelcomeMessage={welcomeMessage}
            initialAnnouncements={announcements}
            initialEvents={events}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export const dynamic = 'force-dynamic';
