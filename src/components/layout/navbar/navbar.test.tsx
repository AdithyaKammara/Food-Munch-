// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { act, cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import NavLinks from './NavLinks'
import ProfileButton from './ProfileButton'
import OffersStrip from '../../home/OffersStrip'
import { useUserStore } from '../../../store/userStore'
import { useOrdersStore } from '../../../store/ordersStore'

// jsdom has neither of these, and GSAP reads matchMedia as soon as it is imported,
// so the stubs must exist before the imports above run.
vi.hoisted(() => {
  globalThis.ResizeObserver ??= class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
  window.matchMedia ??= ((query: string) => ({
    matches: false,
    media: query,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
    onchange: null,
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
})

afterEach(() => {
  cleanup()
  useUserStore.setState({ user: null })
  useOrdersStore.setState({ orders: [], activeOrderId: null })
})

describe('NavLinks', () => {
  it('lists the five sections from the reference, in page order', () => {
    render(<NavLinks active="home" />)
    expect(screen.getAllByRole('link').map((a) => a.textContent)).toEqual(['Home', 'Menu', 'Offers', 'About', 'Contact'])
  })

  it('marks only the active section, with aria-current and bold text, not colour alone', () => {
    render(<NavLinks active="offers" />)
    const offers = screen.getByRole('link', { name: 'Offers' })
    expect(offers).toHaveAttribute('aria-current', 'true')
    expect(offers.className).toContain('font-semibold')
    expect(screen.getByRole('link', { name: 'Menu' })).not.toHaveAttribute('aria-current')
  })

  it('highlights nothing while reading a section without a link (Delivery)', () => {
    render(<NavLinks active="delivery" />)
    expect(screen.getAllByRole('link').filter((a) => a.hasAttribute('aria-current'))).toHaveLength(0)
  })
})

describe('ProfileButton', () => {
  it('offers to log in when signed out', () => {
    render(<ProfileButton />)
    expect(screen.getByRole('button', { name: 'Log in, account and orders' })).toBeInTheDocument()
  })

  it('shows initials when signed in and mentions an order on its way', () => {
    useUserStore.setState({ user: { name: 'Asha Reddy', phone: '9876543210', address: '' } })
    useOrdersStore.setState({ activeOrderId: 'FM1' })
    render(<ProfileButton />)
    const button = screen.getByRole('button', { name: 'Account and orders, Asha Reddy (an order is on its way)' })
    expect(button).toHaveTextContent('AR')
  })
})

describe('OffersStrip', () => {
  it('shows only offers that exist, leaving out the wheel reward', () => {
    render(<OffersStrip />)
    const codes = screen.getAllByText(/^[A-Z]+\d+$/, { selector: 'p' }).map((p) => p.textContent)
    expect(codes).toEqual(['FIRST50', 'MUNCH10', 'FEAST75'])
    expect(screen.queryByText('LUCKY60')).toBeNull()
  })

  it('copies a code and confirms it in a live region beside the button', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    render(<OffersStrip />)
    await userEvent.click(screen.getByRole('button', { name: 'Copy code MUNCH10' }))
    expect(writeText).toHaveBeenCalledWith('MUNCH10')
    const statuses = screen.getAllByRole('status')
    expect(statuses.some((s) => s.textContent === 'Copied')).toBe(true)
    // The button stays enabled so keyboard focus and retries are never lost
    expect(screen.getByRole('button', { name: 'Copy code MUNCH10' })).toBeEnabled()
  })

  it('says so when copying fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
      configurable: true,
    })
    render(<OffersStrip />)
    await act(async () => {
      await userEvent.click(screen.getByRole('button', { name: 'Copy code FIRST50' }))
    })
    expect(screen.getAllByRole('status').some((s) => s.textContent === 'Copy failed')).toBe(true)
  })
})
