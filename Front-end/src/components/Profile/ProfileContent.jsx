import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useSearchParams } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2, KeyRound, Eye, EyeOff } from "lucide-react"
import { updateUserProfile } from "@/lib/updateUserProfile"
import { hydrateUserFromCookie } from "@/store/slices/AuthSlice"
import { toast } from "sonner"
import { getUserFromCookie } from "@/lib/getUserFromCookie"




export default function ProfileContent() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.Auth)
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "personal")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
  })
  const [showDialog, setShowDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Password change states
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showPasswordConfirmDialog, setShowPasswordConfirmDialog] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  })

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
      })
    }
  }, [user])

  const handleChange = (e) => {
    const { id, value } = e.target

    // Phone validation: only numbers and symbols
    if (id === "phone") {
      const phoneRegex = /^[0-9+\-().\s]*$/
      if (!phoneRegex.test(value)) {
        return // Don't update if invalid characters
      }
    }

    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const hasChanges = user
    ? Object.keys(formData).some((key) => formData[key] !== (user[key] || ""))
    : false

  const isFormValid = formData.name.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.phone.trim() !== ""


  const handleSave = async () => {
    // Validate required fields
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      toast.error("Name, email, and phone are required fields")
      setShowDialog(false)
      return
    }

    setLoading(true)

    // Only send changed fields
    const changedFields = Object.keys(formData).reduce((acc, key) => {
      if (formData[key] !== (user[key] || "")) {
        acc[key] = formData[key]
      }
      return acc
    }, {})

    if (Object.keys(changedFields).length === 0) {
      setLoading(false)
      setShowDialog(false)
      toast.info("No changes to save")
      return
    }

    try {
      await updateUserProfile(changedFields)
      const updatedUser = getUserFromCookie()
      dispatch(hydrateUserFromCookie(updatedUser))
      toast.success("Profile updated successfully")
    } catch (err) {
      console.error("Update failed", err)
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
      setShowDialog(false)
    }

  }

  const handlePasswordChange = (e) => {
    const { id, value } = e.target
    setPasswordData((prev) => ({ ...prev, [id]: value }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  const isPasswordFormValid =
    passwordData.oldPassword.trim() !== "" &&
    passwordData.newPassword.trim() !== "" &&
    passwordData.confirmPassword.trim() !== ""

  // First dialog - validates client-side, shows errors here
  const handlePasswordChangeSubmit = () => {
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match")
      return
    }

    // Validate password length
    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    // Check if new password is same as old (client-side check)
    if (passwordData.oldPassword === passwordData.newPassword) {
      toast.error("New password cannot be the same as old password")
      return
    }

    // Check if all fields are filled
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error("All fields are required")
      return
    }

    // All client-side validations passed, show confirmation dialog
    setShowPasswordDialog(false)
    setShowPasswordConfirmDialog(true)
  }

  // Second dialog - actually changes password on confirmation
  const handlePasswordChangeConfirm = async () => {
    setPasswordLoading(true)

    try {
      // Call API to change password (only called here, on confirmation)
      const response = await fetch('http://localhost:3000/api/change-password', {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oldPassword: passwordData.oldPassword,
          password: passwordData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // If old password is wrong from backend, show error and go back to first dialog
        toast.error(data.message || "Failed to change password")
        setShowPasswordConfirmDialog(false)
        setShowPasswordDialog(true)
        setPasswordLoading(false)
        return
      }

      // Success - password changed
      toast.success("Password changed successfully. You will be logged out.")

      // Clear password form
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setShowPasswordConfirmDialog(false)

      // Wait a moment then logout
      setTimeout(async () => {
        try {
          await fetch('http://localhost:3000/api/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          dispatch(hydrateUserFromCookie(null))
          window.location.href = "/login"
        } catch (err) {
          console.error("Logout failed", err)
          // Even if logout fails, redirect to login
          window.location.href = "/login"
        }
      }, 1500)
    } catch (err) {
      console.error("Password change failed", err)
      toast.error(err.message || "Failed to change password")
      setShowPasswordConfirmDialog(false)
      setShowPasswordDialog(true)
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)

    try {
      // Call API to soft delete account (set isDeleted = true)
      await updateUserProfile({ isDeleted: true })

      // Call logout API to clear cookies and tokens
      const response = await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        toast.success("Account deleted successfully")
        // Clear Redux state
        dispatch(hydrateUserFromCookie(null))
        // Redirect to home or login page
        setTimeout(() => {
          window.location.href = "/"
        }, 1000)
      } else {
        throw new Error("Logout failed")
      }
    } catch (err) {
      console.error("Delete failed", err)
      toast.error("Failed to delete account. Please try again.")
    } finally {
      setDeleteLoading(false)
      setShowDeleteDialog(false)
    }
  }

  if (!user) return null

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 py-10">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
      </TabsList>

      {/* Personal Information */}
      <TabsContent value="personal" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Update your personal details and profile information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={4}
              />
            </div>

            {/* Save Button + Confirmation Dialog */}
            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
              <AlertDialogTrigger asChild>
                <Button disabled={!hasChanges || !isFormValid}>Save Changes</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Profile Update</AlertDialogTitle>
                  <AlertDialogDescription>
                    Review the changes you're about to save to your profile.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-3 py-4">
                  {Object.keys(formData).map((key) => {
                    const oldValue = user[key] || ""
                    const newValue = formData[key]
                    if (oldValue === newValue) return null

                    const labels = {
                      name: "Full Name",
                      email: "Email",
                      phone: "Phone",
                      bio: "Bio"
                    }

                    return (
                      <div key={key} className="space-y-1 rounded-lg border p-3">
                        <Label className="text-xs text-muted-foreground">{labels[key]}</Label>
                        <div className="space-y-1">
                          {oldValue && (
                            <p className="text-sm text-muted-foreground line-through">
                              {oldValue}
                            </p>
                          )}
                          <p className="text-sm font-medium">
                            {newValue || <span className="text-muted-foreground italic">Empty</span>}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className={"cursor-pointer"}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSave} disabled={loading}>
                    {loading ? "Saving..." : "Confirm & Save"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Account Settings */}
      <TabsContent value="account" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and subscription.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Account Status</Label>
                <p className="text-muted-foreground text-sm">
                  Your account is currently active
                </p>
              </div>
              <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                Active
              </Badge>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Billing</Label>
                <p className="text-muted-foreground text-sm">View your purchase history and invoices</p>
              </div>
              <Button variant="outline" className={"cursor-pointer"}>View Billing</Button>
            </div>
            <Separator />
            {/* Password Change Section */}

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Password</Label>
                <p className="text-muted-foreground text-sm">
                  Change your account password
                </p>
              </div>
              <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="cursor-pointer">
                    <KeyRound className="mr-2 h-4 w-4" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogDescription>
                      Enter your current password and choose a new one.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword">Current Password *</Label>
                      <div className="relative">
                        <Input
                          id="oldPassword"
                          type={showPasswords.old ? "text" : "password"}
                          value={passwordData.oldPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter current password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 "
                          onClick={() => togglePasswordVisibility('old')}
                        >
                          {showPasswords.old ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password *</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter new password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 "
                          onClick={() => togglePasswordVisibility('new')}
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters long
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password *</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Confirm new password"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 "
                          onClick={() => togglePasswordVisibility('confirm')}
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 ">
                    <Button
                      variant="outline"
                      className={"cursor-pointer"}
                      onClick={() => {
                        setShowPasswordDialog(false)
                        setPasswordData({
                          oldPassword: "",
                          newPassword: "",
                          confirmPassword: "",
                        })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handlePasswordChangeSubmit}
                      disabled={!isPasswordFormValid}
                      className={"cursor-pointer"}
                    >
                      Change Password
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Password Change Confirmation Dialog */}
            <AlertDialog open={showPasswordConfirmDialog} onOpenChange={setShowPasswordConfirmDialog}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Password Change</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to change your password? You will be logged out and need to log in again with your new password.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 text-sm text-yellow-800">
                  <p className="font-semibold">Important:</p>
                  <ul className="mt-2 list-inside list-disc space-y-1">
                    <li>You will be logged out immediately</li>
                    <li>You'll need to log in with your new password</li>
                    <li>Make sure you remember your new password</li>
                  </ul>
                </div>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer"> Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handlePasswordChangeConfirm}
                    disabled={passwordLoading}
                    className="cursor-pointer"
                  >
                    {passwordLoading ? "Changing..." : "Yes, Change Password"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Account Visibility</Label>
                <p className="text-muted-foreground text-sm">
                  Make your profile visible to other users
                </p>
              </div>
              <Switch defaultChecked disabled />
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base">Delete Account</Label>
                <p className="text-muted-foreground text-sm">
                  Permanently delete your account and all data
                </p>
              </div>
              <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className={"cursor-pointer"}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will delete your account and all associated data. Your account will be deactivated immediately and cannot be recovered.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">
                    <p className="font-semibold">Warning:</p>
                    <ul className="mt-2 list-inside list-disc space-y-1">
                      <li>All your personal information will be removed</li>
                      <li>Your purchase history will be deleted</li>
                      <li>This action cannot be undone</li>
                    </ul>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel className={"cursor-pointer"}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      disabled={deleteLoading}
                      className="bg-destructive hover:bg-destructive/90 cursor-pointer"
                    >
                      {deleteLoading ? "Deleting..." : "Yes, Delete My Account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}