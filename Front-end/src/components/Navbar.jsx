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
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "@radix-ui/react-icons"
import { Home, Search, Store, ShoppingCart, User, LayoutDashboard } from "lucide-react"

const Navbar = ({ onLogout }) => {
  const dispatch = useDispatch()
  const location = useLocation()
  const user = useSelector((state) => state.Auth.user)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  useEffect(() => {
    const userFromCookie = getUserFromCookie()
    if (userFromCookie) dispatch(hydrateUserFromCookie(userFromCookie))
  }, [])

  const isActive = (path) => location.pathname === path

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
      <nav className="hidden md:block w-full sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-2">
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
            <div className="flex items-center space-x-5">
              <Link to="/destinations" className="text-sm text-gray-700 hover:text-[#eb662b]">
                Destinations
              </Link>
              <Link to="/activities" className="text-sm text-gray-700 hover:text-[#eb662b]">
                Activities
              </Link>
              <span className="text-sm text-gray-700">USD</span>

              {!user ? (
                <>
                  <Link to="/register">
                    <span className="text-sm text-gray-700 hover:text-[#eb662b] cursor-pointer">
                      Sign up
                    </span>
                  </Link>
                  <Link to="/GuideRegister">
                    <button className="text-white text-sm px-5 py-2 rounded-3xl font-medium bg-[#eb662b] hover:bg-[#d4551f] transition shadow-lg hover:shadow-orange-400/50 animate-pulse-slow cursor-pointer">
                      Become a Guide
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="text-white text-sm px-5 py-2 rounded-3xl font-medium bg-[#eb662b] hover:bg-[#d4551f] transition shadow-lg hover:shadow-orange-400/50 animate-pulse-slow cursor-pointer">
                      Log in
                    </button>
                  </Link>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-9 px-2 py-0 hover:bg-accent hover:text-accent-foreground flex items-center gap-2 cursor-pointer"
                    >
                      <Avatar className="h-7 w-7">
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
                  <DropdownMenuContent align="end" className="w-56">
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
                      <Link to="/billing" className="cursor-pointer">Billing</Link>
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-md z-50">
        <div className="flex justify-around items-center h-16">
          <Link
            to="/"
            className={`flex flex-col items-center text-xs ${
              isActive("/") ? "text-[#eb662b]" : "text-gray-500"
            }`}
          >
            <Home className="h-5 w-5" />
            Home
          </Link>
          <Link
            to="/search"
            className={`flex flex-col items-center text-xs ${
              isActive("/search") ? "text-[#eb662b]" : "text-gray-500"
            }`}
          >
            <Search className="h-5 w-5" />
            Search
          </Link>
          <Link
            to="/store"
            className={`flex flex-col items-center text-xs ${
              isActive("/store") ? "text-[#eb662b]" : "text-gray-500"
            }`}
          >
            <Store className="h-5 w-5" />
            Store
          </Link>
          <Link
            to="/cart"
            className={`flex flex-col items-center text-xs ${
              isActive("/cart") ? "text-[#eb662b]" : "text-gray-500"
            }`}
          >
            <ShoppingCart className="h-5 w-5" />
            Cart
          </Link>
          
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
            <DropdownMenuContent align="end" className="w-56 mb-2">
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
                    <Link to="/billing" className="cursor-pointer">Billing</Link>
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