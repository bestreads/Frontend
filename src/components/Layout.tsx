import { Link, Outlet } from "react-router";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import ProfileDialog from "./ProfileDialog";
import SettingsDialog from "./SettingsDialog";
import { LogOut, Settings, User } from "lucide-react";


function Layout() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-amber-300 flex gap-3 p-3 place-content-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link to="/login">Login</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" className={navigationMenuTriggerStyle()}>
                    Mein Profil
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="flex flex-col gap-1">
                    <button 
                      onClick={() => setProfileOpen(true)}
                      className="px-3 py-2 text-sm hover:bg-accent rounded-md text-left flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Profil
                    </button>
                    <button 
                      onClick={() => setSettingsOpen(true)}
                      className="px-3 py-2 text-sm hover:bg-accent rounded-md text-left flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Einstellungen
                    </button>
                    <button className="px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md text-left flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Abmelden
                    </button>
                  </div>
                </PopoverContent>
              </Popover>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </header>

      <main className="flex-1 bg-background ">
        <Outlet />
      </main>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

export default Layout;