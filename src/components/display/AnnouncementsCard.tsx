
import type { Announcement } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Megaphone } from 'lucide-react';

export function AnnouncementsCard({ data }: { data: Announcement[] }) {
    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <div className="flex items-center gap-4">
                    <Megaphone className="h-8 w-8 text-primary" />
                    <CardTitle className="text-3xl font-headline">Announcements</CardTitle>
                </div>
            </CardHeader>
            <CardContent>
                <ul className="space-y-6">
                    {data.map((ann) => (
                        <li key={ann.id}>
                            <h3 className="text-2xl font-bold text-primary">{ann.title}</h3>
                            <p className="text-lg mt-1 text-foreground/80">{ann.content}</p>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
