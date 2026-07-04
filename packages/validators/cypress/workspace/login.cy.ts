/// <reference types="cypress" />
describe('Login Test for Form Authentication Page', () => {
  it('Verifies successful login using valid credentials and correct selector', () => {
    cy.visit('https://the-internet.herokuapp.com');

    cy.contains('Form Authentication').click();

    cy.get('input[name="username"]').type('tomsmith');
    cy.get('input[name="password"]').type('SuperSecretPassword!');

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/secure');
  });
});