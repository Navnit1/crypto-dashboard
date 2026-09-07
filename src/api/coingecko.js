import axios from 'axios';

const client = axios.create({
 baseURL: 'https://api.allorigins.win/raw?url=https://api.coingecko.com/api/v3',
  timeout: 15000,
});

// List of coins with market data, sorted by market cap desc.
export const getMarkets = (vsCurrency = 'usd', perPage = 50, page = 1) =>
  client
    .get('/coins/markets', {
      params: {
        vs_currency: vsCurrency,
        order: 'market_cap_desc',
        per_page: perPage,
        page,
        price_change_percentage: '24h',
        sparkline: false,
      },
    })
    .then((res) => res.data);

// Historical market chart for a single coin (price series).
export const getMarketChart = (coinId, vsCurrency = 'usd', days = 7) =>
  client
    .get(`/coins/${coinId}/market_chart`, {
      params: { vs_currency: vsCurrency, days },
    })
    .then((res) => res.data);

// Simple price lookup, used for the exchange converter.
export const getSimplePrice = (ids = [], vsCurrencies = ['usd']) =>
  client
    .get('/simple/price', {
      params: {
        ids: ids.join(','),
        vs_currencies: vsCurrencies.join(','),
      },
    })
    .then((res) => res.data);

// Search coins/currencies by free-text query.
export const searchCoins = (query) =>
  client.get('/search', { params: { query } }).then((res) => res.data);

// List of supported fiat + crypto vs-currencies for the base-currency dropdown.
export const getSupportedVsCurrencies = () =>
  client.get('/simple/supported_vs_currencies').then((res) => res.data);

export default client;
