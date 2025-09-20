'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

function Clock() {
  const [date, setDate] = useState<Date | null>(null);
  const pathname = usePathname();
  const [isTvDisplay, setIsTvDisplay] = useState(false);

  useEffect(() => {
    setIsTvDisplay(pathname === '/');
  }, [pathname]);


  useEffect(() => {
    const updateClock = () => {
      setDate(new Date());
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  
  const time = date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null;
  const dateString = date ? date.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : null;

  if (date === null) {
    return <div className={`text-right ${isTvDisplay ? 'text-white' : 'text-foreground'}`} style={{width: '250px'}}>&nbsp;</div>;
  }

  return (
    <div className={`text-right ${isTvDisplay ? 'text-white' : 'text-foreground'}`}>
      <div className="text-2xl font-semibold">{time}</div>
      <div className="text-sm">{dateString}</div>
    </div>
  );
}


export function Header() {
  const pathname = usePathname();
  const [isTvDisplay, setIsTvDisplay] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsTvDisplay(pathname === '/');
  }, [pathname]);

  if (isTvDisplay && isClient) {
    return null;
  }

  return (
    <header className={'bg-card border-b shadow-sm sticky top-0 z-50'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className={`flex items-center gap-3 text-2xl font-bold text-primary`}>
            <Image src="https://i.imgur.com/YryK4qj.png" alt="Maranatha Parish Logo" width={40} height={40} className="h-10 w-10" />
            <span className="font-headline text-4xl">Maranatha Parish</span>
          </Link>
           <nav className="flex items-center gap-4">
            <Clock />
             {isClient && pathname !== '/' && (
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
