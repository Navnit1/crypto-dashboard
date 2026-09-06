# Coinboard — Cryptocurrency Dashboard

A capstone project for the Full Stack Web Development track: a live cryptocurrency
dashboard built with **React**, **Redux + Redux-Thunk**, **Tailwind CSS**, **Chart.js**
and the **CoinGecko API**.

> Scaffolded with **Vite** instead of `create-react-app` (CRA is deprecated and no
> longer maintained). All required libraries and functionality from the brief —
> React, react-redux, redux-thunk, Tailwind, Chart.js, react-chartjs-2, CoinGecko —
> are used exactly as specified; only the build tool differs. `react-router-dom` is
> installed and ready if you extend the app to more routes/pages.

## Features

- **Base currency selector** — switch every price on the page between USD, INR, EUR, GBP, JPY, AUD, CAD.
- **Market cap sidebar** — top 50 coins pulled live from CoinGecko, sorted by market cap, auto-converted to the base currency.
- **Price chart** — 1D / 1W / 1M / 6M / 1Y ranges, line / vertical bar / horizontal bar chart types, and multi-coin comparison on the same graph.
- **Search** — debounced coin search with a results dropdown.
- **Exchange Coins converter** — convert between any two coins (or search/select from the full list), with strict numeric-only input validation and inline error messaging.
- **Portfolio pie chart** — demo holdings visualized as a donut chart.
- **Live ticker tape** — a scrolling strip of top coin prices (pauses on hover, disabled for users with reduced-motion preferences).

## Architecture

```
src/
  api/coingecko.js         Axios wrapper around the CoinGecko REST API
  store/
    actionTypes.js         Action type constants
    actions/                Thunks: coinsActions, chartActions, exchangeActions,
                             searchActions, currencyActions
    reducers/               One reducer per slice, combined in reducers/index.js
    index.js                createStore + redux-thunk middleware
  components/               Header, TickerTape, Sidebar, ChartPanel,
                             CoinMultiSelect, ChartTypeSelect, PortfolioPie,
                             ExchangeCoins
  utils/format.js           Currency / percent / compact-number formatters
  App.jsx                   Page layout
  main.jsx                  ReactDOM root + <Provider store={store}>
```

State is intentionally split into five slices (`currency`, `coins`, `chart`,
`exchange`, `search`) so each component subscribes to only what it needs.
All network calls go through thunks so components stay presentational.

## Getting started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # production build to dist/
npm run preview   # preview the production build locally
npm test          # run the Vitest + React Testing Library suite
```

No API key is required — CoinGecko's public endpoints are used directly.
If you hit CoinGecko's free-tier rate limit during development, wait a minute
and retry, or add your own API key to `src/api/coingecko.js`.

## Testing

Tests live next to the code they cover (`*.test.js`) and run with **Vitest** +
**React Testing Library**, the modern successor to CRA's bundled Jest + RTL setup:

- `src/utils/format.test.js` — currency/percent/compact-number formatting.
- `src/store/exchange.test.js` — the "numbers only" validation rule on the
  Exchange Coins amount field (rejects letters/symbols, clears on empty input).

Extend this suite with component-level tests (e.g. rendering `<ExchangeCoins />`
wrapped in a `<Provider>` with a mock store) as you add features.

## Deployment

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Cryptocurrency dashboard capstone project"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### 2. Deploy

Heroku's free static-site hosting has been discontinued, so use one of these
(both free, both take under two minutes):

**Vercel**
```bash
npm i -g vercel
vercel --prod
```

**Netlify**
```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

Either way, once deployed, submit the live URL together with your GitHub repo
link as required by the capstone guidelines.

## Design notes

The visual direction is a dark "trading terminal" aesthetic: near-black
navy background, a subtle background grid, `Space Grotesk` for headings,
`Inter` for body copy, and `JetBrains Mono` (tabular figures) for every price
and percentage so columns of numbers align — the way real market terminals
set numerals. The signature element is the scrolling ticker tape under the
header, built from live market data rather than a decorative placeholder.
