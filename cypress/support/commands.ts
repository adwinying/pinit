// export needed to supress typescript errors on global scope declarations
export {}

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Reset test server's databse to initial state.
       *
       * @memberof Chainable
       * @example
       *    cy.resetDb()
       */
      resetDb: typeof resetDb

      /**
       * Logs in with a random user.
       *
       * @memberof Chainable
       * @example
       *    cy.login()
       * @example
       *    cy.login({ email: 'test@example.com' })
       */
      login: typeof login
    }
  }
}

function resetDb() {
  cy.exec("cp ./prisma/test.db ./prisma/test-e2e.db")
}

function login() {
  // @TODO
}

Cypress.Commands.add("resetDb", resetDb)
Cypress.Commands.add("login", login)
