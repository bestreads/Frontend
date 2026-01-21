import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link, Navigate } from "react-router"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import logoSvg from "@/assets/images/logo_text_untereinander.svg"
import { useAuth } from "@/contexts/Authcontext"
import { Spinner } from "@/components/ui/spinner"

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login, isAuthenticated } = useAuth()

  // Redirect wenn bereits eingeloggt
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleLogin = async (email: string, password: string) => {
    setError(null)
    setIsLoading(true)
    try {
      await login(email, password)
    } catch {
      setError("Login fehlgeschlagen. Bitte überprüfe deine Zugangsdaten.")
    } finally {
      setIsLoading(false)
    }
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
              {error && (
                <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-md">
                  {error}
                </div>
              )}
              <form onSubmit={async (e) => {
                e.preventDefault()
                await handleLogin(email, password)
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
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Spinner />}
                      {isLoading ? "Anmelden..." : "Login"}
                    </Button>
                    <FieldDescription className="text-center">
                      Noch kein Account? <Link to="/signup">Jetzt Registrieren!</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Login
