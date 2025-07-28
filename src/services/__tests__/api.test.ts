import axios from 'axios';
import * as api from '../api';
const { getFlightPrices, getRoutes, generateMockPrices, generateMockRoutes } = api;

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getFlightPrices', () => {
    it('should fetch flight prices from Duffel API', async () => {
      // Mock successful API response
      const mockResponse = {
        data: {
          data: {
            offers: [
              { amount: 300, created_at: '2025-05-18' },
              { amount: 350, created_at: '2025-05-19' },
            ]
          }
        }
      };
      
      mockedAxios.post.mockResolvedValueOnce(mockResponse);
      
      const result = await getFlightPrices('JFK', 'LHR', '2025-05-18');
      
      // Check that API was called with correct parameters
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/offer_requests',
        expect.objectContaining({
          data: expect.objectContaining({
            slices: expect.arrayContaining([
              expect.objectContaining({
                origin: 'JFK',
                destination: 'LHR'
              })
            ])
          })
        })
      );
      
      // Check that result is formatted correctly
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('price', 300);
      expect(result[0]).toHaveProperty('date');
    });
    
    it('should return mock prices when API call fails', async () => {
      // Mock failed API response
      mockedAxios.post.mockRejectedValueOnce(new Error('API Error'));
      
      const result = await getFlightPrices('JFK', 'LHR', '2025-05-18');
      
      // Check that mock data was returned
      expect(result).toHaveLength(expect.any(Number));
      expect(result[0]).toHaveProperty('price');
      expect(result[0]).toHaveProperty('date');
    });
  });
  
  describe('getRoutes', () => {
    it('should fetch popular routes with prices', async () => {
      // Mock successful API response for each route
      const mockPrices = [
        { price: 300, date: '2025-05-18' },
        { price: 350, date: '2025-05-19' },
      ];
      
      // Spy on getFlightPrices to return mock prices
      jest.spyOn(api, 'getFlightPrices').mockResolvedValue(mockPrices as any);
      
      const result = await getRoutes();
      
      // Check that routes are returned with prices
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('from');
      expect(result[0]).toHaveProperty('to');
      expect(result[0]).toHaveProperty('prices', mockPrices);
    });
    
    it('should return mock routes when API call fails', async () => {
      // Mock failed API response
      jest.spyOn(api, 'getFlightPrices').mockRejectedValue(new Error('API Error'));
      
      const result = await getRoutes();
      
      // Check that mock routes were returned
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('from');
      expect(result[0]).toHaveProperty('to');
      expect(result[0]).toHaveProperty('prices');
    });
  });
  
  describe('Mock Data Generation', () => {
    it('should generate realistic mock prices', () => {
      const mockPrices = generateMockPrices();
      
      // Check that mock prices are generated with correct properties
      expect(mockPrices.length).toBeGreaterThan(0);
      expect(mockPrices[0]).toHaveProperty('price');
      expect(mockPrices[0]).toHaveProperty('date');
      
      // Check that prices follow expected patterns
      const prices = mockPrices.map((p: { price: number }) => p.price);
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      
      // Ensure there's some variation in prices
      expect(maxPrice - minPrice).toBeGreaterThan(50);
    });
    
    it('should generate mock routes with prices', () => {
      const mockRoutes = generateMockRoutes();
      
      // Check that mock routes are generated with correct properties
      expect(mockRoutes.length).toBeGreaterThan(0);
      expect(mockRoutes[0]).toHaveProperty('id');
      expect(mockRoutes[0]).toHaveProperty('from');
      expect(mockRoutes[0]).toHaveProperty('to');
      expect(mockRoutes[0]).toHaveProperty('prices');
      expect(mockRoutes[0].prices.length).toBeGreaterThan(0);
    });
  });
});
