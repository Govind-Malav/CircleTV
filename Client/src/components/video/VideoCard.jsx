import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { formatDistanceToNow } from 'date-fns';
import { addToHistory } from '../../store/videoSlice';

const VideoCard = ({ video }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleClick = () => {
    dispatch(addToHistory(video));
    navigate(`/watch/${video._id}`);
  };
  
  const formatViews = (views) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`;
    return views;
  };
  
  return (
    <div className="video-card" onClick={handleClick}>
      <div className="video-card-thumbnail">
        <img 
          src={video.thumbnail || '/default-thumbnail.jpg'} 
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <span className="video-card-duration">{video.duration}</span>
      </div>
      
      <div className="p-3">
        <div className="flex gap-3">
          <img 
            src={video.channel?.avatar || '/default-avatar.png'}
            alt={video.channel?.name}
            className="w-9 h-9 rounded-full"
          />
          
          <div className="flex-1">
            <h3 className="video-card-title">{video.title}</h3>
            
            <p className="video-card-channel mt-1">
              {video.channel?.name}
            </p>
            
            {/* <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(video.createdAt))} ago</span>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;