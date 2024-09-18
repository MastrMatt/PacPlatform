describe("Auth", () => {
	before(() => {
		// Clear cookies and reset the database before running these tests
		cy.clearCookies();
		cy.resetDb();
	});

	describe("Signup", () => {
		it("should sign up a new user", () => {
			// Visit the signup page
			cy.visit("/signup");

			// Fill out the signup form
			cy.get('input[name="username"]').type("testuser");
			cy.get('input[name="password"]').type("Testpassword!");

			// Submit the form
			cy.get("form").submit();

			// Assert that the user is redirected to the login page
			cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
		});

		it("should not sign up a user with an existing username", () => {
			// Visit the signup page
			cy.visit("/signup");

			// Fill out the signup form
			cy.get('input[name="username"]').type("testuser");
			cy.get('input[name="password"]').type("Testpassword!");

			// Submit the form
			cy.get("form").submit();

			// Assert that the user sees an error message
			cy.contains("Username has already been taken");
		});

		it("should not sign up a user with an invalid password", () => {
			// Visit the signup page
			cy.visit("/signup");

			// Fill out the signup form
			cy.get('input[name="username"]').type("testuser2");
			cy.get('input[name="password"]').type("password");

			// Submit the form
			cy.get("form").submit();

			// Assert that the user sees an error message
			cy.contains(
				"Password must contain at least one uppercase letter and one special character"
			);
		});
	});

	describe("Login", () => {
		it("should log in an existing user", () => {
			// Visit the login page
			cy.visit("/login");

			// Fill out the login form
			cy.get('input[name="username"]').type("testuser");
			cy.get('input[name="password"]').type("Testpassword!");

			// Submit the form
			cy.get("form").submit();

			// Assert that the user is redirected to the home page
			cy.url().should("eq", `${Cypress.config().baseUrl}/home`);
		});

		it("should not log in a user with an incorrect password", () => {
			// Visit the login page
			cy.visit("/login");

			// Fill out the login form
			cy.get('input[name="username"]').type("testuser");
			cy.get('input[name="password"]').type("wrongpassword");

			// Submit the form
			cy.get("form").submit();

			// Assert that the user sees an error message
			cy.contains("Incorrect username or password. Please try again.");
		});

		it("should not log in a user with an incorrect username", () => {
			// Visit the login page
			cy.visit("/login");

			// Fill out the login form
			cy.get('input[name="username"]').type("wronguser");
			cy.get('input[name="password"]').type("Testpassword!");

			// Submit the form
			cy.get("form").submit();

			// Assert that the user sees an error message
			cy.contains("Incorrect username or password. Please try again.");
		});
	});
});
