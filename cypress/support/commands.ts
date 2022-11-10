import type { Like, Pin, Prisma, User } from "@prisma/client"

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

type ScriptName = "login"
export type ScriptInput = {
  login: { user: Prisma.UserCreateInput }
}
export type ScriptOutput = {
  login: {
    user: User
    session: string
  }
}

function runScript<T extends ScriptName>(scriptName: T, input: ScriptInput[T]) {
  const jsonInput = JSON.stringify(input).replace(/"/g, '\\"')

  return cy
    .exec(
      `env-cmd -f .env.test ` +
        `tsx --require tsconfig-paths/register ` +
        `./cypress/support/${scriptName}.ts "${jsonInput}"`,
    )
    .then(({ stdout }) => JSON.parse(stdout) as ScriptOutput[T])
}

function resetDb() {
  cy.exec("cp ./prisma/test.db ./prisma/test-e2e.db")
}

function login(user?: Partial<Prisma.UserCreateInput>) {
  const defaultValues = {
    username: "test",
    twitterId: "test",
    profileImgUrl: "https://www.gstatic.com/webp/gallery/1.webp",
  }

  const input = { user: { ...defaultValues, ...user } }

  return runScript("login", input).then(({ user, session }) => {
    return cy.setCookie("__session", session).then(() => user)
  })
}

Cypress.Commands.add("resetDb", resetDb)
Cypress.Commands.add("login", login)
