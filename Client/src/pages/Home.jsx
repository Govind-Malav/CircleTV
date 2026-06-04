import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchVideos } from '../store/videoSlice';
import { useVideo } from '../hooks/useVideo';
import { VIDEO_CATEGORIES } from '../utils/constants';
import { Link } from 'react-router-dom';
import { formatRelativeTime, formatViews, formatDuration } from '../utils/formatters';
import { motion } from 'framer-motion';

// Video card skeleton
const VideoSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-video bg-gray-800 rounded-xl mb-3" />
    <div className="flex gap-3">
      <div className="w-9 h-9 rounded-full bg-gray-800 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-800 rounded w-3/4" />
        <div className="h-3 bg-gray-800 rounded w-1/2" />
        <div className="h-3 bg-gray-800 rounded w-1/3" />
      </div>
    </div>
  </div>
);

// Single video card
const VideoCard = ({ video }) => (
  <Link to={`/watch/${video._id}`} className="group block">
    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-800 mb-3">
      <img src={video.thumbnail} alt={video.title} loading="lazy"
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      {video.duration && (
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-mono">
          {formatDuration(video.duration)}
        </span>
      )}
    </div>
    <div className="flex gap-3">
      <Link to={`/channel/${video.uploader?._id}`} className="shrink-0">
        <img src={video.uploader?.avatar || `https://ui-avatars.com/api/?name=${video.uploader?.username}&background=7C3AED&color=fff&size=36`}
          alt={video.uploader?.username} className="w-9 h-9 rounded-full object-cover" />
      </Link>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-violet-400 transition-colors">{video.title}</h3>
        <Link to={`/channel/${video.uploader?._id}`} className="text-xs text-gray-400 hover:text-white transition-colors block mt-0.5">{video.uploader?.username}</Link>
        <p className="text-xs text-gray-500 mt-0.5">{formatViews(video.views)} · {formatRelativeTime(video.createdAt)}</p>
      </div>
    </div>
  </Link>
);

const Home = () => {
  const dispatch = useDispatch();
  const { videos, loading, hasMore, selectedCategory, error } = useVideo();
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const sentinelRef = useRef(null);
  const observer = useRef(null);

  useEffect(() => {
    dispatch(fetchVideos({ page: 1, category: activeCategory === 'All' ? undefined : activeCategory }));
    setPage(1);
  }, [activeCategory, dispatch]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const next = page + 1;
      setPage(next);
      dispatch(fetchVideos({ page: next, category: activeCategory === 'All' ? undefined : activeCategory }));
    }
  }, [loading, hasMore, page, activeCategory, dispatch]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) loadMore(); });
    if (sentinelRef.current) observer.current.observe(sentinelRef.current);
    return () => observer.current?.disconnect();
  }, [loadMore]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Category chips */}
      <div className="sticky top-14 z-30 bg-gray-950/90 backdrop-blur-md border-b border-gray-800/60 px-4 py-2">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {VIDEO_CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat ? 'bg-white text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Videos grid */}
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {videos.map((video, i) => (
            <motion.div key={video._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <VideoCard video={video} />
            </motion.div>
          ))}
          {loading && Array.from({ length: 8 }).map((_, i) => <VideoSkeleton key={`sk-${i}`} />)}
        </div>

        {!loading && videos.length === 0 && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">📺</div>
            <h3 className="text-xl font-bold text-white mb-2">No videos found</h3>
            <p className="text-gray-400">Try a different category or check back later</p>
          </div>
        )}

        <div ref={sentinelRef} className="h-8" />
      </div>
    </div>
  );
};

export default Home;
