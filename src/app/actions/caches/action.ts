import { createClient } from "@/lib/supabase/server";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import "server-only";
import { getPublicId, getUser, getUserPlan } from "../db/actions";

export const preload = () => {
  void getCurrentUser();
};

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  return { user: data.user, error };
});

export const userCache = (userId: string) =>
  unstable_cache(() => getUser(userId), [`getUser-${userId}`], {
    revalidate: 3600,
    tags: [`getUser-${userId}`],
  })();
export const userPlanCache = (userId: string) =>
  unstable_cache(async () => getUserPlan(userId), [`getUserPlan-${userId}`], {
    revalidate: 3600,
    tags: [`getUserPlan-${userId}`],
  })();

export const publicIdCache = (userId: string) =>
  unstable_cache(async () => getPublicId(userId), [`getPublicId-${userId}`], {
    revalidate: 3600,
    tags: [`getPublicId-${userId}`],
  })();
