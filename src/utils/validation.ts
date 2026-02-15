/**
 * Stock symbol validation regex
 * Allows uppercase letters, numbers, dots, colons, underscores, and hyphens
 * Max length: 20 characters
 */
const SYMBOL_REGEX = /^[A-Z0-9.:_-]+$/;
const MAX_SYMBOL_LENGTH = 20;

/**
 * Validate a stock symbol
 * @param symbol - Stock symbol to validate
 * @returns True if valid, false otherwise
 */
export function validateSymbol(symbol: string): boolean {
  if (!symbol || symbol.length === 0 || symbol.length > MAX_SYMBOL_LENGTH) {
    return false;
  }
  
  return SYMBOL_REGEX.test(symbol);
}

/**
 * Validate number of shares
 * @param shares - Number of shares
 * @returns True if valid (finite number > 0), false otherwise
 */
export function validateShares(shares: number): boolean {
  // Use Number.isFinite() to reject NaN, Infinity, and -Infinity
  // Also add reasonable upper bound to prevent absurd values
  return Number.isFinite(shares) && shares > 0 && shares <= 1e15;
}

/**
 * Validate stock price
 * @param price - Stock price
 * @returns True if valid (finite number > 0), false otherwise
 */
export function validatePrice(price: number): boolean {
  // Use Number.isFinite() to reject NaN, Infinity, and -Infinity
  // Also add reasonable upper bound (1 quadrillion EUR per share)
  return Number.isFinite(price) && price > 0 && price <= 1e15;
}

/**
 * Sanitize symbol input (convert to uppercase, trim)
 * @param symbol - Raw symbol input
 * @returns Sanitized symbol
 */
export function sanitizeSymbol(symbol: string): string {
  return symbol.trim().toUpperCase();
}

/**
 * Validate all stock fields
 * @param symbol - Stock symbol
 * @param shares - Number of shares
 * @param purchasePrice - Purchase price
 * @returns Object with validation results and error message
 */
export function validateStock(
  symbol: string,
  shares: number,
  purchasePrice: number
): { valid: boolean; error?: string } {
  const sanitizedSymbol = sanitizeSymbol(symbol);
  
  if (!validateSymbol(sanitizedSymbol)) {
    return {
      valid: false,
      error: 'Virheellinen symboli. Käytä A-Z, 0-9, .:_- (max 20 merkkiä)'
    };
  }
  
  if (!validateShares(shares)) {
    return {
      valid: false,
      error: 'Osakkeiden määrän on oltava kelvollinen luku välillä 0-1000000000000000'
    };
  }
  
  if (!validatePrice(purchasePrice)) {
    return {
      valid: false,
      error: 'Hankintahinnan on oltava kelvollinen luku välillä 0-1000000000000000'
    };
  }
  
  return { valid: true };
}

/**
 * Type guard to check if stock object has valid required fields
 * @param stock - Stock object to validate
 * @returns True if stock has all required valid fields
 */
export function isValidStock(stock: { symbol?: string; shares?: number; purchasePrice?: number }): boolean {
  return (
    typeof stock.symbol === 'string' &&
    stock.symbol.length > 0 &&
    typeof stock.shares === 'number' &&
    !Number.isNaN(stock.shares) &&
    stock.shares > 0 &&
    typeof stock.purchasePrice === 'number' &&
    !Number.isNaN(stock.purchasePrice) &&
    stock.purchasePrice > 0
  );
}
