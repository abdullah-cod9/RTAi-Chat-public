import { ChatSidebar } from "@/components/chat/sidebar/Sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <ChatSidebar />
      <SidebarInset className="z-10">
        <SidebarTrigger className="absolute left-3 top-3 z-10" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
