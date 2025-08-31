'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CircleDot, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const { user, signOutUser, loading } = useAuth();

  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background border-b sticky top-0 z-50">
      <Link href="/" className="flex items-center justify-start gap-2">
        <CircleDot className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">Rond-point Express</span>
      </Link>

      <nav className="hidden lg:flex flex-1 justify-center items-center gap-8">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Events
        </Link>
        <Link
          href="/search"
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          Search
        </Link>
      </nav>

      <div className="flex items-center gap-4 ml-auto">
        {loading ? null : user ? (
          <>
            {user.role === 'admin' && (
              <Button variant="ghost" asChild size="sm">
                <Link href="/admin" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              </Button>
            )}
            <Button variant="ghost" asChild>
              <Link href="/profile">Dashboard</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/create-event">Create Event</Link>
            </Button>
            <Button onClick={signOutUser} variant="outline">Sign Out</Button>
          </>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link href="/profile">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/profile">Join Now</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
