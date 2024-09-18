// test the profile page
describe("Profile Page", () => {
	const testUsers = [
		{
			username: "testuser1",
			password: "Testpassword1!",
		},
		{
			username: "testuser2",
			password: "Testpassword2!",
		},
	];

	before(() => {
		cy.resetDb();
		cy.signup(testUsers[0].username, testUsers[0].password);
	});

	beforeEach(() => {
		cy.login(testUsers[0].username, testUsers[0].password);
	});

	it("should display the profile page", () => {
		cy.visit("/profile");
		cy.contains("Profile");
	});
});
