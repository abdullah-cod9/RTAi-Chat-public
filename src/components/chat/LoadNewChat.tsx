import React from "react";
import { NewChat } from "./NewChat";
import { userCache, userPlanCache } from "@/app/actions/caches/action";
import { Plan } from "@/app/actions/db/actions";
import { anonymous_plan } from "@/subscription";
type Props = { userId: string; is_anonymous: boolean };

export default async function LoadNewChat({ userId, is_anonymous }: Props) {
  const [userData, plan] = await Promise.all([
    userCache(userId),
    userPlanCache(userId),
  ]);
  const _plan: Plan = {
    expiresAt: plan.expiresAt,
    subscriptionId: plan.subscriptionId,
    subscriptionType: plan.subscriptionType,
    featuresPlan: is_anonymous ? anonymous_plan : plan.featuresPlan,
  };

  return (
    <NewChat plan={_plan} userData={userData} is_anonymous={is_anonymous} />
  );
}
