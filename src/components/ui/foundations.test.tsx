// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import Button from './Button'
import SectionHeading, { Accent } from './SectionHeading'
import Wordmark from '../brand/Wordmark'
import CharminarMark from '../brand/CharminarMark'

afterEach(cleanup)

describe('Button', () => {
  it('is a plain button by default, so it never submits a form by accident', () => {
    render(<Button>Order now</Button>)
    const button = screen.getByRole('button', { name: 'Order now' })
    expect(button).toHaveAttribute('type', 'button')
    expect(button.className).toContain('bg-copper-600')
  })

  it('becomes a link when given href', () => {
    render(<Button href="#menu">See the menu</Button>)
    expect(screen.getByRole('link', { name: 'See the menu' })).toHaveAttribute('href', '#menu')
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('blocks presses and reports busy while loading', async () => {
    const onClick = vi.fn()
    render(
      <Button loading onClick={onClick}>
        Confirming
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Confirming' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    await userEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })

  it('uses the outline and quiet styles for the other variants', () => {
    render(
      <>
        <Button variant="secondary">Add</Button>
        <Button variant="quiet" aria-label="Next dishes" />
      </>,
    )
    expect(screen.getByRole('button', { name: 'Add' }).className).toContain('border-copper-600')
    expect(screen.getByRole('button', { name: 'Next dishes' }).className).toContain('size-11')
  })
})

describe('SectionHeading', () => {
  it('renders the label, the heading level and one accent word', () => {
    render(
      <SectionHeading label="Our story" as="h2">
        The taste of <Accent>Hyderabad,</Accent> now at your doorstep.
      </SectionHeading>,
    )
    expect(screen.getByText('Our story')).toBeInTheDocument()
    const heading = screen.getByRole('heading', { level: 2 })
    expect(heading).toHaveTextContent('The taste of Hyderabad, now at your doorstep.')
    expect(screen.getByText('Hyderabad,')).toHaveClass('accent')
  })

  it('leaves the label out when none is given', () => {
    render(<SectionHeading as="h3">Starters</SectionHeading>)
    expect(screen.getByRole('heading', { level: 3, name: 'Starters' })).toBeInTheDocument()
    expect(document.querySelector('p')).toBeNull()
  })
})

describe('Brand', () => {
  it('names the wordmark link for screen readers and hides the drawing', () => {
    const { container } = render(<Wordmark />)
    expect(screen.getByRole('link', { name: 'Food Munch, home' })).toHaveAttribute('href', '#home')
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('draws the Charminar once and reuses it in the skyline', () => {
    const { container } = render(<CharminarMark variant="skyline" />)
    const symbol = container.querySelector('symbol')
    const use = container.querySelector('use')
    expect(symbol).not.toBeNull()
    expect(use?.getAttribute('href')).toBe(`#${symbol?.id}`)
  })
})
