import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVideoById, fetchRecommendedVideos, likeVideo, dislikeVideo, selectCurrentVideo, selectRecommendedVideos, selectVideoLoading } from '../store/videoSlice';
import { selectUser } from '../store/authSlice';
import { videoAPI } from '../services/api';
import { formatViews, formatRelativeTime, formatDuration, formatCount } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Watch = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const video = useSelector(selectCurrentVideo);
  const recommendedVideos = useSelector(selectRecommendedVideos);
  const loading = useSelector(selectVideoLoading);
  const currentUser = useSelector(selectUser);

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [localLikes, setLocalLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchVideoById(id));
      dispatch(fetchRecommendedVideos(id));
      // Record view
      videoAPI.recordView(id).catch(() => {});
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (video) {
      setLocalLikes(video.likes?.length || 0);
      setLiked(video.likes?.includes(currentUser?._id) || false);
      setDisliked(video.dislikes?.includes(currentUser?._id) || false);
    }
  }, [video, currentUser]);

  const handleLike = async () => {
    if (!currentUser) { toast.error('Sign in to like videos'); return; }
    const wasLiked = liked;
    setLiked(!wasLiked);
    setLocalLikes(n => wasLiked ? n - 1 : n + 1);
    if (disliked) setDisliked(false);
    try {
      await dispatch(liked ? dislikeVideo(id) : likeVideo(id));
    } catch {
      setLiked(wasLiked);
      setLocalLikes(n => wasLiked ? n + 1 : n - 1);
    }
  };

  if (loading && !video) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!video) return (
    <div className="flex items-center justify-center min-h-[400px] text-center p-6">
      <div>
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="text-xl font-bold text-white mb-2">Video not found</h2>
        <p className="text-gray-400">This video may have been removed or is unavailable.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6 max-w-[1600px] mx-auto">
        {/* ── Left: Video player + info ───────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Video Player */}
          <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
            {video.videoUrl ? (
              <video
                src={video.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
                poster={video.thumbnail}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <p className="text-gray-400">Video unavailable</p>
              </div>
            )}
          </div>

          {/* Video title */}
          <div className="mt-4">
            <h1 className="text-lg sm:text-xl font-bold text-white leading-snug">{video.title}</h1>

            {/* Meta row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-3">
              {/* Views & date */}
              <p className="text-sm text-gray-400">
                {formatViews(video.views)} · {formatRelativeTime(video.createdAt)}
              </p>

              {/* Like / Dislike / Share */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    liked ? 'bg-violet-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                  </svg>
                  {formatCount(localLikes)}
                </button>

                <button
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    disliked ? 'bg-red-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                  </svg>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success('Link copied!');
                  }}
                  className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full text-sm font-medium transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>

            {/* Channel info */}
            <div className="flex items-center gap-3 mt-4 p-4 bg-gray-900/60 rounded-xl border border-gray-800">
              <Link to={`/channel/${video.uploader?._id}`}>
                <img
                  src={video.uploader?.avatar || `https://ui-avatars.com/api/?name=${video.uploader?.username}&background=7C3AED&color=fff&size=44`}
                  alt={video.uploader?.username}
                  className="w-11 h-11 rounded-full object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/channel/${video.uploader?._id}`} className="text-sm font-semibold text-white hover:text-violet-400 transition-colors">
                  {video.uploader?.username}
                </Link>
                <p className="text-xs text-gray-400">
                  {formatCount(video.uploader?.subscriberCount || 0)} subscribers
                </p>
              </div>
              <button className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-full transition-colors">
                Subscribe
              </button>
            </div>

            {/* Description */}
            {video.description && (
              <div className="mt-4 p-4 bg-gray-900/60 rounded-xl border border-gray-800">
                <p className={`text-sm text-gray-300 whitespace-pre-line ${!showFullDescription ? 'line-clamp-3' : ''}`}>
                  {video.description}
                </p>
                {video.description.length > 200 && (
                  <button
                    onClick={() => setShowFullDescription(s => !s)}
                    className="mt-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                  >
                    {showFullDescription ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Recommendations ──────────────────────────── */}
        <aside className="w-full lg:w-96 shrink-0 space-y-3">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-1">Up next</h2>
          {recommendedVideos.map(rec => (
            <Link key={rec._id} to={`/watch/${rec._id}`} className="flex gap-3 group p-2 rounded-xl hover:bg-gray-900 transition-colors">
              <div className="relative w-40 aspect-video rounded-lg overflow-hidden shrink-0 bg-gray-800">
                <img src={rec.thumbnail} alt={rec.title} loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                {rec.duration && (
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                    {formatDuration(rec.duration)}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold text-white line-clamp-2 group-hover:text-violet-400 transition-colors">{rec.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{rec.uploader?.username}</p>
                <p className="text-xs text-gray-500">{formatViews(rec.views)}</p>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default Watch;
