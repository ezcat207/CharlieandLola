/**
 * CDN URL conversion utilities for Charlie and Lola AI
 * Converts R2 URLs to CDN format for better sharing and performance
 */

const R2_DOMAIN = 'pub-ea658a60b7dd4332a2c19d54d6d566c6.r2.dev';
const CDN_DOMAIN = 'cdn.charlielola.com';

/**
 * Convert R2 URL to CDN format
 * @param url - Original R2 URL
 * @returns CDN URL for sharing
 */
export function convertToCdnUrl(url: string): string {
  if (url.includes(R2_DOMAIN)) {
    return url.replace(`https://${R2_DOMAIN}`, `https://${CDN_DOMAIN}`);
  }
  return url;
}

/**
 * Convert CDN URL back to R2 format (if needed)
 * @param url - CDN URL
 * @returns Original R2 URL
 */
export function convertToR2Url(url: string): string {
  if (url.includes(CDN_DOMAIN)) {
    return url.replace(`https://${CDN_DOMAIN}`, `https://${R2_DOMAIN}`);
  }
  return url;
}

/**
 * Check if URL is from our R2 storage
 * @param url - URL to check
 * @returns true if URL is from our R2 storage
 */
export function isR2Url(url: string): boolean {
  return url.includes(R2_DOMAIN);
}

/**
 * Check if URL is from our CDN
 * @param url - URL to check
 * @returns true if URL is from our CDN
 */
export function isCdnUrl(url: string): boolean {
  return url.includes(CDN_DOMAIN);
}