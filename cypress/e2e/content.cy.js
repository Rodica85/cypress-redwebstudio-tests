describe('Content, SEO and accessibility', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('meta description sells the studio proposition', () => {
    cy.get('head meta[name="description"]')
      .should('have.attr', 'content')
      .and('include', 'UK')
      .and('include', 'AI chatbot');
  });

  it('Open Graph title, description and image are set for social sharing', () => {
    cy.get('head meta[property="og:title"]').should('have.attr', 'content').and('not.be.empty');
    cy.get('head meta[property="og:description"]').should('have.attr', 'content').and('not.be.empty');
    cy.get('head meta[property="og:image"]').should('have.attr', 'content').and('include', 'http');
  });

  it('Twitter card meta tags are present', () => {
    cy.get('head meta[name="twitter:card"]').should('have.attr', 'content', 'summary_large_image');
    cy.get('head meta[name="twitter:title"]').should('have.attr', 'content').and('not.be.empty');
  });

  it('FAQ structured data is embedded for rich Google results', () => {
    cy.get('head script[type="application/ld+json"]').should('have.length.at.least', 1);
    cy.get('head script[type="application/ld+json"]').then(($scripts) => {
      const hasFaq = [...$scripts].some((s) => s.textContent.includes('FAQPage'));
      expect(hasFaq, 'at least one JSON-LD block declares FAQPage').to.be.true;
    });
  });

  it('every image has a non-empty alt attribute (accessibility)', () => {
    cy.get('img').each(($img) => {
      cy.wrap($img)
        .should('have.attr', 'alt')
        .and((alt) => { expect(alt, 'image alt text').to.exist; });
    });
  });

  it('the page declares en-GB locale for UK audience', () => {
    cy.get('head meta[property="og:locale"]').should('have.attr', 'content', 'en_GB');
  });
});
