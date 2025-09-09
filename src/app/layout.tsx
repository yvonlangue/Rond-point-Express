import type { Metadata } from 'next';
import { Poppins, PT_Sans } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { UserSyncProvider } from '@/components/user-sync-provider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

export const metadata: Metadata = {
  title: 'Rond-point Express',
  description: 'Discover and share local events.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning className={`${poppins.variable} ${ptSans.variable}`}>
        <head>
        </head>
        <body className="antialiased">
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 bg-background">
              <UserSyncProvider>
                {children}
              </UserSyncProvider>
            </main>
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
