import { Lock } from 'lucide-react';
import Link from 'next/link';
import type { JSX } from 'react';
import { Button } from '@/client/features/common/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/client/features/common/components/ui/card';
import LogoutButton from '@/client/features/layout/components/atoms/logout-button/logout-button';
import { createClient } from '@/server/utils/supabase-server';

const Forbidden = async (): Promise<JSX.Element> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-muted/40 px-4">
      <Card className="w-full max-w-md border-muted-foreground/20 shadow-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Lock aria-hidden="true" className="h-7 w-7" />
            <span className="sr-only">Access denied</span>
          </div>
          <CardTitle className="text-2xl">403 — Forbidden</CardTitle>
          <CardDescription>
            {user
              ? "You're signed in but don't have permission to access this page."
              : 'You are not authorized to access this page.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center text-muted-foreground text-sm">
          {user
            ? 'You can return to the homepage or sign out and try a different account.'
            : 'If you believe this is a mistake, try signing in or return to the homepage.'}
        </CardContent>

        <CardFooter className="flex justify-center gap-2">
          <Button asChild variant="secondary">
            <Link href="/">Back to Home</Link>
          </Button>
          {user ? (
            <LogoutButton />
          ) : (
            <Button asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  );
};

export default Forbidden;
