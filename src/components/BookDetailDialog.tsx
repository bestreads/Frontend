import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Plus, X, RefreshCw } from "lucide-react"
import { bookStateLabels } from "@/types/book"
import type { Book, BookState } from "@/types/book"

interface BookDetailDialogProps {
  book: Book | null
  open: boolean
  onOpenChange: (open: boolean) => void
  isInLibrary?: boolean
  currentStatus?: BookState
  onStatusChange?: (book: Book, status: BookState) => void
}

/**
 * Fügt ein Buch zur Bibliothek hinzu oder aktualisiert den Status.
 * @param book - Das Buch
 * @param status - Der gewählte Status
 * @param isUpdate - Ob es ein Update (true) oder ein Hinzufügen (false) ist
 */
async function updateBookStatus(book: Book, status: BookState, isUpdate: boolean): Promise<void> {
  // TODO: Backend-Integration mit axios
  // if (isUpdate) {
  //   await axios.put(`/api/library/${book.ISBN}`, { status })
  // } else {
  //   await axios.post('/api/library', { isbn: book.ISBN, status })
  // }
  
  console.log(isUpdate ? "Update Buchstatus:" : "Buch zur Bibliothek hinzufügen:", {
    isbn: book.ISBN,
    title: book.Title,
    status: status,
  })
}

export function BookDetailDialog({
  book,
  open,
  onOpenChange,
  isInLibrary = false,
  currentStatus,
  onStatusChange,
}: BookDetailDialogProps) {
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false)

  if (!book) return null

  const handleStatusSelect = async (status: BookState) => {
    await updateBookStatus(book, status, isInLibrary)
    
    if (onStatusChange) {
      onStatusChange(book, status)
    }
    
    setIsStatusPopoverOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        showCloseButton={false}
      >
        <DialogHeader className="flex-row items-start justify-between gap-4">
          <div className="sr-only">
            <DialogTitle>{book.Title}</DialogTitle>
            <DialogDescription>
              Buchdetails für {book.Title} von {book.Author}
            </DialogDescription>
          </div>
          <div className="flex gap-2 ml-auto">
            {/* Status-Button: + für Hinzufügen, RefreshCw für Update */}
            <Popover open={isStatusPopoverOpen} onOpenChange={setIsStatusPopoverOpen}>
              <PopoverTrigger asChild>
                {isInLibrary ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Status ändern"
                    className="text-primary hover:text-primary/80 hover:bg-primary/10"
                  >
                    <RefreshCw className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Zur Bibliothek hinzufügen"
                    className="text-green-600 hover:text-green-700 hover:bg-green-100"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                )}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="end">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium px-2 py-1 text-muted-foreground">
                    {isInLibrary ? "Status ändern" : "Zur Bibliothek hinzufügen"}
                  </p>
                  <Button
                    variant={currentStatus === "want-to-read" ? "default" : "ghost"}
                    className="justify-start"
                    size="sm"
                    onClick={() => handleStatusSelect("want-to-read")}
                  >
                    {bookStateLabels["want-to-read"]}
                  </Button>
                  <Button
                    variant={currentStatus === "reading" ? "default" : "ghost"}
                    className="justify-start"
                    size="sm"
                    onClick={() => handleStatusSelect("reading")}
                  >
                    {bookStateLabels["reading"]}
                  </Button>
                  <Button
                    variant={currentStatus === "read" ? "default" : "ghost"}
                    className="justify-start"
                    size="sm"
                    onClick={() => handleStatusSelect("read")}
                  >
                    {bookStateLabels["read"]}
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              title="Schließen"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Buch-Informationen */}
        <div className="flex gap-6">
          {/* Buchcover */}
          <div className="shrink-0">
            <img
              src={book.CoverURL || "/placeholder-book.png"}
              alt={`Cover von ${book.Title}`}
              className="w-36 h-52 object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-3">
            <div>
              <span className="text-sm text-muted-foreground">Titel</span>
              <h2 className="text-2xl font-bold">{book.Title}</h2>
            </div>

            <div>
              <span className="text-sm text-muted-foreground">Autor</span>
              <p className="text-lg font-medium">{book.Author}</p>
            </div>

            <div>
              <span className="text-sm text-muted-foreground">Erscheinungsjahr</span>
              <p className="text-base">{book.ReleaseDate}</p>
            </div>

            {book.Genre && (
              <div>
                <span className="text-sm text-muted-foreground">Genre</span>
                <div className="mt-1">
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-secondary text-secondary-foreground rounded-full">
                    {book.Genre}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-4" />

        {/* Beschreibung */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Beschreibung</h3>
          <p className="text-muted-foreground leading-relaxed">
            {book.Description || "Keine Beschreibung verfügbar."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
