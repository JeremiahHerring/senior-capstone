describe("Sign-up and login flow", () => {
  const userEmail = "john.doe@example.com";

  before(() => {
    // Check if the user exists before the test
    cy.request("POST", "/api/checkUser", {
      email: userEmail,
    }).then((response) => {
      if (response.body.auth) {
        // If the user exists, delete the user and assert it was deleted
        cy.request("DELETE", "/api/deleteUser", {
          email: userEmail,
        }).then((deleteResponse) => {
          expect(deleteResponse.status).to.eq(200);
        });
      }
    });
  });

  it("navigates to the sign-up page, submits user data, and redirects to the dashboard", () => {
    // Visit the sign-up page
    cy.visit("/sign-up");

    // Fill out the sign-up form
    cy.get('input[id="firstName"]').type("John");
    cy.get('input[id="lastName"]').type("Doe");
    cy.get('input[id="email"]').type(userEmail);
    cy.get('input[id="password"]').type("SuperSecretPassword");

    // Submit the form
    cy.get("form").submit();

    // Wait for the dashboard to load and then assert the URL
    cy.url().should("include", "/dashboard");
  });
});
