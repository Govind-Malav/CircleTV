import React, { useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { fetchVideos, selectAllVideos, selectVideoLoading, selectHasMore } from '../../store/videoSlice';
import { userAPI } from '../../services/api';
import { useState } from 'react';

// Duration formatter: seconds → h:mm:ss or m:ss
const formatDuration = (seconds = 0) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  return `${m}:${String(s).padStart(2, '0')}`;
};

const formatViews = (num = 0) => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M views';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K views';
  return `${num} views`;
};

// ── Video Card Skeleton ───────────────────────────────────────────────────────
const VideoCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-video bg-gray-800 rounded-xl mb-2" />
    <div className="h-4 bg-gray-800 rounded w-3/4 mb-1" />
    <div className="h-3 bg-gray-800 rounded w-1/2" />
  </div>
);

// ── Channel Videos ─────────────────────────────────────────────────────────────
const ChannelVideos = ({ channelId, isOwner }) => {
  const dispatch = useDispatch();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('newest');
  const observer = useRef(null);

  const loadVideos = useCallback(async (p = 1, sort = sortBy) => {
    if (!channelId) return;
    setLoading(true);
    try {
      const response = await userAPI.getUserVideos(channelId, { page: p, limit: 12, sort });
      const data = response.data?.data || [];
      if (p === 1) {
        setVideos(data);
      } else {
        setVideos((prev) => [...prev, ...data]);
      }
      setHasMore(response.data?.hasMore || false);
    } catch (err) {
      console.error('[ChannelVideos] Failed to load:', err);
    } finally {
      setLoading(false);
    }
  }, [channelId, sortBy]);

  useEffect(() => {
    setPage(1);
    loadVideos(1, sortBy);
  }, [channelId, sortBy]);

  // Infinite scroll sentinel
  const sentinelRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadVideos(nextPage, sortBy);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, page, sortBy, loadVideos]);

  const handleSortChange = (newSort) => {
    if (newSort === sortBy) return;
    setSortBy(newSort);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Sort controls */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-400">
          {videos.length > 0 ? `${videos.length}${hasMore ? '+' : ''} videos` : ''}
        </p>
        <div className="flex gap-1 bg-gray-900 rounded-lg p-1">
          {['newest', 'popular', 'oldest'].map((sort) => (
            <button
              key={sort}
              onClick={() => handleSortChange(sort)}
              className={`px-3 py-1 text-xs rounded-md transition-colors capitalize ${
                sortBy === sort
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {sort}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      {!loading && videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">
            {isOwner ? 'No videos yet. Start uploading!' : 'No videos uploaded yet.'}
          </p>
          {isOwner && (
            <Link
              to="/upload"
              className="mt-3 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-full transition-colors"
            >
              Upload video
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Loaded videos */}
          {videos.map((video) => (
            <Link
              key={video._id}
              to={`/watch/${video._id}`}
              className="group block"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800 mb-2">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                {/* Duration */}
                {video.duration && (
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                    {formatDuration(video.duration)}
                  </span>
                )}
                {/* Shorts badge */}
                {video.isShort && (
                  <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    SHORT
                  </span>
                )}
              </div>
              {/* Meta */}
              <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-violet-400 transition-colors">
                {video.title}
              </h3>
              <p className="mt-0.5 text-xs text-gray-400">
                {formatViews(video.views)} · {formatDistanceToNow(new Date(video.createdAt), { addSuffix: true })}
              </p>
            </Link>
          ))}

          {/* Loading skeletons */}
          {loading && Array.from({ length: 4 }).map((_, i) => (
            <VideoCardSkeleton key={`sk-${i}`} />
          ))}
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {hasMore && <div ref={sentinelRef} className="h-4" />}
    </div>
  );
};

export default ChannelVideos;
