import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { videoAPI } from '../services/api';
import { formatCount } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ShortsCard = ({ video, isActive }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (isActive && videoRef.current) {
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive]);

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-black snap-start">
      {video.videoUrl ? (
        <video ref={videoRef} src={video.videoUrl} loop muted={false} playsInline
          className="h-full max-w-sm w-full object-contain" />
      ) : (
        <div className="h-full max-w-sm w-full bg-gray-900 flex items-center justify-center">
          <p className="text-gray-500">Video unavailable</p>
        </div>
      )}

      {/* Overlay info */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <Link to={`/channel/${video.uploader?._id}`} className="flex items-center gap-2 mb-2">
          <img src={video.uploader?.avatar || `https://ui-avatars.com/api/?name=${video.uploader?.username}&background=7C3AED&color=fff&size=32`}
            alt="" className="w-8 h-8 rounded-full" />
          <span className="text-sm font-semibold text-white">{video.uploader?.username}</span>
        </Link>
        <h2 className="text-sm text-white line-clamp-2">{video.title}</h2>
      </div>

      {/* Right actions */}
      <div className="absolute right-4 bottom-24 flex flex-col items-center gap-5">
        {[{ icon: '❤️', label: formatCount(video.likes?.length || 0) }, { icon: '💬', label: formatCount(video.comments || 0) }, { icon: '🔗', label: 'Share' }].map((a, i) => (
          <button key={i} className="flex flex-col items-center gap-1">
            <span className="text-2xl">{a.icon}</span>
            <span className="text-xs text-white">{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const Shorts = () => {
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await videoAPI.getShorts();
        setShorts(response.data?.data || []);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      const index = Math.round(container.scrollTop / window.innerHeight);
      setActiveIndex(index);
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;

  if (!shorts.length) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-center">
      <div>
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-xl font-bold text-white mb-2">No shorts yet</h2>
        <p className="text-gray-400">Check back soon for short videos!</p>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="h-screen overflow-y-scroll snap-y snap-mandatory bg-black">
      {shorts.map((short, i) => (
        <ShortsCard key={short._id} video={short} isActive={i === activeIndex} />
      ))}
    </div>
  );
};

export default Shorts;
