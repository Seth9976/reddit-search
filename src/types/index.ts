export type SearchType = 'submission' | 'comment';

// Updated sort types to match API
export type SortType = 'created_utc' | 'score' | 'num_comments';
export type SortDirection = 'desc' | 'asc';

export interface SearchFilters {
  query: string;
  type: SearchType;
  subreddit: string;
  after: number | null;
  before: number | null;
  sort_type: SortType;
  sort: SortDirection;
  size: number;
  page: number;
}

export interface RedditItem {
  id: string;
  title: string;
  selftext?: string;
  body?: string;
  author: string;
  subreddit: string;
  created_utc: number;
  url: string;
  score: number;
  num_comments?: number;
  permalink: string;
  is_self?: boolean;
  thumbnail?: string;
}