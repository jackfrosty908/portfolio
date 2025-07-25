import Link from 'next/link';
import LogoutButton from '@/client/features/layout/components/atoms/logout-button/logout-button';
import { ModeToggle } from '@/features/layout/components/molecules/mode-toggle/mode-toggle';
import { createClient } from '@/server/utils/supabase-server';

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const links = [
    { to: '/', label: 'Home' },
    { to: '/login', label: 'Login' },
    { to: '/signup', label: 'Signup' },
    { to: '/forgot-password', label: 'Forgot Password' },
  ];

  const socialLinks = [
    {
      href: 'https://github.com/jackfrosty908',
      label: 'GitHub',
    },
    {
      href: 'https://www.linkedin.com/in/jack-foster-dev/',
      label: 'LinkedIn',
    },
  ];

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <Link href={to} key={to}>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground text-sm">
                Hello, {user.user_metadata.first_name}
              </p>
              <LogoutButton />
            </div>
          ) : null}

          {/* Social Links */}
          <div className="flex items-center gap-1">
            {socialLinks.map(({ href, label }) => (
              <Link
                className="rounded-md px-3 py-1 text-muted-foreground text-sm transition-colors hover:bg-accent hover:text-foreground"
                href={href}
                key={href}
                rel="noopener noreferrer"
                target="_blank"
              >
                {label}
              </Link>
            ))}
          </div>

          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  );
}
