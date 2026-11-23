import type { CSSProperties, ReactNode } from 'react'
import { clsx } from 'clsx'

type Side = 'left' | 'right' | 'top'

// Points along a torn paper edge: x is the tear depth (in % of a 100-unit box), y the position.
// Paper tears in small, uneven fibres, so the depth stays under 1.6% and the spacing varies.
// Generated once from a fixed seed, so the edge is identical on every render and in every browser.
const TEAR: [number, number][] = (() => {
  let seed = 7
  const next = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const points: [number, number][] = []
  for (let y = 0; y <= 100; y += 0.9 + next() * 1.6) {
    const fibre = next() < 0.18 ? 0.5 : 0 // an occasional deeper notch
    points.push([Number((0.15 + next() * 1.1 + fibre).toFixed(2)), Number(y.toFixed(2))])
  }
  points.push([0.6, 100])
  return points
})()

function maskFor(side: Side): string {
  let points: string
  if (side === 'left') points = `100,0 100,100 ${TEAR.map(([x, y]) => `${x},${100 - y}`).join(' ')}`
  else if (side === 'right') points = `0,0 ${TEAR.map(([x, y]) => `${100 - x},${y}`).join(' ')} 0,100`
  else points = `${TEAR.map(([x, y]) => `${y},${x}`).join(' ')} 100,100 0,100`
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><polygon points='${points}' fill='white'/></svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const MASKS: Record<Side, string> = { left: maskFor('left'), right: maskFor('right'), top: maskFor('top') }

interface Props {
  /** The edge that looks torn. */
  side: Side
  /** A different torn edge from the `lg` breakpoint (1024px) up, for panels that change place. */
  lgSide?: Side
  className?: string
  children: ReactNode
}

/**
 * Gives a panel a torn-paper edge with a CSS mask (design.md §6; modern-web-guidance: complex-shapes).
 * The mask is passed as custom properties and applied by `.torn-edge` in index.css, so a
 * breakpoint can switch the torn side. Browsers without masking show a plain rectangle, so
 * content and layout never depend on the mask.
 */
export default function TornEdge({ side, lgSide, className, children }: Props) {
  const style = {
    '--tear': MASKS[side],
    '--tear-lg': MASKS[lgSide ?? side],
  } as CSSProperties
  return (
    <div className={clsx('torn-edge relative', className)} style={style}>
      {children}
    </div>
  )
}
