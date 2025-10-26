import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "../Layouts/GuestLayout";
import ClientLayout from "../Layouts/ClientLayout";
import GuideLayout from "../Layouts/GuideLayout";
import AdminLayout from "../Layouts/AdminLayout";
import ProtectedRoutes from "./ProtectedRoutes";
import NotFoundPage from "../pages/NotFoundPage";
import LandingPage from "../pages/Home/LandingPage";

import Login from "@/pages/Home/Login";
import SignUpPage from "@/pages/Home/RegisterPage";
import { GuideRegister } from "@/components/GuideRegister";

//import TestRoute from "../pages/testRoute";
import AllPacks from "../pages/Home/AllPacks";
import PacksGuid from "../pages/Guide/PacksGuid";
import AllGuides from "../pages/admin/guides";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import GuidePlaces from "@/pages/Guide/GuidePlaces";
import AddGuidePlaceForm from "@/Components/GuidePlace/AddGuidePlaceForm";
import UpdateGuidePlaceForm from "@/Components/GuidePlace/UpdateGuidePlaceForm";
import AddPack from "@/pages/Guide/AddPack";
import UpdatePack from "@/pages/Guide/UpdatePack";
import ProfilePage from "@/pages/Home/ProfilePage";

const router = createBrowserRouter([
  {
    // Routes publiques
    element: <GuestLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      // { path: "/test", element: <TestRoute /> },
      // { path: "/login", element: <LoginPage /> },
      // { path: "/register", element: <RegisterPage /> },
      { path: "/login", element: <Login /> },
      { path: "/register", element: <SignUpPage /> },
      {path:"/guideregister", element:<GuideRegister/>},
      {path:"/profile", element:<ProfilePage/>}
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
      { path: "PacksGuide", element: <PacksGuid /> },
      { path: "packs/add", element: <AddPack /> },
      { path: "packs/edit/:id", element: <UpdatePack /> },
      { path: "places", element: <GuidePlaces /> },
      { path: "places/add", element: <AddGuidePlaceForm /> },
      { path: "places/edit/:id", element: <UpdateGuidePlaceForm /> },
      // { path: "packsguide", element: <PacksGuid /> },
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
      // { path: "users", element: <UsersManagement /> },
      // { path: "packs", element: <PacksManagement /> },
      // { path: "bookings", element: <BookingsManagement /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
