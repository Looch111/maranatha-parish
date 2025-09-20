
import type { Event } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function EventsCard({ data }: { data: Event[] }) {
    return (
        <div className="h-full w-full flex items-center justify-center p-8 bg-gradient-to-br from-sky-500 to-cyan-600">
            <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                     <div className="flex items-center gap-4">
                        <Calendar className="h-10 w-10 text-primary" />
                        <CardTitle className="text-5xl font-headline">Upcoming Events</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-6">
                        {data.map((event) => (
                            <li key={event.id} className="p-4 rounded-lg bg-white/50">
                                <h3 className="text-3xl font-bold text-primary">{event.name}</h3>
                                <div className="text-xl mt-2 text-foreground/80 grid grid-cols-2 gap-x-4">
                                    <p><strong>Date:</strong> {format(new Date(event.date), 'EEEE, MMMM do')}</p>
                                    <p><strong>Time:</strong> {event.time}</p>
                                    <p className="col-span-2"><strong>Location:</strong> {event.location}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
