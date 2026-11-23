import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import { fieldClasses } from './fieldClasses'

interface FieldProps {
  label: string
  error?: string | null
  hint?: string
}

function useFieldIds(error?: string | null, hint?: string) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ')
  return { id, hintId, errorId, describedBy: describedBy || undefined }
}


function Messages({ error, hint, ids }: { error?: string | null; hint?: string; ids: { hintId: string; errorId: string } }) {
  return (
    <>
      {hint && (
        <p id={ids.hintId} className="mt-1.5 text-[0.8125rem] text-ink-600">
          {hint}
        </p>
      )}
      {error && (
        <p id={ids.errorId} role="alert" className="mt-1.5 text-sm font-medium text-nonveg">
          {error}
        </p>
      )}
    </>
  )
}

export function TextField({ label, error, hint, ...props }: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const ids = useFieldIds(error, hint)
  return (
    <div>
      <label htmlFor={ids.id} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={ids.id}
        aria-invalid={error ? true : undefined}
        aria-describedby={ids.describedBy}
        className={fieldClasses(error)}
        {...props}
      />
      <Messages error={error} hint={hint} ids={ids} />
    </div>
  )
}

export function TextAreaField({
  label,
  error,
  hint,
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ids = useFieldIds(error, hint)
  return (
    <div>
      <label htmlFor={ids.id} className="text-sm font-semibold">
        {label}
      </label>
      <textarea
        id={ids.id}
        aria-invalid={error ? true : undefined}
        aria-describedby={ids.describedBy}
        className={fieldClasses(error)}
        {...props}
      />
      <Messages error={error} hint={hint} ids={ids} />
    </div>
  )
}