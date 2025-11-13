import { Outlet } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const ClientLayout = () => {
  useScrollToTop();
  
  return (
    <div className="min-h-screen bg-blue-100">
      <ScrollToTop />
      <div className="bg-blue-500">Navbar Client</div>
      <Outlet />
    </div>
  );
};

export default ClientLayout;