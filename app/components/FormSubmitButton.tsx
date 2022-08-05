import { FaSync } from "react-icons/fa"

type Props = {
  isSubmitting: boolean
}

export default function FormSubmitButton({ isSubmitting }: Props) {
  return (
    <button
      type="submit"
      className="btn btn-primary mt-5"
      cy-data="formSubmitButton"
      disabled={isSubmitting}
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
