/** Removes spaces and dashes, and a leading +91 or 91 country code. */
export function normalizePhone(input: string): string {
  return input.replace(/[\s-]/g, '').replace(/^(\+91|91)(?=\d{10}$)/, '')
}

export function validateName(name: string): string | null {
  const value = name.trim()
  if (value.length < 2) return 'Enter your full name (at least 2 characters).'
  if (value.length > 60) return 'Name is too long (60 characters max).'
  return null
}

export function validatePhone(phone: string): string | null {
  return /^[6-9]\d{9}$/.test(normalizePhone(phone))
    ? null
    : 'Enter a valid 10-digit Indian mobile number.'
}

export function validateAddress(address: string): string | null {
  const value = address.trim()
  if (value.length < 10) return 'Enter a full address (at least 10 characters).'
  if (value.length > 200) return 'Address is too long (200 characters max).'
  return null
}