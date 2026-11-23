import { lazy, Suspense, useEffect, useState } from 'react'
import { useUiStore, type Panel } from '../../store/uiStore'

// Dialogs that nobody needs until they are opened, split out of the main bundle
// (checkout carries the QR code library). The cart drawer stays in the main bundle.
const load = {
  checkout: () => import('../checkout/CheckoutDialog'),
  auth: () => import('../checkout/AuthDialog'),
  tracking: () => import('../orders/TrackingDialog'),
  history: () => import('../orders/HistoryDialog'),
}
const PANELS = {
  checkout: lazy(load.checkout),
  auth: lazy(load.auth),
  tracking: lazy(load.tracking),
  history: lazy(load.history),
}
type LazyPanel = keyof typeof PANELS
const isLazy = (p: Panel | null): p is LazyPanel => p !== null && p in PANELS

/**
 * Mounts each lazy dialog the first time it is asked for, then keeps it mounted so its closing
 * animation and state behave exactly as before. When the browser is idle after load, all four are
 * fetched in the background, so the first open does not wait for the network.
 */
export default function LazyPanels() {
  const panel = useUiStore((s) => s.panel)
  const [mounted, setMounted] = useState<LazyPanel[]>([])
  // Adjusting state while rendering, when the open panel changes (React's documented pattern).
  if (isLazy(panel) && !mounted.includes(panel)) setMounted([...mounted, panel])

  useEffect(() => {
    const warm = () => Object.values(load).forEach((get) => void get())
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(warm, { timeout: 4000 })
      return () => window.cancelIdleCallback(id)
    }
    const timer = setTimeout(warm, 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Suspense fallback={null}>
      {mounted.map((name) => {
        const Dialog = PANELS[name]
        return <Dialog key={name} />
      })}
    </Suspense>
  )
}
