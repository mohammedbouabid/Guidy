"use client";

import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";


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
import { useSelector } from "react-redux";

// ---- Dynamic Menu ----


export function AppSidebar() {
  const [activeItem, setActiveItem] = useState();
  const { user} = useSelector((state) => state.Auth);
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
    { title: "Tours", url: "#", icon: Route },
    { title: "Bookings", url: "#", icon: BookmarkCheck },
    { title: "Ratings", url: "#", icon: MessageSquareHeart },
  ];
} else if (role === "guide") {
  items = [
    { title: "Dashboard", url: "", icon: CircleGauge },
    { title: "My Places", url: "places", icon: Route },
    { title: "My Packs", url: "PacksGuide", icon: MapPinned },
    { title: "Calendar", url: "#", icon: CalendarRange },
    { title: "Bokking", url: "bookingsGuide", icon: BookIcon },
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
                          ? "bg-[var(--sidebar-accent)] text-[var(--sidebar-accent-foreground)] scale-[1.03]"
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
                      src="https://i.pravatar.cc/40"
                      alt="Avatar"
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="flex flex-col items-start text-sm">
                      <span className="font-medium">shadcn</span>
                      <span className="text-xs text-muted-foreground">
                        m@example.com
                      </span>
                    </div>
                  </div>
                  <PanelBottomOpen className="ml-auto h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-53" align="center" side="top">
                <DropdownMenuItem>
                  <UserRoundPen className="mr-2 h-4 w-4" />
                  <Link to="/profile">
                  <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
