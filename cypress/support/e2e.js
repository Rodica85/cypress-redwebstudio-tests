// Suppress uncaught exceptions thrown by third-party scripts (analytics,
// fonts, animations) so they don't fail tests for issues not on the site itself.
Cypress.on('uncaught:exception', () => false);
