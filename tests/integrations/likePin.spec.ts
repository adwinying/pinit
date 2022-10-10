import { installGlobals } from "@remix-run/node"

import { actingAs } from "~/../tests/auth"
import { prepareRealDb } from "~/../tests/realDb"
import { loader, action } from "~/routes/pins/$id.like"
import db from "~/utils/db.server"

describe("like pin", () => {
  beforeEach(() => {
    installGlobals()
    prepareRealDb()
  })

  it("returns error when id undefined", async () => {
    try {
      await action({
        request: new Request("http:///pins/like"),
        params: {},
        context: {},
      })

      assert.fail()
    } catch (e) {
      if (!(e instanceof Response)) assert.fail()

      expect(e.status).toEqual(422)
      expect(e.text()).resolves.toEqual("Invalid pin ID")
    }
  })

  it("returns error if pin not found", async () => {
    const id = "not-a-valid-id"

    try {
      await action({
        request: new Request("http:///pins/like"),
        params: { id },
        context: {},
      })

      assert.fail()
    } catch (e) {
      if (!(e instanceof Response)) assert.fail()

      expect(e.status).toEqual(422)
      expect(e.text()).resolves.toEqual("Invalid pin ID")
    }
  })

  it("redirects when unauthenticated", async () => {
    const user = await db.user.create({
      data: {
        username: "user",
        twitterId: "user",
        profileImgUrl: "http://test.com/profile.png",
      },
    })
    const pin = await db.pin.create({
      data: {
        title: "title",
        imageUrl: "http://test.com/test.png",
        ownerId: user.id,
      },
    })
    const id = pin.id

    try {
      await action({
        request: new Request("http:///pins/like"),
        params: { id },
        context: {},
      })

      assert.fail()
    } catch (e) {
      if (!(e instanceof Response)) assert.fail()

      expect(e.status).toEqual(302)
      expect(e.headers.get("location")).toEqual("/login/unauthenticated")
    }
  })

  it("can like a pin", async () => {
    const user = await actingAs()
    const pin = await db.pin.create({
      data: {
        title: "title",
        imageUrl: "http://test.com/test.png",
        ownerId: user.id,
      },
    })
    const id = pin.id

    const response: Response = await action({
      request: new Request("http:///pins/like"),
      params: { id },
      context: {},
    })

    expect(response).toBeNull()

    const like = await db.like.findFirst()

    expect(db.like.count()).resolves.toEqual(1)
    expect(like?.pinId).toEqual(pin.id)
    expect(like?.userId).toEqual(user.id)
  })

  it("redirects to index page when request is GET", async () => {
    const response: Response = await loader({
      request: new Request("http:///pins/like"),
      params: {},
      context: {},
    })

    const redirectTo = `/`
    expect(response.status).toEqual(302)
    expect(response.headers.get("location")).toEqual(redirectTo)
    expect(response.headers.get("set-cookie")).not.toBeNull()
  })
})
