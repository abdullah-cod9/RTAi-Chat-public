import React from "react";
import Chat from "@/components/chat/Chat";
import { getInitialMessage, IsChatValid, Plan } from "@/app/actions/db/actions";
import { redirect } from "next/navigation";
import {
  getCurrentUser,
  publicIdCache,
  userCache,
  userPlanCache,
} from "@/app/actions/caches/action";
import TurnstileValidation from "../captcha/TurnstileValidation";
import { anonymous_plan } from "@/subscription";
type Props = { chatId: string };

export default async function LoadChat({ chatId }: Props) {
 const { user, error } = await getCurrentUser();

  if (error || !user) {
    return <TurnstileValidation />;
  }
  const { id, is_anonymous } = user;

  if (is_anonymous === undefined) redirect("/error");

  const publicId = await publicIdCache(id);

  const [initialMessage, userData, plan, isChatValid] = await Promise.all([
    getInitialMessage(chatId),
    userCache(id),
    userPlanCache(id),
    IsChatValid(id, chatId, publicId),
  ]);

    const _plan: Plan = {
      expiresAt: plan.expiresAt,
      subscriptionId: plan.subscriptionId,
      subscriptionType: plan.subscriptionType,
      featuresPlan: is_anonymous ? anonymous_plan : plan.featuresPlan,
    };
  return (
    <Chat
      plan={_plan}
      chatId={chatId}
      userData={userData}
      initialMessage={initialMessage}
      isPublicChat={isChatValid}
      is_anonymous={is_anonymous}
    />
  );
}
