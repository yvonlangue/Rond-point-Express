import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CircleDot, UserCircle } from 'lucide-react';

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background border-b sticky top-0 z-50">
      <Link href="/" className="flex items-center justify-center gap-2">
        <CircleDot className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">Rond-point Express</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Button variant="link" asChild>
          <Link href="/profile" className="flex items-center gap-2 text-sm font-medium">
            <UserCircle className="h-5 w-5" />
            Profile
          </Link>
        </Button>
        <Button asChild>
          <Link href="/create-event">Create Event</Link>
        </Button>
      </nav>
    </header>
  );
}
