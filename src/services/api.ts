import axios, { AxiosError } from 'axios';
import { SearchFilters } from '../types';

const API_BASE_URL = 'https://api.pullpush.io/reddit/search';

const MAX_SIZE = 100;

export class APIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'APIError';
  }
}

export const searchReddit = async (filters: SearchFilters) => {
  try {
    const endpoint = `${API_BASE_URL}/${filters.type}/`;
    
    // Ensure size doesn't exceed API limits
    const size = Math.min(filters.size, MAX_SIZE);
    
    const params = {
      q: filters.query.trim(),
      subreddit: filters.subreddit || undefined,
      after: filters.after ? Math.floor(filters.after / 1000) : undefined,
      before: filters.before ? Math.floor(filters.before / 1000) : undefined,
      sort_type: filters.sort_type,
      sort: filters.sort,
      size,
      page: filters.page,
    };

    const headers = {
      'Accept': 'application/json',
      'User-Agent': 'Reddit-Search-App/1.0.0',
    };

    const response = await axios.get(endpoint, { 
      params,
      headers,
      timeout: 10000 // 10 second timeout
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new APIError(
          error.response.data.message || 'API request failed',
          error.response.status
        );
      } else if (error.request) {
        throw new APIError('No response received from server');
      }
    }
    throw new APIError('An unexpected error occurred');
  }
};