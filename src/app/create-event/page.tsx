'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { EventForm } from '@/components/event-form';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useUserSync } from '@/hooks/use-user-sync';

export default function CreateEventPage() {
  useUserSync(); // Automatically sync user with Supabase
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <SignedOut>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create Your Event</CardTitle>
            <CardDescription>
              To create and manage events, you need an account. Please sign in or create one to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground">Sign in to get started with creating events.</p>
            <SignInButton mode="modal">
              <Button size="lg" className="w-full">Sign In</Button>
            </SignInButton>
          </CardContent>
        </Card>
      </SignedOut>

      <SignedIn>
        <Card className="border">
          <CardHeader className="text-center">
            <CardTitle className="font-bold text-3xl">
              {isEditMode ? 'Edit Event' : 'Create a New Event'}
            </CardTitle>
            <CardDescription>
              {isEditMode ? 'Update your event details below.' : 'Fill out the form below to share your event with the community.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EventForm editId={editId} />
          </CardContent>
        </Card>
      </SignedIn>
    </div>
  );
}
