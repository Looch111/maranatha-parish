'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  const isTvDisplay = pathname === '/';

  return (
    <header className={isTvDisplay ? 'absolute top-0 left-0 right-0 z-50' : 'bg-card border-b shadow-sm sticky top-0 z-50'}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className={`flex items-center gap-2 text-xl font-bold ${isTvDisplay ? 'text-white' : 'text-primary'}`}>
            <Image src="https://i.imgur.com/YryK4qj.png" alt="Maranatha Parish Logo" width={24} height={24} className="h-6 w-6" />
            <span className="font-headline">Maranatha Parish</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant={pathname === '/' ? 'ghost' : (pathname.startsWith('/admin') ? 'ghost' : 'secondary')} className={isTvDisplay ? 'text-white hover:bg-white/10 hover:text-white' : ''}>
              <Link href="/">TV Display</Link>
            </Button>
            <Button asChild variant={pathname.startsWith('/admin') ? 'secondary' : 'ghost'} className={isTvDisplay ? 'text-white hover:bg-white/10 hover:text-white' : ''}>
              <Link href="/admin">Admin Panel</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
