import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, Eye, EyeOff, Mail, Pencil, User, Camera } from "lucide-react";
import { useAuth } from "@/contexts/Authcontext";
import { updateUserData } from "@/api/userService";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { user, handleUserData } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempUsername, setTempUsername] = useState<string>("");
  const [tempEmail, setTempEmail] = useState<string>("");
  const [tempPassword, setTempPassword] = useState<string>("");
  const [tempPasswordConfirm, setTempPasswordConfirm] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleUpdateUsername = async (newUsername: string) => {
    setIsSaving(true);
    try {
      await updateUserData({ username: newUsername });
      await handleUserData();
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Benutzernamens:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateEmail = async (newEmail: string) => {
    setIsSaving(true);
    try {
      await updateUserData({ email: newEmail });
      await handleUserData();
    } catch (error) {
      console.error("Fehler beim Aktualisieren der E-Mail:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (newPassword: string) => {
    setIsSaving(true);
    try {
      await updateUserData({ password: newPassword });
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Passworts:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsSaving(true);
      try {
        await updateUserData({ profilePicture: file });
        await handleUserData();
      } catch (error) {
        console.error("Fehler beim Hochladen des Profilbilds:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSave = async () => {
    if (editingField === "username") {
      await handleUpdateUsername(tempUsername);
    } else if (editingField === "email") {
      await handleUpdateEmail(tempEmail);
    } else if (editingField === "password") {
      if (tempPassword.length < 12) {
        setPasswordError("Passwort muss mindestens 12 Zeichen lang sein!");
        return;
      }
      if (tempPassword !== tempPasswordConfirm) {
        setPasswordError("Passwörter stimmen nicht überein!");
        return;
      }
      await handleUpdatePassword(tempPassword);
    }
    setEditingField(null);
    setTempUsername("");
    setTempEmail("");
    setTempPassword("");
    setTempPasswordConfirm("");
    setPasswordError("");
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempUsername("");
    setTempEmail("");
    setTempPassword("");
    setTempPasswordConfirm("");
    setPasswordError("");
  };

  const startEditing = (field: string, currentValue: string = "") => {
    setEditingField(field);
    if (field === "username") setTempUsername(currentValue);
    if (field === "email") setTempEmail(currentValue);
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Reset alle Felder wenn Dialog geschlossen wird
      handleCancel();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Meine Daten</DialogTitle>
          <DialogDescription>
            Verwalte deine BestReads-Informationen.
          </DialogDescription>
        </DialogHeader>

        {/* Profilbild */}
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center border-2">
              {user?.profilePictureURL ? (
                <img
                  src={user.profilePictureURL}
                  alt="Profilbild"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            <label
              htmlFor="profile-image-input"
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <Camera className="w-4 h-4 text-primary-foreground" />
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
                disabled={isSaving}
              />
            </label>
          </div>
          <h3 className="mt-3 text-lg font-semibold">{user?.username || "Unbekannter Benutzer"}</h3>
        </div>

        {/* Bearbeitbare Felder */}
        <div className="space-y-4 py-4">
          {/* Benutzername ändern */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <label className="text-sm font-medium">Benutzername</label>
                </div>
                <p className="text-sm text-muted-foreground">{user?.username}</p>
              </div>
              {editingField !== "username" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing("username", user?.username || "")}
                  disabled={isSaving}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
            {editingField === "username" && (
              <div className="space-y-2 pt-2">
                <Input
                  type="text"
                  placeholder="Neuer Benutzername"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                    Abbrechen
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Speichern..." : "Speichern"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Email ändern */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <label className="text-sm font-medium">E-Mail</label>
                </div>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              {editingField !== "email" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing("email", user?.email || "")}
                  disabled={isSaving}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
            {editingField === "email" && (
              <div className="space-y-2 pt-2">
                <Input
                  type="email"
                  placeholder="Neue E-Mail-Adresse"
                  value={tempEmail}
                  onChange={(e) => setTempEmail(e.target.value)}
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                    Abbrechen
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Speichern..." : "Speichern"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Passwort ändern */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  <label className="text-sm font-medium">Passwort</label>
                </div>
                <p className="text-sm text-muted-foreground">••••••••</p>
              </div>
              {editingField !== "password" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing("password")}
                  disabled={isSaving}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
            </div>
            {editingField === "password" && (
              <div className="space-y-2 pt-2">
                {passwordError && (
                  <p className="text-sm text-destructive font-medium">{passwordError}</p>
                )}
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Neues Passwort"
                    value={tempPassword}
                    onChange={(e) => {
                      setTempPassword(e.target.value);
                      setPasswordError("");
                    }}
                    aria-invalid={passwordError ? "true" : "false"}
                    className="pr-10"
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
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Passwort wiederholen"
                    value={tempPasswordConfirm}
                    onChange={(e) => {
                      setTempPasswordConfirm(e.target.value);
                      setPasswordError("");
                    }}
                    aria-invalid={passwordError ? "true" : "false"}
                    className="pr-10"
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
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel} disabled={isSaving}>
                    Abbrechen
                  </Button>
                  <Button size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Speichern..." : "Speichern"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileDialog;