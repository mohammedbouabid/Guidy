import { Outlet } from "react-router-dom";

const ClientLayout = () => (
  <div className="min-h-screen bg-blue-100">
    <div className="bg-blue-500">Navbar Client</div>
    <Outlet />
  </div>
);

export default ClientLayout;