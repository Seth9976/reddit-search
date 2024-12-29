import React from 'react';
import { Search, Filter } from 'lucide-react';
import { SearchFilters, SearchType, SortType, SortDirection } from '../types';

interface SearchFormProps {
  filters: SearchFilters;
  onSearch: (filters: SearchFilters) => void;
}

export default function SearchForm({ filters, onSearch }: SearchFormProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [localQuery, setLocalQuery] = React.useState(filters.query);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!localQuery.trim()) return;
    onSearch({ 
      ...filters,
      query: localQuery,
      page: 1
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
  };

  const handleDateChange = (field: 'after' | 'before') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const timestamp = e.target.value ? new Date(e.target.value).getTime() : null;
    onSearch({ 
      ...filters, 
      [field]: timestamp,
      page: 1
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto space-y-4 p-4">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Reddit..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={localQuery}
              onChange={handleInputChange}
              minLength={1}
              required
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Search
        </button>

        <select
          className="px-4 py-2 rounded-lg border border-gray-300"
          value={filters.type}
          onChange={(e) => onSearch({ ...filters, type: e.target.value as SearchType, page: 1 })}
        >
          <option value="submission">Posts</option>
          <option value="comment">Comments</option>
        </select>

        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50"
        >
          <Filter className="h-5 w-5" />
          Filters
        </button>
      </div>

      {showAdvanced && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subreddit</label>
            <input
              type="text"
              placeholder="e.g., programming"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={filters.subreddit}
              onChange={(e) => onSearch({ ...filters, subreddit: e.target.value, page: 1 })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">After Date</label>
            <input
              type="date"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={filters.after ? new Date(filters.after).toISOString().split('T')[0] : ''}
              onChange={handleDateChange('after')}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Before Date</label>
            <input
              type="date"
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              value={filters.before ? new Date(filters.before).toISOString().split('T')[0] : ''}
              onChange={handleDateChange('before')}
            />
          </div>

          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Sort By</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={filters.sort_type}
                onChange={(e) => onSearch({ ...filters, sort_type: e.target.value as SortType, page: 1 })}
              >
                <option value="created_utc">Date</option>
                <option value="score">Score</option>
                <option value="num_comments">Comments</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Direction</label>
              <select
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
                value={filters.sort}
                onChange={(e) => onSearch({ ...filters, sort: e.target.value as SortDirection, page: 1 })}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}