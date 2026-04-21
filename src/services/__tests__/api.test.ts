jest.mock('../../config/runtime', () => ({
  getApiMode: () => 'netlify' as const,
  getApiBaseUrl: () => '/.netlify/functions',
  getApiTimeoutMs: () => 20000,
  mockRoutesFromEnv: () => false,
}));

const mockGet = jest.fn();
jest.mock('axios', () => ({
  __esModule: true,
  default: {
    create: () => ({
      get: mockGet,
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
    }),
  },
}));

import * as api from '../api';
const { getFlightPrices, getRoutes, generateMockPrices, generateMockRoutes } = api;

jest.mock('../routeService', () => ({
  hasRoutes: jest.fn().mockResolvedValue(true),
  saveApiRoutes: jest.fn().mockResolvedValue(undefined),
  getRoutes: jest.fn().mockResolvedValue([
    {
      id: 1,
      origin: 'JFK',
      destination: 'LAX',
      price: 299,
      departure_date: new Date('2025-06-01'),
      return_date: null,
      airline: 'AA',
      flight_number: 'AA100',
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]),
}));

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFlightPrices', () => {
    it('should fetch flight prices via Netlify function (GET)', async () => {
      mockGet.mockResolvedValueOnce({
        data: {
          prices: [
            { date: '2025-05-18', price: 300 },
            { date: '2025-05-19', price: 350 },
          ],
          source: 'amadeus',
        },
      });

      const result = await getFlightPrices('JFK', 'LHR', '2025-05-18');

      expect(mockGet).toHaveBeenCalledWith(
        '/flight-prices?from=JFK&to=LHR',
        expect.objectContaining({ signal: undefined })
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('price', 300);
      expect(result[0].date).toBeInstanceOf(Date);
    });

    it('should return mock prices when API call fails', async () => {
      mockGet.mockRejectedValueOnce(new Error('API Error'));

      const result = await getFlightPrices('JFK', 'LHR', '2025-05-18');

      expect(result.length).toBe(7);
      expect(result[0]).toHaveProperty('price');
      expect(result[0]).toHaveProperty('date');
    });
  });

  describe('getRoutes', () => {
    it('should return routes from Postgres via routeService', async () => {
      const result = await getRoutes();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('from');
      expect(result[0]).toHaveProperty('to');
      expect(result[0]).toHaveProperty('prices');
    });
  });

  describe('Mock Data Generation', () => {
    it('should generate realistic mock prices', () => {
      const mockPrices = generateMockPrices();
      expect(mockPrices.length).toBeGreaterThan(0);
      expect(mockPrices[0]).toHaveProperty('price');
      expect(mockPrices[0]).toHaveProperty('date');
      const prices = mockPrices.map((p: { price: number }) => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      expect(maxPrice - minPrice).toBeGreaterThan(50);
    });

    it('should generate mock routes with prices', () => {
      const mockRoutes = generateMockRoutes();
      expect(mockRoutes.length).toBeGreaterThan(0);
      expect(mockRoutes[0]).toHaveProperty('id');
      expect(mockRoutes[0]).toHaveProperty('from');
      expect(mockRoutes[0]).toHaveProperty('to');
      expect(mockRoutes[0]).toHaveProperty('prices');
      expect(mockRoutes[0].prices.length).toBeGreaterThan(0);
    });
  });
});
