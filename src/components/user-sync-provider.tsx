'use client';

import { useUserSync } from '@/hooks/use-user-sync';

export function UserSyncProvider({ children }: { children: React.ReactNode }) {
  useUserSync();
  return <>{children}</>;
}
