export default async function handler(req, res) {
  try {
    const { path = [], ...query } = req.query;

    const segments = Array.isArray(path)
      ? path.join("/")
      : path;

    const queryString = new URLSearchParams(query).toString();

    const url = `https://api.coingecko.com/api/v3/${segments}${
      queryString ? `?${queryString}` : ""
    }`;

    console.log("CoinGecko URL:", url);

    const response = await fetch(url);

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("CoinGecko proxy error:", error);

    return res.status(500).json({
      error: "Failed to fetch from CoinGecko",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}