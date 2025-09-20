
'use client';
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/Header';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const metadata: Metadata = {
  title: 'ParishView',
  description: 'Manage and display church activities in real-time.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isTvDisplay, setIsTvDisplay] = useState(false);
  
  useEffect(() => {
    setIsTvDisplay(pathname === '/');
  }, [pathname]);

  return (
    <html lang="en" className="h-full">
      <head>
        <title>{metadata.title as string}</title>
        <meta name="description" content={metadata.description as string} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background">
        <div className={!isTvDisplay ? "flex flex-col min-h-screen" : ""}>
          <Header />
          <main className={!isTvDisplay ? "flex-1" : ""}>
            {isTvDisplay ? children : (
              <div className="container mx-auto py-8 px-4">
                {children}
              </div>
            )}
          </main>
          <Toaster />
        </div>
      </body>
    </html>
  );
}
