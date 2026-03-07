export type WeekStart = 'sunday' | 'monday';

/**
 * ISO 3166-1 alpha-2 country codes where the week starts on Sunday.
 * All other countries are treated as Monday-start (e.g. Europe, most of Asia).
 * Source: regional conventions (Americas, UK/IE/PT, Israel, Japan, Korea, etc.).
 */
const SUNDAY_FIRST_COUNTRIES = new Set([
  'US', 'CA', 'MX', 'BR', 'AR', 'CL', 'CO', 'PE', 'EC', 'BO', 'PY', 'UY', 'VE', 'CR', 'PA', 'DO', 'GT', 'HN', 'SV', 'NI', 'CU', 'PR', 'BS', 'BB', 'JM', 'GD', 'HT', 'BZ', 'GY', 'SR',
  'GB', 'IE', 'PT',
  'IL', 'EG', 'ZA', 'NG', 'KE', 'GH', 'TN', 'MA',
  'JP', 'KR', 'TW', 'IN', 'PK', 'PH', 'ID', 'SG', 'HK', 'SA', 'AE',
  'AU', 'NZ',
]);

export function getWeekStartForCountry(countryCode: string): WeekStart {
  return SUNDAY_FIRST_COUNTRIES.has(countryCode.toUpperCase()) ? 'sunday' : 'monday';
}
