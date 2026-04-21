/**
 * Shared Amadeus batched date pricing — used by flight-prices and popular-routes.
 * @param {import('amadeus').default} amadeus
 * @param {string} origin
 * @param {string} destination
 * @param {string[]} dates
 */
export async function getFlightPricesForDates(amadeus, origin, destination, dates) {
  const pricePromises = dates.map(async (date) => {
    try {
      const response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: date,
        adults: '1',
        max: '1',
        currencyCode: 'USD',
      });

      if (response.data && response.data.length > 0) {
        const flight = response.data[0];
        const price = parseFloat(flight.price.total);
        const firstSegment = flight.itineraries[0].segments[0];
        const lastSegment =
          flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1];

        return {
          date,
          price,
          flightDetails: {
            carrier: firstSegment.carrierCode,
            flightNumber: `${firstSegment.carrierCode}${firstSegment.number}`,
            departureTime: firstSegment.departure.at,
            arrivalTime: lastSegment.arrival.at,
            duration: flight.itineraries[0].duration,
            stops: flight.itineraries[0].segments.length - 1,
            bookingClass:
              flight.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'ECONOMY',
          },
        };
      }

      return { date, price: null };
    } catch (error) {
      console.error(`Error fetching price for ${date}:`, error);
      return { date, price: null };
    }
  });

  const prices = await Promise.all(pricePromises);
  return prices.filter((p) => p.price !== null);
}
