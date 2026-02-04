import { StarRating } from "./libraryOptions/StarRating"

interface AvgRatingProps {
  avg: number
  count: number
  starIconSize?: number
  showLabel?: boolean
}

export function AvgRating({ avg, count, starIconSize = 5, showLabel = true }: AvgRatingProps) {
  return (
    <div className="flex flex-col gap-1">
      {showLabel && (
        <span className="text-sm text-muted-foreground">Gesamtbewertung</span>
      )}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="hidden sm:flex">
            <StarRating rating={avg} starIconSize={starIconSize} />
          </span>
          <span className="flex sm:hidden">
            <StarRating rating={avg} starIconSize={starIconSize} />
          </span>
          <span className="text-sm text-muted-foreground">
            ({avg.toFixed(1)}/5)
          </span>
        </div>
        <span className="text-xs text-muted-foreground italic">
        von {count} {count === 1 ? "Nutzer" : "Nutzern"}
        </span>
      </div>
    </div>
  )
}
