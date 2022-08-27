import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node"
import { json } from "@remix-run/node"
import { redirect } from "@remix-run/node"
import { withZod } from "@remix-validated-form/with-zod"
import { useCallback, useEffect, useRef, useState } from "react"
import { useDropzone } from "react-dropzone"
import { FaFileImage, FaTrash } from "react-icons/fa"
import { ValidatedForm, validationError } from "remix-validated-form"
import { z } from "zod"
import { zfd } from "zod-form-data"

import FormInput from "~/components/FormInput"
import FormSubmitButton from "~/components/FormSubmitButton"
import PageTitle from "~/components/PageTitle"
import { createPin } from "~/libs/createPin"
import { requireUser } from "~/utils/auth.server"

export const meta: MetaFunction = () => ({
  title: "New Pin - Pinit",
})

export const loader: LoaderFunction = async ({ request }) => {
  await requireUser(request)

  return json({})
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

function ImageDropzone({
  imageUrl,
  onImageChange,
}: {
  imageUrl: string
  onImageChange: (imageUrl: string) => void
}) {
  const [isImageLoadError, setIsImageLoadError] = useState(false)

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      const imageFile = acceptedFiles[0]

      if (!imageFile) return

      const reader = new FileReader()
      reader.readAsDataURL(imageFile)
      reader.onload = () => {
        const { result } = reader

        if (typeof result !== "string") return

        onImageChange(result)
      }
    },
    [onImageChange],
  )

  const onDropRejected = useCallback(() => {
    window.alert("Please select an image file")
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/jpeg": [], "image/png": [] },
    maxFiles: 1,
    onDropAccepted,
    onDropRejected,
  })

  return (
    <>
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        <img
          className={`w-full ${!imageUrl || isImageLoadError ? "hidden" : ""}`}
          alt="Preview"
          src={imageUrl}
          onLoad={() => setIsImageLoadError(false)}
          onError={() => setIsImageLoadError(true)}
        />

        {(!imageUrl || isImageLoadError) && (
          <div
            className="mb-4 flex w-full flex-col items-center space-y-5 rounded-sm
          border-4 border-dashed border-gray-200 bg-gray-100 p-20 text-center"
          >
            <FaFileImage className="text-4xl" />
            {isDragActive ? (
              <span>Drop image here</span>
            ) : (
              <span>Drag & drop, or click to select an image</span>
            )}
          </div>
        )}
      </div>

      {imageUrl && (
        <div className="text-right">
          <button
            className="btn btn-error btn-sm mt-3"
            onClick={(e) => {
              e.preventDefault()
              onImageChange("")
            }}
          >
            <FaTrash className="mr-1" />
            Remove Image
          </button>
        </div>
      )}
    </>
  )
}

export default function NewPin() {
  const formRef = useRef<HTMLFormElement>(null)
  const [imageUrl, setImageUrl] = useState("")

  const handleImageChange = (imageUrl: string) => setImageUrl(imageUrl)

  useEffect(() => {
    const $imageUrl =
      formRef.current?.querySelector<HTMLInputElement>('[name="imageUrl"]')

    if (!$imageUrl) return

    $imageUrl.value = imageUrl
  }, [imageUrl])

  return (
    <>
      <PageTitle>New Pin</PageTitle>

      <ValidatedForm
        method="post"
        validator={validator}
        className="w-full sm:max-w-lg"
        formRef={formRef}
      >
        <ImageDropzone imageUrl={imageUrl} onImageChange={handleImageChange} />

        <FormInput label="Title" name="title" placeholder="Some Title" />
        <FormInput
          label="Image URL"
          name="imageUrl"
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <FormSubmitButton />
      </ValidatedForm>
    </>
  )
}
