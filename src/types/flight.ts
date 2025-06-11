export interface FlightPrice {
  origin: string;
  destination: string;
  departureDate: Date;
  price: number;
  currency: string;
  flightNumber?: string;
}

export interface FlightPriceResult {
  origin: string;
  destination: string;
  departureDate: string; // ISO date string
  price: number;
  currency: string;
  flightNumber?: string;
}

export interface FlightLeg {
  from: string;
  to: string;
  distance?: string;
  duration?: string;
}
