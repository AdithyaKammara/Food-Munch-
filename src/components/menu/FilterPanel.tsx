import { useEffect, useRef, type ReactNode } from 'react'
import * as Switch from '@radix-ui/react-switch'
import { BicepsFlexed, ChevronDown, Heart, Leaf } from 'lucide-react'
import type { SortKey } from '../../lib/menuFilters'
import { HIGH_PROTEIN_GRAMS } from '../../lib/menuFilters'
import { buttonClasses } from '../ui/buttonClasses'
import type { FilterValues } from './categories'


interface Props {
  id: string
  values: FilterValues
  onChange: (next: Partial<FilterValues>) => void
  favouriteCount: number
  onClearAll: () => void
}

const SORTS: { value: SortKey; label: string }[] = [
  { value: 'default', label: 'Recommended' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'rating-desc', label: 'Rating: high to low' },
  { value: 'protein-desc', label: 'Protein: high to low' },
  { value: 'prep-asc', label: 'Fastest to prepare' },
]

/**
 * The Filter button's panel: a native popover (modern-web-guidance: declarative-dialog-popover-control).
 * The button opens it with `popovertarget`, so the browser handles light dismiss, Escape,
 * `aria-expanded` and returning focus. CSS anchor positioning places it under the button
 * (`.filter-panel` in index.css); where that is missing, a few lines below place it instead.
 * Browsers without popovers show it as a plain panel under the toolbar, still usable.
 */
export default function FilterPanel({ id, values, onChange, favouriteCount, onClearAll }: Props) {
  const panel = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = panel.current
    if (!el || globalThis.CSS?.supports?.('position-area: block-end')) return
    const place = () => {
      const trigger = document.querySelector<HTMLElement>(`[popovertarget="${id}"]`)
      if (!trigger || !el.matches(':popover-open')) return
      const r = trigger.getBoundingClientRect()
      const width = el.offsetWidth
      el.style.top = `${Math.round(r.bottom + 8)}px`
      el.style.left = `${Math.round(Math.min(Math.max(16, r.right - width), innerWidth - width - 16))}px`
    }
    el.addEventListener('toggle', place)
    addEventListener('scroll', place, { passive: true })
    addEventListener('resize', place)
    return () => {
      el.removeEventListener('toggle', place)
      removeEventListener('scroll', place)
      removeEventListener('resize', place)
    }
  }, [id])

  // "Done" hides the panel from inside it, so focus goes back to the Filter button by hand.
  const done = () => {
    panel.current?.hidePopover?.()
    document.querySelector<HTMLElement>(`[popovertarget="${id}"]`)?.focus()
  }

  return (
    <div
      ref={panel}
      id={id}
      popover="auto"
      role="dialog"
      aria-labelledby={`${id}-title`}
      className="filter-panel w-[min(20rem,calc(100vw-2rem))] rounded-md border border-line-200 bg-cream-50 p-5 text-ink-900 shadow-lift"
    >
      <h3 id={`${id}-title`} className="font-display text-title font-semibold">
        Filters
      </h3>

      <div className="mt-3 divide-y divide-line-200">
        <SwitchRow
          id={`${id}-veg`}
          label="Veg only"
          icon={<Leaf size={16} aria-hidden="true" className="fill-veg text-veg" />}
          checked={values.vegOnly}
          onChange={(vegOnly) => onChange({ vegOnly })}
        />
        <SwitchRow
          id={`${id}-protein`}
          label={`High protein (${HIGH_PROTEIN_GRAMS}g+)`}
          icon={<BicepsFlexed size={16} aria-hidden="true" />}
          checked={values.highProtein}
          onChange={(highProtein) => onChange({ highProtein })}
        />
        <SwitchRow
          id={`${id}-favs`}
          label={`Favourites (${favouriteCount})`}
          icon={<Heart size={16} aria-hidden="true" className="text-nonveg" />}
          checked={values.favouritesOnly}
          onChange={(favouritesOnly) => onChange({ favouritesOnly })}
        />
      </div>

      <label htmlFor={`${id}-sort`} className="mt-4 block text-sm font-semibold">
        Sort by
      </label>
      <span className="relative mt-1.5 block">
        <select
          id={`${id}-sort`}
          value={values.sort}
          onChange={(e) => onChange({ sort: e.target.value as SortKey })}
          className="h-11 w-full appearance-none rounded-sm border border-field-500 bg-cream-50 pl-3 pr-10 text-[0.9375rem] hover:border-copper-600"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <ChevronDown size={16} aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
      </span>

      <div className="mt-5 flex items-center justify-between gap-3">
        <button type="button" onClick={onClearAll} className="min-h-11 text-sm font-semibold text-copper-700 underline-offset-4 hover:underline">
          Clear filters
        </button>
        <button type="button" onClick={done} className={buttonClasses('primary', 'md', 'h-11 px-5 text-[0.9375rem]')}>
          Done
        </button>
      </div>
    </div>
  )
}

function SwitchRow({
  id,
  label,
  icon,
  checked,
  onChange,
}: {
  id: string
  label: string
  icon: ReactNode
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <label htmlFor={id} className="inline-flex min-h-11 flex-1 cursor-pointer items-center gap-2 text-[0.9375rem] font-medium">
        {icon}
        {label}
      </label>
      <Switch.Root
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        className="relative h-6 w-11 shrink-0 rounded-full bg-line-200 transition-colors before:absolute before:inset-x-0 before:-inset-y-2.5 before:content-[''] data-[state=checked]:bg-copper-600"
      >
        <Switch.Thumb className="block size-5 translate-x-0.5 rounded-full bg-cream-50 shadow transition-[translate] data-[state=checked]:translate-x-[22px] motion-reduce:transition-none" />
      </Switch.Root>
    </div>
  )
}
