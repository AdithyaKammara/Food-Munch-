import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import '@fontsource-variable/inter'
import '@fontsource-variable/fraunces/standard.css'
import '@fontsource-variable/fraunces/standard-italic.css'
import '@fontsource-variable/caveat'
import './index.css'
import App from './App'

const container = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

// The production build ships the page prerendered (scripts/prerender.mjs), so React takes over
// that HTML instead of drawing it again. The dev server's index.html is empty, so it renders.
if (container.hasChildNodes()) hydrateRoot(container, app)
else createRoot(container).render(app)
