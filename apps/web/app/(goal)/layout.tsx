import type { Metadata } from "next";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "@/components/sidebar/app-sidebar";

export const metadata: Metadata = {
  title: "Goal - Reverse Roadmap",
  description: "Manage your goals and roadmap",
};

export default function GoalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="h-screen flex-row">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}