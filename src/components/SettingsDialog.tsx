import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useTheme } from "@/components/theme-provider"

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Einstellungen</DialogTitle>
          <DialogDescription>
            Passe deine App-Einstellungen an.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-3">
            <label className="text-sm font-medium">
              Theme
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="system"
                  checked={theme === "system"}
                  onChange={() => setTheme("system")}
                  className="h-4 w-4"
                />
                <div>
                  <div className="text-sm font-medium">System</div>
                  <div className="text-xs text-muted-foreground">Browser-Einstellung verwenden</div>
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="light"
                  checked={theme === "light"}
                  onChange={() => setTheme("light")}
                  className="h-4 w-4"
                />
                <div>
                  <div className="text-sm font-medium">Light</div>
                  <div className="text-xs text-muted-foreground">Helles Farbschema</div>
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="theme"
                  value="dark"
                  checked={theme === "dark"}
                  onChange={() => setTheme("dark")}
                  className="h-4 w-4"
                />
                <div>
                  <div className="text-sm font-medium">Dark</div>
                  <div className="text-xs text-muted-foreground">Dunkles Farbschema</div>
                </div>
              </label>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm border rounded-md hover:bg-accent"
          >
            Abbrechen
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Speichern
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsDialog;
