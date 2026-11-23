import { useId } from 'react'

/*
 * The Charminar, drawn once for Food Munch as a single-stroke line drawing (design.md §6).
 * It is an original drawing, not traced from the reference or any other artwork.
 *
 * The full drawing is a <symbol>; the skyline reuses it with <use>, so the shape exists once
 * per SVG (modern-web-guidance: icons). Strokes follow `currentColor` and keep their width
 * at every size (`vector-effect: non-scaling-stroke`).
 */

/** The landmark, 240 × 260 units, standing on y = 252. */
function CharminarDrawing() {
  return (
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke">
      {[38, 202].map((x) => (
        <g key={x}>
          {/* Minaret shaft */}
          <path d={`M${x - 9} 252V44M${x + 9} 252V44`} vectorEffect="non-scaling-stroke" />
          {/* Three galleries */}
          {[156, 104, 70].map((y) => (
            <path key={y} d={`M${x - 15} ${y}h30v-6h-30z`} vectorEffect="non-scaling-stroke" />
          ))}
          {/* Onion dome and finial */}
          <path d={`M${x - 9} 44c0-11 9-14 9-24 0 10 9 13 9 24z`} vectorEffect="non-scaling-stroke" />
          <path d={`M${x} 20v-10`} vectorEffect="non-scaling-stroke" />
          <circle cx={x} cy={7} r={2.5} vectorEffect="non-scaling-stroke" />
        </g>
      ))}
      {/* Main body */}
      <path d="M47 252V126h146v126" vectorEffect="non-scaling-stroke" />
      {/* Great central arch, with its inner line */}
      <path d="M90 252v-58c0-26 14-40 30-48 16 8 30 22 30 48v58" vectorEffect="non-scaling-stroke" />
      <path d="M98 252v-54c0-20 10-32 22-39 12 7 22 19 22 39v54" vectorEffect="non-scaling-stroke" />
      {/* Side arches */}
      {[58, 160].map((x) => (
        <path key={x} d={`M${x} 252v-32c0-12 6-19 11-22 5 3 11 10 11 22v32`} vectorEffect="non-scaling-stroke" />
      ))}
      {/* Upper gallery: a band of small arches between the minarets */}
      <path d="M47 126v-22h146v22" vectorEffect="non-scaling-stroke" />
      {[60, 78, 96, 114, 132, 150, 168].map((x) => (
        <path key={x} d={`M${x} 122v-8c0-4 3-6 5-6s5 2 5 6v8`} vectorEffect="non-scaling-stroke" />
      ))}
      {/* Parapet with its crenellations */}
      <path d="M47 104v-8h146v8" vectorEffect="non-scaling-stroke" />
      <path
        d="M58 96v-5h8v5M80 96v-5h8v5M102 96v-5h8v5M130 96v-5h8v5M152 96v-5h8v5M174 96v-5h8v5"
        vectorEffect="non-scaling-stroke"
      />
      {/* Ground line */}
      <path d="M14 252h212" vectorEffect="non-scaling-stroke" />
    </g>
  )
}

/** The 32 × 32 logo version: two minarets and the great arch, readable at 24px. */
function MarkDrawing() {
  return (
    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 29V9.5M10 29V9.5M22 29V9.5M26 29V9.5" />
      <path d="M6 9.5c0-2.6 2-3.2 2-5.5 0 2.3 2 2.9 2 5.5M22 9.5c0-2.6 2-3.2 2-5.5 0 2.3 2 2.9 2 5.5" />
      <path d="M10 29V15h12v14" />
      <path d="M12.5 29v-6c0-3 1.6-4.6 3.5-5.6 1.9 1 3.5 2.6 3.5 5.6v6" />
      <path d="M10 15v-2.5h12V15" />
      <path d="M3 29h26" />
    </g>
  )
}

interface Props {
  /** `mark`: logo size. `art`: large drawing behind the hero dish. `skyline`: footer edge. */
  variant: 'mark' | 'art' | 'skyline'
  className?: string
  /** Stroke width in screen pixels for the art and skyline (the mark scales with its box). */
  strokeWidth?: number
}

export default function CharminarMark({ variant, className, strokeWidth = 1.5 }: Props) {
  const symbolId = `fm-charminar-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`

  if (variant === 'mark') {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className={className} strokeWidth={1.75}>
        <MarkDrawing />
      </svg>
    )
  }

  if (variant === 'art') {
    return (
      <svg viewBox="0 0 240 260" aria-hidden="true" focusable="false" className={className} strokeWidth={strokeWidth}>
        <CharminarDrawing />
      </svg>
    )
  }

  // Skyline: the Charminar at the centre, with low domes and rooftops either side.
  return (
    <svg
      viewBox="0 0 1200 140"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
      className={className}
      strokeWidth={strokeWidth}
    >
      <defs>
        <symbol id={symbolId} viewBox="0 0 240 260">
          <CharminarDrawing />
        </symbol>
      </defs>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path
          vectorEffect="non-scaling-stroke"
          d="M0 132h1200M60 132v-22h70v22M90 110c0-14 15-18 15-28 0 10 15 14 15 28M170 132v-34h56v34M190 98v-10h16v10M262 132v-18h84v18M286 114c0-10 16-12 16-22 0 10 16 12 16 22M380 132v-26h54v26M470 132v-14h40v14"
        />
        <path
          vectorEffect="non-scaling-stroke"
          d="M690 132v-14h40v14M766 132v-26h54v26M854 132v-18h84v18M878 114c0-10 16-12 16-22 0 10 16 12 16 22M974 132v-34h56v34M994 98v-10h16v10M1070 132v-22h70v22M1090 110c0-14 15-18 15-28 0 10 15 14 15 28"
        />
      </g>
      <use href={`#${symbolId}`} x="540" y="0" width="120" height="132" />
    </svg>
  )
}
