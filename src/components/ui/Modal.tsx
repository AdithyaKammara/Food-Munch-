import type { ReactNode } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { clsx } from 'clsx'
import { buttonClasses } from './buttonClasses'

interface Props {
  open: boolean
  onClose: () => void
  title: ReactNode
  description: ReactNode
  children: ReactNode
  /** md: 28rem (policies, customise). lg: 36rem (forms, tracking). xl: 40rem (order history). */
  size?: 'md' | 'lg' | 'xl'
  /** Accessible name of the close button, when "Close" alone is not clear. */
  closeLabel?: string
}

const WIDTHS = { md: 'max-w-md', lg: 'max-w-xl', xl: 'max-w-[40rem]' }

/**
 * Every centred dialog on the site (component-guidelines.md §17): a cream panel with a Fraunces
 * title, a short description and a 44px close button. Radix Dialog supplies the modal behaviour:
 * the dialog role, focus kept inside, Escape and outside click to close, focus returned to the
 * button that opened it, and the page scroll locked behind it.
 */
export default function Modal({ open, onClose, title, description, children, size = 'md', closeLabel = 'Close' }: Props) {
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="motion-overlay fixed inset-0 z-50 bg-forest-950/50" />
        <Dialog.Content
          className={clsx(
            'motion-dialog fixed left-1/2 top-1/2 z-50 max-h-[min(90vh,52rem)] w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto overscroll-contain rounded-lg bg-cream-50 p-6 text-ink-900 shadow-dialog sm:p-7',
            WIDTHS[size],
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <Dialog.Title className="font-display text-display-md font-semibold text-balance">{title}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-ink-600">{description}</Dialog.Description>
            </div>
            <Dialog.Close aria-label={closeLabel} className={buttonClasses('quiet', 'md', '-mr-2 -mt-2')}>
              <X size={20} aria-hidden="true" />
            </Dialog.Close>
          </div>
          <div className="mt-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
