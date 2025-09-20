
import type { WhatsNext } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Forward } from 'lucide-react';

export function WhatsNextCard({ data }: { data: WhatsNext }) {
    return (
        <div className="h-full w-full flex items-center justify-center p-8 bg-gradient-to-br from-rose-500 to-pink-600">
            <Card className="w-full max-w-4xl bg-white/90 backdrop-blur-sm shadow-2xl text-center">
                <CardHeader>
                    <div className="flex items-center gap-4 justify-center">
                        <Forward className="h-10 w-10 text-primary" />
                        <CardTitle className="text-5xl font-headline">What's Next?</CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-6xl font-bold text-primary">{data.message}</p>
                </CardContent>
            </Card>
        </div>
    );
}
