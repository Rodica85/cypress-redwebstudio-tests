# redwebstudio.com — Cypress regression suite

End-to-end tests for [www.redwebstudio.com](https://www.redwebstudio.com), the single-page studio site for my freelance web-development practice (UK). The suite is my own safety-net while I iterate on copy, design and the lead-capture form.

## What it covers

- **Smoke** (`smoke.cy.js`) — homepage responds 200, title carries the brand + value proposition, the typewriter h1 hero is visible, all eight in-page anchor sections (`#services`, `#ai-chatbot`, `#about`, `#industries`, `#work`, `#audit`, `#faq`, `#contact`) exist in the DOM, and the canonical URL points to the production domain.
- **Navigation** (`navigation.cy.js`) — the desktop navbar exposes the six main anchor links and clicking each one scrolls the matching section into view.
- **Mobile menu** (`mobile-menu.cy.js`) — the hamburger is visible on a mobile viewport and hidden on desktop; clicking it reveals the nav links.
- **Work portfolio** (`work-portfolio.cy.js`) — the `#work` section links to all three client sites (doctorstanlarisa.ro, redspeedrider.co.uk, gungchaba.online), each opening in a new tab with `rel="noopener"`.
- **Contact channels** (`booking-links.cy.js`) — phone (`tel:+447424714686`), WhatsApp (`wa.me/447424714686`), email (`contact@redwebstudio.com`) and Facebook profile link are present and correct; every external link carries `rel="noopener"`.
- **Audit form** (`audit-form.cy.js`) — the Free Website Audit form submits to Formspree via POST, uses a hidden `_gotcha` honeypot to deter bots, sets a meaningful subject, marks `website` / `name` / `email` as required with the right HTML5 types (`url`, `text`, `email`), and leaves `business_type` optional.
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

- **No real form submissions** — the audit form is tested for structure and validation only; tests never POST to Formspree, so no real leads land in the inbox.
- **Selectors** — prefer semantic IDs (`#auditForm`, `#hamburger`, `#navbar`, section IDs) over utility classes, which churn between design iterations.
- **External-script noise suppressed** in `cypress/support/e2e.js` so third-party widgets and font CDNs don't fail the suite for issues that are not the site's.

## What I would add next

- GitHub Actions CI to run the suite on every push to `main`.
- Visual regression snapshots for the hero on each viewport.
- A Lighthouse / accessibility audit step via `cypress-audit`.
- A real submit-path test against a Formspree test endpoint, gated behind an env flag so it never runs on every push.
