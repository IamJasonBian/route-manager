import axios, { AxiosError } from 'axios';

export interface QueryResult<T> {
  rows: T[];
  rowCount: number;
}

// In development, use the same origin as the frontend since they're served together
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/.netlify/functions'
  : '/.netlify/functions';

/**
 * Executes a database query and returns the result
 * @param query The SQL query to execute
 * @param params Optional parameters for the query
 * @returns A promise that resolves to the query result rows
 * @throws {Error} If the query fails or returns an error
 */
export const executeQuery = async <T = any>(
  query: string,
  params: any[] = []
): Promise<QueryResult<T>> => {
  try {
    const response = await axios.post<QueryResult<T>>(
      `${API_BASE_URL}/db`,
      { query, params },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    
    if (!response.data) {
      throw new Error('No data returned from database');
    }
    
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Database query failed with status:', axiosError.response.status);
      console.error('Response data:', axiosError.response.data);
      throw new Error(`Database error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
    } else if (axiosError.request) {
      // The request was made but no response was received
      console.error('No response received from database service');
      throw new Error('No response received from database service');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up database request:', axiosError.message);
      throw new Error(`Database request error: ${axiosError.message}`);
    }
  }
};

/**
 * Returns a database client that can be used for transactions
 */
interface DatabaseClient {
  query: <T = any>(query: string, params?: any[]) => Promise<QueryResult<T>>;
  release: () => void;
}

export const getClient = (): DatabaseClient => {
  // In a serverless environment, we can't maintain a real connection pool,
  // so we'll return a client that makes HTTP requests for each query
  return {
    query: async <T = any>(query: string, params: any[] = []): Promise<QueryResult<T>> => {
      try {
        const response = await axios.post<QueryResult<T>>(
          `${API_BASE_URL}/db`,
          { query, params },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        if (!response.data) {
          throw new Error('No data returned from database');
        }
        
        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError;
        
        if (axiosError.response) {
          console.error('Database query failed with status:', axiosError.response.status);
          console.error('Response data:', axiosError.response.data);
          throw new Error(`Database error: ${axiosError.response.status} - ${JSON.stringify(axiosError.response.data)}`);
        } else if (axiosError.request) {
          console.error('No response received from database service');
          throw new Error('No response received from database service');
        } else {
          console.error('Error setting up database request:', axiosError.message);
          throw new Error(`Database request error: ${axiosError.message}`);
        }
      }
    },
    release: () => {
      // No-op in serverless environment
    }
  };
};
