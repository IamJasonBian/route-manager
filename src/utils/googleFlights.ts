/**
 * Generates a Google Flights URL for a given route and date.
 *
 * @param origin - Origin airport IATA code (e.g., 'JFK')
 * @param destination - Destination airport IATA code (e.g., 'LAX')
 * @param departureDate - Departure date (Date object or ISO string)
 * @param returnDate - Optional return date for round trip
 * @returns Google Flights URL
 */
export function generateGoogleFlightsUrl(
  origin: string,
  destination: string,
  departureDate: Date | string,
  returnDate?: Date | string
): string {
  const baseUrl = 'https://www.google.com/travel/flights';

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toISOString().split('T')[0];
  };

  const depDate = formatDate(departureDate);

  // For round-trip flights
  if (returnDate) {
    const retDate = formatDate(returnDate);
    // Round trip URL format
    return `${baseUrl}?q=flights+from+${origin}+to+${destination}+on+${depDate}+return+${retDate}`;
  }

  // One-way URL format
  return `${baseUrl}?q=flights+from+${origin}+to+${destination}+on+${depDate}+one+way`;
}

/**
 * Generates a Google Flights explore URL for flexible date searching.
 *
 * @param origin - Origin airport IATA code
 * @param destination - Destination airport IATA code
 * @returns Google Flights explore URL
 */
export function generateGoogleFlightsExploreUrl(
  origin: string,
  destination: string
): string {
  return `https://www.google.com/travel/flights?q=flights+from+${origin}+to+${destination}`;
}
