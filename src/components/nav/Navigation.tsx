import { Link, useLocation } from "react-router";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { LogOut, Search, Settings, User, Menu, Library, House, UserPen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import SettingsDialog from "./SettingsDialog";
import ProfileDialog from "./ProfileDataDialog";
import BookSearchDialog from "../BookSearchDialog";
import { FollowListDialog } from "../FollowListDialog";
import logoSvgN from "@/assets/images/logo_text_nebeneinander.svg"
import { useAuth } from "@/contexts/Authcontext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

function Navigation() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookSearchOpen, setBookSearchOpen] = useState(false);
  const [followDialogOpen, setFollowDialogOpen] = useState(false);
  const [followInitialTab, setFollowInitialTab] = useState<"followers" | "following">("followers");
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <>
      <div className="flex items-center px-6 gap-6">
        <Link to="/" className="shrink-0">
          <img src={logoSvgN} alt="bestreads logo" className="h-15" />
        </Link>

        {/* Mobile Menu Button */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden ml-auto">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
            <SheetHeader>
              <SheetTitle>
                <div className="flex flex-col items-center justify-center gap-4">
                  <Avatar className="border-2 h-20 w-20">
                    <AvatarImage src={user?.profilePicture} />
                    <AvatarFallback>
                      <User className="h-4 w-4 inline" />
                    </AvatarFallback>
                  </Avatar>
                  <h1 className="text-xl font-semibold">
                    {user?.username}
                  </h1>
                </div>
              </SheetTitle>
            </SheetHeader>
            <hr className="my-2" />
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-md hover:bg-accent flex items-center gap-2 ${location.pathname === "/" ? "bg-accent-foreground" : ""
                  }`}
              >
                <House className="w-4 h-4" />
                Startseite
              </Link>
              <Link
                to="/library"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2 rounded-md hover:bg-accent flex items-center gap-2 ${location.pathname === "/library" ? "bg-accent-foreground" : ""
                  }`}
              >
                <Library className="w-4 h-4" />
                Bibliothek
              </Link>
              <Button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setBookSearchOpen(true);
                }}
                variant="default"
                className="justify-start"
              >
                <Search className="w-4 h-4 inline mr-2" />
                Buch suchen
              </Button>
              <hr className="my-2" />
              <Link
                to={`/profile/${user?.userId}`}
                className="px-4 py-2 rounded-md hover:bg-accent text-left flex items-center gap-2"
                onClick={() => { setMobileMenuOpen(false) }}
              >
                <User className="w-4 h-4" />
                Mein Profil
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setFollowInitialTab("followers");
                  setFollowDialogOpen(true);
                }}
                className="px-4 py-2 rounded-md hover:bg-accent text-left flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Follower & Gefolgt
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setProfileOpen(true);
                }}
                className="px-4 py-2 rounded-md hover:bg-accent text-left flex items-center gap-2"
              >
                <UserPen className="w-4 h-4" />
                Meine Daten
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSettingsOpen(true);
                }}
                className="px-4 py-2 rounded-md hover:bg-accent text-left flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Einstellungen
              </button>
              <button className="px-4 py-2 rounded-md hover:bg-destructive/20 text-destructive text-left flex items-center gap-2"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}>
                <LogOut className="w-4 h-4" />
                Abmelden
              </button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Haupt-Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className=" md:flex gap-6">
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/"
                  className={`px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground flex flex-row items-center gap-2 ${location.pathname === "/" ? "bg-accent-foreground" : ""}`}
                >
                  <House className="w-4 h-4 text-current" />
                  Startseite
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link
                  to="/library"
                  className={` flex flex-row items-center gap-2 px-4 py-2 text-sm font-medium rounded-md 
                    hover:bg-accent hover:text-accent-foreground 
                    ${location.pathname === "/library" ? "bg-accent-foreground" : ""}`}
                >
                  <Library className="w-4 h-4 text-current" />
                  Bibliothek
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop User-Menü rechts */}
        <NavigationMenu viewport={false} className="ml-auto hidden md:flex">
          <NavigationMenuList className="md:flex gap-6">
            <NavigationMenuItem>
              <Button
                onClick={() => setBookSearchOpen(true)}
                variant="default"
                className="flex gap-2"
              >
                <Search className="w-4 h-4" />
                Buch suchen
              </Button>
            </NavigationMenuItem>

            <NavigationMenuItem className="relative group/trigger">
              <NavigationMenuTrigger className="flex gap-2 items-center ">
                <Avatar className="border-2">
                  <AvatarImage src={user?.profilePicture} />
                  <AvatarFallback>
                    <User className="h-4 w-4 inline transition-colors group-hover/trigger:text-accent" />
                  </AvatarFallback>
                </Avatar>
                <h1 className=" hidden lg:flex">
                  {user?.username}
                </h1>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="left-auto right-0 min-w-[220px]">
                <ul className="p-2 space-y-2 whitespace-nowrap">
                  <li>
                    <Link
                      to={`/profile/${user?.userId}`}
                      className="w-full px-3 py-2 text-sm hover:bg-accent rounded-md text-left flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Mein Profil
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setFollowInitialTab("followers");
                        setFollowDialogOpen(true);
                      }}
                      className="w-full px-3 py-2 text-sm hover:bg-accent rounded-md text-left flex items-center gap-2"
                    >
                      <Users className="w-4 h-4" />
                      Follower & Gefolgt
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setProfileOpen(true)}
                      className="w-full px-3 py-2 text-sm hover:bg-accent rounded-md text-left flex items-center gap-2"
                    >
                      <UserPen className="w-4 h-4" />
                      Meine Daten
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
                    <button
                      onClick={() => logout()}
                      className="w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/20 rounded-md text-left flex items-center gap-2">
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
      <BookSearchDialog open={bookSearchOpen} onOpenChange={setBookSearchOpen} />
      <FollowListDialog
        open={followDialogOpen}
        onOpenChange={setFollowDialogOpen}
        userId={user!.userId}
        initialTab={followInitialTab}
      />
    </>
  );
}

export default Navigation;
