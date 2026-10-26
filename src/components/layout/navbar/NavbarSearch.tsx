import { Search, X } from 'lucide-react'
import { useUiStore } from '../../../store/uiStore'

/** Shares its text with the menu search; pressing Enter scrolls to the menu. */
export default function NavbarSearch({ id, onSubmit }: { id: string; onSubmit?: () => void }) {
  const query = useUiStore((s) => s.menuQuery)
  const setQuery = useUiStore((s) => s.setMenuQuery)

  return (
    <form
      role="search"
      className="relative w-full"
      onSubmit={(e) => {
        e.preventDefault()
        document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
        onSubmit?.()
      }}
    >
      <label htmlFor={id} className="sr-only">
        Search dishes
      </label>
      <Search
        size={19}
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink"
      />
      <input
        id={id}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search dishes..."
        className="w-full rounded-full border border-[#eee2c8] bg-white py-3 pl-11 pr-10 text-sm placeholder:text-muted focus:border-gold [&::-webkit-search-cancel-button]:hidden"
      />
      {query && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setQuery('')}
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-muted hover:bg-cream-deep hover:text-ink"
        >
          <X size={15} aria-hidden="true" />
        </button>
      )}
    </form>
  )
}
