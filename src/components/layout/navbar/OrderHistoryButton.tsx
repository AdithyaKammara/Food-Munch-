import { ReceiptText } from 'lucide-react'
import { useOrdersStore } from '../../../store/ordersStore'
import { useUiStore } from '../../../store/uiStore'
import IconButton from './IconButton'

export default function OrderHistoryButton() {
  const orderCount = useOrdersStore((s) => s.orders.length)
  const hasActiveOrder = useOrdersStore((s) => s.activeOrderId !== null)
  const openPanel = useUiStore((s) => s.openPanel)

  const label = hasActiveOrder
    ? 'Order history (an order is on its way)'
    : `Order history${orderCount ? `, ${orderCount} ${orderCount === 1 ? 'order' : 'orders'}` : ''}`

  return (
    // An order in progress opens its tracking; otherwise the history list.
    <IconButton label={label} onClick={() => openPanel(hasActiveOrder ? 'tracking' : 'history')}>
      <ReceiptText size={20} aria-hidden="true" />
      {hasActiveOrder && (
        <span aria-hidden="true" className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-green-600 ring-2 ring-white" />
      )}
    </IconButton>
  )
}
