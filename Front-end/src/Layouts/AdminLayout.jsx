import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-gray-800 text-white">
        <nav>Admin Navigation</nav>
      </div>
      <main className="p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;