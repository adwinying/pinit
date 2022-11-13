describe("index page", () => {
  beforeEach(() => {
    cy.resetDb()
  })

  it("can perform pin CRUD", () => {
    cy.login().then((user) => {
      cy.visit("/")

      // create
      cy.findByRole("button", { name: /new pin/i }).click()

      const newPin = {
        title: "pin title",
        image: "https://www.gstatic.com/webp/gallery/1.webp",
      }

      cy.findByRole("textbox", { name: /title/i }).type(newPin.title)
      cy.findByRole("textbox", { name: /image url/i }).type(
        newPin.image + "{enter}",
      )

      cy.url().should("contain", `/profile/${user.username}`)

      // read
      cy.visit("http://localhost:3002")

      cy.get("li.card").as("card")
      cy.get("@card").should("have.length", 1)
      cy.get("@card").get("p").contains(newPin.title)
      cy.get("@card").get("img").should("have.attr", "src", newPin.image)

      cy.get("@card")
        .findByRole("button", { name: /like pin/i })
        .as("likeButton")
        .contains(/0/i)

      cy.get("@card")
        .findByRole("button", { name: /delete pin/i })
        .as("deleteButton")
        .should("exist")

      // like/unlike
      cy.get("@likeButton").click()
      cy.get("@card")
        .findByRole("button", { name: /unlike pin/i })
        .as("unlikeButton")
        .contains(/1/i)

      cy.get("@card")
        .findByRole("button", { name: /^like pin$/i })
        .should("not.exist")

      cy.get("@unlikeButton").click()
      cy.get("@likeButton").contains(/0/i)

      // delete
      cy.get("@deleteButton").click()
      cy.get("@card").should("not.exist")
    })
  })

  it("can paginate", () => {
    cy.login().then((user) => {
      cy.seed({
        pins: Array.from({ length: 21 }).map((_, i) => ({
          title: `pin ${i}`,
          imageUrl: `https://www.gstatic.com/webp/gallery/${(i % 5) + 1}.webp`,
          ownerId: user.id,
        })),
      })

      cy.visit("/")

      cy.contains("Showing 1 - 20 of 21")
      cy.get("li.card").as("card").should("have.length", 20)
      cy.findByRole("navigation", { name: /pagination/i })
        .findAllByLabelText(/page/i)
        .should("have.length", 2)

      cy.findByLabelText("Page 2").click()
      cy.url().should("contain", "?page=2")
      cy.contains("Showing 21 - 21 of 21")
      cy.get("@card").should("have.length", 1)
    })
  })
})
