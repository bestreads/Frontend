import { Star } from "lucide-react"
import { useState } from "react"

interface StarRatingProps {
  rating: number
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  starIconSize?: number
}

export function StarRating({ rating, interactive = false, onRatingChange, starIconSize = 6 }: StarRatingProps) {

  const [hoverRating, setHoverRating] = useState(0)

  const handleRatingClick = (newRating: number) => {
    onRatingChange?.(newRating)
  }

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (interactive ? (hoverRating || rating) : rating)
        const isHovered = interactive && hoverRating >= star

        return (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && handleRatingClick(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={interactive ? "cursor-pointer transition-transform hover:scale-110" : ""}
          >
            <Star
              className={`w-${starIconSize} h-${starIconSize} transition-colors ${isActive
                ? isHovered
                  ? "fill-primary/80 text-primary/80"
                  : "fill-primary text-primary"
                : "fill-gray-300 text-gray-300"
                }`}
            />
          </button>
        )
      })}
    </div>
  )
}