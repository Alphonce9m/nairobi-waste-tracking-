import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { UserNav } from '@/components/user-nav';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search, PlusCircle } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Nairobi Waste Marketplace',
  description: 'Buy and sell waste materials in Nairobi',
};

export default function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-background font-sans antialiased', inter.className)}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <header className="border-b">
              <div className="container flex h-16 items-center justify-between px-4">
                <Link href="/marketplace" className="flex items-center space-x-2">
                  <span className="text-xl font-bold">Nairobi Waste</span>
                </Link>
                
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/marketplace/create">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Listing
                    </Link>
                  </Button>
                  <UserNav />
                </div>
              </div>
            </header>
            
            <main className="flex-1">
              {children}
            </main>
            
            <footer className="border-t py-6">
              <div className="container px-4">
                <p className="text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} Nairobi Waste Marketplace. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
          
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
