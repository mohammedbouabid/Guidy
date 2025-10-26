import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "../Layouts/GuestLayout";
import ClientLayout from "../Layouts/ClientLayout";
import GuideLayout from "../Layouts/GuideLayout";
import AdminLayout from "../Layouts/AdminLayout";
import ProtectedRoutes from "./ProtectedRoutes";
import NotFoundPage from "../pages/NotFoundPage";
import LandingPage from "../pages/Home/LandingPage";
//import TestRoute from "../pages/testRoute";
import AllPacks from "../pages/Home/AllPacks";
import PacksGuid from "../pages/Guide/PacksGuid";
import AllGuides from "../pages/admin/AllGuides";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import AllClients from "@/pages/admin/AllClients";

const router = createBrowserRouter([
  {
    // Routes publiques
    element: <GuestLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      //{ path: "/test", element: <TestRoute /> },
      // { path: "/login", element: <LoginPage /> },
      // { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    // Routes Client
    path: "/client",
    element: (
      <ProtectedRoutes allowedRoles={["client"]}>
        <ClientLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "packs", element: <AllPacks /> },
      // { path: "bookings", element: <ClientBookings /> },
      // { path: "profile", element: <ClientProfile /> },
    ],
  },
  {
    // Routes Guide
    path: "/guide",
    element: (
      <ProtectedRoutes allowedRoles={["guide"]}>
        <GuideLayout />
      </ProtectedRoutes>
    ),
    children: [
      { path: "packsguide", element: <PacksGuid /> },
      // { path: "places", element: <GuidePlaces /> },
      // { path: "packs", element: <GuidePacks /> },
      // { path: "profile", element: <GuideProfile /> },
    ],
  },
  {
    // Routes Admin
    path: "/admin",
    element: (
      <ProtectedRoutes allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoutes>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "guides", element: <AllGuides /> },
      { path: "clients", element: <AllClients /> },
      // { path: "packs", element: <PacksManagement /> },
      // { path: "bookings", element: <BookingsManagement /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
