import { installGlobals } from "@remix-run/node"

import { actingAs } from "~/../tests/auth"
import { prepareRealDb } from "~/../tests/realDb"
import { action, loader } from "~/routes/pins/$id.delete"
import db from "~/utils/db.server"

describe("delete pin", () => {
  beforeEach(() => {
    installGlobals()
    prepareRealDb()
  })

  it("returns error when id undefined", async () => {
    try {
      await action({
        request: new Request("http:///pins/delete"),
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
        request: new Request("http:///pins/delete"),
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
        request: new Request("http:///pins/delete"),
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

  it("returns error if pin does not belong to authed user", async () => {
    await actingAs()

    const pinOwner = await db.user.create({
      data: {
        username: "owner",
        twitterId: "owner",
        profileImgUrl: "http://test.com/owner.png",
      },
    })
    const pin = await db.pin.create({
      data: {
        title: "title",
        imageUrl: "http://test.com/test.png",
        ownerId: pinOwner.id,
      },
    })
    const id = pin.id

    try {
      await action({
        request: new Request("http:///pins/delete"),
        params: { id },
        context: {},
      })

      assert.fail()
    } catch (e) {
      if (!(e instanceof Response)) assert.fail()

      expect(e.status).toEqual(401)
      expect(e.text()).resolves.toEqual("Not your pin!")
    }
  })

  it("can delete a pin", async () => {
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
      request: new Request("http:///pins/delete"),
      params: { id },
      context: {},
    })

    expect(response).toBeNull()
  })

  it("redirects to index page when request is GET", async () => {
    const response: Response = await loader({
      request: new Request("http:///pins/delete"),
      params: {},
      context: {},
    })

    expect(response.status).toEqual(302)
    expect(response.headers.get("location")).toEqual("/")
    expect(response.headers.get("set-cookie")).not.toBeNull()
  })
})
