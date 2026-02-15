/**
 * Yahoo Finance API service
 * Uses yfapi.net to fetch stock quotes
 */

const API_HOST = import.meta.env.VITE_API_HOST || 'yfapi.net';
const API_BASE_URL = `https://${API_HOST}`;
const QUOTE_ENDPOINT = '/v6/finance/quote';
const DEFAULT_TIMEOUT_MS = 15000;
const MIN_TIMEOUT_MS = 1000;
const BATCH_SIZE = 10; // Yahoo Finance API limit
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
      regularMarketChange?: number;          // Daily change in currency
      regularMarketChangePercent?: number;   // Daily change as percentage
      currency?: string;                     // Currency (USD, EUR, SEK, etc.)
      displayName?: string;
      shortName?: string;
      longName?: string;
    }>;
    error: null | string;
  };
}

/**
 * Helper function to fetch a single batch of quotes
 * @param symbols - Array of stock symbols to fetch (max 10)
 * @param apiKey - API key for yfapi.net
 * @returns Object with prices, names, changes, changePercents, and currencies records
 * @throws Error if API request fails
 */
async function fetchBatch(
  symbols: string[],
  apiKey: string
): Promise<{ 
  prices: Record<string, number>; 
  names: Record<string, string>;
  changes: Record<string, number>;
  changePercents: Record<string, number>;
  currencies: Record<string, string>;
}> {
  const ticker = symbols.join(',');
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
      throw new Error(`API-virhe: ${String(response.status)}`);
    }

    const data: YahooQuoteResponse = await response.json();

    if (!data.quoteResponse || !Array.isArray(data.quoteResponse.result)) {
      throw new Error('Virheellinen API-vastaus');
    }

    if (data.quoteResponse.error) {
      throw new Error(`API-virhe: ${data.quoteResponse.error}`);
    }

    // Map symbols to prices and names
    const priceMap: Record<string, number> = {};
    const nameMap: Record<string, string> = {};
    const changeMap: Record<string, number> = {};
    const changePercentMap: Record<string, number> = {};
    const currencyMap: Record<string, string> = {};
    
    for (const quote of data.quoteResponse.result) {
      if (quote.symbol && typeof quote.regularMarketPrice === 'number') {
        priceMap[quote.symbol] = quote.regularMarketPrice;
        
        // Store daily change data
        if (typeof quote.regularMarketChange === 'number') {
          changeMap[quote.symbol] = quote.regularMarketChange;
        }
        if (typeof quote.regularMarketChangePercent === 'number') {
          changePercentMap[quote.symbol] = quote.regularMarketChangePercent;
        }
        if (quote.currency) {
          currencyMap[quote.symbol] = quote.currency;
        }
      }
      
      // Try multiple name fields with priority order
      if (quote.symbol) {
        const name = quote.displayName || quote.shortName || quote.longName;
        if (name) {
          nameMap[quote.symbol] = name;
        }
      }
    }

    return { 
      prices: priceMap, 
      names: nameMap,
      changes: changeMap,
      changePercents: changePercentMap,
      currencies: currencyMap
    };
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

/**
 * Fetch stock quotes from Yahoo Finance API
 * Automatically splits large requests into batches of 10 symbols
 * @param symbols - Array of stock symbols to fetch
 * @param apiKey - API key for yfapi.net
 * @returns Object with prices, names, changes, changePercents, and currencies records
 * @throws Error if all batch requests fail
 */
export async function fetchQuotes(
  symbols: string[],
  apiKey: string
): Promise<{ 
  prices: Record<string, number>; 
  names: Record<string, string>;
  changes: Record<string, number>;
  changePercents: Record<string, number>;
  currencies: Record<string, string>;
}> {
  if (!apiKey || apiKey.trim().length === 0) {
    throw new Error('API-avain puuttuu');
  }

  if (symbols.length === 0) {
    return { 
      prices: {}, 
      names: {},
      changes: {},
      changePercents: {},
      currencies: {}
    };
  }

  // Deduplicate symbols
  const uniqueSymbols = Array.from(new Set(symbols));
  
  // Split into batches of 10
  const batches: string[][] = [];
  for (let i = 0; i < uniqueSymbols.length; i += BATCH_SIZE) {
    batches.push(uniqueSymbols.slice(i, i + BATCH_SIZE));
  }
  
  // Fetch all batches in parallel
  const batchPromises = batches.map(batch => fetchBatch(batch, apiKey));
  const batchResults = await Promise.allSettled(batchPromises);
  
  // Combine results from all successful batches
  const priceMap: Record<string, number> = {};
  const nameMap: Record<string, string> = {};
  const changeMap: Record<string, number> = {};
  const changePercentMap: Record<string, number> = {};
  const currencyMap: Record<string, string> = {};
  const errors: string[] = [];
  
  for (let i = 0; i < batchResults.length; i++) {
    const result = batchResults[i];
    if (result.status === 'fulfilled') {
      Object.assign(priceMap, result.value.prices);
      Object.assign(nameMap, result.value.names);
      Object.assign(changeMap, result.value.changes);
      Object.assign(changePercentMap, result.value.changePercents);
      Object.assign(currencyMap, result.value.currencies);
    } else {
      const errorMessage = result.reason instanceof Error ? result.reason.message : String(result.reason);
      errors.push(`Erä ${String(i + 1)}/${String(batches.length)} epäonnistui: ${errorMessage}`);
    }
  }
  
  // If all batches failed, throw error
  if (Object.keys(priceMap).length === 0 && errors.length > 0) {
    throw new Error(errors.join('; '));
  }
  
  // If some batches failed, log warning but return partial results
  if (errors.length > 0) {
    console.warn('Osittainen virhe hintojen haussa:', errors);
  }
  
  return { 
    prices: priceMap, 
    names: nameMap,
    changes: changeMap,
    changePercents: changePercentMap,
    currencies: currencyMap
  };
}
