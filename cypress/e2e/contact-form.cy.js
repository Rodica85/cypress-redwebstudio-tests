// The contact form does not post to a server: it opens WhatsApp with the
// message ready. window.open is stubbed, so no real message is ever sent.

describe('Contact form', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.window().then((win) => cy.stub(win, 'open').as('open'));
    cy.get('#contactForm').scrollIntoView();
  });

  it('renders the contact form on the homepage', () => {
    cy.get('#contactForm').should('be.visible');
  });

  it('has the six expected fields', () => {
    ['name', 'email', 'phone', 'business', 'service', 'message'].forEach((field) => {
      cy.get(`#contactForm [name="${field}"]`).should('exist');
    });
  });

  it('uses email and tel input types so phones show the right keyboard', () => {
    cy.get('#contactForm input[name="email"]').should('have.attr', 'type', 'email');
    cy.get('#contactForm input[name="phone"]').should('have.attr', 'type', 'tel');
  });

  it('offers the three packages, custom projects and a call in the service list', () => {
    const expected = ['Starter', 'Business', 'Growth', 'Custom project', 'Just exploring'];
    cy.get('#contactForm select[name="service"] option').then(($options) => {
      const labels = [...$options].map((option) => option.textContent);
      expected.forEach((label) => {
        expect(labels.some((text) => text.includes(label)), `option "${label}"`).to.be.true;
      });
    });
  });

  it('links to the privacy policy next to the submit button', () => {
    cy.get('#contactForm .form-privacy-note a').should('have.attr', 'href', '/privacy-policy');
  });

  it('opens WhatsApp with the visitor\'s details instead of posting to a server', () => {
    cy.intercept('POST', '**', cy.spy().as('anyPost'));
    cy.get('#contactForm input[name="name"]').type('Cypress Test');
    cy.get('#contactForm input[name="business"]').type('Test Bakery');
    cy.get('#contactForm select[name="service"]').select('Starter (one page)');
    cy.get('#contactForm button[type="submit"]').click();

    cy.get('@open').should('have.been.calledOnce');
    cy.get('@open').its('firstCall.args.0').then((url) => {
      const text = decodeURIComponent(url);
      expect(text).to.include('https://wa.me/447424714686');
      expect(text).to.include('Name: Cypress Test');
      expect(text).to.include('Business: Test Bakery');
      expect(text).to.include('Service needed: Starter (one page)');
    });
    cy.get('@anyPost').should('not.have.been.called');
  });
});
