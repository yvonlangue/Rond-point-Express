import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rond-point Express',
  description: 'Discover and share local events.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className="antialiased">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 bg-background">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
