import type { ChangeEvent } from "react"
import { useField } from "remix-validated-form"

type Props = {
  label: string
  name: string
  type?: string
  placeholder?: string
  disabled?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export default function FormInput({
  label,
  name,
  type = "text",
  placeholder = "",
  disabled = false,
  onChange = () => {},
}: Props) {
  const { error, getInputProps } = useField(name)

  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        {label}
      </label>

      <input
        {...getInputProps({
          id: name,
          type,
          placeholder,
          disabled,
          className: `input input-bordered ${error ? "input-error" : ""}`,
          onChange,
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
