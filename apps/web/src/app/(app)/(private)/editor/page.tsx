import { redirect } from 'next/navigation';

import { createClient } from '@/server/utils/supabase-server';

// TODO: @JF this is a temporary page that we will flesh out later
export default async function EditorPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }

  return <p>Hello {data.user.email}</p>;
}
