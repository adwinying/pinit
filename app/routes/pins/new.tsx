import { withZod } from "@remix-validated-form/with-zod"
import { ValidatedForm } from "remix-validated-form"
import { z } from "zod"
import { zfd } from "zod-form-data"

import FormSubmitButton from "~/components/FormSubmitButton"
import FormText from "~/components/FormText"
import PageTitle from "~/components/PageTitle"

const validator = withZod(
  zfd.formData({
    title: zfd.text(z.string({ required_error: "Title is required" })),
    imageUrl: zfd.text(
      z
        .string({ required_error: "Image URL is required" })
        .url({ message: "Please input a valid URL" }),
    ),
  }),
)

export default function NewPin() {
  return (
    <>
      <PageTitle>New Pin</PageTitle>

      <ValidatedForm
        method="post"
        validator={validator}
        className="w-full sm:max-w-lg"
      >
        <FormText label="Title" name="title" placeholder="some title" />

        <FormText label="Image URL" name="imageUrl" />

        <FormSubmitButton />
      </ValidatedForm>
    </>
  )
}
