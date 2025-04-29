import { Sidebar } from "@/components/ui/sidebar";
import LoadContent from "./LoadContent";
import { Suspense } from "react";
import { SkeletonLoadPage } from "@/components/SkeletonLoad";

export function ChatSidebar() {
  return (
    <Sidebar>
      <Suspense fallback={<SkeletonLoadPage/>}>
        <LoadContent />
      </Suspense>
    </Sidebar>
  );
}
