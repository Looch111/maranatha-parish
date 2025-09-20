
import type { Event } from '@/lib/types';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function EventsCard({ data }: { data: Event[] }) {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                 <div className="flex items-center gap-4">
                    <Calendar className="h-8 w-8 text-primary" />
                    <CardTitle className="text-3xl font-headline">Upcoming Events</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {data.map((event) => (
                        <li key={event.id} className="p-4 rounded-lg bg-secondary/50 border">
                            <h3 className="text-xl font-bold text-primary">{event.name}</h3>
                            <div className="text-base mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                                <p><strong>Date:</strong> {format(new Date(event.date), 'EEE, MMM d, yyyy')}</p>
                                <p><strong>Time:</strong> {event.time}</p>
                                <p className="md:col-span-2"><strong>Location:</strong> {event.location}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
