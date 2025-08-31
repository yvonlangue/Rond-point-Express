import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CircleDot, Calendar } from 'lucide-react';

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-background border-b sticky top-0 z-50">
      <Link href="/" className="flex items-center justify-start gap-2">
        <CircleDot className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">Rond-point Express</span>
      </Link>
      
      <nav className="hidden lg:flex flex-1 justify-center items-center gap-8">
        <Link href="/" className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg text-foreground">
          <Calendar className="h-5 w-5" />
          Discover
        </Link>
      </nav>

      <div className="flex items-center gap-4 ml-auto">
        <Button variant="ghost" asChild>
          <Link href="/profile">Sign In</Link>
        </Button>
        <Button asChild>
          <Link href="/create-event">Join Now</Link>
        </Button>
      </div>
    </header>
  );
}
