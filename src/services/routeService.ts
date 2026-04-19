import axios from 'axios';
import { ApiRoute as ApiRouteType } from './api';

const API_URL = '/.netlify/functions/routes';

export interface DbRoute {
  id: number;
  origin: string;
  destination: string;
  price: number | null;
  departure_date: Date | null;
  return_date: Date | null;
  airline: string | null;
  flight_number: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ApiRoute {
  id: number;
  from: string;
  to: string;
  basePrice: number;
  prices: Array<{ date: Date; price: number }>;
  distance: string;
  duration: string;
  meta: {
    fromCode: string;
    toCode: string;
    source: string;
    lowestPrice?: number;
    highestPrice?: number;
    _error?: string;
  };
}

function parseDbRow(row: any): DbRoute {
  return {
    id: row.id,
    origin: row.origin,
    destination: row.destination,
    price: row.price,
    departure_date: row.departureDate ? new Date(row.departureDate) : (row.departure_date ? new Date(row.departure_date) : null),
    return_date: row.returnDate ? new Date(row.returnDate) : (row.return_date ? new Date(row.return_date) : null),
    airline: row.airline,
    flight_number: row.flightNumber || row.flight_number,
    created_at: new Date(row.createdAt || row.created_at),
    updated_at: new Date(row.updatedAt || row.updated_at),
  };
}

export const saveRoute = async (
  route: Omit<DbRoute, 'id' | 'created_at' | 'updated_at'>
): Promise<DbRoute> => {
  const response = await axios.post(API_URL, {
    origin: route.origin,
    destination: route.destination,
    price: route.price,
    departure_date: route.departure_date?.toISOString?.() ?? route.departure_date,
    return_date: route.return_date?.toISOString?.() ?? route.return_date,
    airline: route.airline,
    flight_number: route.flight_number,
  });

  if (!response.data.rows || response.data.rows.length === 0) {
    throw new Error('Failed to save route: No data returned');
  }
  return parseDbRow(response.data.rows[0]);
};

export const getRoutes = async (origin?: string, destination?: string): Promise<DbRoute[]> => {
  const params = new URLSearchParams();
  if (origin) params.set('origin', origin);
  if (destination) params.set('destination', destination);

  const url = params.toString() ? `${API_URL}?${params}` : API_URL;
  const response = await axios.get(url);

  return (response.data.rows || []).map(parseDbRow);
};

export const getRouteById = async (id: number): Promise<DbRoute | undefined> => {
  const response = await axios.get(`${API_URL}?id=${id}`);
  const rows = response.data.rows || [];
  return rows.length > 0 ? parseDbRow(rows[0]) : undefined;
};

export const deleteRoute = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}?id=${id}`);
};

export const saveRoutes = async (routes: Omit<DbRoute, 'id' | 'created_at' | 'updated_at'>[]): Promise<DbRoute[]> => {
  const response = await axios.post(API_URL, {
    action: 'bulk',
    routes: routes.map((r) => ({
      origin: r.origin,
      destination: r.destination,
      price: r.price,
      departure_date: r.departure_date?.toISOString?.() ?? r.departure_date,
      return_date: r.return_date?.toISOString?.() ?? r.return_date,
      airline: r.airline,
      flight_number: r.flight_number,
    })),
  });

  return (response.data.rows || []).map(parseDbRow);
};

const apiRouteToDbRoute = (apiRoute: Omit<ApiRouteType, 'id'>): Omit<DbRoute, 'id' | 'created_at' | 'updated_at'> => {
  const basePrice = apiRoute.prices.length > 0 ? Math.min(...apiRoute.prices.map(p => p.price)) : 0;
  return {
    origin: apiRoute.from,
    destination: apiRoute.to,
    price: basePrice,
    departure_date: apiRoute.prices.length > 0 ? new Date(apiRoute.prices[0].date) : null,
    return_date: null,
    airline: 'Multiple',
    flight_number: null,
  };
};

export const saveApiRoutes = async (apiRoutes: Omit<ApiRouteType, 'id'>[]): Promise<DbRoute[]> => {
  const dbRoutes = apiRoutes.map(apiRouteToDbRoute);
  return saveRoutes(dbRoutes);
};

export const hasRoutes = async (): Promise<boolean> => {
  const response = await axios.get(`${API_URL}?action=exists`);
  return response.data.exists;
};
