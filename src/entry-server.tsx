import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'

/**
 * Renders the page to HTML at build time (scripts/prerender.mjs), so the hero paints before the
 * scripts load. The tree must match the one main.tsx hydrates. Stores render their defaults
 * here; a returning visitor's saved cart, favourites and login arrive just after hydration.
 */
export function render(): string {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}
