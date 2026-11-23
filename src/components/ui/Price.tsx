import { clsx } from 'clsx'

interface Props {
  amount: number
  /** Body text instead of Fraunces: bill rows, chips and "each" prices. */
  plain?: boolean
  className?: string
}

/**
 * A price in Fraunces with tabular figures (design.md §4). The rupee sign is set in Inter:
 * Fraunces keeps ₹ in its "Latin extended" file, and one sign would download all 58KB of it.
 */
export default function Price({ amount, plain = false, className }: Props) {
  return (
    <span className={clsx('tabular', plain ? 'font-sans' : 'font-display font-bold', className)}>
      <span className={plain ? undefined : 'font-sans font-semibold'}>₹</span>
      {amount.toLocaleString('en-IN')}
    </span>
  )
}
