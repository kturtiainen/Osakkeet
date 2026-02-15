/**
 * Yahoo Finance API service
 * Uses yfapi.net to fetch stock quotes
 */

const API_HOST = import.meta.env.VITE_API_HOST || 'yfapi.net';
const API_BASE_URL = `https://${API_HOST}`;
const QUOTE_ENDPOINT = '/v6/finance/quote';
const DEFAULT_TIMEOUT_MS = 15000;
const MIN_TIMEOUT_MS = 1000;
const rawTimeout = import.meta.env.VITE_API_TIMEOUT_MS;
const parsedTimeout =
  rawTimeout !== undefined ? Number.parseInt(rawTimeout, 10) : DEFAULT_TIMEOUT_MS;
const TIMEOUT_MS =
  !Number.isNaN(parsedTimeout) && parsedTimeout > 0
    ? Math.max(MIN_TIMEOUT_MS, parsedTimeout)
    : DEFAULT_TIMEOUT_MS;

// Updated interface for new API format
interface YahooQuoteResponse {
  quoteResponse: {
    result: Array<{
      symbol: string;
      regularMarketPrice?: number;
    }>;
    error: null | string;
  };
}

/**
 * Fetch stock quotes from Yahoo Finance API
 * @param symbols - Array of stock symbols to fetch
 * @param apiKey - API key for yfapi.net
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

  const url = `${API_BASE_URL}${QUOTE_ENDPOINT}?region=US&symbols=${encodeURIComponent(ticker)}`;
  
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'x-api-key': apiKey
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

    // Updated validation for new API format
    if (!data.quoteResponse || !Array.isArray(data.quoteResponse.result)) {
      throw new Error('Virheellinen API-vastaus');
    }

    // Check for API errors
    if (data.quoteResponse.error) {
      throw new Error(`API-virhe: ${data.quoteResponse.error}`);
    }

    // Map symbols to prices - updated to use result instead of body
    const priceMap: Record<string, number> = {};
    for (const quote of data.quoteResponse.result) {
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
