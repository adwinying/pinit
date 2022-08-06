import { useField, useIsSubmitting } from "remix-validated-form"

type Props = {
  label: string
  name: string
  type?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  errors?: string[]
}

export default function FormText({
  label,
  name,
  type = "text",
  placeholder = "",
  disabled = false,
}: Props) {
  const { error, getInputProps } = useField(name)
  const isSubmitting = useIsSubmitting()

  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        {label}
      </label>

      <input
        {...getInputProps({
          id: name,
          type,
          disabled: isSubmitting || disabled,
          placeholder,
          className: `input input-bordered ${error ? "input-error" : ""}`,
        })}
      />

      {error && (
        <label
          className="label label-text-alt text-error"
          htmlFor={`${name}-error`}
        >
          {error}
        </label>
      )}
    </div>
  )
}
