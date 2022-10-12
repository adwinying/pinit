import { installGlobals } from "@remix-run/node"

import { prepareRealDb } from "~/../tests/realDb"
import { loader } from "~/routes/profile/$username"
import db from "~/utils/db.server"

describe("profile page", () => {
  beforeEach(async () => {
    installGlobals()
    prepareRealDb()
  })

  it("shows not found if username undefined", async () => {
    try {
      await loader({
        request: new Request("http:///profile"),
        params: {},
        context: {},
      })

      assert.fail()
    } catch (e) {
      if (!(e instanceof Response)) assert.fail()

      expect(e.status).toEqual(404)
    }
  })

  it("shows not found if username does not exist", async () => {
    try {
      await loader({
        request: new Request("http:///profile"),
        params: { username: "foo" },
        context: {},
      })

      assert.fail()
    } catch (e) {
      if (!(e instanceof Response)) assert.fail()

      expect(e.status).toEqual(404)
    }
  })

  const userData = {
    username: "foo",
    twitterId: "foo",
    profileImgUrl: "http://test.com/test.png",
  }

  it("returns user info", async () => {
    const user = await db.user.create({ data: userData })

    const request = new Request("http:///profile")
    const response: Response = await loader({
      request,
      params: { username: userData.username },
      context: {},
    })
    const loaderData = await response.json()

    const expected = {
      id: user.id,
      username: user.username,
    }

    expect(response.status).toEqual(200)
    expect(loaderData.user).toEqual(expected)
  })

  it("returns empty pins array if user created no pins", async () => {
    await db.user.create({ data: userData })

    const request = new Request("http:///profile")
    const response: Response = await loader({
      request,
      params: { username: userData.username },
      context: {},
    })
    const loaderData = await response.json()

    expect(response.status).toEqual(200)
    expect(loaderData.pins).toHaveLength(0)
  })

  it("returns all pins created by user", async () => {
    const pinsData = Array.from({ length: 20 }).map((_, i) => ({
      title: `Pin ${i + 1}`,
      imageUrl: "http://test.com/test.png",
    }))

    const user = await db.user.create({ data: userData })
    const createdPins = await Promise.all(
      pinsData.map((pin) =>
        db.pin.create({ data: { ...pin, ownerId: user.id } }),
      ),
    )
    await Promise.all(
      createdPins.slice(0, 10).map((pin) =>
        db.like.create({
          data: { userId: user.id, pinId: pin.id },
        }),
      ),
    )
    const pins = await db.pin.findMany({
      orderBy: { updatedAt: "desc" },
      include: { likes: true },
    })

    const request = new Request("http:///profile")
    const response: Response = await loader({
      request,
      params: { username: userData.username },
      context: {},
    })
    const loaderData = await response.json()

    const expected = pins.map(({ id, title, imageUrl, likes }) => ({
      id,
      title,
      imageUrl,
      username: user.username,
      userImgUrl: user.profileImgUrl,
      likedBy: likes.map(({ userId }) => userId),
    }))

    expect(response.status).toEqual(200)
    expect(loaderData.pins).toEqual(expected)
  })

  it("returns pagination params", async () => {
    await db.user.create({ data: userData })

    const request = new Request("http:///profile")
    const response: Response = await loader({
      request,
      params: { username: userData.username },
      context: {},
    })
    const loaderData = await response.json()

    const expected = {
      baseUrl: request.url,
      perPage: 20,
      currentPage: 1,
      total: 0,
    }

    expect(response.status).toEqual(200)
    expect(loaderData.pagination).toEqual(expected)
  })

  it("returns max 20 pins", async () => {
    const pinsData = Array.from({ length: 21 }).map((_, i) => ({
      title: `Pin ${i + 1}`,
      imageUrl: "http://test.com/test.png",
    }))

    const user = await db.user.create({ data: userData })
    await Promise.all(
      pinsData.map((pin) =>
        db.pin.create({ data: { ...pin, ownerId: user.id } }),
      ),
    )

    const request = new Request("http:///profile")
    const response: Response = await loader({
      request,
      params: { username: userData.username },
      context: {},
    })
    const loaderData = await response.json()

    expect(response.status).toEqual(200)
    expect(loaderData.pins).toHaveLength(20)
  })

  it("returns next page's pins when query params defined", async () => {
    const pinsData = Array.from({ length: 25 }).map((_, i) => ({
      title: `Pin ${i + 1}`,
      imageUrl: "http://test.com/test.png",
    }))

    const user = await db.user.create({ data: userData })
    await Promise.all(
      pinsData.map((pin) =>
        db.pin.create({ data: { ...pin, ownerId: user.id } }),
      ),
    )

    const request = new Request("http:///profile?page=2")
    const response: Response = await loader({
      request,
      params: { username: userData.username },
      context: {},
    })
    const loaderData = await response.json()

    const page2Pins = await db.pin.findMany({
      skip: 20,
      orderBy: { updatedAt: "desc" },
    })
    const expected = page2Pins.map(({ id, title, imageUrl }) => ({
      id,
      title,
      imageUrl,
      username: user.username,
      userImgUrl: user.profileImgUrl,
      likedBy: [],
    }))

    expect(response.status).toEqual(200)
    expect(loaderData.pins).toHaveLength(5)
    expect(loaderData.pins).toEqual(expected)
  })
})
