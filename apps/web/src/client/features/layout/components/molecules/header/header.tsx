"use client";
import Link from "next/link";
import { Button } from "@/client/components/ui/button";
import { createClient } from "@/client/utils/supabase-client";
import { ModeToggle } from "@/features/layout/components/molecules/mode-toggle/mode-toggle";

export default async function Header() {
  const supabase = createClient();

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
