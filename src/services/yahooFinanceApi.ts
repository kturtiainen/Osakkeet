/**
 * Yahoo Finance API service
 * Uses RapidAPI to fetch stock quotes
 */

const API_HOST = import.meta.env.VITE_API_HOST || 'yahoo-finance15.p.rapidapi.com';
const API_BASE_URL = `https://${API_HOST}`;
const QUOTE_ENDPOINT = '/api/v1/markets/stock/quotes';
const TIMEOUT_MS = parseInt(import.meta.env.VITE_API_TIMEOUT_MS || '15000', 10);

interface YahooQuoteResponse {
  body: Array<{
    symbol: string;
    regularMarketPrice?: number;
  }>;
}

/**
 * Fetch stock quotes from Yahoo Finance API
 * @param symbols - Array of stock symbols to fetch
 * @param apiKey - RapidAPI key
 * @returns Record mapping symbol to current price
 * @throws Error if API request fails
 */
export async function fetchQuotes(
  symbols: string[],
  apiKey: string
): Promise<Record<string, number>> {
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('API-avain puuttuu');
  }

  if (symbols.length === 0) {
    return {};
  }

  // Deduplicate symbols
  const uniqueSymbols = Array.from(new Set(symbols));
  const ticker = uniqueSymbols.join(',');

  const url = `${API_BASE_URL}${QUOTE_ENDPOINT}?ticker=${encodeURIComponent(ticker)}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': API_HOST,
      },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Virheellinen API-avain');
      } else if (response.status === 429) {
        throw new Error('API-kuukausikiintiö ylitetty');
      }
      throw new Error(`API-virhe: ${response.status}`);
    }

    const data: YahooQuoteResponse = await response.json();

    if (!data.body || !Array.isArray(data.body)) {
      throw new Error('Virheellinen API-vastaus');
    }

    // Map symbols to prices
    const priceMap: Record<string, number> = {};
    for (const quote of data.body) {
      if (quote.symbol && typeof quote.regularMarketPrice === 'number') {
        priceMap[quote.symbol] = quote.regularMarketPrice;
      }
    }

    return priceMap;
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TimeoutError' || error.name === 'AbortError') {
        throw new Error('Aikakatkaisu: API ei vastannut ajoissa');
      }
      throw error;
    }
    throw new Error('Tuntematon virhe haettaessa hintoja');
  }
}
