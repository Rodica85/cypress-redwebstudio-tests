describe('Privacy policy and site basics', () => {
  it('the privacy policy page loads and covers the key sections', () => {
    cy.visit('/privacy-policy');
    cy.get('h1').should('contain', 'Privacy Policy');
    ['Who we are', 'What we receive, and why', 'Cookies', 'How long we keep it', 'Your rights']
      .forEach((heading) => cy.contains('h2', heading).should('exist'));
  });

  it('the privacy policy explains how the chat assistant handles messages', () => {
    cy.visit('/privacy-policy');
    cy.contains('h3', 'chat assistant').should('exist');
    cy.contains('We do not store your conversation').should('exist');
  });

  ['/', '/services/website-design', '/services/ai-chatbot'].forEach((path) => {
    it(`the footer on ${path} links to the privacy policy`, () => {
      cy.visit(path);
      cy.get('footer a[href="/privacy-policy"]').should('exist');
    });
  });

  it('the site sets no cookies, matching what the policy says', () => {
    cy.visit('/');
    cy.get('[data-chat-widget]').should('exist');
    cy.getCookies().should('have.length', 0);
  });

  it('an unknown address returns 404 with the custom page', () => {
    cy.request({ url: '/this-page-does-not-exist', failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(404);
      expect(response.body).to.include('Page Not Found');
    });
  });

  it('sends the basic security headers', () => {
    cy.request('/').its('headers').then((headers) => {
      expect(headers['x-content-type-options']).to.eq('nosniff');
      expect(headers['x-frame-options']).to.eq('SAMEORIGIN');
      expect(headers['referrer-policy']).to.eq('strict-origin-when-cross-origin');
    });
  });

  it('the sitemap lists the privacy policy', () => {
    cy.request('/sitemap.xml').its('body').should('include', 'https://redwebstudio.com/privacy-policy');
  });
});
