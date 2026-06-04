import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearHistory, selectHistory } from '../store/videoSlice';
import { formatViews, formatRelativeTime } from '../utils/formatters';
import toast from 'react-hot-toast';

const History = () => {
  const dispatch = useDispatch();
  const history = useSelector(selectHistory);

  const handleClear = () => {
    dispatch(clearHistory());
    toast.success('Watch history cleared');
  };

  if (!history.length) return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center text-center p-6">
      <div className="text-6xl mb-4">⏳</div>
      <h2 className="text-xl font-bold text-white mb-2">No watch history</h2>
      <p className="text-gray-400 mb-6">Videos you watch will appear here</p>
      <Link to="/" className="px-6 py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-full transition-colors">Browse videos</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Watch history</h1>
        <button onClick={handleClear} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 hover:text-white rounded-lg transition-colors">
          Clear history
        </button>
      </div>
      <div className="space-y-4 max-w-3xl">
        {history.map(video => (
          <Link key={video._id} to={`/watch/${video._id}`} className="flex gap-4 group p-3 rounded-xl hover:bg-gray-900 transition-colors">
            <div className="relative w-40 aspect-video rounded-lg overflow-hidden shrink-0 bg-gray-800">
              <img src={video.thumbnail} alt={video.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-violet-400 transition-colors">{video.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{video.uploader?.username}</p>
              <p className="text-xs text-gray-500">{formatViews(video.views)} · {formatRelativeTime(video.createdAt)}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default History;
