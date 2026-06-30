describe('Navigation — desktop nav and anchor scrolling', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visit('/');
  });

  const anchors = [
    { href: '#services',   section: '#services' },
    { href: '#ai-chatbot', section: '#ai-chatbot' },
    { href: '#about',      section: '#about' },
    { href: '#industries', section: '#industries' },
    { href: '#audit',      section: '#audit' },
    { href: '#contact',    section: '#contact' },
  ];

  it('desktop nav exposes the six main anchor links', () => {
    anchors.forEach(({ href }) => {
      cy.get(`#navbar a[href="${href}"]`).should('exist');
    });
  });

  anchors.forEach(({ href, section }) => {
    it(`clicking the ${href} nav link scrolls ${section} into view`, () => {
      cy.get(`#navbar a[href="${href}"]`).first().click();
      cy.get(section).should('be.visible');
    });
  });

  it('the brand/logo link is present in the navbar', () => {
    cy.get('#navbar a.logo').should('exist');
  });
});
