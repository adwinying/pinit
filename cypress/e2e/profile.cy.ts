describe("profile page", () => {
  const user = {
    id: "asdf-qwer-1234-5678",
    username: "test",
    twitterId: "test",
    profileImgUrl: "https://www.gstatic.com/webp/gallery/1.webp",
  }

  const pins = Array.from({ length: 10 }).map((_, i) => ({
    title: `pin ${i}`,
    imageUrl: `https://www.gstatic.com/webp/gallery/${(i % 5) + 1}.webp`,
    ownerId: user.id,
  }))

  beforeEach(() => {
    cy.resetDb()
  })

  it("can show user's pins and like/unlike the pins", () => {
    cy.seed({ users: [user] })
    cy.seed({ pins })

    cy.visit("/")
    cy.get("li.card").as("card").should("have.length", pins.length)

    cy.visit(`/profile/${user.username}`)
    cy.get("@card").should("have.length", pins.length)

    cy.get("@card")
      .findByRole("button", { name: /like pin/i })
      .first()
      .as("likeButton")
      .click()
    cy.url().should("contain", "/login/unauthenticated")

    cy.login({ username: "authuser", twitterId: "authuser" })

    cy.visit("/")
    cy.get("@card").should("have.length", pins.length)
    cy.get("@card").contains(user.username).first().click()

    cy.url().should("contain", `/profile/${user.username}`)
    cy.get("@card").should("have.length", pins.length)

    cy.get("@card")
      .findByRole("button", { name: /like pin/i })
      .first()
      .as("likeButton")
      .click()
    cy.get("@card")
      .findByRole("button", { name: /unlike pin/i })
      .first()
      .as("unlikeButton")
      .contains(/1/i)

    cy.get("@unlikeButton").click()
    cy.get("@likeButton").contains(/0/i)

    cy.get("@card")
      .findByRole("button", { name: /delete pin/i })
      .should("not.exist")
  })
})
