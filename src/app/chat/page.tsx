import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import LoadNewChat from "@/components/chat/LoadNewChat";
import { SkeletonLoadPage } from "@/components/SkeletonLoad";
import { getCurrentUser } from "../actions/caches/action";
import TurnstileValidation from "@/components/captcha/TurnstileValidation";

export default async function ChatPage() {
  const { user, error } = await getCurrentUser();

  if (error || !user) {
    return <TurnstileValidation />;
  }
  const { id, is_anonymous } = user;
  if (is_anonymous === undefined) redirect("/error");
  return (
    <Suspense fallback={<SkeletonLoadPage />}>
      <LoadNewChat userId={id} is_anonymous={is_anonymous} />
    </Suspense>
  );
}
