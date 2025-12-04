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
import { Link } from "react-router"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

function Signup() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="flex w-full h-full items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <Card>
          <CardHeader>
            <CardTitle>Erstelle einen Account</CardTitle>
            <CardDescription>
              Gib deine Daten ein, um einen GoodReads-Account zu erstellen.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault() }}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="username">
                    <User className="h-4 w-4 inline mr-2" />
                    Benutzername
                  </FieldLabel>
                  <Input id="username" type="text" placeholder="max.mustermann" required />
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
                      type={showConfirmPassword ? "text" : "password"}
                      minLength={8}
                      className="pr-10"
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
                    <Button type="submit">Account erstellen</Button>
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
