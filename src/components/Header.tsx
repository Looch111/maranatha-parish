'use client';
import Link from 'next/link';
import { Church } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-card border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <Church className="h-6 w-6" />
            <span className="font-headline">Maranatha Parish</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Button asChild variant={pathname === '/' ? 'secondary' : 'ghost'}>
              <Link href="/">TV Display</Link>
            </Button>
            <Button asChild variant={pathname.startsWith('/admin') ? 'secondary' : 'ghost'}>
              <Link href="/admin">Admin Panel</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
