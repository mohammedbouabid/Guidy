import { useSelector, useDispatch } from "react-redux"
import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Calendar, Mail, MapPin } from "lucide-react"
import { hydrateUserFromCookie } from "@/store/slices/AuthSlice"
import { getUserFromCookie } from "@/lib/getUserFromCookie"
import Loader from "./loader"

export default function ProfileHeader() {
  const dispatch = useDispatch()
  const { user, isHydrated } = useSelector((state) => state.Auth)
  const [uploading, setUploading] = useState(false)

  if (!isHydrated || !user) return <Loader />;

  if (!user) return null

  const formatName = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")

  const getInitials = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join(" ")

  const formatJoinDate = (dateString) => {
    if (!dateString) return "2025"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formattedName = formatName(user.name)
  const initials = getInitials(user.name)
  const joinDate = formatJoinDate(user.joinedAt || user.createdAt)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append("avatar", file) // ✅ matches backend

    try {
      setUploading(true)

      // ✅ Upload to backend
      await axios.put("http://localhost:3000/api/user/", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })

      // ✅ Rehydrate Redux with updated user info from cookie
      const updatedUser = getUserFromCookie()
      dispatch(hydrateUserFromCookie(updatedUser)) // 👈 this updates the avatar in your header

    } catch (err) {
      console.error("Avatar upload failed:", err)
    } finally {
      setUploading(false)
    }
  }
  console.log("Hydrated user:", user);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          {/* Avatar + Upload Button */}
          <div className="relative">
            <Avatar key={user.profileImage || "fallback"} className="h-24 w-24">
              <AvatarImage
                src={user.profileImage}
                alt={formattedName}
                onError={(e) => {
                  e.target.style.display = "none"; // fallback will show
                }}
              />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>


            <input
              type="file"
              accept="image/*"
              id="avatarUpload"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
              onClick={() => document.getElementById("avatarUpload").click()}
              disabled={uploading}
            >
              <Camera />
            </Button>
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-2">
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <h1 className="text-2xl font-bold">{formattedName}</h1>
              <Badge variant="secondary">{user.role || "Member"}</Badge>
            </div>
            <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="size-4" />
                {user.email}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="size-4" />
                {user.location || "World Traveler"}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="size-4" />
                Member Since {joinDate}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
