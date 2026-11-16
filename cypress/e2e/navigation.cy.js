describe('Navigation — desktop nav and anchor scrolling', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visit('/');
  });

  const anchors = [
    { href: '#services', section: '#services' },
    { href: '#pricing',  section: '#pricing' },
    { href: '#demos',    section: '#demos' },
    { href: '#about',    section: '#about' },
    { href: '#contact',  section: '#contact' },
  ];

  it('desktop nav exposes the five main anchor links', () => {
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

  it('clicking the logo scrolls back to the top of the page', () => {
    cy.get('#contact').scrollIntoView();
    cy.window().its('scrollY').should('be.greaterThan', 500);
    cy.get('#navbar a.logo').click();
    cy.window().its('scrollY').should('eq', 0);
  });
});
