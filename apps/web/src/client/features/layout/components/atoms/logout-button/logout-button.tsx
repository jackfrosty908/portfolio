'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/client/features/common/components/ui/button';
import { createClient } from '@/client/utils/supabase-client';
import logger from '@/logger';

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const supabase = await createClient();
      const result = await supabase.auth.signOut();
      logger.info('Logout successful:', result);
      router.push('/');
      router.refresh();
    } catch (error) {
      logger.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button disabled={isLoading} onClick={handleLogout} variant="outline">
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  );
}
