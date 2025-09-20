'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

function Clock() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const updateClock = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const isTvDisplay = usePathname() === '/';

  if (time === null) {
    return <div className={`text-3xl font-semibold ${isTvDisplay ? 'text-white' : 'text-foreground'}`} style={{width: '120px'}}>&nbsp;</div>;
  }

  return (
    <div className={`text-3xl font-semibold ${isTvDisplay ? 'text-white' : 'text-foreground'}`}>
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
        <div className="flex items-center justify-between h-24">
          <Link href="/" className={`flex items-center gap-3 text-2xl font-bold ${isTvDisplay ? 'text-white' : 'text-primary'}`}>
            <Image src="https://i.imgur.com/YryK4qj.png" alt="Maranatha Parish Logo" width={40} height={40} className="h-10 w-10" />
            <span className="font-headline text-5xl">Maranatha Parish</span>
          </Link>
           <nav className="flex items-center gap-4">
            <Clock />
             {pathname !== '/' && (
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
