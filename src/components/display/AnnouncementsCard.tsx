
import type { Announcement } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

export function AnnouncementsCard({ data }: { data: Announcement[] }) {
    return (
        <div className="h-full w-full flex items-center justify-center p-8 bg-gradient-to-br from-indigo-500 to-purple-600">
            <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-2xl">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Megaphone className="h-10 w-10 text-primary" />
                        <CardTitle className="text-5xl font-headline">Announcements</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-6">
                        {data.map((ann) => (
                            <li key={ann.id}>
                                <h3 className="text-3xl font-bold text-primary">{ann.title}</h3>
                                <p className="text-xl mt-2 text-foreground/80">{ann.content}</p>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
