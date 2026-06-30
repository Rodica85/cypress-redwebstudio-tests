describe('Mobile hamburger menu', () => {
  context('on a mobile viewport', () => {
    beforeEach(() => {
      cy.viewport('iphone-se2');
      cy.visit('/');
    });

    it('hamburger button is visible on mobile', () => {
      cy.get('#hamburger').should('be.visible');
    });

    it('clicking the hamburger toggles the nav menu', () => {
      cy.get('#hamburger').click();
      cy.get('#navLinks').should('be.visible');
    });
  });

  context('on a desktop viewport', () => {
    beforeEach(() => {
      cy.viewport(1280, 800);
      cy.visit('/');
    });

    it('hamburger button is hidden on desktop', () => {
      cy.get('#hamburger').should('not.be.visible');
    });

    it('desktop nav links are visible on desktop', () => {
      cy.get('#navLinks').should('be.visible');
    });
  });
});
