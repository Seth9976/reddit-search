import React from 'react';
import { format } from 'date-fns';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RedditItem } from '../types';
import { HighlightText } from '../components/HighlightText';

interface ResultCardProps {
  item: RedditItem;
  searchQuery: string;
}

export default function ResultCard({ item, searchQuery }: ResultCardProps) {
  const [expanded, setExpanded] = React.useState(false);

  const content = item.selftext || item.body || '';
  const previewContent = content.slice(0, 100) + (content.length > 100 ? '...' : '');

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            <HighlightText text={item.title} highlight={searchQuery} />
          </h3>
          <div className="mt-2 text-sm text-gray-600">
            <span>Posted by u/{item.author}</span>
            <span className="mx-2">•</span>
            <span>{format(item.created_utc * 1000, 'PPP')}</span>
            <span className="mx-2">•</span>
            <span>r/{item.subreddit}</span>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="ml-4 p-1 hover:bg-gray-100 rounded"
        >
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </button>
      </div>

      <div className="mt-3 text-gray-700">
        <HighlightText 
          text={expanded ? content : previewContent} 
          highlight={searchQuery}
        />
      </div>

      {item.url && (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-blue-600 hover:underline text-sm"
        >
          View on Reddit →
        </a>
      )}
    </div>
  );
}