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
  defaultValue = "",
  disabled = false,
  errors = [],
}: Props) {
  return (
    <div className="form-control">
      <label htmlFor={name} className="label">
        {label}
      </label>

      <input
        id={name}
        type={type}
        name={name}
        defaultValue={defaultValue}
        disabled={disabled}
        className={`input input-bordered ${errors.length ? "input-error" : ""}`}
        placeholder={placeholder}
      />

      {errors && (
        <label
          className="label label-text-alt text-error"
          htmlFor={`${name}-error`}
        >
          {errors[0]}
        </label>
      )}
    </div>
  )
}
