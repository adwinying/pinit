import db from "~/utils/db.server"

const ran = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min)

;(async () => {
  const user = await db.user.create({
    data: {
      twitterId: "test",
      username: "test",
      profileImgUrl: "http://placekitten.com/400/400",
    },
  })

  await Promise.all(
    Array.from({ length: 50 }).map((_, i) => {
      const data = {
        title: `Pin ${i + 1}`,
        imageUrl: `http://placekitten.com/${ran(100, 500)}/${ran(100, 500)}`,
        ownerId: user.id,
      }

      return db.pin.create({ data })
    }),
  )
})()
