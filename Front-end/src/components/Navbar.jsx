import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, Link } from "react-router-dom"
import { hydrateUserFromCookie } from "@/store/slices/AuthSlice"
import { getUserFromCookie } from "@/lib/getUserFromCookie"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../Components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/components/ui/button"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { Home, Package, Users, Info, User, LayoutDashboard,History } from "lucide-react"

const Navbar = ({ onLogout }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const user = useSelector((state) => state.Auth.user)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const navLinks = [
    { to: "/", label: "Accueil", shortLabel: "Home", icon: Home },
    { to: "/about", label: "À propos", shortLabel: "About", icon: Info },
    { to: "/filter", label: "Nos packs", shortLabel: "Packs", icon: Package },
    { to: "/guides", label: "Nos guides", shortLabel: "Guides", icon: Users },
    { to: "/profile/billing", label: "Historic", shortLabel: "Guides", icon: History },
  ]

  useEffect(() => {
    const userFromCookie = getUserFromCookie()
    if (userFromCookie) dispatch(hydrateUserFromCookie(userFromCookie))
  }, [])

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  const handleLogoutClick = () => {
    setShowLogoutDialog(true)
  }

  const handleLogoutConfirm = () => {
    setShowLogoutDialog(false)
    onLogout()
  }

  return (
    <>
      {/* Desktop / Tablet Top Navbar */}
      <nav className="hidden md:block w-full sticky top-0 left-0 right-0 z-[10000] bg-white/90 backdrop-blur border-b border-orange-100/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/">
              <span
                className="text-[22px] font-bold tracking-tight cursor-pointer"
                style={{ color: "#eb662b" }}
              >
                Guidy
              </span>
            </Link>

            {/* Right side */}
            <div className="flex flex-wrap items-center justify-end gap-4">
              <div className="flex items-center gap-2 rounded-full border border-orange-100/80 bg-white/80 px-2 py-1 shadow-sm">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      isActive(link.to)
                        ? "bg-gradient-to-r from-[#eb662b] via-orange-500 to-amber-400 text-white shadow-lg"
                        : "text-gray-600 hover:text-[#eb662b]"
                    }`}
                  >
                    <link.icon className={`h-4 w-4 ${isActive(link.to) ? "text-white" : "text-[#eb662b]/70 group-hover:text-[#eb662b]"}`} />
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              <div className="hidden xl:block h-6 w-px bg-gray-200" />

              {!user ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/register"
                    className="text-sm font-medium text-gray-600 transition hover:text-[#eb662b]"
                  >
                    S'inscrire
                  </Link>
                  <Link to="/GuideRegister">
                    <button className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#eb662b] shadow-[0_4px_18px_-6px_rgba(235,102,43,0.6)] transition hover:-translate-y-[1px] hover:bg-orange-50">
                      Devenir guide
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="rounded-full bg-gradient-to-r from-[#eb662b] via-orange-500 to-amber-400 px-5 py-2 text-sm font-semibold text-white shadow-[0_8px_22px_-10px_rgba(235,102,43,0.9)] transition hover:-translate-y-[1px]">
                      Se connecter
                    </button>
                  </Link>
                </div>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-10 rounded-full px-2 py-0 hover:bg-orange-50 hover:text-[#eb662b] flex items-center gap-2 cursor-pointer border border-transparent hover:border-orange-200"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profileImage} alt={user.name} />
                        <AvatarFallback className="text-xs">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDownIcon className="h-3 w-3 ml-1" />
                      <span className="sr-only">User menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 z-[11001]">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.role === "admin" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    {user.role === "guide" && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link to="/guide" className="cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem asChild>
                      <Link to="/profile?tab=personal" className="cursor-pointer">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile?tab=account" className="cursor-pointer">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile/billing" className="cursor-pointer">Billing</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogoutClick}
                      className="text-red-600 hover:text-white hover:bg-red-600 cursor-pointer"
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-[10000]">
        <div className="flex justify-around items-center h-16 px-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex flex-col items-center text-[11px] font-medium transition ${
                isActive(link.to) ? "text-[#eb662b]" : "text-gray-500"
              }`}
            >
              <link.icon className="h-5 w-5" />
              {link.shortLabel}
            </Link>
          ))}

          {/* Profile Dropdown for Mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex flex-col items-center text-xs ${
                  isActive("/profile") ? "text-[#eb662b]" : "text-gray-500"
                } focus:outline-none`}
              >
                <User className="h-5 w-5" />
                Profile
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mb-2 z-[11001]">
              {!user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="cursor-pointer">
                      Log in
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register" className="cursor-pointer">
                      Sign up
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/GuideRegister" className="cursor-pointer text-[#eb662b]">
                      Become a Guide
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  {user.role === "guide" && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/guide" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/profile?tab=personal" className="cursor-pointer">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile?tab=account" className="cursor-pointer">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile/billing" className="cursor-pointer">Billing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogoutClick}
                    className="text-red-600 hover:text-white hover:bg-red-600 cursor-pointer"
                  >
                    Log out
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to log out from the website? You will need to log in again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="rounded-lg bg-orange-50 border border-orange-200 p-4 text-sm text-orange-800">
            <p className="font-semibold">Before you go:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>We are happy to have you with us</li>
              <li>You'll be redirected to the login page</li>
              <li>Your session will be ended securely</li>
            </ul>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutConfirm}
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
            >
              Yes, Log Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default Navbar