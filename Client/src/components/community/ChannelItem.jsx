import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  HashtagIcon, 
  SpeakerWaveIcon, 
  MegaphoneIcon,
  LockClosedIcon,
  Cog6ToothIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { setActiveChannel, deleteChannel } from '../../store/communitySlice';
import { selectIsAdmin, selectIsModerator } from '../../store/communitySlice';

const ChannelItem = ({ channel, communityId, onContextMenu }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const isAdmin = useSelector(state => selectIsAdmin(state, communityId, currentUser?._id));
  const isModerator = useSelector(state => selectIsModerator(state, communityId, currentUser?._id));
  
  const getChannelIcon = () => {
    switch (channel.type) {
      case 'text':
        return <HashtagIcon className="w-5 h-5" />;
      case 'voice':
        return <SpeakerWaveIcon className="w-5 h-5" />;
      case 'announcement':
        return <MegaphoneIcon className="w-5 h-5" />;
      default:
        return <HashtagIcon className="w-5 h-5" />;
    }
  };
  
  const handleClick = () => {
    dispatch(setActiveChannel(channel));
  };
  
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete #${channel.name}? This cannot be undone.`)) {
      dispatch(deleteChannel({ communityId, channelId: channel._id }));
    }
  };
  
  const canManage = isAdmin || isModerator;
  
  return (
    <div
      onClick={handleClick}
      onContextMenu={(e) => onContextMenu?.(e, channel)}
      className={`flex items-center gap-2 px-2 py-1 rounded-lg mb-0.5 cursor-pointer group
        ${channel.isActive 
          ? 'bg-gray-700 text-white' 
          : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
    >
      {getChannelIcon()}
      <span className="flex-1 text-sm truncate">{channel.name}</span>
      
      {/* Channel badges */}
      {channel.isPrivate && (
        <LockClosedIcon className="w-3 h-3 text-gray-500" title="Private Channel" />
      )}
      
      {channel.type === 'voice' && channel.userCount > 0 && (
        <span className="text-xs bg-gray-600 px-1.5 rounded-full">
          {channel.userCount}
        </span>
      )}
      
      {/* Admin actions */}
      {canManage && (
        <div className="hidden group-hover:flex items-center gap-1">
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-gray-600 rounded"
            title="Delete Channel"
          >
            <TrashIcon className="w-3 h-3 text-red-400" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); /* Open settings */ }}
            className="p-1 hover:bg-gray-600 rounded"
            title="Channel Settings"
          >
            <Cog6ToothIcon className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChannelItem;