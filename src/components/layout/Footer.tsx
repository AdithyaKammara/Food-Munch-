import { useState } from 'react'
import { ChefHat, Mail, MapPin, Phone } from 'lucide-react'
import { useReveal } from '../../lib/useReveal'

const quickLinks = [
  { href: '#home', label: 'Home' },
  { href: '#why-us', label: 'Why Us' },
  { href: '#menu', label: 'Menu' },
  { href: '#delivery', label: 'Delivery' },
]

const DEVELOPER_EMAIL = 'adithyakammara13@gmail.com'

export default function Footer() {
  const ref = useReveal<HTMLElement>()
  const year = new Date().getFullYear()

  return (
    <footer ref={ref} id="contact" className="scroll-mt-20 bg-ink text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.7fr_1.2fr_1.3fr]">
        {/* Brand */}
        <div data-reveal>
          <a href="#home" className="flex items-center gap-2 font-display text-xl font-extrabold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gold text-on-gold">
              <ChefHat size={20} aria-hidden="true" />
            </span>
            <span>
              Food <span className="text-gold">Munch</span>
            </span>
          </a>
          <p className="mt-4 text-sm text-white/70">
            Authentic Hyderabadi flavours, made with fresh ingredients. A portfolio demo project.
          </p>
        </div>

        {/* Quick links */}
        <nav data-reveal aria-label="Footer">
          <h2 className="font-display font-bold text-gold">Quick Links</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-white/70 hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div data-reveal>
          <h2 className="font-display font-bold text-gold">Contact</h2>
          <p className="mt-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80">
            Sample details: not a real restaurant
          </p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
              Sample Street, Hyderabad, Telangana
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
              +91 00000 00000 (sample)
            </li>
          </ul>

          <h3 className="mt-5 text-sm font-bold">Project contact</h3>
          <p className="mt-1 text-sm text-white/70">Built by Adithya Kammara</p>
          <a
            href={`mailto:${DEVELOPER_EMAIL}`}
            className="mt-1 inline-flex items-center gap-2 break-all text-sm font-semibold text-gold hover:underline"
          >
            <Mail size={16} aria-hidden="true" className="shrink-0" />
            {DEVELOPER_EMAIL}
          </a>
        </div>

        {/* Subscribe */}
        <div data-reveal>
          <h2 className="font-display font-bold text-gold">Get Offers</h2>
          <p className="mt-3 text-sm text-white/70">Hear about new dishes and promo codes.</p>
          <SubscribeForm />
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-center text-xs text-white/60">
          © {year} Food Munch · Portfolio project by Adithya Kammara · Food photos from Unsplash
        </p>
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
      className="mt-4"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <label htmlFor="subscribe-email" className="text-sm font-semibold">
        Email address
      </label>
      {/* flex-wrap: the button drops below the input when the column is narrow */}
      <div className="mt-1 flex flex-wrap gap-2">
        <input
          id="subscribe-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={hasError}
          aria-describedby="subscribe-note subscribe-result"
          placeholder="name@example.com"
          className="min-w-[12rem] flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/50"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-gold px-5 py-2.5 text-sm font-bold text-on-gold"
        >
          Subscribe
        </button>
      </div>
      <p id="subscribe-note" className="mt-2 text-xs text-white/60">
        Demo: no emails are sent.
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