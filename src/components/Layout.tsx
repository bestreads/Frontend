import { Navigate, Outlet } from "react-router";
import Navigation from "./Navigation";
import { useAuth } from "@/contexts/Authcontext";


function Layout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Lädt...</div>; // Oder Spinner-Component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background shadow-xl border-b">
        <Navigation />
      </header>

      <main className="flex-1 bg-linear-to-br from-background to-secondary/10 overflow-auto">
        <Outlet />
      </main>
      <footer>
      </footer>
    </div>
  );
}

export default Layout;