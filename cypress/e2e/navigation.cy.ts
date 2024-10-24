describe("navigation tests", () => {
  it("navigates to sign-in page on button click", () => {
    cy.visit("/");

    // Click the sign-in button
    cy.get('[data-id="open-sign-in-btn"]').click();

    // Assert that the URL has changed to the sign-in page
    cy.url().should("include", "/sign-in");

    // Click the sign-up button
    cy.get('[data-id="open-sign-up-btn"]').click();

    // Assert that the URL has changed to the sign-up page
    cy.url().should("include", "/sign-up");

    // Click the logo
    cy.get('[data-id="logo"]').click();

    //Assert that the URL has changed back to the home page
    cy.url().should("eq", "http://localhost:3000/");
  });
});
