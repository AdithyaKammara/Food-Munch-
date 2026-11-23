import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { LoaderCircle } from 'lucide-react'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonClasses'

interface CommonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Shows a spinner, keeps the width and blocks repeat presses. */
  loading?: boolean
  icon?: ReactNode
  iconPosition?: 'start' | 'end'
  className?: string
  children?: ReactNode
}

type AsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type AsLink = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
export type ButtonProps = AsButton | AsLink

/**
 * Primary, secondary and quiet (icon) buttons from component-guidelines.md §4.
 * Renders an <a> when given `href`, otherwise a <button type="button">.
 */
export default function Button(props: ButtonProps) {
  const { variant = 'primary', size = 'md', loading = false, icon, iconPosition = 'start', className, children, ...rest } = props
  const classes = buttonClasses(variant, size, className)
  const content = (
    <>
      {loading ? (
        <LoaderCircle size={18} aria-hidden="true" className="motion-safe:animate-spin" />
      ) : (
        iconPosition === 'start' && icon
      )}
      {children}
      {!loading && iconPosition === 'end' && icon}
    </>
  )

  if ('href' in rest && rest.href !== undefined) {
    const linkProps = rest as AnchorHTMLAttributes<HTMLAnchorElement>
    return (
      <a {...linkProps} className={classes}>
        {content}
      </a>
    )
  }

  const { type = 'button', disabled, ...buttonProps } = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button
      {...buttonProps}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
    >
      {content}
    </button>
  )
}
