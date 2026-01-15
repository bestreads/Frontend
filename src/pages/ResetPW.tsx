import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import { Link, Navigate } from "react-router"
import logoSvg from "@/assets/images/logo_text_untereinander.svg"
import { useAuth } from "@/contexts/Authcontext"

function ResetPW() {
  const { isAuthenticated } = useAuth()

  // Redirect wenn bereits eingeloggt
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex flex-col w-full h-screen items-center justify-center p-6">
      <img src={logoSvg} alt="bestreads logo"
        className="w-50" />
      <div className="flex flex-col gap-6 m-6 w-full max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Passwort zurücksetzen</CardTitle>
            <CardDescription>
              Gib deine Email-Adresse ein. Wir senden dir einen Link zum Zurücksetzen deines Passworts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault()
              /* TODO: Funktionalität hinzufügen */
            }}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="beispiel@email.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </Field>
                <Field>
                  <Button type="submit">Link senden</Button>
                  <FieldDescription className="text-center">
                    <Link to="/login">Zurück zur Anmeldung</Link>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>

  )
}

export default ResetPW
