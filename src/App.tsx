import React, { useState } from 'react';
import { SearchFilters, RedditItem } from './types';
import { searchReddit, APIError } from './services/api';
import SearchForm from './components/SearchForm';
import ResultsList from './components/ResultsList';

function App() {
  const [filters, setFilters] = React.useState<SearchFilters>({
    query: '',
    type: 'submission',
    subreddit: '',
    after: null,
    before: null,
    sort_type: 'created_utc',
    sort: 'desc',
    size: 25,
    page: 1
  });

  const [results, setResults] = React.useState<RedditItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string>('');

  const handleSearch = async (newFilters: SearchFilters) => {
    try {
      setLoading(true);
      setError(null);
      
      if (JSON.stringify({ ...filters, page: 1 }) !== JSON.stringify({ ...newFilters, page: 1 })) {
        setResults([]);
        newFilters.page = 1;
      }

      const generatedUrl = `https://api.pullpush.io/reddit/submission/search?html_decode=True&q=${encodeURIComponent(newFilters.query)}&size=25`;
      setApiUrl(generatedUrl);

      const data = await searchReddit(newFilters);
      
      setResults(prev => 
        newFilters.page === 1 ? data.data : [...prev, ...data.data]
      );
      
      setFilters(newFilters);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && results.length > 0) {
      handleSearch({ ...filters, page: filters.page + 1 });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto py-6">
          <h1 className="text-3xl font-bold text-gray-900">Reddit Search</h1>
        </div>
      </header>

      <main className="container mx-auto py-6">
        <SearchForm filters={filters} onSearch={handleSearch} />
        
        {error && (
          <div className="max-w-4xl mx-auto p-4">
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="max-w-4xl mx-auto p-4">
            <div className="mb-4 text-gray-700">
              找到 {results.length} 条搜索结果
            </div>
            <div className="mb-4">
              <a 
                href={apiUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Generated API URL
              </a>
            </div>
          </div>
        )}

        <ResultsList
          results={results}
          loading={loading}
          onLoadMore={handleLoadMore}
          searchQuery={filters.query}
        />
      </main>
    </div>
  );
}

export default App;