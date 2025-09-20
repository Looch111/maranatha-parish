
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

function Clock() {
  const [date, setDate] = useState<Date | null>(null);

  useEffect(() => {
    // This code now runs only on the client, after the component has mounted.
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);
    setDate(new Date()); // Set initial time
    return () => clearInterval(timer);
  }, []); // Empty dependency array ensures this effect runs once on mount

  if (!date) {
    // Render a placeholder or nothing on the server and initial client render
    return <div className="text-right text-primary-foreground" style={{width: '250px'}}>&nbsp;</div>;
  }
  
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateString = date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="text-right text-primary-foreground">
      <div className="text-2xl font-semibold">{time}</div>
      <div className="text-sm">{dateString}</div>
    </div>
  );
}


export function Header() {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <header className={'bg-primary text-primary-foreground shadow-lg sticky top-0 z-50'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 text-2xl font-bold text-primary-foreground">
            <Image src="https://i.imgur.com/YryK4qj.png" alt="Maranatha Parish Logo" width={40} height={40} className="h-10 w-10 bg-white rounded-full p-1" />
            <span className="font-headline text-4xl">Maranatha Parish</span>
          </Link>
           <nav className="flex items-center gap-4">
            <Clock />
             {isClient && (
              <Button asChild variant={pathname.startsWith('/admin') ? 'secondary' : 'ghost'}>
                <Link href="/admin">Admin Panel</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
