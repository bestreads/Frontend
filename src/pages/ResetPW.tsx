import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router"

function ResetPW() {
  return (
    <div className="flex w-full h-full items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <img src="src/assets/images/logo_komplett_klein.png" alt="bestreads logo"
          className="m-auto w-50" />
        <div className="flex flex-col gap-6 m-6">
          <Card>
            <CardHeader>
              <CardTitle>Passwort zurücksetzen</CardTitle>
              <CardDescription>
                Gib deine Email-Adresse ein. Wir senden dir einen Link zum Zurücksetzen deines Passworts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="beispiel@email.com"
                      required
                    />
                    <FieldDescription>
                      Wir senden dir einen Link an diese Email-Adresse.
                    </FieldDescription>
                  </Field>
                  <Field>
                    <Button type="submit">Link senden</Button>
                    <FieldDescription className="text-center">
                      Zurück zur <Link to="/login">Anmeldung</Link>
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

export default ResetPW
