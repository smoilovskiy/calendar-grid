/**
 * Gets ISO 3166-1 alpha-2 country code from browser locale.
 * e.g. "en-US" -> "US", "uk-UA" -> "UA". Falls back to "US" if no region.
 */
export function getCountryFromLocale(): string {
  if (typeof navigator === 'undefined') return 'US';
  const locale = navigator.language ?? navigator.languages?.[0] ?? 'en-US';
  const part = locale.split('-')[1];
  const region = part && part.length === 2 ? part.toUpperCase() : 'US';
  console.log('[locale] detected:', { locale, languages: navigator.languages, region });
  return region;
}
