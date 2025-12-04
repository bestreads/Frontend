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
import { Lock, Eye, EyeOff, Mail, Pencil, User } from "lucide-react";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Max Mustermann");
  
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempUsername, setTempUsername] = useState<string>("");
  const [tempEmail, setTempEmail] = useState<string>("");
  const [tempPassword, setTempPassword] = useState<string>("");
  const [tempPasswordConfirm, setTempPasswordConfirm] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleUpdateUsername = async (newUsername: string) => {  
    // TODO: Backend-Integration
    console.log("Update username:", newUsername);
    setUserName(newUsername);
  };

  const handleUpdateEmail = async (newEmail: string) => {
    // TODO: Backend-Integration
    console.log("Update email:", newEmail);
  };

  const handleUpdatePassword = async (newPassword: string) => {
    // TODO: Backend-Integration
    console.log("Update password:", newPassword);
  };

  const handleProfileImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
        // TODO: Backend-Integration zum Hochladen
        console.log("Upload profile image:", file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (editingField === "username") {
      handleUpdateUsername(tempUsername);
    } else if (editingField === "email") {
      handleUpdateEmail(tempEmail);
    } else if (editingField === "password") {
      if (tempPassword.length < 8) {
        setPasswordError("Passwort muss mindestens 8 Zeichen lang sein!");
        return;
      }
      if (tempPassword !== tempPasswordConfirm) {
        setPasswordError("Passwörter stimmen nicht überein!");
        return;
      }
      handleUpdatePassword(tempPassword);
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
          <DialogTitle>Profil</DialogTitle>
          <DialogDescription>
            Verwalte deine Profilinformationen.
          </DialogDescription>
        </DialogHeader>

        {/* Profilbild */}
        <div className="flex flex-col items-center py-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profilbild"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                  aria-hidden="true"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </div>
            <label
              htmlFor="profile-image-input"
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
              <input
                id="profile-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
            </label>
          </div>
          <h3 className="mt-3 text-lg font-semibold">{userName}</h3>
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
                <p className="text-sm text-muted-foreground">{userName}</p>
              </div>
              {editingField !== "username" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing("username", userName)}
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
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Abbrechen
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Speichern
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
                <p className="text-sm text-muted-foreground">user@example.com</p>
              </div>
              {editingField !== "email" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing("email", "user@example.com")}
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
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Abbrechen
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Speichern
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
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    Abbrechen
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    Speichern
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