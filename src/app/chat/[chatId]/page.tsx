import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { validate as isUUID } from "uuid";
import LoadChat from "@/components/chat/LoadChat";
import { SkeletonLoadPage } from "@/components/SkeletonLoad";

type Params = Promise<{ chatId: string }>;
export default async function Page({ params }: { params: Params }) {
  const  chatId  = await params

 
 

  if (!isUUID(chatId.chatId)) {
    redirect("/chat");
  }
  return (
    <Suspense fallback={<SkeletonLoadPage />}>
      <LoadChat chatId={chatId.chatId} />
    </Suspense>
  );
}
