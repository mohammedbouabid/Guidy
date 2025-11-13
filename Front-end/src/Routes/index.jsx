import { createBrowserRouter } from "react-router-dom";
import GuestLayout from "../Layouts/GuestLayout";
import ClientLayout from "../Layouts/ClientLayout";
import GuideLayout from "../Layouts/GuideLayout";
import AdminLayout from "../Layouts/AdminLayout";
import ProtectedRoutes from "./ProtectedRoutes";
import NotFoundPage from "../pages/NotFoundPage";
import LandingPage from "../pages/Home/LandingPage";
import About from "@/pages/About";
import FilterPage from "@/pages/Home/FilterPage";
import Login from "@/pages/Home/Login";
import SignUpPage from "@/pages/Home/RegisterPage";
import { GuideRegister } from "@/components/AuthPages/GuideRegister";

//import TestRoute from "../pages/testRoute";
import AllPacks from "@/pages/Home/AllPacks";
import PacksGuid from "@/pages/Guide/PacksGuid";
import AllGuides from "@/pages/admin/AllGuides";
import AllGuidesPublic from "@/pages/Guides/AllGuides";
import GuideProfile from "@/pages/Guides/GuideProfile";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import AllClients from "@/pages/admin/AllClients";
import GuidePlacesPage from "@/pages/admin/GuidePlaces";
import GuidePlaces from "@/pages/Guide/GuidePlaces";
import AddGuidePlaceForm from "@/Components/GuidePlace/AddGuidePlaceForm";
import UpdateGuidePlaceForm from "@/Components/GuidePlace/UpdateGuidePlaceForm";
import AddPack from "@/pages/Guide/AddPack";
import UpdatePack from "@/pages/Guide/UpdatePack";
import ProfilePage from "@/pages/Home/ProfilePage";
import ProfileBillingPage from "@/pages/Home/ProfileBillingPage";
import PackDetails from "@/pages/Guide/PackDetails";
import GuideBookings from "../pages/Guide/GuideBookings";
import BookingDetailsModal from "@/Components/Bookings/BookingDetailsModal";
import GuideDashboard from "@/pages/Guide/GuideDashboard";
import Analtytics  from "@/pages/Guide/Analtytics";
import PackDetailsPage from "@/pages/Home/PackDetailsPage";
import RatingsPage from "@/pages/admin/Ratings";
import CalenderPacks from "@/pages/Guide/CalenderPacks";
import BookingsPage from "@/pages/admin/Booking";
import PacksAdmin from "@/pages/admin/PacksAdmin";

const router = createBrowserRouter([
  {
    // Routes publiques
    element: <GuestLayout />,   
    children: [
      { path: "/", element: <LandingPage /> },
      // { path: "/test", element: <TestRoute /> },
      // { path: "/login", element: <LoginPage /> },
      { path: "/login", element: <Login /> },
      // { path: "/register", element: <RegisterPage /> },
      { path: "/register", element: <SignUpPage /> },
      {path:"/guideregister", element:<GuideRegister/>},
      { path: "/about", element: <About /> },
      {path:"/profile", element:<ProfilePage/>},
      {path:"/profile/billing", element:<ProfileBillingPage/>},
      { path: "/packs/:id", element: <PackDetailsPage /> },
      {path:"/filter", element:<FilterPage/>},
      {path:"/guides", element:<AllGuidesPublic/>},
      {path:"/guide/:id", element:<GuideProfile/>},
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
      // Removed: { path: "bookings", element: <ClientBookings /> },
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
      { index: true, element: <GuideDashboard /> },
      { path: "PacksGuide", element: <PacksGuid /> },
      { path: "packs/add", element: <AddPack /> },
      { path: "packs/edit/:id", element: <UpdatePack /> },
      { path: "packs/details/:id", element: <PackDetails /> },
      { path: "places", element: <GuidePlaces /> },
      { path: "places/add", element: <AddGuidePlaceForm /> },
      { path: "places/edit/:id", element: <UpdateGuidePlaceForm /> },
      { path: "bookingsGuide", element: <GuideBookings /> },
      { path: "bookingsGuide/:id", element: <BookingDetailsModal /> },
      { path: "CalenderPacks", element: <CalenderPacks /> },
      { path: "Analytics", element: <Analtytics /> },
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
      { path: "destinations", element: <GuidePlacesPage /> },
      { path: "packs", element: <PacksAdmin /> },
      { path: "ratings", element: <RatingsPage /> },
      { path: "bookings", element: <BookingsPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);

export default router;
