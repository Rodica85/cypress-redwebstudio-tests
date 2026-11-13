// The chat widget is loaded from a separate backend and renders in a shadow
// root (cypress.config.js sets includeShadowDom). Answers from the AI are
// stubbed with cy.intercept so the tests are fast and repeatable; one test at
// the end talks to the real backend.

const CHAT_API = '**/api/chat';
const widget = () => cy.get('[data-chat-widget="redwebstudio"]');
const openChat = () => widget().find('.launcher').click();
const send = (text) => widget().find('.input').type(`${text}{enter}`);

describe('Chat widget', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visit('/');
    widget().should('exist');
  });

  it('stays closed until the visitor opens it', () => {
    widget().find('.launcher').should('be.visible');
    widget().find('.panel').should('not.be.visible');
    cy.wait(2000);
    widget().find('.panel').should('not.be.visible');
  });

  it('opens on click and greets the visitor', () => {
    openChat();
    widget().find('.panel').should('be.visible');
    widget().find('.msg.bot').first().should('contain', 'RED Web Studio');
    widget().find('.launcher').should('have.attr', 'aria-expanded', 'true');
  });

  it('closes with the X in the header', () => {
    openChat();
    widget().find('.x').click();
    widget().find('.panel').should('not.be.visible');
  });

  it('closes when the round button is pressed again', () => {
    openChat();
    widget().find('.launcher').click();
    widget().find('.panel').should('not.be.visible');
  });

  it('closes with the Escape key', () => {
    openChat();
    widget().find('.input').type('{esc}');
    widget().find('.panel').should('not.be.visible');
  });

  it('sends the question to the chat backend and shows the answer', () => {
    cy.intercept('POST', CHAT_API, { body: 'Our Starter package costs £349.' }).as('chat');
    openChat();
    send('How much is a one page website?');

    cy.wait('@chat').its('request.body').should((body) => {
      expect(body.client).to.eq('redwebstudio');
      expect(body.messages.at(-1)).to.deep.eq({ role: 'user', content: 'How much is a one page website?' });
    });
    widget().find('.msg.user').last().should('have.text', 'How much is a one page website?');
    widget().find('.msg.bot').last().should('have.text', 'Our Starter package costs £349.');
  });

  it('shows the phone number when the backend is unavailable', () => {
    cy.intercept('POST', CHAT_API, { statusCode: 503, body: { error: 'unavailable' } });
    openChat();
    send('Hello?');
    widget().find('.msg.bot').last().should('contain', '+44 7424 714686');
  });

  it('shows text from the backend as plain text, never as HTML', () => {
    cy.intercept('POST', CHAT_API, { body: '<img src=x onerror="window.hacked=true"> hi' });
    openChat();
    send('test');
    widget().find('.msg.bot').last().should('contain', '<img src=x');
    widget().find('.msg.bot img').should('not.exist');
    cy.window().its('hacked').should('be.undefined');
  });

  describe('"Start a project" flow', () => {
    beforeEach(() => {
      cy.window().then((win) => cy.stub(win, 'open').as('open'));
      openChat();
      widget().contains('.bar .chip', 'Start a project').click();
    });

    it('rejects an invalid email address and asks again', () => {
      widget().contains('.msgs .chip', 'Starter (one page)').click();
      send('Test Bakery');
      widget().contains('.msgs .chip', 'Skip').click();
      send('Cypress Test');
      send('not-an-email');
      widget().find('.msg.bot').last().should('contain', 'email address');
    });

    it('collects the details and opens WhatsApp, without sending them to a server', () => {
      cy.intercept('POST', '**/api/**', cy.spy().as('apiPost'));
      widget().contains('.msgs .chip', 'Starter (one page)').click();
      send('Test Bakery');
      widget().contains('.msgs .chip', 'Skip').click();
      send('Cypress Test');
      send('cypress@example.com');
      widget().contains('.msgs .chip', 'Skip').click();

      widget().find('.msg.bot').should('contain', 'Name: Cypress Test');
      widget().contains('.msgs .chip', 'Open WhatsApp').click();

      cy.get('@open').should('have.been.calledOnce');
      cy.get('@open').its('firstCall.args.0').then((url) => {
        const text = decodeURIComponent(url);
        expect(text).to.include('https://wa.me/447424714686');
        expect(text).to.include('Looking for: Starter (one page)');
        expect(text).to.include('Email: cypress@example.com');
      });
      cy.get('@apiPost').should('not.have.been.called');
    });

    it('can be cancelled without anything being sent', () => {
      widget().contains('.msgs .chip', 'Cancel').click();
      widget().find('.msg.bot').last().should('contain', 'nothing was sent');
      cy.get('@open').should('not.have.been.called');
    });
  });

  it('on a phone the chat fills the screen and the X closes it', () => {
    cy.viewport(375, 812);
    openChat();
    widget().find('.panel').invoke('outerWidth').should('eq', 375);
    widget().find('.launcher').should('not.be.visible');
    widget().find('.x').should('be.visible').click();
    widget().find('.panel').should('not.be.visible');
    widget().find('.launcher').should('be.visible');
  });

  it('is not loaded on the demo pages', () => {
    cy.visit('/demos');
    cy.get('[data-chat-widget]').should('not.exist');
  });

  // Talks to the real AI backend: one question, checked against a fixed price.
  it('answers a real price question correctly (live backend)', () => {
    openChat();
    send('How much is a one page website?');
    widget().find('.msg.bot', { timeout: 30000 }).last().should('contain', '349');
  });
});
