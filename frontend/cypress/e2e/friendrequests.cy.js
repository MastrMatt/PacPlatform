describe("Friend Requests", () => {
	const testUsers = [
		{ username: "friendRequestTest1", password: "Testpassword1!" },
		{ username: "friendRequestTest2", password: "Testpassword2!" },
		{ username: "friendRequestTest3", password: "Testpassword3!" },
	];

	before(() => {
		// Reset the database and sign up new users before all tests
		cy.resetDb();
		testUsers.forEach((user) => {
			cy.signup(user.username, user.password);
		});
	});

	beforeEach(() => {
		cy.login(testUsers[0].username, testUsers[0].password);
	});

	it("should display the friend requests page", () => {
		cy.visit("/friendrequests");
	});

	it("Search for a user and view their profile", () => {
		cy.visit("/search");
		cy.get("input").type(testUsers[1].username);

		// get the button with the view text
		cy.get("button").contains("View").click();

		// make sure the user is displayed
		cy.contains(testUsers[1].username);
	});

	it("Send and accept a friend request", () => {
		cy.visit("/search");
		cy.get("input").type(testUsers[1].username);

		// get the button with the send friend request text
		cy.get("button").contains("Send Friend Request").click();

		// make sure the button text is now "Sent"
		cy.get("button").contains("Sent");

		// navigate to profile page to logout and sign in to the other user
		cy.visit("/profile");
		cy.get("button").contains("Sign Out").click();
		cy.login(testUsers[1].username, testUsers[1].password);

		// navigate to friend requests page
		cy.visit("/friendrequests");

		// make sure the friend request is displayed
		cy.contains(testUsers[0].username);

		// click for first button to accept the friend request
		cy.get("button").first().click();

		// make sure the friend request is not displayed
		cy.contains(testUsers[0].username).should("not.exist");
	});

	it("Send and reject a friend request", () => {
		cy.visit("/search");
		cy.get("input").type(testUsers[2].username);

		// get the button with the send friend request text
		cy.get("button").contains("Send Friend Request").click();

		// make sure the button text is now "Sent"
		cy.get("button").contains("Sent");

		// navigate to profile page to logout and sign in to the other user
		cy.visit("/profile");
		cy.get("button").contains("Sign Out").click();
		cy.login(testUsers[2].username, testUsers[2].password);

		// navigate to friend requests page
		cy.visit("/friendrequests");

		// make sure the friend request is displayed
		cy.contains(testUsers[0].username);

		// click the second button to reject the friend request
		cy.get("button").eq(1).click();

		// make sure the friend request is not displayed
		cy.contains(testUsers[0].username).should("not.exist");
	});
});
