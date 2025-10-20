import React from "react"
import { Link } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronDownIcon } from "@radix-ui/react-icons"

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="w-full sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-2">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <span className="text-[22px] font-bold tracking-tight cursor-pointer" style={{ color: "#eb662b" }}>
              Guidy
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 mx-6 max-w-xl">
            <input
              type="text"
              placeholder="Search destinations or activities"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#eb662b]"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-5">
            <a href="#" className="text-sm text-gray-700 hover:text-[#eb662b]">Destinations</a>
            <a href="#" className="text-sm text-gray-700 hover:text-[#eb662b]">Activities</a>
            <a href="#" className="text-sm text-gray-700 hover:text-[#eb662b]">USD</a>

            {!user ? (
              <>
                <Link to="/register">
                  <span className="text-sm text-gray-700 hover:text-[#eb662b] cursor-pointer">Sign up</span>
                </Link>
                <Link to="/login">
                  <button
                    className="text-white cursor-pointer text-sm px-5 py-2 rounded-3xl transition-colors hover:opacity-90"
                    style={{ backgroundColor: "#eb662b" }}
                  >
                    Log in
                  </button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 px-2 py-0 hover:bg-accent hover:text-accent-foreground flex items-center gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="text-xs">
                        {user.name.split(" ").map(n => n[0]).join("")}
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
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer px-4 py-2 hover:bg-orange-500 hover:text-white transition-colors duration-200">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer px-4 py-2 hover:bg-orange-500 hover:text-white transition-colors duration-200">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/billing" className="cursor-pointer px-4 py-2 hover:bg-orange-500 hover:text-white transition-colors duration-200">Billing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout} className="cursor-pointer px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 transition-colors duration-200" >Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
