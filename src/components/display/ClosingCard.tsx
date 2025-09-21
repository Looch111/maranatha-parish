
import type { ClosingMessage } from '@/lib/types';
import { LogOut } from 'lucide-react';

export function ClosingCard({ data }: { data: ClosingMessage }) {
    if (!data) {
        return null;
    }

    return (
        <div className="w-full max-w-4xl bg-black/30 backdrop-blur-sm rounded-2xl p-12 border border-white/20 shadow-2xl text-center">
            <div className="flex items-center gap-4 justify-center mb-6">
                <LogOut className="h-12 w-12 text-white" />
                <h1 className="text-5xl font-headline text-white drop-shadow-lg">Thank You for Joining Us</h1>
            </div>
            <p className="text-6xl font-bold text-amber-400 drop-shadow-md">{data.message}</p>
        </div>
    );
}
