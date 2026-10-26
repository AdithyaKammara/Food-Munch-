import { useState } from 'react'
import { ArrowRight, ArrowUp, ChefHat, Mail, MapPin, Phone, Utensils } from 'lucide-react'
import { useReveal } from '../../lib/useReveal'

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
    <h2 className="font-display text-xl font-bold text-gold">
      {children}
      <span aria-hidden="true" className="mt-2.5 block h-0.5 w-7 rounded-full bg-gold" />
    </h2>
  )
}

export default function Footer() {
  const ref = useReveal<HTMLElement>()
  const year = new Date().getFullYear()

  return (
    <footer ref={ref} id="contact" className="relative isolate scroll-mt-20 overflow-hidden bg-[#141414] text-white">
      {/* ---------- Decorative edges (large screens only) ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 -z-10 hidden w-[22rem] min-[1440px]:block">
        <Charminar className="absolute left-5 top-8 h-44 w-auto text-gold/30" />
        <img
          src="/images/why-biryani.jpg"
          alt=""
          width={1400}
          height={1050}
          loading="lazy"
          className="absolute -left-28 -bottom-6 h-64 w-auto max-w-none object-cover"
          style={{
            maskImage: 'radial-gradient(70% 80% at 30% 75%, black 45%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(70% 80% at 30% 75%, black 45%, transparent 75%)',
          }}
        />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-[22rem] min-[1600px]:block">
        <img
          src="/images/spice-bowls.jpg"
          alt=""
          width={1000}
          height={1250}
          loading="lazy"
          className="absolute -right-10 top-2 h-[22rem] w-auto max-w-none object-cover"
          style={{
            maskImage: 'radial-gradient(55% 50% at 60% 50%, black 45%, transparent 75%)',
            WebkitMaskImage: 'radial-gradient(55% 50% at 60% 50%, black 45%, transparent 75%)',
          }}
        />
      </div>

      {/* ---------- Columns ---------- */}
      <div className="mx-auto grid max-w-[72rem] gap-12 px-6 pb-12 pt-16 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.65fr_1.45fr_1.5fr] lg:gap-9 lg:px-8 lg:pt-20">
        {/* Brand */}
        <div data-reveal>
          <a href="#home" className="inline-flex items-center gap-3 font-display text-[1.75rem] font-extrabold tracking-tight">
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold text-on-gold">
              <ChefHat size={26} aria-hidden="true" />
            </span>
            <span>
              Food <span className="text-gold">Munch</span>
            </span>
          </a>
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-white/80">
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
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/25 text-white transition-colors hover:border-gold hover:bg-gold hover:text-on-gold"
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
                <a href={link.href} className="text-[15px] text-white/85 transition-colors hover:text-gold">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div data-reveal>
          <Heading>Contact</Heading>
          <ul className="mt-5 space-y-4 text-[15px] text-white/85">
            <li className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/60 text-gold">
                <MapPin size={17} aria-hidden="true" />
              </span>
              <span className="pt-1.5">Sample Street, Hyderabad, Telangana</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/60 text-gold">
                <Phone size={17} aria-hidden="true" />
              </span>
              +91 00000 00000 (sample)
            </li>
          </ul>
          <p className="mt-3 text-xs text-white/55">Sample details: not a real restaurant.</p>

          <div className="mt-5 border-t border-white/10 pt-5">
            <h3 className="text-[15px] font-bold text-gold">Project Contact</h3>
            <a
              href={`mailto:${DEVELOPER_EMAIL}`}
              className="mt-2.5 inline-flex items-center gap-2.5 break-all text-[15px] font-semibold text-gold hover:underline lg:whitespace-nowrap lg:break-normal lg:text-[14px]"
            >
              <Mail size={18} aria-hidden="true" className="shrink-0" />
              {DEVELOPER_EMAIL}
            </a>
          </div>
        </div>

        {/* Subscribe */}
        <div data-reveal>
          <Heading>Get Offers</Heading>
          <p className="mt-5 text-[15px] leading-relaxed text-white/85">
            Be the first to know about new dishes, promo codes and special offers.
          </p>
          <SubscribeForm />
        </div>
      </div>

      {/* ---------- Bottom bar ---------- */}
      <div className="border-t border-gold/30">
        <div className="mx-auto flex max-w-[72rem] flex-col items-center gap-3 px-6 py-5 text-center text-[13px] text-white/70 lg:flex-row lg:justify-between lg:px-8 lg:text-left">
          <p className="inline-flex items-center gap-2 font-display text-sm italic text-gold">
            <Utensils size={16} aria-hidden="true" />
            Good food brings good people together.
          </p>
          <p>
            © {year} Food Munch · Portfolio project by Adithya Kammara · Food photos from Unsplash
          </p>
          <a href="#home" className="inline-flex items-center gap-1.5 font-semibold text-white hover:text-gold">
            Back to top <ArrowUp size={15} aria-hidden="true" />
          </a>
        </div>
      </div>
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
      <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.06] p-1.5 focus-within:border-gold">
        <Mail size={18} aria-hidden="true" className="ml-3 shrink-0 text-white/70" />
        <input
          id="subscribe-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={hasError}
          aria-describedby="subscribe-note subscribe-result"
          placeholder="name@example.com"
          className="w-0 min-w-0 flex-1 bg-transparent py-2 text-[15px] text-white outline-none placeholder:text-white/50"
        />
        <button
          type="submit"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-on-gold transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Subscribe <ArrowRight size={16} aria-hidden="true" />
        </button>
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
