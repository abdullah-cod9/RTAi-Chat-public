import Checkout from "@/components/checkout/Checkout";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../actions/caches/action";

export const metadata: Metadata = {
  title: "Checkout",
};

export default async function Page() {
  const { user } = await getCurrentUser();
if (!user) {
  redirect('/auth/403')
}
 
  if (!user.email) {
    redirect("/login");
  }
  return <Checkout email={user.email} />;
}
