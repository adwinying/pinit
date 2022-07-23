import db from "~/utils/db.server"

export interface UpdateOrCreateUserInput {
  twitterId: string
  username: string
  profileImgUrl: string
}

export async function updateOrCreateUser({
  twitterId,
  username,
  profileImgUrl,
}: UpdateOrCreateUserInput) {
  const user = await db.user.upsert({
    where: { twitterId },
    create: {
      twitterId,
      username,
      profileImgUrl,
    },
    update: {
      username,
      profileImgUrl,
    },
  })

  return user
}
