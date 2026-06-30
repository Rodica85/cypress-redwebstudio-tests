// Bookings happen via phone, WhatsApp, email and Facebook on this site.
// We verify the link metadata only — never click external/tel/mailto links.

describe('Contact channels', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('phone link uses the international tel: format', () => {
    cy.get('a[href^="tel:"]').first()
      .should('have.attr', 'href', 'tel:+447424714686');
  });

  it('WhatsApp link uses the correct UK number', () => {
    cy.get('a[href*="wa.me"]').first()
      .should('have.attr', 'href')
      .and('include', 'wa.me/447424714686');
  });

  it('email link uses the studio mailto address', () => {
    cy.get('a[href^="mailto:"]').first()
      .should('have.attr', 'href')
      .and('include', 'contact@redwebstudio.com');
  });

  it('Facebook link points to the studio profile and opens in a new tab', () => {
    cy.get('a[href*="facebook.com"]').first()
      .should('have.attr', 'target', '_blank')
      .and('have.attr', 'href')
      .and('include', 'facebook.com/profile.php?id=61577439808035');
  });

  it('all external links use rel="noopener" for security', () => {
    cy.get('a[target="_blank"]').each(($link) => {
      cy.wrap($link)
        .should('have.attr', 'rel')
        .and('include', 'noopener');
    });
  });
});
