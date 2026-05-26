# AI Governance Maturity Assessment Web App

Browser-based AI governance maturity assessment for Australian finance leaders.

## Run locally

1. Download the web app folder from the file repository.
2. Extract the zip and keep the folder contents together.
3. Open a terminal in this folder.
4. Run `node dev-server.mjs`.
5. Open `http://127.0.0.1:4173` in a browser.

On Windows, you can also double-click `Start Web Preview.cmd` to start the same local preview server.

## Deploy as a web application

Upload the complete folder contents to any static web host that can serve HTML, CSS, JavaScript, SVG, and JSON files. Examples include Azure Static Web Apps, Netlify, Vercel static hosting, GitHub Pages, an internal intranet web server, or a SharePoint-hosted static site configuration.

The app has no backend dependency and does not require an API key. Responses are stored only in the user's browser profile unless the user exports JSON, copies the board summary, or prints/saves the report.

## Web app capabilities

- Installable browser app manifest.
- Offline-friendly service worker when hosted over HTTP or HTTPS.
- Deterministic local scoring and recommendations.
- Conditional Australian regulatory questions by organisation type.
- Board summary, holistic report, framework-by-framework analysis, 90-day roadmap, JSON export, copy summary, and print/PDF support.

## Advisory notice

This tool is for educational and planning use only. It is not legal, regulatory, financial, accounting, or professional advice. Validate regulatory obligations with qualified advisers before taking compliance action.
