"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useDispatch } from "react-redux";


import {
  CircleGauge,
  UsersRound,
  MapPinned,
  Route,
  BookmarkCheck,
  CalendarRange,
  PanelBottomOpen,
  UserRoundPen,
  LogOut,
  MessageSquareHeart,
  BookIcon,
  ChartArea,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSelector } from "react-redux";
import { LogoutUser, hydrateUserFromCookie } from "@/store/slices/AuthSlice";
import { toast } from "react-hot-toast";

// ---- Dynamic Menu ----


export function AppSidebar() {
  const [activeItem, setActiveItem] = useState();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { user} = useSelector((state) => state.Auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Update activeItem based on current URL
  const role =user.role ; // you can replace this with context or props

let items = [];

if (role === "admin") {
  items = [
    { title: "Dashboard", url: "", icon: CircleGauge },
    { title: "Guides", url: "guides", icon: UsersRound },
    { title: "Clients", url: "clients", icon: UsersRound },
    { title: "Destinations", url: "destinations", icon: MapPinned },
    { title: "Tours", url: "packs", icon: Route },
    { title: "Bookings", url: "bookings", icon: BookmarkCheck },
    { title: "Ratings", url: "ratings", icon: MessageSquareHeart },
  ];
} else if (role === "guide") {
  items = [
    { title: "Dashboard", url: "", icon: CircleGauge },
    { title: "My Places", url: "places", icon: Route },
    { title: "My Packs", url: "PacksGuide", icon: MapPinned },
    { title: "Bokking", url: "bookingsGuide", icon: BookIcon },
    { title: "Calendar", url: "CalenderPacks", icon: CalendarRange },
    { title: "Analytics", url: "Analytics", icon: ChartArea },
  ];
}
  useEffect(() => {
    const path = location.pathname.split("/").pop();
    const found = items.find((item) => item.url === path);
    if (found) {
      setActiveItem(found.title);
    }else {
      setActiveItem("Dashboard");
    }
  }, [location.pathname]);

  const handleNavigate = (item) => {
    setActiveItem(item.title);
    navigate(item.url);
  };

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutDialog(false);
    try {
      await dispatch(LogoutUser()).unwrap();
      
      // Clear cookies on client side
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "userInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      
      // Clear Redux state
      dispatch(hydrateUserFromCookie(null));
      
      toast.success('Déconnexion réussie');
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error('Erreur lors de la déconnexion');
      
      // Even if API fails, clear local state and redirect
      document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "userInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      dispatch(hydrateUserFromCookie(null));
      navigate("/login");
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="px-5 group-data-[collapsible=icon]:px-0 transition-[padding] duration-200 ease-linear">
        <SidebarGroup className="before:top-0 before:h-full before:w-1 before:bg-[var(--sidebar-accent)] relative">
          <SidebarGroupLabel>LOGO</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="relative">
                  {activeItem === item.title && (
                    <span className="absolute -left-[30px] top-0 h-full w-3 bg-[var(--sidebar-accent)] rounded-r-full" />
                  )}
                  <SidebarMenuButton
                    onClick={() => handleNavigate(item)}
                    className={`flex items-center w-full gap-2 px-4 py-6 rounded-md transition-all duration-200 cursor-pointer
                      ${
                        activeItem === item.title
                          ? "bg-[#EB662B] text-[var(--sidebar-accent-foreground)] scale-[1.03]"
                          : "hover:bg-[var(--sidebar-accent)] hover:text-[var(--sidebar-accent-foreground)]"
                      }`}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ---- Footer ---- */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex items-center justify-between w-full py-6 hover:bg-[#f5f5f5] hover:text-black">
                  <div className="flex items-center gap-2">
                    <img
                      src={user?.profileImage || "https://res.cloudinary.com/dqbu98gev/image/upload/v1760193539/profile-icon-vector_lxkuyo.jpg"}
                      alt={user?.name || "Avatar"}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium capitalize">{user?.name || "User"}</span>
                      <span className="text-xs text-muted-foreground">
                        {user?.email || "user@example.com"}
                      </span>
                    </div>
                  </div>
                  <PanelBottomOpen className="ml-auto h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-53" align="center" side="top">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center cursor-pointer">
                    <UserRoundPen className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogoutClick} className="cursor-pointer hover:bg-red-50">
                  <LogOut className="mr-2 h-4 w-4 text-red-600" />
                  <span className="text-red-600">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la déconnexion</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Oui, se déconnecter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  );
}
