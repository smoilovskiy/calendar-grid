const API_BASE = '/api';

export type CountryOption = {
  countryCode: string;
  name: string;
};

export async function fetchCountries(): Promise<CountryOption[]> {
  const res = await fetch(`${API_BASE}/countries`);
  if (!res.ok) throw new Error('Failed to fetch countries');
  return res.json();
}
