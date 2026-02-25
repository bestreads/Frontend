import { Fragment } from "react"

/**
 * Parst eine Bio-Beschreibung und rendert Links im Format text[url].
 * Beispiel: "Schau mal auf Google[https://google.com] vorbei!" 
 *   → "Schau mal auf " + <a href="https://google.com">Google</a> + " vorbei!"
 */

// Regex: erfasst "linktext[url]"
const LINK_REGEX = /([^\s\[\]]+)\[(https?:\/\/[^\]]+)\]/g

interface BioRendererProps {
  text: string
  className?: string
}

function BioRenderer({ text, className }: BioRendererProps) {
  const lines = text.split("\n")

  const parseLine = (line: string): (string | React.ReactElement)[] => {
    const parts: (string | React.ReactElement)[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null

    const regex = new RegExp(LINK_REGEX.source, "g")

    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.slice(lastIndex, match.index))
      }

      const linkText = match[1]
      const url = match[2]

      parts.push(
        <a
          key={match.index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {linkText}
        </a>
      )

      lastIndex = match.index + match[0].length
    }

    if (lastIndex < line.length) {
      parts.push(line.slice(lastIndex))
    }

    return parts
  }

  return (
    <span className={className}>
      {lines.map((line, lineIndex) => (
        <Fragment key={lineIndex}>
          {lineIndex > 0 && <br />}
          {parseLine(line).map((part, i) => (
            <Fragment key={i}>{part}</Fragment>
          ))}
        </Fragment>
      ))}
    </span>
  )
}

export default BioRenderer
