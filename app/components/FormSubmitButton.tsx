import { FaSync } from "react-icons/fa"
import { useIsSubmitting, useIsValid } from "remix-validated-form"

export default function FormSubmitButton() {
  const isSubmitting = useIsSubmitting()
  const isValid = useIsValid()

  return (
    <button
      type="submit"
      className="btn btn-primary mt-5"
      cy-data="formSubmitButton"
      disabled={isSubmitting || !isValid}
    >
      {isSubmitting ? (
        <>
          <FaSync className="mr-2 animate-spin" />
          Submitting...
        </>
      ) : (
        "Submit"
      )}
    </button>
  )
}
