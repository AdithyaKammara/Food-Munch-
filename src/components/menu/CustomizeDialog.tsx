import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { ADDONS, PORTIONS, type AddonId, type MenuItem, type PortionId } from '../../data/menu'
import { unitPrice, type CartLine } from '../../lib/pricing'

const SPICE_LEVELS = ['Mild', 'Medium', 'Extra Spicy']

interface Props {
  item: MenuItem
  onClose: () => void
  onConfirm: (line: Omit<CartLine, 'qty'>) => void
}

export default function CustomizeDialog({ item, onClose, onConfirm }: Props) {
  const [portionId, setPortionId] = useState<PortionId>('regular')
  const [spice, setSpice] = useState('Medium')
  const [addons, setAddons] = useState<AddonId[]>([])

  const line = { itemId: item.id, portionId, spice, addons }
  const price = unitPrice({ ...line, qty: 1 })

  const toggleAddon = (id: AddonId) =>
    setAddons((current) => (current.includes(id) ? current.filter((a) => a !== id) : [...current, id]))

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="motion-overlay fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="motion-dialog fixed left-1/2 top-1/2 z-50 max-h-[90vh] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-surface p-6 shadow-card-hover">
          <div className="flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-extrabold">Customize {item.title}</Dialog.Title>
              <Dialog.Description className="mt-1 text-sm text-muted">
                Choose a portion, spice level and any extras.
              </Dialog.Description>
            </div>
            <Dialog.Close
              aria-label="Close"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line hover:border-gold"
            >
              <X size={18} aria-hidden="true" />
            </Dialog.Close>
          </div>

          <form
            className="mt-5 space-y-5"
            onSubmit={(e) => {
              e.preventDefault()
              onConfirm(line)
              onClose()
            }}
          >
            <fieldset>
              <legend className="mb-2 font-bold">1. Portion</legend>
              {PORTIONS.map((p) => (
                <label key={p.id} className="flex cursor-pointer items-center justify-between py-1.5">
                  <span className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="portion"
                      checked={portionId === p.id}
                      onChange={() => setPortionId(p.id)}
                      className="accent-gold-dark"
                    />
                    {p.label}
                  </span>
                  <span className="font-semibold">₹{item.price + p.extra}</span>
                </label>
              ))}
            </fieldset>

            <fieldset>
              <legend className="mb-2 font-bold">2. Spice level</legend>
              <div className="flex flex-wrap gap-4">
                {SPICE_LEVELS.map((level) => (
                  <label key={level} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="spice"
                      checked={spice === level}
                      onChange={() => setSpice(level)}
                      className="accent-gold-dark"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 font-bold">3. Extras</legend>
              {ADDONS.map((a) => (
                <label key={a.id} className="flex cursor-pointer items-center justify-between py-1.5">
                  <span className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={addons.includes(a.id)}
                      onChange={() => toggleAddon(a.id)}
                      className="accent-gold-dark"
                    />
                    {a.label}
                  </span>
                  <span className="text-muted">+₹{a.price}</span>
                </label>
              ))}
            </fieldset>

            <button
              type="submit"
              className="flex w-full items-center justify-between rounded-full bg-gold px-6 py-3.5 font-bold text-on-gold shadow-card hover:shadow-card-hover"
            >
              <span>Add to Cart</span>
              <span>₹{price}</span>
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}