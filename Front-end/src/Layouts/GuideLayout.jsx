import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";


const GuideLayout = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex items-center gap-2 border-b px-4 h-12">
          <SidebarTrigger />
        </div>
        <div className="p-4 w-full flex-1">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default GuideLayout;