// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Footer from './Footer'
import { useUiStore } from '../../store/uiStore'

// jsdom lacks these, and GSAP reads matchMedia as soon as it is imported (see navbar.test.tsx).
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
  useUiStore.setState({ menuCategory: 'all', panel: null })
})

describe('Footer', () => {
  it('has only real links: menu filters, help, legal and the two real profiles', () => {
    render(<Footer />)
    const nav = screen.getByRole('navigation', { name: 'Footer' })
    expect(within(nav).getAllByRole('heading').map((h) => h.textContent)).toEqual(['Menu', 'Help', 'Legal'])
    for (const a of within(nav).getAllByRole('link')) {
      expect(a.getAttribute('href')).toMatch(/^(#menu|mailto:)/)
    }
    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/AdithyaKammara')
    expect(screen.queryByText(/Careers|Blog|Instagram|YouTube|FAQs/)).toBeNull()
    expect(screen.getByText(/Portfolio project by Adithya Kammara/)).toBeInTheDocument()
  })

  it('opens the menu filtered to a category from its Menu links', async () => {
    render(<Footer />)
    await userEvent.click(screen.getByRole('link', { name: 'Biryani' }))
    expect(useUiStore.getState().menuCategory).toBe('biryani')
  })

  it('opens order tracking and history from Help', async () => {
    render(<Footer />)
    await userEvent.click(screen.getByRole('button', { name: 'Order history' }))
    expect(useUiStore.getState().panel).toBe('history')
  })

  it('keeps the subscribe check, returns focus to the field, and clears the error on typing', async () => {
    render(<Footer />)
    const field = screen.getByRole('textbox', { name: 'Email address' })
    await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    expect(screen.getByRole('status')).toHaveTextContent('Enter a valid email address')
    expect(field).toHaveAttribute('aria-invalid', 'true')
    expect(field).toHaveFocus()
    await userEvent.type(field, 'a')
    expect(field).toHaveAttribute('aria-invalid', 'false')
    await userEvent.type(field, '@example.com')
    await userEvent.click(screen.getByRole('button', { name: 'Subscribe' }))
    expect(screen.getByRole('status')).toHaveTextContent('was not saved or sent')
    expect(field).toHaveValue('')
  })
})
