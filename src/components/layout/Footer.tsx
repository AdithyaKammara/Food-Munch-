import { useState } from 'react'
import { ChefHat, Mail, MapPin, Phone, Utensils } from 'lucide-react'
import { useReveal } from '../../lib/useReveal'
import Modal from '../ui/Modal'

const quickLinks = [
  { href: '#home', label: 'Home' },
  { href: '#menu', label: 'Menu' },
  { href: '#why-us', label: 'Why Us' },
  { href: '#delivery', label: 'Delivery' },
]

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

function Heading({ children }: { children: string }) {
  return (
    <h2 className="whitespace-nowrap font-display text-xl font-bold text-gold">
      {children}
    </h2>
  )
}

export default function Footer() {
  const ref = useReveal<HTMLElement>()
  const year = new Date().getFullYear()
  const [policy, setPolicy] = useState<'privacy' | 'terms' | 'credits' | null>(null)

  return (
    <footer ref={ref} id="contact" className="bg-ink text-white">
      {/* ---------- Columns ---------- */}
      <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-12 pt-16 sm:grid-cols-2 sm:px-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)_minmax(0,0.7fr)_minmax(0,1.4fr)] xl:gap-10">
        {/* Brand */}
        <div data-reveal>
          <a href="#home" className="inline-flex items-center gap-3 font-display text-[1.75rem] font-extrabold tracking-tight xl:text-[1.6rem] 2xl:text-[1.85rem]">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold text-on-gold">
              <ChefHat size={26} aria-hidden="true" />
            </span>
            <span className="whitespace-nowrap">
              Food <span className="text-gold">Munch</span>
            </span>
          </a>
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/80 xl:text-sm 2xl:text-[15px]">
            Authentic Hyderabadi flavours, made with fresh ingredients. A portfolio demo project.
          </p>
          <ul className="mt-6 flex gap-3">
            {socials.map(({ href, label, icon: Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/30 text-white transition-colors hover:border-gold hover:bg-gold hover:text-on-gold"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Subscribe */}
        <div data-reveal>
          <Heading>Get Offers</Heading>
          <p className="mt-5 text-[15px] leading-relaxed text-white/85 xl:text-sm 2xl:text-[15px]">
            Be the first to know about new dishes, promo codes and special offers.
          </p>
          <SubscribeForm />
        </div>

        {/* Quick links */}
        <nav data-reveal aria-label="Footer">
          <Heading>Quick Links</Heading>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 sm:block sm:space-y-3">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-[15px] text-white/85 transition-colors hover:text-gold xl:text-sm 2xl:text-[15px]">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div data-reveal>
          <Heading>Contact</Heading>
          <ul className="mt-5 space-y-4 text-[15px] text-white/85 xl:text-sm 2xl:text-[15px]">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 shrink-0 text-gold">
                <MapPin size={17} aria-hidden="true" />
              </span>
              <span>Sample Street, Hyderabad, Telangana</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="mt-0.5 shrink-0 text-gold">
                <Phone size={17} aria-hidden="true" />
              </span>
              +91 00000 00000 (sample)
            </li>
          </ul>

          <div className="mt-5 border-t border-white/10 pt-4">
            <h3 className="text-[15px] font-bold text-gold">Project Contact</h3>
            <a
              href={`mailto:${DEVELOPER_EMAIL}`}
              className="mt-2.5 inline-flex items-center gap-2.5 break-all text-[15px] font-semibold text-gold hover:underline sm:whitespace-nowrap sm:break-normal xl:text-[13px] 2xl:text-sm"
            >
              <Mail size={18} aria-hidden="true" className="shrink-0" />
              {DEVELOPER_EMAIL}
            </a>
          </div>
        </div>

      </div>

      {/* ---------- Bottom bar ---------- */}
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-5 sm:px-6 text-center text-[13px] text-white/70 lg:flex-row lg:justify-between lg:gap-6 lg:text-left">
          <p className="inline-flex items-center gap-2 whitespace-nowrap font-display text-base font-bold text-gold">
            <Utensils size={18} aria-hidden="true" />
            Good food brings good people together.
          </p>
          <p className="2xl:whitespace-nowrap">
            © {year} Food Munch. Portfolio project by Adithya Kammara.
          </p>
          <p className="flex items-center gap-3 whitespace-nowrap text-white/85">
            <button type="button" onClick={() => setPolicy('privacy')} className="hover:text-gold hover:underline">
              Privacy Policy
            </button>
            <span aria-hidden="true" className="h-3.5 w-px bg-white/40" />
            <button type="button" onClick={() => setPolicy('terms')} className="hover:text-gold hover:underline">
              Terms of Service
            </button>
            <span aria-hidden="true" className="h-3.5 w-px bg-white/40" />
            <button type="button" onClick={() => setPolicy('credits')} className="hover:text-gold hover:underline">
              Photo Credits
            </button>
          </p>
        </div>
      </div>

      <Modal
        open={policy === 'privacy'}
        onClose={() => setPolicy(null)}
        title="Privacy Policy"
        description="Food Munch is a portfolio demo. Here is exactly what it stores."
      >
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink">
          <li>Your bag, favourites, demo login (name, phone, address) and past demo orders are saved only in this browser (localStorage).</li>
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
        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-ink">
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
        description="These photos were resized and cropped to fit the menu."
      >
        <ul className="space-y-3 text-sm leading-relaxed text-ink">
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

function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null)

  const submit = () => {
    const value = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setResult({ ok: false, text: 'Enter a valid email address, like name@example.com.' })
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
      className="mt-5"
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
        <div className="flex flex-col gap-2.5 @[18.5rem]:flex-row @[18.5rem]:items-center @[18.5rem]:gap-2 @[18.5rem]:rounded-full @[18.5rem]:border @[18.5rem]:border-white/50 @[18.5rem]:bg-white/[0.06] @[18.5rem]:p-1.5 @[18.5rem]:focus-within:border-gold">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/50 bg-white/[0.06] px-4 focus-within:border-gold @[18.5rem]:border-0 @[18.5rem]:bg-transparent @[18.5rem]:pl-3 @[18.5rem]:pr-0">
            <Mail size={18} aria-hidden="true" className="shrink-0 text-white/70" />
            <input
              id="subscribe-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={hasError}
              aria-describedby="subscribe-note subscribe-result"
              placeholder="name@example.com"
              className="w-0 min-w-0 flex-1 bg-transparent py-3 text-[15px] text-white outline-none placeholder:text-white/50 @[18.5rem]:py-2"
            />
          </div>
          <button
            type="submit"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-gold px-5 py-3 text-sm font-bold text-on-gold transition-transform hover:-translate-y-0.5 active:translate-y-0 @[18.5rem]:py-2.5"
          >
            Subscribe
          </button>
        </div>
      </div>
      <p id="subscribe-note" className="mt-3 text-[13px] text-white/60">
        Demo only: no emails are sent.
      </p>
      <p
        id="subscribe-result"
        role="status"
        className={`mt-1 text-sm ${hasError ? 'text-red-300' : 'text-green-300'}`}
      >
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

