import React from 'react';
import { useInView } from 'react-intersection-observer';
import Papa from 'papaparse';
import { Download } from 'lucide-react';
import { RedditItem } from '../types';
import ResultCard from './ResultCard';

interface ResultsListProps {
  results: RedditItem[];
  loading: boolean;
  onLoadMore: () => void;
  searchQuery: string;
}

export default function ResultsList({ results, loading, onLoadMore, searchQuery }: ResultsListProps) {
  const { ref, inView } = useInView();

  React.useEffect(() => {
    if (inView && !loading) {
      onLoadMore();
    }
  }, [inView, loading]);

  const exportToCsv = () => {
    const data = results.map(item => ({
      title: item.title,
      content: item.selftext || item.body || '',
      author: item.author,
      subreddit: item.subreddit,
      created_at: new Date(item.created_utc * 1000).toISOString(),
      url: item.url
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'reddit_search_results.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {results.length > 0 && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={exportToCsv}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Download className="h-5 w-5" />
            Export to CSV
          </button>
        </div>
      )}

      <div className="space-y-4">
        {results.map((item) => (
          <ResultCard key={item.id} item={item} searchQuery={searchQuery} />
        ))}
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
        </div>
      )}

      <div ref={ref} className="h-4" />
    </div>
  );
}