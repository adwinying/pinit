import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { ValidatedForm, validationError } from "remix-validated-form"
import { z } from "zod"
import { zfd } from "zod-form-data"

import FormInput from "~/components/FormInput"
import FormSubmitButton from "~/components/FormSubmitButton"
import PageTitle from "~/components/PageTitle"
import createPin from "~/libs/createPin"
import { requireUser } from "~/utils/auth.server"

export const meta: MetaFunction = () => ({
  title: "New Pin - Pinit",
})

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request)

  return {}
}

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

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request)
  const result = await validator.validate(await request.formData())

  if (result.error) return validationError(result.error, result.submittedData)

  const pin = await createPin({
    owner: user,
    title: result.data.title,
    imageUrl: result.data.imageUrl,
  })

  return redirect(`/profile/${user.username}?new_pin_id=${pin.id}`)
}

export default function NewPin() {
  return (
    <>
      <PageTitle>New Pin</PageTitle>

      <ValidatedForm
        method="post"
        validator={validator}
        className="w-full sm:max-w-lg"
      >
        <FormInput label="Title" name="title" placeholder="Some Title" />
        <FormInput label="Image URL" name="imageUrl" />
        <FormSubmitButton />
      </ValidatedForm>
    </>
  )
}
