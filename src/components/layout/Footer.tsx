import { useState } from 'react'
import { ArrowRight, ChefHat, Leaf, Mail, MapPin, Phone, Utensils } from 'lucide-react'
import { useReveal } from '../../lib/useReveal'
import Modal from '../ui/Modal'

const quickLinks = [
  { href: '#home', label: 'Home' },
  { href: '#why-us', label: 'Why Us' },
  { href: '#menu', label: 'Menu' },
  { href: '#delivery', label: 'Delivery' },
  { href: '#contact', label: 'Contact' },
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
      <span aria-hidden="true" className="mt-2.5 block h-0.5 w-7 rounded-full bg-gold" />
    </h2>
  )
}

export default function Footer() {
  const ref = useReveal<HTMLElement>()
  const year = new Date().getFullYear()
  const [policy, setPolicy] = useState<'privacy' | 'terms' | null>(null)

  return (
    <footer ref={ref} id="contact" className="relative isolate scroll-mt-20 overflow-hidden bg-[#121212] text-white">
      {/* Warm glow in the corners, like light from the kitchen */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20"
        style={{
          background:
            'radial-gradient(40% 70% at 0% 100%, rgb(217 149 0 / 0.16), transparent 70%), radial-gradient(35% 70% at 100% 60%, rgb(217 149 0 / 0.12), transparent 70%)',
        }}
      />

      {/* ---------- Left edge: Charminar, steam and biryani ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden w-[15%] xl:block">
        <Charminar className="absolute left-[6%] top-8 h-52 w-auto text-gold/35 2xl:h-60" />
        <Steam className="absolute bottom-[11.5rem] left-[6%] h-28 w-auto text-white/25" />
        <img
          src="/images/why-biryani.jpg"
          alt=""
          width={1400}
          height={1050}
          loading="lazy"
          className="absolute -bottom-6 -left-[48%] h-64 w-auto max-w-none 2xl:-left-[36%] 2xl:h-72"
          style={{
            maskImage: 'radial-gradient(60% 62% at 50% 58%, black 55%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(60% 62% at 50% 58%, black 55%, transparent 78%)',
          }}
        />
        <Leaf className="absolute bottom-[10%] right-[2%] h-8 w-8 rotate-[200deg] fill-green-600 text-green-800" />
        <Sparks className="absolute bottom-[12rem] right-[-8%] h-9 w-9 -scale-x-100 text-gold" />
      </div>

      {/* ---------- Right edge: spices ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[17%] xl:block">
        <img
          src="/images/footer-spices.jpg"
          alt=""
          width={560}
          height={560}
          loading="lazy"
          className="absolute -right-[34%] top-20 h-60 w-auto max-w-none 2xl:-right-[20%] 2xl:h-72"
          style={{
            maskImage: 'radial-gradient(closest-side, black 62%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(closest-side, black 62%, transparent 100%)',
          }}
        />
        <Leaf className="absolute bottom-[14%] left-[8%] h-9 w-9 rotate-[30deg] fill-green-600 text-green-800" />
        <Leaf className="absolute right-[4%] top-[8%] h-7 w-7 -rotate-12 fill-green-500 text-green-700" />
        <Sparks className="absolute left-[2%] top-[16%] h-10 w-10 text-gold" />
      </div>

      {/* ---------- Columns ---------- */}
      <div className="mx-auto grid max-w-[72rem] gap-12 px-6 pb-12 pt-16 sm:grid-cols-2 lg:gap-x-16 xl:max-w-none xl:grid-cols-[1.25fr_0.65fr_1.3fr_1.7fr] xl:gap-8 xl:pl-[16%] xl:pr-[15%] 2xl:gap-10">
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
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/70 text-gold">
                <MapPin size={17} aria-hidden="true" />
              </span>
              <span className="pt-1.5">Sample Street, Hyderabad, Telangana</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/70 text-gold">
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

        {/* Subscribe */}
        <div data-reveal>
          <Heading>Get Offers</Heading>
          <p className="mt-5 text-[15px] leading-relaxed text-white/85 xl:text-sm 2xl:text-[15px]">
            Be the first to know about new dishes, promo codes and special offers.
          </p>
          <SubscribeForm />
        </div>
      </div>

      {/* ---------- Bottom bar ---------- */}
      <div className="relative">
        {/* Gold line that glows in the middle */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgb(255 191 0 / 0.7) 30%, rgb(255 191 0 / 0.7) 70%, transparent)' }}
        />
        <div className="mx-auto flex max-w-[72rem] flex-col items-center gap-3 px-6 py-5 text-center text-[13px] text-white/70 lg:flex-row lg:justify-between lg:gap-6 lg:text-left xl:max-w-none xl:pl-[15%] xl:pr-[15%] xl:text-xs 2xl:text-[13px]">
          <p className="inline-flex items-center gap-2 whitespace-nowrap font-script text-xl text-gold">
            <Utensils size={18} aria-hidden="true" />
            Good food brings good people together.
          </p>
          <p className="2xl:whitespace-nowrap">
            © {year} Food Munch · Portfolio project by Adithya Kammara · Food photos from Unsplash
          </p>
          <p className="flex items-center gap-3 whitespace-nowrap text-white/85">
            <button type="button" onClick={() => setPolicy('privacy')} className="hover:text-gold hover:underline">
              Privacy Policy
            </button>
            <span aria-hidden="true" className="h-3.5 w-px bg-white/40" />
            <button type="button" onClick={() => setPolicy('terms')} className="hover:text-gold hover:underline">
              Terms of Service
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
          <li>Built by Adithya Kammara as a portfolio project. Food photos are from Unsplash.</li>
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
        <div className="flex flex-col gap-2.5 @[18.5rem]:flex-row @[18.5rem]:items-center @[18.5rem]:gap-2 @[18.5rem]:rounded-full @[18.5rem]:border @[18.5rem]:border-white/20 @[18.5rem]:bg-white/[0.06] @[18.5rem]:p-1.5 @[18.5rem]:focus-within:border-gold">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] px-4 focus-within:border-gold @[18.5rem]:border-0 @[18.5rem]:bg-transparent @[18.5rem]:pl-3 @[18.5rem]:pr-0">
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
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-gold px-5 py-3 text-sm font-bold text-on-gold transition-transform hover:-translate-y-0.5 active:translate-y-0 @[18.5rem]:py-2.5"
          >
            Subscribe <ArrowRight size={16} aria-hidden="true" />
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

/** Simple line drawing of the Charminar, Hyderabad's landmark. */
function Charminar({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 200 240" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
      {/* Minarets */}
      {[22, 178].map((x) => (
        <g key={x}>
          <path d={`M${x - 9} 236V70h18v166`} />
          <path d={`M${x - 12} 70h24M${x - 12} 112h24M${x - 12} 154h24`} />
          <path d={`M${x - 8} 70c0-14 8-18 8-28 0 10 8 14 8 28`} />
          <path d={`M${x} 42v-14`} />
          <circle cx={x} cy="25" r="3" />
          <path d={`M${x - 5} 90h10v14h-10zM${x - 5} 128h10v14h-10z`} />
        </g>
      ))}
      {/* Main body */}
      <path d="M31 236V122h138v114" />
      <path d="M31 122h138M31 112h138" />
      <path d="M70 236v-56c0-22 30-22 30-40 0 18 30 18 30 40v56" />
      <path d="M44 236v-40c0-12 14-12 14-22 0 10 14 10 14 22" />
      <path d="M128 196c0-12 14-12 14-22 0 10 14 10 14 22v40" />
      {/* Upper gallery */}
      <path d="M40 112V96h120v16" />
      {[52, 72, 92, 112, 132, 150].map((x) => (
        <path key={x} d={`M${x} 112v-8c0-5 6-5 6 0v8`} />
      ))}
    </svg>
  )
}

function Sparks({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <g stroke="currentColor" strokeWidth="4.5" strokeLinecap="round">
        <line x1="30" y1="22" x2="18" y2="6" />
        <line x1="30" y1="30" x2="8" y2="24" />
      </g>
    </svg>
  )
}

/** Soft wisps of steam rising from the biryani. */
function Steam({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 80 120" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
      <path d="M20 115c-12-18 12-26 0-46s10-28 2-44" />
      <path d="M44 112c-10-16 10-24 0-40s8-24 2-38" opacity="0.7" />
      <path d="M64 116c-8-14 8-20 0-34" opacity="0.5" />
    </svg>
  )
}
