import { Outlet } from "react-router-dom";

const GuideLayout = () => (
  <div className="min-h-screen ">
    <div className="bg-blue-400">Navbar Guide</div>
    <Outlet />
  </div>
);

export default GuideLayout;