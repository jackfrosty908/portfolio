"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/client/features/common/components/ui/button";
import { createClient } from "@/client/utils/supabase-client";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const supabase = await createClient();
      const result = await supabase.auth.signOut();
      console.log(result);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Logging out..." : "Logout"}
    </Button>
  );
}
