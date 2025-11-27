import { Link, Outlet } from "react-router";
import {
  NavigationMenu,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"


function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-amber-300 flex gap-3 p-3 place-content-center">

        <NavigationMenu className="flex gap-3">
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/">Home</Link>
          </NavigationMenuLink>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <Link to="/login">Login</Link>
          </NavigationMenuLink>
        </NavigationMenu>

      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;