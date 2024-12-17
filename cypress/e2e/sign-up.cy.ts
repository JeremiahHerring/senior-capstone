describe("Sign-up and login flow", () => {
  // Function to generate a random email
  const getRandomEmail = () => {
    const randomString = Math.random().toString(36).substring(2, 10); // Generate random string
    return `john.doe.${randomString}@example.com`;
  };

  const userEmail = getRandomEmail();

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
