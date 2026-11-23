import { useState } from 'react'
import { ADDONS, PORTIONS, type AddonId, type MenuItem, type PortionId } from '../../data/menu'
import { unitPrice, type CartLine } from '../../lib/pricing'
import { buttonClasses } from '../ui/buttonClasses'
import Modal from '../ui/Modal'
import Price from '../ui/Price'

const SPICE_LEVELS = ['Mild', 'Medium', 'Extra Spicy']

// A whole row is the label for its native radio or checkbox; the chosen row gets a copper border.
const optionRow =
  'flex min-h-12 cursor-pointer items-center justify-between gap-3 rounded-sm border border-line-200 px-3.5 py-2.5 transition-colors hover:border-copper-600 has-[:checked]:border-copper-600 has-[:checked]:bg-cream-100'

interface Props {
  item: MenuItem
  onClose: () => void
  onConfirm: (line: Omit<CartLine, 'qty'>) => void
}

/** Portion, spice level and extras for dishes that have options. Behaviour unchanged. */
export default function CustomizeDialog({ item, onClose, onConfirm }: Props) {
  const [portionId, setPortionId] = useState<PortionId>('regular')
  const [spice, setSpice] = useState('Medium')
  const [addons, setAddons] = useState<AddonId[]>([])

  const line = { itemId: item.id, portionId, spice, addons }
  const price = unitPrice({ ...line, qty: 1 })

  const toggleAddon = (id: AddonId) =>
    setAddons((current) => (current.includes(id) ? current.filter((a) => a !== id) : [...current, id]))

  return (
    <Modal open onClose={onClose} title={`Customise ${item.title}`} description="Choose a portion, spice level and any extras.">
      <form
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault()
          onConfirm(line)
          onClose()
        }}
      >
        <fieldset>
          <legend className="mb-2.5 font-display text-title font-semibold">Portion</legend>
          <div className="space-y-2">
            {PORTIONS.map((p) => (
              <label key={p.id} className={optionRow}>
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="portion"
                    checked={portionId === p.id}
                    onChange={() => setPortionId(p.id)}
                    className="size-4 accent-copper-600"
                  />
                  {p.label}
                </span>
                <Price amount={item.price + p.extra} plain className="font-semibold" />
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2.5 font-display text-title font-semibold">Spice level</legend>
          <div className="flex flex-wrap gap-2">
            {SPICE_LEVELS.map((level) => (
              <label
                key={level}
                className="inline-flex h-11 cursor-pointer items-center rounded-full border border-line-200 px-4 text-[0.9375rem] font-semibold transition-colors hover:border-copper-600 has-[:checked]:border-copper-600 has-[:checked]:bg-copper-600 has-[:checked]:text-white has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus"
              >
                {/* The radio stays in the page for keyboards and screen readers; the pill shows its state */}
                <input
                  type="radio"
                  name="spice"
                  checked={spice === level}
                  onChange={() => setSpice(level)}
                  className="sr-only"
                />
                {level}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2.5 font-display text-title font-semibold">Extras</legend>
          <div className="space-y-2">
            {ADDONS.map((a) => (
              <label key={a.id} className={optionRow}>
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={addons.includes(a.id)}
                    onChange={() => toggleAddon(a.id)}
                    className="size-4 accent-copper-600"
                  />
                  {a.label}
                </span>
                <span className="text-ink-600">
                  +<Price amount={a.price} plain />
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <button type="submit" className={buttonClasses('primary', 'lg', 'w-full justify-between')}>
          <span>Add to cart</span>
          <Price amount={price} plain className="font-semibold" />
        </button>
      </form>
    </Modal>
  )
}
