import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useDispatch, useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { RegisterUser, clearError, clearSuccess } from "@/store/slices/AuthSlice"
import { useNavigate, Link } from "react-router-dom"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "../ui/components/ui/button"

export function SignupForm({ className, ...props }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, success } = useSelector((state) => state.Auth)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "client",
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      role: formData.role,
    }
    dispatch(RegisterUser(payload))
  }

  useEffect(() => {
    if (success) {
      navigate("/login")
      dispatch(clearSuccess())
    }
  }, [success, navigate, dispatch])

  // Clear error when user types
  useEffect(() => {
    if (error) dispatch(clearError())
  }, [formData.name, formData.email, formData.phone, formData.password, formData.confirmPassword, formData.role])

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Error block styled like LoginForm */}
          {error && (
            <div className="text-sm text-red-500 text-center mb-4">
              {Array.isArray(error)
                ? error.map((msg, i) => (
                    <p key={i}>{typeof msg === "string" ? msg : msg.message}</p>
                  ))
                : typeof error === "string"
                ? error
                : error.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+212600000000"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Field>

              <Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirmPassword">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </Field>
                </div>
                <FieldDescription>
                  Must be at least 6 characters long.
                </FieldDescription>
              </Field>
              


              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white hover:opacity-90 cursor-pointer"
                  style={{ backgroundColor: "#EB662B" }}
                >
                  {loading ? "Creating..." : "Create Account"}
                </Button>
                <Link to="/login">
                  <FieldDescription className="text-center">
                    Already have an account?{" "}
                    <span className="text-[#EB662B] hover:underline">
                      Sign in
                    </span>
                  </FieldDescription>
                </Link>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
