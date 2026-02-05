import { Outlet } from "react-router";
import Navigation from "./nav/Navigation";
import { CreatePostDialog } from "./CreatePostDialog";
import { PostDialogProvider, usePostDialog } from "@/contexts/PostDialogContext";

function LayoutContent() {
  const { isOpen, setIsOpen, initialBookId, setInitialBookId, triggerRefresh } = usePostDialog();

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setInitialBookId(undefined);
    }
  };

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

      {/* Global Post Dialog */}
      <CreatePostDialog
        open={isOpen}
        onOpenChange={handleDialogClose}
        onPostCreated={triggerRefresh}
        initialBookId={initialBookId}
        onInitialBookIdChange={setInitialBookId}
        showButton={true}
      />
    </div>
  );
}

function Layout() {
  return (
    <PostDialogProvider>
      <LayoutContent />
    </PostDialogProvider>
  );
}

export default Layout;