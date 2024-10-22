describe('navigation tests', () => {
  it('navigates to sign-in page on button click', () => {
    cy.visit('http://localhost:3000');
    
    // Click the sign-in button
    cy.get('[data-id="open-sign-in-btn"]').click();

    // Assert that the URL has changed to the sign-in page
    cy.url().should('include', '/sign-in');
  });
});
