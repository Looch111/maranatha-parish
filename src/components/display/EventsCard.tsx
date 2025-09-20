
import type { Event } from '@/lib/types';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function EventsCard({ data }: { data: Event[] }) {
    return (
        <div className="w-full max-w-4xl bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
                <Calendar className="h-12 w-12 text-white" />
                <h1 className="text-5xl font-headline text-white drop-shadow-lg">Upcoming Events</h1>
            </div>
            <ul className="space-y-6">
                {data.map((event) => (
                    <li key={event.id} className="p-6 rounded-lg bg-black/20 border border-white/10">
                        <h3 className="text-3xl font-bold text-amber-400">{event.name}</h3>
                        <div className="text-xl text-white/90 mt-3 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                            <p><strong>Date:</strong> {format(new Date(event.date), 'EEE, MMM d, yyyy')}</p>
                            <p><strong>Time:</strong> {event.time}</p>
                            <p className="md:col-span-2"><strong>Location:</strong> {event.location}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
