describe('Responsive layout', () => {
  const viewports = [
    { name: 'mobile (iPhone SE)', preset: 'iphone-se2' },
    { name: 'tablet (iPad 2)',    preset: 'ipad-2' },
    { name: 'desktop (1280x800)', preset: [1280, 800] },
  ];

  function setViewport(preset) {
    if (Array.isArray(preset)) cy.viewport(preset[0], preset[1]);
    else cy.viewport(preset);
  }

  viewports.forEach(({ name, preset }) => {
    it(`${name}: homepage h1 is visible`, () => {
      setViewport(preset);
      cy.visit('/');
      cy.get('h1').should('be.visible');
    });

    it(`${name}: homepage renders without horizontal overflow`, () => {
      setViewport(preset);
      cy.visit('/');
      cy.window().then((win) => {
        const docWidth = win.document.documentElement.scrollWidth;
        const viewWidth = win.innerWidth;
        expect(docWidth, `${name}: doc width vs viewport`).to.be.at.most(viewWidth + 1);
      });
    });
  });
});
