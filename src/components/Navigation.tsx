import { Link, useLocation } from "react-router";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { LogOut, Search, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";

import SettingsDialog from "./SettingsDialog";
import ProfileDialog from "./ProfileDialog";
import logoSvg from "@/assets/images/logo_text_nebeneinander.svg"

function Navigation() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const location = useLocation();
  console.log(location)

  return (
    <>
      <div className="flex items-center w-full px-6 gap-6">
        <Link to="/" className="shrink-0">
          <img src={logoSvg} alt="bestreads logo" className="h-15" />
        </Link>

        {/* Haupt-Navigation */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link
                  to="/"
                  className={location.pathname == "/" ? "underline font-bold" : ""}
                >
                  Startseite
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link
                  to="/library"
                  className={location.pathname == "/library" ? "underline" : ""}
                >
                  Bibliothek
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>


          </NavigationMenuList>
        </NavigationMenu>

        {/* User-Menü rechts */}
        <NavigationMenu viewport={false} className="ml-auto">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button
                onClick={() => alert('Buchsuche')}
                variant="default"
                size="sm"
              >
                <Search className="w-4 h-4 inline mr-2" />
                Buch suchen
              </Button>
            </NavigationMenuItem>

            <NavigationMenuItem className="relative">
              <NavigationMenuTrigger>
                <User className="h-4 w-4 inline mr-2" />
                Mein Profil
              </NavigationMenuTrigger>
              <NavigationMenuContent className="left-auto right-0">
                <ul className="w-48 p-2">
                  <li>
                    <button
                      onClick={() => setProfileOpen(true)}
                      className="w-full px-3 py-2 text-sm hover:bg-accent rounded-md text-left flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Profil
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setSettingsOpen(true)}
                      className="w-full px-3 py-2 text-sm hover:bg-accent rounded-md text-left flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Einstellungen
                    </button>
                  </li>
                  <li>
                    <button className="w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/20 rounded-md text-left flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      Abmelden
                    </button>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}

export default Navigation;
