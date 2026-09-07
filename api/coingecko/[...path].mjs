export default async function handler(req, res)
 { const { path = [], ...query } = req.query; 
 const segments = Array.isArray(path) ? path.join('/') : path; const queryString = new URLSearchParams(query).toString(); 
 const url = `https://api.coingecko.com/api/v3/${segments}${queryString ? `?${queryString}` : ''}`;
 try { const response = await fetch(url); const data = await response.json();
 res.status(response.status).json(data);
 }
  catch (error) 
  { res.status(500).json({ error: 'Failed to fetch from CoinGecko', details: error.message });
 } }