import { installGlobals } from "@remix-run/node"

import { prepareRealDb } from "~/../tests/realDb"
import { loader } from "~/routes"
import db from "~/utils/db.server"

describe("top page", () => {
  beforeEach(() => {
    installGlobals()
    prepareRealDb()
  })

  it("returns all pins", async () => {
    const pinsData = Array.from({ length: 20 }).map((_, i) => ({
      title: `Pin ${i + 1}`,
      imageUrl: "http://test.com/test.png",
    }))

    const user1 = await db.user.create({
      data: {
        username: "foo",
        twitterId: "foo",
        profileImgUrl: "http://test.com/foo.png",
      },
    })
    const user2 = await db.user.create({
      data: {
        username: "bar",
        twitterId: "bar",
        profileImgUrl: "http://test.com/bar.png",
      },
    })
    const randomUser = () => (Math.random() > 0.5 ? user1 : user2)

    const createdPins = await Promise.all(
      pinsData.map((pin) =>
        db.pin.create({
          data: { ...pin, ownerId: randomUser().id },
        }),
      ),
    )
    await Promise.all(
      createdPins.slice(0, 10).map((pin) =>
        db.like.create({
          data: { userId: randomUser().id, pinId: pin.id },
        }),
      ),
    )
    const pins = await db.pin.findMany({
      orderBy: { updatedAt: "desc" },
      include: { likes: true, owner: true },
    })

    const response: Response = await loader({
      request: new Request("http:///top"),
      params: {},
      context: {},
    })
    const loaderData = await response.json()

    const expected = pins.map(({ id, title, imageUrl, likes, owner }) => ({
      id,
      title,
      imageUrl,
      username: owner.username,
      userImgUrl: owner.profileImgUrl,
      likedBy: likes.map(({ userId }) => userId),
    }))

    expect(response.status).toEqual(200)
    expect(loaderData.pins).toEqual(expected)
  })

  it("returns pagination params", async () => {
    const request = new Request("http:///profile")
    const response: Response = await loader({
      request,
      params: {},
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

    const user = await db.user.create({
      data: {
        username: "foo",
        twitterId: "foo",
        profileImgUrl: "http://test.com/foo.png",
      },
    })
    await Promise.all(
      pinsData.map((pin) =>
        db.pin.create({ data: { ...pin, ownerId: user.id } }),
      ),
    )

    const request = new Request("http:///top")
    const response: Response = await loader({
      request,
      params: {},
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

    const user = await db.user.create({
      data: {
        username: "foo",
        twitterId: "foo",
        profileImgUrl: "http://test.com/foo.png",
      },
    })
    await Promise.all(
      pinsData.map((pin) =>
        db.pin.create({ data: { ...pin, ownerId: user.id } }),
      ),
    )

    const request = new Request("http:///top?page=2")
    const response: Response = await loader({
      request,
      params: {},
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
