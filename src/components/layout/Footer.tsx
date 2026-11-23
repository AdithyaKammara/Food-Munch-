import { useRef, useState, type ReactNode } from 'react'
import { Mail } from 'lucide-react'
import type { MenuCategory } from '../../data/menu'
import { useReveal } from '../../lib/useReveal'
import { useUiStore } from '../../store/uiStore'
import CharminarMark from '../brand/CharminarMark'
import OrnamentBorder from '../brand/OrnamentBorder'
import Wordmark from '../brand/Wordmark'
import { CATEGORIES } from '../menu/categories'
import { buttonClasses } from '../ui/buttonClasses'
import Modal from '../ui/Modal'

// Creative Commons photos need their author, source and licence shown.
const photoCredits = [
  {
    dish: 'Veg Spring Rolls',
    author: 'Srujanabotcha',
    source: 'https://commons.wikimedia.org/wiki/File:Golden_Vegetable_Spring_Rolls_Served_with_Dipping_Sauce.jpg',
    licence: 'CC BY-SA 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    dish: 'Chicken 65',
    author: 'Jose Nicdao',
    source: 'https://commons.wikimedia.org/wiki/File:Chicken-65.jpg',
    licence: 'CC BY 2.0',
    licenceUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  {
    dish: 'Our story photo (the Charminar, resized)',
    author: 'Theanjalivarma',
    source: 'https://commons.wikimedia.org/wiki/File:Charminar-Hyderabad-Telangana-001.jpg',
    licence: 'CC BY-SA 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  {
    dish: 'Alphonso Mango Lassi',
    author: 'Nithyasrm',
    source: 'https://commons.wikimedia.org/wiki/File:Tasty_Mango_lassi_picture.JPG',
    licence: 'CC BY-SA 4.0',
    licenceUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
]

const DEVELOPER_EMAIL = 'adithyakammara13@gmail.com'

// Only real profiles: the restaurant itself has no social accounts (it is a demo).
const socials = [
  { href: 'https://github.com/AdithyaKammara', label: 'Adithya Kammara on GitHub', icon: GitHubMark },
  { href: 'https://www.linkedin.com/in/adithyakammara', label: 'Adithya Kammara on LinkedIn', icon: LinkedInMark },
]

// Links and link-like buttons: 15px cream at 85%, a 44px tap height on touch screens.
const linkClass =
  'inline-flex items-center py-1 text-[0.9375rem] text-cream-50/85 transition-colors hover:text-gold-300 hover:underline underline-offset-4 pointer-coarse:min-h-11'

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div data-reveal>
      <h2 className="font-display text-lg font-semibold text-gold-300">{title}</h2>
      <ul className="mt-4 space-y-1.5 pointer-coarse:space-y-0">{children}</ul>
    </div>
  )
}

/**
 * The footer (component-guidelines.md §14): a forest band under the Charminar skyline, with the
 * brand, three groups of real links only (implementation-plan.md C5), the demo newsletter, and the
 * ornamental border along the bottom edge.
 */
export default function Footer() {
  const ref = useReveal<HTMLElement>()
  const year = new Date().getFullYear()
  const [policy, setPolicy] = useState<'privacy' | 'terms' | 'credits' | null>(null)
  const setMenuCategory = useUiStore((s) => s.setMenuCategory)
  const openPanel = useUiStore((s) => s.openPanel)

  const showCategory = (id: MenuCategory) => setMenuCategory(id)

  return (
    <footer ref={ref} id="contact" tabIndex={-1} className="on-forest relative bg-forest-900 text-cream-50 outline-none">
      {/* The skyline along the top edge: the Charminar's third and last appearance (design.md §2) */}
      <CharminarMark
        variant="skyline"
        strokeWidth={1.25}
        className="pointer-events-none mx-auto block h-16 w-full max-w-[77.5rem] px-4 pt-4 text-gold-400/60 sm:h-20 sm:px-6 lg:h-24 lg:px-8"
      />

      <div className="mx-auto grid max-w-[77.5rem] gap-x-10 gap-y-10 px-4 pb-12 pt-8 sm:grid-cols-2 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2.3fr)_minmax(0,1.4fr)] lg:px-8">
        {/* Brand */}
        <div data-reveal className="sm:col-span-2 lg:col-span-1">
          <Wordmark tone="light" />
          <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed text-cream-50/80">
            Hyderabadi biryanis and favourites, on a demo ordering site built as a portfolio project.
          </p>
          <ul className="mt-5 flex gap-3">
            {socials.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-full border border-cream-50/30 text-cream-50 transition-colors hover:border-gold-300 hover:text-gold-300"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-8 sm:col-span-2 min-[560px]:grid-cols-3 lg:col-span-1">
          <Group title="Menu">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <a href="#menu" onClick={() => showCategory(c.id)} className={linkClass}>
                  {c.label}
                </a>
              </li>
            ))}
          </Group>

          <Group title="Help">
            <li>
              <button type="button" onClick={() => openPanel('tracking')} className={linkClass}>
                Track order
              </button>
            </li>
            <li>
              <button type="button" onClick={() => openPanel('history')} className={linkClass}>
                Order history
              </button>
            </li>
            <li>
              <a href={`mailto:${DEVELOPER_EMAIL}`} className={linkClass}>
                Contact
              </a>
            </li>
          </Group>

          <Group title="Legal">
            <li>
              <button type="button" onClick={() => setPolicy('privacy')} className={linkClass}>
                Privacy
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setPolicy('terms')} className={linkClass}>
                Terms
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setPolicy('credits')} className={linkClass}>
                Photo credits
              </button>
            </li>
          </Group>
        </nav>

        {/* Newsletter */}
        <div data-reveal className="sm:col-span-2 lg:col-span-1">
          <h2 className="font-display text-lg font-semibold text-gold-300">Stay in the loop</h2>
          <p className="mt-4 text-[0.9375rem] leading-relaxed text-cream-50/85">
            New dishes and promo codes, now and then.
          </p>
          <SubscribeForm />
        </div>
      </div>

      <div className="mx-auto max-w-[77.5rem] border-t border-cream-50/15 px-4 py-5 sm:px-6 lg:px-8">
        {/* The page is prerendered at build time, so across New Year the build's year can differ
            from the visitor's until the next deploy; that one difference is allowed. */}
        <p suppressHydrationWarning className="text-center text-[0.8125rem] text-cream-50/70 sm:text-left">
          © {year} Food Munch. Portfolio project by Adithya Kammara.
        </p>
      </div>

      <OrnamentBorder />

      <Modal
        open={policy === 'privacy'}
        onClose={() => setPolicy(null)}
        title="Privacy Policy"
        description="Food Munch is a portfolio demo. Here is exactly what it stores."
      >
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-900">
          <li>Your cart, favourites, demo login (name, phone, address) and past demo orders are saved only in this browser (localStorage).</li>
          <li>Nothing is sent to a server, and there is no tracking or analytics.</li>
          <li>The subscribe form does not save or send your email.</li>
          <li>To delete everything, clear this site&apos;s data in your browser settings.</li>
        </ul>
      </Modal>
      <Modal
        open={policy === 'terms'}
        onClose={() => setPolicy(null)}
        title="Terms of Service"
        description="Please read before using this demo."
      >
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink-900">
          <li>Food Munch is not a real restaurant. Orders are not cooked or delivered.</li>
          <li>Payments are simulated: the UPI QR moves no money, and no card details are ever asked for.</li>
          <li>Order tracking is a timed demo, not live location.</li>
          <li>Built by Adithya Kammara as a portfolio project. Photo credits are listed in the footer.</li>
        </ul>
      </Modal>
      <Modal
        open={policy === 'credits'}
        onClose={() => setPolicy(null)}
        title="Photo Credits"
        description="These photos were resized and cropped to fit the site."
      >
        <ul className="space-y-3 text-sm leading-relaxed text-ink-900">
          {photoCredits.map(({ dish, author, source, licence, licenceUrl }) => (
            <li key={dish}>
              <span className="font-semibold">{dish}</span>: photo by{' '}
              <a href={source} target="_blank" rel="noreferrer" className="underline">
                {author}
              </a>
              , via Wikimedia Commons,{' '}
              <a href={licenceUrl} target="_blank" rel="noreferrer" className="underline">
                {licence}
              </a>
            </li>
          ))}
          <li>The other food photos are from Unsplash.</li>
        </ul>
      </Modal>
    </footer>
  )
}

/**
 * Demo newsletter. Validation is unchanged (checked on submit); per modern-web-guidance: forms,
 * a failed submit moves focus back to the field, typing clears the error, and autocorrect is off.
 */
function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)
  const input = useRef<HTMLInputElement>(null)

  const submit = () => {
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setResult({ ok: false, text: 'Enter a valid email address, like name@example.com.' })
      input.current?.focus()
      return
    }
    // Demo only: the address is not saved or sent anywhere.
    setEmail('')
    setResult({ ok: true, text: 'Thanks! This is a demo, so your email was not saved or sent.' })
  }

  const hasError = result !== null && !result.ok

  return (
    <form
      noValidate
      className="mt-4"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <label htmlFor="subscribe-email" className="sr-only">
        Email address
      </label>
      {/* One pill with the button inside when there is room; otherwise the button sits below. */}
      <div className="@container">
        <div className="flex flex-col gap-2.5 @[18.5rem]:flex-row @[18.5rem]:items-center @[18.5rem]:gap-2 @[18.5rem]:rounded-full @[18.5rem]:border @[18.5rem]:border-cream-50/50 @[18.5rem]:bg-cream-50/[0.06] @[18.5rem]:p-1.5 @[18.5rem]:focus-within:border-gold-300">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-cream-50/50 bg-cream-50/[0.06] px-4 focus-within:border-gold-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-gold-300 @[18.5rem]:border-0 @[18.5rem]:bg-transparent @[18.5rem]:pl-3 @[18.5rem]:pr-0">
            <Mail size={18} aria-hidden="true" className="shrink-0 text-cream-50/70" />
            <input
              ref={input}
              id="subscribe-email"
              type="email"
              autoComplete="email"
              autoCorrect="off"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="send"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (hasError) setResult(null)
              }}
              aria-invalid={hasError}
              aria-describedby="subscribe-note subscribe-result"
              placeholder="name@example.com"
              className="min-h-11 w-0 min-w-0 flex-1 bg-transparent py-2 text-[0.9375rem] text-cream-50 outline-none placeholder:text-cream-50/50"
            />
          </div>
          <button type="submit" className={buttonClasses('primary', 'md', 'h-11 px-5 text-[0.9375rem]')}>
            Subscribe
          </button>
        </div>
      </div>
      <p id="subscribe-note" className="mt-3 text-[0.8125rem] text-cream-50/65">
        Demo only: no emails are sent.
      </p>
      <p id="subscribe-result" role="status" className={`mt-1 text-sm ${hasError ? 'text-nonveg-300' : 'text-veg-300'}`}>
        {result?.text}
      </p>
    </form>
  )
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className="h-5 w-5" fill="currentColor">
      <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
    </svg>
  )
}

function LinkedInMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5" fill="currentColor">
      <rect x="2" y="2" width="20" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="6" y="10" width="2.6" height="8" rx="0.6" />
      <circle cx="7.3" cy="6.9" r="1.6" />
      <path d="M10.7 10h2.5v1.2c.5-.8 1.5-1.4 2.8-1.4 2.1 0 3 1.3 3 3.6V18h-2.6v-4.2c0-1.1-.4-1.8-1.4-1.8-1 0-1.7.7-1.7 1.9V18h-2.6Z" />
    </svg>
  )
}

