import type { ActionFunction } from "@remix-run/node"

export const testValidation = async (
  action: ActionFunction,
  baseFormData: FormData,
  overrideData: { [key: string]: string | Blob },
  expectedErrors: { [key: string]: string },
) => {
  Object.entries(overrideData).forEach(([key, val]) => {
    baseFormData.set(key, val)
  })

  const response: Response = await action({
    request: new Request("http:///some_url", {
      method: "POST",
      body: baseFormData,
    }),
    params: {},
    context: {},
  })

  const responseBody = await response.json()

  expect(response.status).toEqual(422)
  expect(responseBody.fieldErrors).toEqual(expectedErrors)
}
