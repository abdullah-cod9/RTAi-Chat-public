"use client";

import TurnstileValidation from "@/components/captcha/TurnstileValidation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function validation() {
      const { data } = await supabase.auth.getUser();
      if (data && (data.user?.is_anonymous || data.user?.email)) {
        setUser(null);
      }
    }
    validation();
  }, [supabase.auth, user]);

  if (!user) {
    return <TurnstileValidation />;
  }
  return <ThemeContext.Provider value={user}>{children}</ThemeContext.Provider>;
}
