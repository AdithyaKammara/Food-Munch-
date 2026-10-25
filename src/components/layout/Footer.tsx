import { useState } from 'react'
import { Mail } from 'lucide-react'
import { useReveal } from '../../lib/useReveal'

const quickLinks = [
  { href: '#home', label: 'Home' },
  { href: '#menu', label: 'Menu' },
  { href: '#why-us', label: 'Why us' },
  { href: '#delivery', label: 'Delivery' },
]

const DEVELOPER_EMAIL = 'adithyakammara13@gmail.com'

export default function Footer() {
  const ref = useReveal<HTMLElement>()
  const year = new Date().getFullYear()

  return (
    <footer ref={ref} id="contact" className="scroll-mt-16 overflow-hidden bg-ink pt-24 text-white md:pt-32">
      <div className="frame">
        <div className="grid gap-14 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          {/* Subscribe */}
          <div data-reveal className="md:col-span-2 lg:col-span-5">
            <h2 className="display text-[clamp(2.25rem,4.4vw,3.75rem)]">Hungry for offers?</h2>
            <p className="mt-4 max-w-md text-lg text-white/85">
              New dishes and promo codes, about once a month.
            </p>
            <SubscribeForm />
          </div>

          {/* Quick links */}
          <nav data-reveal aria-label="Footer" className="lg:col-span-2 lg:col-start-7">
            <h2 className="text-lg font-bold text-gold">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-[17px] text-white/85 hover:text-white hover:underline">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div data-reveal className="lg:col-span-4">
            <h2 className="text-lg font-bold text-gold">Contact</h2>
            <p className="mt-4 text-[17px] leading-relaxed text-white/85">
              Sample Street, Hyderabad, Telangana
              <br />
              +91 00000 00000
            </p>
            <p className="mt-2 text-sm text-white/60">
              Sample details: Food Munch is not a real restaurant.
            </p>

            <h3 className="mt-8 text-lg font-bold text-gold">Built by Adithya Kammara</h3>
            <a
              href={`mailto:${DEVELOPER_EMAIL}`}
              className="mt-3 inline-flex items-center gap-2 break-all text-[17px] font-semibold text-white underline decoration-gold decoration-2 underline-offset-4 hover:text-gold"
            >
              <Mail size={18} aria-hidden="true" className="shrink-0" />
              {DEVELOPER_EMAIL}
            </a>
          </div>
        </div>

        <p className="mt-20 flex flex-wrap justify-between gap-x-6 gap-y-2 text-sm text-white/60">
          <span>© {year} Food Munch. A portfolio demo project.</span>
          <span>Food photographs from Unsplash.</span>
        </p>
      </div>

      {/* The name returns at full width to close the page. */}
      <p
        aria-hidden="true"
        className="display mt-8 select-none whitespace-nowrap text-center text-[16.4vw] leading-[0.8] text-gold"
      >
        Food Munch
      </p>
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
      className="mt-8 max-w-md"
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
    >
      <label htmlFor="subscribe-email" className="text-[15px] font-semibold">
        Email address
      </label>
      {/* flex-wrap: the button drops below the input when the column is narrow */}
      <div className="mt-2 flex flex-wrap gap-2">
        <input
          id="subscribe-email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={hasError}
          aria-describedby="subscribe-note subscribe-result"
          placeholder="name@example.com"
          className="min-w-[12rem] flex-1 rounded-full border-2 border-white/35 bg-ink-soft px-5 py-3 text-[16px] text-white placeholder:text-white/55 focus:border-gold"
        />
        <button
          type="submit"
          className="shrink-0 rounded-full bg-gold px-6 py-3.5 font-bold text-on-gold transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          Subscribe
        </button>
      </div>
      <p id="subscribe-note" className="mt-3 text-sm text-white/60">
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