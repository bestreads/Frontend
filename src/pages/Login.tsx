import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import logoSvg from "@/assets/images/logo_text_untereinander.svg"

function Login() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex w-full h-full items-center justify-center p-6">
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
              <form onSubmit={(e) => { e.preventDefault() }}>
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
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Passwort</FieldLabel>
                      <Link
                        to="/reset-password"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Passwort vergessen?
                      </Link>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
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
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  )
}

export default Login
