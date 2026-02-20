import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

interface PostDialogContextType {
  isOpen: boolean
  initialBookId: number | undefined
  openDialog: (bookId?: number) => void
  closeDialog: () => void
  setIsOpen: (open: boolean) => void
  setInitialBookId: (id: number | undefined) => void
  registerRefreshCallback: (callback: () => void) => void
  unregisterRefreshCallback: (callback: () => void) => void
  triggerRefresh: () => void
}

const PostDialogContext = createContext<PostDialogContextType | null>(null)

export function PostDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [initialBookId, setInitialBookId] = useState<number | undefined>(undefined)
  const [refreshCallbacks, setRefreshCallbacks] = useState<Set<() => void>>(new Set())

  const openDialog = useCallback((bookId?: number) => {
    setInitialBookId(bookId)
    setIsOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setIsOpen(false)
    setInitialBookId(undefined)
  }, [])

  const registerRefreshCallback = useCallback((callback: () => void) => {
    setRefreshCallbacks(prev => new Set(prev).add(callback))
  }, [])

  const unregisterRefreshCallback = useCallback((callback: () => void) => {
    setRefreshCallbacks(prev => {
      const next = new Set(prev)
      next.delete(callback)
      return next
    })
  }, [])

  const triggerRefresh = useCallback(() => {
    refreshCallbacks.forEach(callback => callback())
  }, [refreshCallbacks])

  return (
    <PostDialogContext.Provider
      value={{
        isOpen,
        initialBookId,
        openDialog,
        closeDialog,
        setIsOpen,
        setInitialBookId,
        registerRefreshCallback,
        unregisterRefreshCallback,
        triggerRefresh,
      }}
    >
      {children}
    </PostDialogContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function usePostDialog() {
  const context = useContext(PostDialogContext)
  if (!context) {
    throw new Error("usePostDialog must be used within a PostDialogProvider")
  }
  return context
}
