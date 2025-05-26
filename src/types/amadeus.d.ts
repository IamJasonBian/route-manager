declare module 'amadeus' {
  interface AmadeusOptions {
    clientId?: string;
    clientSecret?: string;
    hostname?: 'test' | 'production' | string;
    customLogger?: any;
    logLevel?: 'silent' | 'warn' | 'debug';
  }

  interface FlightOfferSearchParams {
    originLocationCode: string;
    destinationLocationCode: string;
    departureDate: string;
    returnDate?: string;
    adults?: number;
    children?: number;
    infants?: number;
    travelClass?: string;
    includedAirlineCodes?: string;
    excludedAirlineCodes?: string;
    nonStop?: boolean;
    currencyCode?: string;
    maxPrice?: number;
    max?: number;
  }

  interface FlightOffer {
    type: string;
    id: string;
    source: string;
    instantTicketingRequired: boolean;
    nonHomogeneous: boolean;
    oneWay: boolean;
    lastTicketingDate: string;
    numberOfBookableSeats: number;
    itineraries: Array<{
      duration: string;
      segments: Array<{
        departure: {
          iataCode: string;
          at: string;
          terminal?: string;
        };
        arrival: {
          iataCode: string;
          at: string;
          terminal?: string;
        };
        carrierCode: string;
        number: string;
        aircraft: {
          code: string;
        };
        operating?: {
          carrierCode: string;
        };
        duration: string;
        id: string;
        numberOfStops: number;
        blacklistedInEU: boolean;
      }>;
    }>;
    price: {
      currency: string;
      total: string;
      base: string;
      fees: Array<{
        amount: string;
        type: string;
      }>;
      grandTotal: string;
    };
    pricingOptions: {
      fareType: string[];
      includedCheckedBagsOnly: boolean;
    };
    validatingAirlineCodes: string[];
    travelerPricings: Array<{
      travelerId: string;
      fareOption: string;
      travelerType: string;
      price: {
        currency: string;
        total: string;
        base: string;
      };
      fareDetailsBySegment: any[]; // You can expand this based on your needs
    }>;
  }

  interface Meta {
    count: number;
    links: {
      self: string;
    };
  }

  interface FlightOffersSearchResponse {
    data: FlightOffer[];
    meta: Meta;
    result: {
      meta: Meta;
      data: FlightOffer[];
    };
  }

  class Amadeus {
    constructor(options: AmadeusOptions);
    
    shopping: {
      flightOffersSearch: {
        get(params: FlightOfferSearchParams): Promise<FlightOffersSearchResponse>;
      };
      flightOffers: {
        get(params: any): Promise<any>;
        prediction: {
          post(body: any): Promise<any>;
        };
      };
    };
    
    travel: {
      analytics: {
        airTraffic: {
          booked: {
            get(params: {
              originCityCode: string;
              period: string;
            }): Promise<{
              data: Array<{
                destination: string;
                analytics: {
                  travelers: {
                    score: number;
                    value: number;
                  };
                  flights: {
                    score: number;
                    price: {
                      score: number;
                      average: number;
                    };
                  };
                };
              }>;
            }>;
          };
        };
      };
    };
  }

  export = Amadeus;
}
