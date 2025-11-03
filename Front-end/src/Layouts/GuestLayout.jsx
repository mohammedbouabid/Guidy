import { useSelector, useDispatch } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"
import Navbar from "@/components/Navbar"
import { LogoutUser } from "@/store/slices/AuthSlice"
import { useNavigate } from "react-router-dom"
import Footer from "@/components/Footer"

const GuestLayout = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.Auth)

  const navigate = useNavigate()

  const handleLogout = async () => {
  try {
    await dispatch(LogoutUser()).unwrap()
    navigate("/login") // ✅ redirect to login page
  } catch (err) {
    console.error("Logout failed:", err)
  }
}

  return (
    <div className="min-h-screen">
      <div className="bg-white">
        <Navbar user={user} onLogout={handleLogout} />
      </div>
      <Outlet />
      <div><Footer/></div>
    </div>
  )
}

export default GuestLayout

