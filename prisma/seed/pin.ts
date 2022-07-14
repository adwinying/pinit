import db from "~/utils/db.server"
;(async () => {
  await Promise.all(
    Array.from({ length: 50 }).map((_, i) => {
      const data = {
        title: `Pin ${i + 1}`,
        imageUrl: `http://placekitten.com/${i + 200}/${i + 300}`,
      }

      return db.pin.create({ data })
    }),
  )
})()
