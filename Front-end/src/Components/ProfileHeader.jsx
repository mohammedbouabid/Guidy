import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Calendar, Mail, MapPin } from "lucide-react"

export default function ProfileHeader() {
  const { user } = useSelector((state) => state.Auth)

  if (!user) return null

  // Capitalize each word in the name
  const formatName = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")

  // Get initials with space between
  const getInitials = (name) =>
    name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join(" ")

  // Format join date
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

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center">
          {/* Avatar + Edit Button */}
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={formattedName} />
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              variant="outline"
              className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full"
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
            <p className="text-muted-foreground">{user.title || "Traveler"}</p>
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

          {/* Edit Button */}
          <Button variant="default">Edit Profile</Button>
        </div>
      </CardContent>
    </Card>
  )
}
