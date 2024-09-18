// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// add commands for seeding and resetting the database
Cypress.Commands.add("resetDb", () => {
	cy.task("db:reset");
});

// Custom command for login
Cypress.Commands.add("login", (username, password) => {
  cy.visit("/login");
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get("form").submit();
  cy.url().should("eq", `${Cypress.config().baseUrl}/home`);
});

// Custom command for signup
Cypress.Commands.add("signup", (username, password) => {
  cy.visit("/signup");
  cy.get('input[name="username"]').type(username);
  cy.get('input[name="password"]').type(password);
  cy.get("form").submit();
  cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
});
