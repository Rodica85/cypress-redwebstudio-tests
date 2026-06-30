describe('Smoke — homepage essentials', () => {
  it('homepage responds 200', () => {
    cy.request('/').its('status').should('eq', 200);
  });

  it('has the expected title with brand + value proposition', () => {
    cy.visit('/');
    cy.title().should('include', 'RED Web Studio').and('include', 'AI Chatbot');
  });

  it('shows the typewriter h1 hero', () => {
    cy.visit('/');
    cy.get('h1').should('be.visible').and('not.be.empty');
  });

  it('exposes all eight in-page anchor sections in the DOM', () => {
    cy.visit('/');
    ['#services', '#ai-chatbot', '#about', '#industries', '#work', '#audit', '#faq', '#contact']
      .forEach((sec) => cy.get(sec).should('exist'));
  });

  it('canonical URL points to the production domain', () => {
    cy.visit('/');
    cy.get('head link[rel="canonical"]')
      .should('have.attr', 'href')
      .and('include', 'redwebstudio.com');
  });
});
