
import type { WhatsNext } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Forward } from 'lucide-react';

export function WhatsNextCard({ data }: { data: WhatsNext }) {
    return (
        <Card className="w-full shadow-lg text-center">
            <CardHeader>
                <div className="flex items-center gap-4 justify-center">
                    <Forward className="h-8 w-8 text-primary" />
                    <CardTitle className="text-3xl font-headline">What's Next?</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-8">
                <p className="text-4xl font-bold text-primary">{data.message}</p>
            </CardContent>
        </Card>
    );
}
