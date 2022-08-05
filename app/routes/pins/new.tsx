import { Form, useTransition } from "@remix-run/react"

import FormSubmitButton from "~/components/FormSubmitButton"
import FormText from "~/components/FormText"
import PageTitle from "~/components/PageTitle"

export default function NewPin() {
  const transition = useTransition()

  return (
    <>
      <PageTitle>New Pin</PageTitle>

      <Form method="post" className="w-full sm:max-w-lg">
        <FormText
          label="Title"
          name="title"
          disabled={transition.state === "submitting"}
        />

        <FormText
          label="Image URL"
          name="imageUrl"
          disabled={transition.state === "submitting"}
        />

        <FormSubmitButton isSubmitting={transition.state === "submitting"} />
      </Form>
    </>
  )
}
