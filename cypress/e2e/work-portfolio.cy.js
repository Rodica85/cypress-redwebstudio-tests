describe('Work — client portfolio links', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#work').scrollIntoView();
  });

  it('shows the work section with at least three client sites', () => {
    cy.get('#work').should('be.visible');
  });

  const clients = [
    { href: 'doctorstanlarisa.ro' },
    { href: 'redspeedrider.co.uk' },
    { href: 'gungchaba.online' },
  ];

  clients.forEach(({ href }) => {
    it(`links to ${href} as a client portfolio item`, () => {
      cy.get(`#work a[href*="${href}"]`).should('exist');
    });
  });

  it('client portfolio links open in a new tab with rel="noopener"', () => {
    cy.get('#work a[target="_blank"]').each(($link) => {
      cy.wrap($link)
        .should('have.attr', 'rel')
        .and('include', 'noopener');
    });
  });
});
