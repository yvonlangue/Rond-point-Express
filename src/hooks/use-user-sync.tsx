'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { usersApi } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export function useUserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;

    const syncUser = async () => {
      try {
        console.log('Syncing user:', user.id);
        
        // Check if user exists in Supabase
        const response = await usersApi.getProfile(user.id);
        
        if (response.error) {
          console.log('User not found in Supabase, creating user...');
          // Try to create user directly with Supabase (without RLS for now)
          try {
            const { data: userData, error: createError } = await supabase
              .from('users')
              .insert([{
                clerk_id: user.id,
                name: user.firstName || user.emailAddresses[0]?.emailAddress || 'User',
                email: user.emailAddresses[0]?.emailAddress || '',
                role: user.publicMetadata?.role || 'organizer',
                is_premium: false,
                event_count: 0,
              }])
              .select()
              .single();

            if (createError) {
              console.error('Failed to create user:', createError);
              console.error('Error details:', JSON.stringify(createError, null, 2));
            } else {
              console.log('User created successfully:', userData);
            }
          } catch (createErr) {
            console.error('Error creating user:', createErr);
          }
        } else {
          console.log('User already exists in Supabase:', response.data);
        }
      } catch (error) {
        console.error('Error syncing user:', error);
      }
    };

    syncUser();
  }, [user, isLoaded]);
}
