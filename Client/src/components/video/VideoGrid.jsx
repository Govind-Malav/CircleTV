import React from 'react';
import VideoCard from './VideoCard';

const VideoGrid = ({ videos, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="skeleton-thumbnail" />
        ))}
      </div>
    );
  }
  
//   if (error) {
//     return (
//       <div className="text-center py-10">
//         <p className="text-error">{error}</p>
//       </div>
//     );
//   }
  
//   if (videos.length === 0) {
//     return (
//       <div className="text-center py-10">
//         <p className="text-gray-400">No videos found</p>
//       </div>
//     );
//   }
  
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//       {videos.map(video => (
//         <VideoCard key={video._id} video={video} />
//       ))}
//     </div>
//   );
};

export default VideoGrid;