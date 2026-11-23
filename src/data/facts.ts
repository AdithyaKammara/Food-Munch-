/**
 * The delivery facts, written once. The story's feature row and the Delivery & Payment section
 * both read from here, so they can never disagree (component-guidelines.md §13). All of it is
 * honest for a demo: the time is an estimate, tracking is simulated, UPI is a demo QR code.
 */
export const DELIVERY_FACTS = {
  time: 'Hot meals in about 22 min (demo estimate).',
  payment: 'UPI (QR demo) or cash on delivery.',
  tracking: 'Kitchen to doorstep, simulated.',
} as const
