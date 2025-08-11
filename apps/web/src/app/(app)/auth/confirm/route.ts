import type { EmailOtpType } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import logger from '@/logger';
import { createClient } from '@/server/utils/supabase-server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next);
    }

    logger.error('OTP verification failed', {
      type,
      error: error?.message,
      tokenHash: token_hash,
    });
  } else {
    logger.error('Missing required parameters for OTP verification', {
      hasTokenHash: !!token_hash,
      hasType: !!type,
    });
  }

  //TODO: @JF redirect the user to an error page with some instructions
  redirect('/error');
}
