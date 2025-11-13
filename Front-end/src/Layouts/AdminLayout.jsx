import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sideBar/app-sidebar";
import ScrollToTop from "@/components/ScrollToTop";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const AdminLayout = () => {
  useScrollToTop();
  
  return (
    <SidebarProvider>
      <ScrollToTop />
      <AppSidebar />
      <main className="w-full flex-1 overflow-auto">
        <SidebarTrigger className="fixed"/>
        <Outlet />
      </main>
    </SidebarProvider>
  );
};

export default AdminLayout;