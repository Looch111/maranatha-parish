
import type { Announcement } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

export function AnnouncementsCard({ data }: { data: Announcement[] }) {
    return (
        <div className="w-full max-w-4xl bg-black/30 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
                <Megaphone className="h-12 w-12 text-white" />
                <h1 className="text-5xl font-headline text-white drop-shadow-lg">Announcements</h1>
            </div>
            <ul className="space-y-8">
                {data.map((ann) => (
                    <li key={ann.id} className="border-l-4 border-amber-400 pl-6">
                        <h3 className="text-4xl font-bold text-white">{ann.title}</h3>
                        <p className="text-2xl mt-2 text-white/80 leading-relaxed">{ann.content}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
