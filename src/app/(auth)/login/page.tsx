import { Login } from "@/components/auth/Login";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function SignupPage() {
   const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data && data.user?.email) {
      redirect("/chat");
    }
  return <Login />;
}
