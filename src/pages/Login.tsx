import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, useNavigate, Navigate } from "react-router"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import logoSvg from "@/assets/images/logo_text_untereinander.svg"
import { useAuth } from "@/contexts/Authcontext"

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate();

  // Redirect wenn bereits eingeloggt
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex h-screen items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <img src={logoSvg} alt="bestreads logo"
          className="m-auto w-50" />
        <div className="flex flex-col gap-6 m-6">
          <Card>
            <CardHeader>
              <CardTitle>Anmeldung</CardTitle>
              <CardDescription>
                Gib deine Email und dein Passwort an, um dich anzumelden.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={async (e) => {
                e.preventDefault()
                await login(email, password)
                navigate("/")
              }}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">
                      <Mail className="h-4 w-4 inline mr-2" />
                      E-Mail
                    </FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="beispiel@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">
                        <Lock className="h-4 w-4 inline mr-2" />
                        Passwort
                      </FieldLabel>
                      <Link
                        to="/reset-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Passwort vergessen?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </Field>
                  <Field>
                    <Button type="submit">Login</Button>
                    <FieldDescription className="text-center">
                      Noch kein Account? <Link to="/signup">Jetzt Registrieren!</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>

              {/*TODO: entfernen */}
              <button
                onClick={async () => {
                  await login("test@example.com", "password123")
                  navigate("/")
                }}
                className="mt-4 w-full px-4 py-2 text-sm text-muted-foreground border border-dashed rounded hover:bg-muted"
                type="button"
              >
                Schnell Login (Entwicklung)
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login
