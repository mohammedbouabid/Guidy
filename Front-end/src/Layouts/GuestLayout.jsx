import { useSelector, useDispatch } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"
import { logout } from "@/store/slices/AuthSlice"

const GuestLayout = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.Auth)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <div className="h-screen">
      <div className="bg-white">
        <Navbar user={user} onLogout={handleLogout} />
      </div>
      <Outlet />
    </div>
  )
}

export default GuestLayout
