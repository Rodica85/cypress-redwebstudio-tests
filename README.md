# redwebstudio.com — Cypress regression suite

End-to-end tests for [www.redwebstudio.com](https://www.redwebstudio.com), the studio site for my freelance web-development practice (UK). The suite is my own safety-net while I iterate on copy, design, the contact form and the AI chat widget. 67 tests.

## What it covers

- **Smoke** (`smoke.cy.js`) — homepage responds 200, title carries the brand + value proposition, the typewriter h1 hero is visible, all eight in-page sections (`#services`, `#pricing`, `#demos`, `#process`, `#about`, `#work`, `#faq`, `#contact`) exist, and the canonical URL points to the production domain.
- **Navigation** (`navigation.cy.js`) — the desktop navbar exposes the five main anchor links and clicking each one scrolls the matching section into view.
- **Mobile menu** (`mobile-menu.cy.js`) — the hamburger is visible on a mobile viewport and hidden on desktop; clicking it reveals the nav links.
- **Work portfolio** (`work-portfolio.cy.js`) — the `#work` section links to all three client sites (doctorstanlarisa.ro, redspeedrider.co.uk, gungchaba.online), each opening in a new tab with `rel="noopener"`.
- **Contact channels** (`booking-links.cy.js`) — phone (`tel:+447424714686`), WhatsApp (`wa.me/447424714686`), email (`contact@redwebstudio.com`) and Facebook profile link are present and correct; every external link carries `rel="noopener"`.
- **Contact form** (`contact-form.cy.js`) — the six fields exist with the right HTML5 input types, the service list offers the three packages, the form links to the privacy policy, and submitting opens WhatsApp with the visitor's details instead of posting to a server.
- **Chat widget** (`chat-widget.cy.js`) — the AI chat stays closed until clicked, opens and greets, closes with the X, the round button or Escape, sends the question to the backend and shows the answer, falls back to the phone number when the backend is down, never renders backend text as HTML, and the "Start a project" flow validates the email and hands over to WhatsApp. One test asks the real backend a price question.
- **Privacy and site basics** (`privacy-and-site-basics.cy.js`) — the privacy policy page and its footer links, no cookies set, the custom 404 page, the security headers and the sitemap entry.
- **Responsive** (`responsive.cy.js`) — the homepage h1 stays visible and the page renders without horizontal overflow on iPhone SE, iPad 2 and 1280×800 desktop.
- **Content, SEO and accessibility** (`content.cy.js`) — meta description, OG title/description/image, Twitter card, FAQ structured data (`FAQPage` JSON-LD), `en_GB` locale and non-empty `alt` text on every image.

## How to run

```bash
npm install
npm run cy:open    # interactive runner — pick a spec to watch live
npm run cy:run     # headless run for the full suite
```

`baseUrl` is set to `https://www.redwebstudio.com` in `cypress.config.js`, so visits use relative paths.

## Notes on the design

- **No real messages sent** — `window.open` is stubbed in the contact form and chat tests, so WhatsApp never opens and nothing reaches the inbox.
- **Selectors** — prefer semantic IDs (`#contactForm`, `#hamburger`, `#navbar`, section IDs) over utility classes, which churn between design iterations.
- **Shadow DOM** — the chat widget renders in a shadow root, so `includeShadowDom` is on in `cypress.config.js` and the widget is found through its `data-chat-widget` attribute.
- **Stubbed AI answers** — chat answers are stubbed with `cy.intercept`, so the tests are fast and give the same result every run. Only one test uses the real AI backend.
- **External-script noise suppressed** in `cypress/support/e2e.js` so third-party widgets and font CDNs don't fail the suite for issues that are not the site's.

## What I would add next

- GitHub Actions CI to run the suite on every push to `main`.
- Visual regression snapshots for the hero on each viewport.
- A Lighthouse / accessibility audit step via `cypress-audit`.
