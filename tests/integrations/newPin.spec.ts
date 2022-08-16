import { installGlobals } from "@remix-run/node"

import { actingAs } from "~/../tests/auth"
import { prepareRealDb } from "~/../tests/realDb"
import { testValidation } from "~/../tests/validation"
import { action, loader } from "~/routes/pins/new"
import db from "~/utils/db.server"

describe("new pin", () => {
  beforeEach(async () => {
    installGlobals()
    prepareRealDb()
  })

  it("redirects when user unauthenticated", async () => {
    try {
      await loader({
        request: new Request("http:///pins/new"),
        params: {},
        context: {},
      })

      assert.fail()
    } catch (e) {
      if (!(e instanceof Response)) assert.fail()

      expect(e.status).toEqual(302)
      expect(e.headers.get("location")).toEqual("/login/unauthenticated")
    }
  })

  it("loads new pin page when authenticated", async () => {
    await actingAs()

    const response: Response = await loader({
      request: new Request("http:///pins/new"),
      params: {},
      context: {},
    })

    expect(response.status).toEqual(200)
    expect(await response.json()).toEqual({})
  })

  it("can create new pin", async () => {
    const title = "some title"
    const imageUrl = "http://test.com/test.png"

    const body = new FormData()
    body.append("title", title)
    body.append("imageUrl", imageUrl)

    const user = await actingAs()
    const response: Response = await action({
      request: new Request("http:///pins/new", { method: "POST", body }),
      params: {},
      context: {},
    })

    const pin = await db.pin.findFirst()

    expect(pin?.title).toEqual(title)
    expect(pin?.imageUrl).toEqual(imageUrl)
    expect(pin?.ownerId).toEqual(user.id)

    const redirectTo = `/profile/test?new_pin_id=${pin?.id}`
    expect(response.status).toEqual(302)
    expect(response.headers.get("location")).toEqual(redirectTo)
  })

  test.each([
    [
      "title missing",
      {
        data: { title: "" },
        errors: { title: "Title is required" },
      },
    ],
    [
      "imageUrl missing",
      {
        data: { imageUrl: "" },
        errors: { imageUrl: "Image URL is required" },
      },
    ],
    [
      "imageUrl is invalid url",
      {
        data: { imageUrl: "test" },
        errors: { imageUrl: "Please input a valid URL" },
      },
    ],
  ])("validation test: %s", async (_, { data, errors }) => {
    const title = "some title"
    const imageUrl = "http://test.com/test.png"

    const baseFormData = new FormData()
    baseFormData.append("title", title)
    baseFormData.append("imageUrl", imageUrl)

    await actingAs()
    await testValidation(action, baseFormData, data, errors)
  })
})
