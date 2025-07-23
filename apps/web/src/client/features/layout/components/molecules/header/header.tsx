import Link from "next/link";
import { Button } from "@/client/features/common/components/ui/button";
import { ModeToggle } from "@/features/layout/components/molecules/mode-toggle/mode-toggle";
import { createClient } from "@/server/utils/supabase-server";

export default async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const links = [
    { to: "/", label: "Home" },
    { to: "/login", label: "Login" },
    { to: "/signup", label: "Signup" },
    { to: "/forgot-password", label: "Forgot Password" },
  ];

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <Link key={to} href={to}>
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              Logout
            </Button>
          ) : null}
          <ModeToggle />
        </div>
      </div>
      <hr />
    </div>
  );
}
