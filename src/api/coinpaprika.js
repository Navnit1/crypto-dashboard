
import axios from 'axios';
 
const client = axios.create({
  baseURL: 'https://api.coinpaprika.com/v1',
  timeout: 15000,
});
 
// NOTE: CoinPaprika's free tier reliably supports USD only.
// vsCurrency is accepted for compatibility but only 'usd' is guaranteed to work.
 
// List of coins with market data, sorted by market cap desc.
export const getMarkets = (vsCurrency = 'usd', perPage = 50, page = 1) =>
  client.get('/tickers', { params: { limit: perPage } }).then((res) =>
    res.data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol.toLowerCase(),
      name: coin.name,
      image: `https://static.coinpaprika.com/coin/${coin.id}/logo.png`,
      current_price: coin.quotes?.USD?.price ?? 0,
      market_cap: coin.quotes?.USD?.market_cap ?? 0,
      market_cap_rank: coin.rank,
      price_change_percentage_24h: coin.quotes?.USD?.percent_change_24h ?? 0,
      total_volume: coin.quotes?.USD?.volume_24h ?? 0,
    }))
  );
 
// Historical market chart for a single coin (price series).
// Returns { prices: [[timestamp_ms, price], ...] } to match the old CoinGecko shape.
export const getMarketChart = (coinId, vsCurrency = 'usd', days = 7) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - Number(days));
 
  return client
    .get(`/tickers/${coinId}/historical`, {
      params: {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
        interval: days <= 1 ? '1h' : '1d',
      },
    })
    .then((res) => ({
      prices: res.data.map((point) => [new Date(point.timestamp).getTime(), point.price]),
    }));
};
 
// Simple price lookup, used for the exchange converter.
// Returns { [coinId]: { usd: price } } to match the old shape.
export const getSimplePrice = (ids = [], vsCurrencies = ['usd']) =>
  Promise.all(ids.map((id) => client.get(`/tickers/${id}`))).then((responses) => {
    const result = {};
    responses.forEach((res, i) => {
      result[ids[i]] = { usd: res.data.quotes?.USD?.price ?? 0 };
    });
    return result;
  });
 
// Search coins/currencies by free-text query.
export const searchCoins = (query) =>
  client.get('/search', { params: { q: query, c: 'currencies' } }).then((res) => ({
    coins: (res.data.currencies || []).map((c) => ({
      id: c.id,
      symbol: c.symbol,
      name: c.name,
    })),
  }));
 
// List of supported fiat currencies. CoinPaprika free tier is USD-only.
export const getSupportedVsCurrencies = () => Promise.resolve(['usd']);
 
export default client;
 
