const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.redwebstudio.com',
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 8000,
    // The chat widget renders inside a shadow root.
    includeShadowDom: true,
    video: false,
    screenshotOnRunFailure: true,
    setupNodeEvents() {},
  },
});
