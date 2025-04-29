import React from "react";
import { Content } from "./SidebarContent";
import { redirect } from "next/navigation";
import {
  getCurrentUser,
  publicIdCache,
  userCache,
  userPlanCache,
} from "@/app/actions/caches/action";
import { Plan } from "@/app/actions/db/actions";
import { anonymous_plan } from "@/subscription";

export default async function LoadContent() {
  const { user, error } = await getCurrentUser();

  if (error || !user) {
    return;
  }
  const { id, is_anonymous } = user;
  if (is_anonymous === undefined) redirect("/error");

  const [userData, plan, publicId] = await Promise.all([
    userCache(id),
    userPlanCache(id),
    publicIdCache(id),
  ]);

  const _plan: Plan = {
    expiresAt: plan.expiresAt,
    subscriptionId: plan.subscriptionId,
    subscriptionType: plan.subscriptionType,
    featuresPlan: is_anonymous ? anonymous_plan : plan.featuresPlan,
  };
  return (
    <Content
      plan={_plan}
      publicId={publicId}
      userData={userData}
      is_anonymous={is_anonymous}
    />
  );
}
