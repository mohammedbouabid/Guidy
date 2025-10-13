import { Outlet } from "react-router-dom";

const GuideLayout = () => (
  <div className="min-h-screen bg-green-100">
    <div className="bg-green-500">Navbar Guide</div>
    <Outlet />
  </div>
);

export default GuideLayout;