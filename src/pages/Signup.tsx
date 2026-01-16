import { Button } from "@/components/ui/button"
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
import { Link, Navigate, useNavigate } from "react-router"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useAuth } from "@/contexts/Authcontext"
import { register } from "@/api/authService"
import logoSvg from "@/assets/images/logo_text_untereinander.svg"
import { AxiosError } from "axios"
import { Spinner } from "@/components/ui/spinner"

function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const confirmPasswordRef = useRef<HTMLInputElement>(null)

  // Validate passwords
  useEffect(() => {
    if (confirmPasswordRef.current) {
      if (confirmPassword && password !== confirmPassword) {
        confirmPasswordRef.current.setCustomValidity("Die Passwörter stimmen nicht überein.")
      } else {
        confirmPasswordRef.current.setCustomValidity("")
      }
    }
  }, [password, confirmPassword])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await register({ email, username, password })
      navigate("/login")
    } catch (err) {
      if (err instanceof AxiosError) {
        const status = err.response?.status
        const message = err.response?.data?.message

        switch (status) {
          case 400:
            setError("Ungültige Eingabe. Bitte überprüfe deine Daten.")
            break
          case 409:
            setError("Ein Benutzer mit dieser E-Mail oder diesem Benutzernamen existiert bereits.")
            break
          default:
            setError(message || "Registrierung fehlgeschlagen. Bitte versuche es erneut.")
        }
      } else if (err instanceof Error && err.message === "Network Error") {
        setError("Keine Verbindung zum Server. Bitte prüfe deine Internetverbindung.")
      } else {
        setError("Ein unerwarteter Fehler ist aufgetreten.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center p-6">
      <img src={logoSvg} alt="bestreads logo"
        className="w-50" />
      <div className="w-full max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Erstelle einen Account</CardTitle>
            <CardDescription>
              Gib deine Daten ein, um einen BestReads-Account zu erstellen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950 rounded-md">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="username">
                    <User className="h-4 w-4 inline mr-2" />
                    Benutzername
                  </FieldLabel>
                  <Input
                    id="username"
                    type="text"
                    placeholder="max.mustermann"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    minLength={3}
                    maxLength={30}
                    pattern="^[a-zA-Z0-9._]+$"
                    title="3-30 Zeichen, nur Buchstaben, Zahlen, Punkte und Unterstriche"
                    required
                  />
                </Field>
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
                  <FieldLabel htmlFor="password">
                    <Lock className="h-4 w-4 inline mr-2" />
                    Passwort
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      minLength={8}
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
                  <FieldLabel htmlFor="confirm-password">
                    <Lock className="h-4 w-4 inline mr-2" />
                    Passwort bestätigen
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      ref={confirmPasswordRef}
                      type={showConfirmPassword ? "text" : "password"}
                      minLength={8}
                      className="pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showConfirmPassword ? "Passwort verbergen" : "Passwort anzeigen"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
                <FieldGroup>
                  <Field>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && <Spinner />}
                      {isLoading ? "Wird erstellt..." : "Account erstellen"}
                    </Button>
                    <FieldDescription className="px-6 text-center">
                      Bereits registriert? <Link to="/login">Melde dich an!</Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Signup
