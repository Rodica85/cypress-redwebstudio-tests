// We verify the form's structure, validation and anti-spam setup without
// submitting — no real leads or notifications are sent to Formspree.

describe('Free Website Audit form', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#auditForm').scrollIntoView();
  });

  it('renders the audit form on the homepage', () => {
    cy.get('#auditForm').should('be.visible');
  });

  it('submits to a Formspree endpoint via POST', () => {
    cy.get('#auditForm')
      .should('have.attr', 'method')
      .and('match', /post/i);
    cy.get('#auditForm')
      .should('have.attr', 'action')
      .and('include', 'formspree.io');
  });

  it('uses a hidden honeypot field to deter bots', () => {
    cy.get('#auditForm input[name="_gotcha"]').should('exist').and('not.be.visible');
  });

  it('sets a meaningful email subject for inbound leads', () => {
    cy.get('#auditForm input[name="_subject"]')
      .should('have.attr', 'value')
      .and('include', 'Audit');
  });

  it('marks website, name and email as required', () => {
    cy.get('#auditForm input[name="website"]').should('have.attr', 'required');
    cy.get('#auditForm input[name="name"]').should('have.attr', 'required');
    cy.get('#auditForm input[name="email"]').should('have.attr', 'required');
  });

  it('website field is type=url so the browser performs URL validation', () => {
    cy.get('#auditForm input[name="website"]').should('have.attr', 'type', 'url');
  });

  it('email field is type=email so the browser performs email validation', () => {
    cy.get('#auditForm input[name="email"]').should('have.attr', 'type', 'email');
  });

  it('business_type field exists and is optional', () => {
    cy.get('#auditForm input[name="business_type"]')
      .should('exist')
      .and('not.have.attr', 'required');
  });
});
