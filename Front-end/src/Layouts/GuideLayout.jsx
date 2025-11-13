import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sideBar/app-sidebar";
import ScrollToTop from "@/components/ScrollToTop";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const GuideLayout = () => {
  useScrollToTop();
  
  return (
    <SidebarProvider>
      <ScrollToTop />
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        <div className="flex items-center gap-2 border-b px-4 h-12">
          <SidebarTrigger  />
        </div>
        <div className="p-4 w-full max-w-full flex-1 overflow-x-hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default GuideLayout;