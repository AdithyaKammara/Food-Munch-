import { clsx } from 'clsx'

interface Props {
  className?: string
}

/**
 * The hand-drawn copper underline under the hero's accent word and beside section labels
 * (design.md §6). It stretches to the width it is given, with the stroke kept at 3px.
 * `pathLength="1"` lets the motion layer draw it in with stroke-dashoffset.
 */
export default function Flourish({ className }: Props) {
  return (
    <svg viewBox="0 0 220 24" preserveAspectRatio="none" aria-hidden="true" focusable="false" className={clsx('text-copper-500', className)}>
      <path
        data-flourish
        pathLength={1}
        d="M4 15C46 8 104 5 160 8c22 1 40 3 56 6M150 15c18-3 36-3 54 1"
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
