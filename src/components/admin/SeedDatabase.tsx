'use client';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { seedDatabaseAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Loader2, AlertCircle, Database } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function SeedDatabase() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const handleSeed = () => {
        startTransition(async () => {
            setError(null);
            const result = await seedDatabaseAction();
            if (result.type === 'success') {
                toast({
                    title: 'Database Seeded!',
                    description: 'Your application is now ready with sample data.',
                });
            } else {
                setError(result.message || 'An unknown error occurred.');
            }
        });
    };

    return (
        <Card className="max-w-xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Database /> Initialize Your Application</CardTitle>
                <CardDescription>
                    It looks like your database is empty. Click the button below to add sample content and get started. This will create all the necessary collections and documents for you.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Seeding Failed</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Button onClick={handleSeed} disabled={isPending} className="w-full">
                    {isPending ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Seeding...</>
                    ) : (
                        'Seed Database'
                    )}
                </Button>
            </CardContent>
        </Card>
    );
}
