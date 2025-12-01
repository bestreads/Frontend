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

function Signup() {
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
            <form>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="firstname">Vorname</FieldLabel>
                  <Input id="firstname" type="text" placeholder="Max" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="lastname">Nachname</FieldLabel>
                  <Input id="lastname" type="text" placeholder="Mustermann" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="beispiel@email.com"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Passwort</FieldLabel>
                  <Input id="password" type="password" required />
                  <FieldDescription>
                    Muss mindestens 8 Zeichen lang sein.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Passwort bestätigen
                  </FieldLabel>
                  <Input id="confirm-password" type="password" required />
                  <FieldDescription>Bitte bestätige dein Passwort.</FieldDescription>
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
