import { describe, expect, it } from 'vitest'
import { normalizePhone, validateAddress, validateName, validatePhone } from './validation'

describe('normalizePhone', () => {
  it('strips spaces, dashes and the +91 prefix', () => {
    expect(normalizePhone('+91 98765-43210')).toBe('9876543210')
    expect(normalizePhone('919876543210')).toBe('9876543210')
  })
  it('does not strip a 10-digit number that merely starts with 91', () => {
    expect(normalizePhone('9112345678')).toBe('9112345678')
  })
})

describe('validatePhone', () => {
  it('accepts valid Indian mobile numbers', () => {
    expect(validatePhone('9876543210')).toBeNull()
    expect(validatePhone('+91 98765 43210')).toBeNull()
  })
  it('rejects numbers that are too short or start with 0-5', () => {
    expect(validatePhone('98765')).not.toBeNull()
    expect(validatePhone('1234567890')).not.toBeNull()
    expect(validatePhone('')).not.toBeNull()
  })
})

describe('validateName', () => {
  it('needs at least 2 characters after trimming', () => {
    expect(validateName(' A ')).not.toBeNull()
    expect(validateName('Adithya')).toBeNull()
  })
})

describe('validateAddress', () => {
  it('needs at least 10 characters after trimming', () => {
    expect(validateAddress('Flat 4')).not.toBeNull()
    expect(validateAddress('Flat 402, Road 5, Hitech City')).toBeNull()
  })
})