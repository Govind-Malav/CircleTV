import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { playlistAPI } from '../services/api';
import { formatViews, formatRelativeTime, formatDuration } from '../utils/formatters';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Playlist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response = await playlistAPI.getPlaylist(id);
        const data = response.data?.data || response.data;
        setPlaylist(data);
        setActiveVideo(data?.videos?.[0] || null);
      } catch { } finally { setLoading(false); }
    };
    if (id) load();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>;
  if (!playlist) return <div className="text-center py-20 text-gray-400">Playlist not found</div>;

  return (
    <div className="min-h-screen bg-gray-950 p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
        {/* Player */}
        <div className="flex-1">
          {activeVideo ? (
            <>
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
                <video src={activeVideo.videoUrl} controls autoPlay className="w-full h-full" poster={activeVideo.thumbnail} />
              </div>
              <h2 className="text-lg font-bold text-white">{activeVideo.title}</h2>
              <p className="text-sm text-gray-400 mt-1">{formatViews(activeVideo.views)} · {formatRelativeTime(activeVideo.createdAt)}</p>
            </>
          ) : (
            <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
              <p className="text-gray-400">Select a video</p>
            </div>
          )}
        </div>

        {/* Playlist sidebar */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-800">
              <h1 className="font-bold text-white line-clamp-2">{playlist.title}</h1>
              <p className="text-xs text-gray-400 mt-1">{playlist.videos?.length || 0} videos</p>
            </div>
            <div className="overflow-y-auto max-h-[60vh] custom-scrollbar">
              {playlist.videos?.map((video, i) => (
                <button key={video._id} onClick={() => setActiveVideo(video)}
                  className={`w-full flex gap-3 p-3 text-left transition-colors ${
                    activeVideo?._id === video._id ? 'bg-violet-600/20 border-l-2 border-violet-500' : 'hover:bg-gray-800'
                  }`}>
                  <span className="text-xs text-gray-500 w-4 shrink-0 pt-1">{i + 1}</span>
                  <div className="relative w-20 aspect-video rounded-lg overflow-hidden shrink-0 bg-gray-800">
                    <img src={video.thumbnail} alt="" className="w-full h-full object-cover" loading="lazy" />
                    {video.duration && <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[10px] px-0.5 rounded">{formatDuration(video.duration)}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white line-clamp-2">{video.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{video.uploader?.username}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Playlist;
