export interface GoogleFlightsParams {
  origin: string;
  destination: string;
  departureDate?: string;
  returnDate?: string;
  cabin?: 'economy' | 'premium_economy' | 'business' | 'first';
}

export function buildGoogleFlightsUrl(params: GoogleFlightsParams): string {
  const { origin, destination, cabin = 'economy' } = params;

  const departDate = params.departureDate || (() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  })();

  const tripType = params.returnDate ? 'round trip' : 'one way';
  const query = params.returnDate
    ? `Flights from ${origin} to ${destination} on ${departDate} return ${params.returnDate} ${tripType} ${cabin}`
    : `Flights from ${origin} to ${destination} on ${departDate} ${tripType} ${cabin}`;

  const searchParams = new URLSearchParams({
    hl: 'en',
    gl: 'us',
    curr: 'USD',
    q: query,
  });

  return `https://www.google.com/travel/flights?${searchParams.toString()}`;
}
