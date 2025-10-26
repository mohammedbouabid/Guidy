import React from "react"
import ProfileContent from "@/components/ProfileContent"
import ProfileHeader from "@/components/ProfileHeader"

export default function ProfilePage() {
    return (
        <div className="max-w-3xl mx-auto py-16 px-4">
            <ProfileHeader />
            <ProfileContent />
        </div>
    )
}
