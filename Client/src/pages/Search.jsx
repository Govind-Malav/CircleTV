import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { videoAPI } from '../services/api';
import { formatViews, formatRelativeTime, formatDuration } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;
    const search = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await videoAPI.searchVideos(query);
        setResults(response.data?.data?.videos || response.data?.videos || []);
      } catch { setError('Search failed'); } finally { setLoading(false); }
    };
    search();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6">
      {query && <h1 className="text-xl font-bold text-white mb-6">Results for <span className="text-violet-400">"{query}"</span></h1>}

      {loading && <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>}

      {!loading && results.length === 0 && query && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-white mb-2">No results found</h2>
          <p className="text-gray-400">Try different keywords or check your spelling</p>
        </div>
      )}

      <div className="space-y-4 max-w-3xl">
        {results.map(video => (
          <Link key={video._id} to={`/watch/${video._id}`} className="flex gap-4 group p-3 rounded-xl hover:bg-gray-900 transition-colors">
            <div className="relative w-40 sm:w-48 aspect-video rounded-lg overflow-hidden shrink-0 bg-gray-800">
              <img src={video.thumbnail} alt={video.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              {video.duration && <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">{formatDuration(video.duration)}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white line-clamp-2 group-hover:text-violet-400 transition-colors">{video.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{formatViews(video.views)} · {formatRelativeTime(video.createdAt)}</p>
              <div className="flex items-center gap-2 mt-2">
                <img src={video.uploader?.avatar || `https://ui-avatars.com/api/?name=${video.uploader?.username}&background=7C3AED&color=fff&size=24`}
                  className="w-5 h-5 rounded-full" alt="" />
                <span className="text-xs text-gray-400">{video.uploader?.username}</span>
              </div>
              {video.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{video.description}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Search;
