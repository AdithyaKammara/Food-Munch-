import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * False while React is hydrating the prerendered page, true from the render after it. The saved
 * stores (zustand persist) also show their build-time defaults during hydration and switch to the
 * visitor's saved values in that same next render, so this tells "just loaded" apart from
 * "the visitor changed something". Always true when the page is not hydrated (dev, tests).
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
