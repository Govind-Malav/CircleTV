import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { userAPI, playlistAPI } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

// Skeleton
const PlaylistSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-video bg-gray-800 rounded-xl mb-2" />
    <div className="h-4 bg-gray-800 rounded w-2/3 mb-1" />
    <div className="h-3 bg-gray-800 rounded w-1/3" />
  </div>
);

const ChannelPlaylists = ({ channelId, isOwner }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPlaylists = useCallback(async () => {
    if (!channelId) return;
    setLoading(true);
    try {
      const response = await userAPI.getUserPlaylists(channelId);
      setPlaylists(response.data?.data || []);
    } catch (err) {
      console.error('[ChannelPlaylists] Failed:', err);
    } finally {
      setLoading(false);
    }
  }, [channelId]);

  useEffect(() => {
    loadPlaylists();
  }, [loadPlaylists]);

  // Playlist thumbnail: first video thumbnail or fallback
  const getPlaylistThumbnail = (playlist) =>
    playlist.thumbnail || playlist.videos?.[0]?.thumbnail || null;

  return (
    <div className="p-4 sm:p-6">
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <PlaylistSkeleton key={i} />)}
        </div>
      ) : playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
            </svg>
          </div>
          <p className="text-gray-400 text-sm">No playlists yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((playlist) => {
            const thumbnail = getPlaylistThumbnail(playlist);
            return (
              <Link
                key={playlist._id}
                to={`/playlist/${playlist._id}`}
                className="group block"
              >
                {/* Stacked thumbnail effect */}
                <div className="relative aspect-video mb-2">
                  {/* Stack shadows */}
                  <div className="absolute inset-0 bg-gray-700 rounded-xl translate-y-1 translate-x-1 opacity-60" />
                  <div className="absolute inset-0 bg-gray-600 rounded-xl translate-y-0.5 translate-x-0.5 opacity-60" />

                  {/* Main thumbnail */}
                  <div className="relative rounded-xl overflow-hidden bg-gray-800 h-full">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={playlist.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-900/60 to-gray-800">
                        <svg className="w-12 h-12 text-violet-400/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Video count badge */}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M4 6h16M4 10h16M4 14h16M4 18h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                    </svg>
                    {playlist.videos?.length || 0}
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-violet-400 transition-colors">
                  {playlist.title}
                </h3>
                <p className="mt-0.5 text-xs text-gray-400 capitalize">
                  {playlist.visibility} · Updated {formatDistanceToNow(new Date(playlist.updatedAt || playlist.createdAt), { addSuffix: true })}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChannelPlaylists;
