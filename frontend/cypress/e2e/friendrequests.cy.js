describe("Friend Requests", () => {
	const testUser = {
		username: "friendRequestTest",
		password: "Testpassword!",
	};

	before(() => {
		// Reset the database and sign up a new user before all tests
		cy.resetDb();
		cy.signup(testUser.username, testUser.password);
		cy.login(testUser.username, testUser.password);
	});

	it("should display the friend requests page", () => {
		cy.visit("/friendrequests");
	});
});
