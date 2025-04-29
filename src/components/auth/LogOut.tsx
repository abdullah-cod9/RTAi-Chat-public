import React from "react";
import { Button } from "../ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { revalidate } from "@/app/actions/other/action";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

export default function LogOut() {
  const router = useRouter();
  const supabase = createClient();
  const queryClient = useQueryClient();
  const t = useTranslations("Chat.settings.general.LogOut");
  const handleClick = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return toast.error("Logout error");
    }
    await Promise.all([revalidate(), queryClient.removeQueries()]);
    localStorage.clear();
    sessionStorage.clear();

    router.refresh();
  };

  return (
    <Button variant="outline" onClick={handleClick}>
      <span>{t("title")}</span>
    </Button>
  );
}
