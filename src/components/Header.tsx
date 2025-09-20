'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    // Set initial time
    setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    return () => clearInterval(timer);
  }, []);

  const isTvDisplay = usePathname() === '/';

  if (time === null) {
    return <div className={`text-xl font-semibold ${isTvDisplay ? 'text-white' : 'text-foreground'}`} style={{width: '80px'}}>&nbsp;</div>;
  }

  return (
    <div className={`text-xl font-semibold ${isTvDisplay ? 'text-white' : 'text-foreground'}`}>
      {time}
    </div>
  );
}


export function Header() {
  const pathname = usePathname();

  const isTvDisplay = pathname === '/';

  return (
    <header className={isTvDisplay ? 'absolute top-0 left-0 right-0 z-50' : 'bg-card border-b shadow-sm sticky top-0 z-50'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className={`flex items-center gap-2 text-2xl font-bold ${isTvDisplay ? 'text-white' : 'text-primary'}`}>
            <Image src="https://i.imgur.com/YryK4qj.png" alt="Maranatha Parish Logo" width={24} height={24} className="h-6 w-6" />
            <span className="font-headline text-3xl">Maranatha Parish</span>
          </Link>
           <nav className="flex items-center gap-4">
            <Clock />
            <Button asChild variant={pathname.startsWith('/admin') ? 'secondary' : 'ghost'} className={isTvDisplay ? 'text-white hover:bg-white/10 hover:text-white' : ''}>
              <Link href="/admin">Admin Panel</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
