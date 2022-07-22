import db from "~/utils/db.server"
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
        imageUrl: `http://placekitten.com/${i + 200}/${i + 300}`,
        ownerId: user.id,
      }

      return db.pin.create({ data })
    }),
  )
})()
