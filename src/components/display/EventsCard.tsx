
import type { Event } from '@/lib/types';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function EventsCard({ data }: { data: Event[] }) {
    return (
        <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-sky-500 to-cyan-600 text-white">
            <div className="w-full max-w-4xl">
                 <div className="flex items-center gap-4 mb-8">
                    <Calendar className="h-16 w-16" />
                    <h1 className="text-7xl font-headline drop-shadow-md">Upcoming Events</h1>
                </div>
                <ul className="space-y-6">
                    {data.map((event) => (
                        <li key={event.id} className="p-6 rounded-lg bg-black/20 backdrop-blur-md border border-white/20">
                            <h3 className="text-4xl font-bold">{event.name}</h3>
                            <div className="text-2xl mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                                <p><strong>Date:</strong> {format(new Date(event.date), 'EEEE, MMMM do')}</p>
                                <p><strong>Time:</strong> {event.time}</p>
                                <p className="md:col-span-2"><strong>Location:</strong> {event.location}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
