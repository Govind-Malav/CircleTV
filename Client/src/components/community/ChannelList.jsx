import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { 
  PlusIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HashtagIcon,
  SpeakerWaveIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline';
import ChannelItem from './ChannelItem';

const ChannelList = ({ 
  channels, 
  communityId, 
  onAddChannel,
  onChannelContextMenu 
}) => {
  const [collapsedCategories, setCollapsedCategories] = useState({});
  
  const groupChannelsByCategory = () => {
    const categories = {};
    
    channels.forEach(channel => {
      const category = channel.category || 'TEXT CHANNELS';
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(channel);
    });
    
    return categories;
  };
  
  const toggleCategory = (category) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  const getCategoryIcon = (categoryName) => {
    if (categoryName.toLowerCase().includes('voice')) {
      return <SpeakerWaveIcon className="w-4 h-4" />;
    }
    if (categoryName.toLowerCase().includes('announce')) {
      return <MegaphoneIcon className="w-4 h-4" />;
    }
    return <HashtagIcon className="w-4 h-4" />;
  };
  
  const channelCategories = groupChannelsByCategory();
  
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
      {Object.entries(channelCategories).map(([category, categoryChannels]) => (
        <div key={category} className="mb-2">
          {/* Category Header */}
          <div
            onClick={() => toggleCategory(category)}
            className="flex items-center justify-between px-2 py-1 cursor-pointer hover:bg-gray-700 rounded group"
          >
            <div className="flex items-center gap-1">
              {collapsedCategories[category] ? (
                <ChevronRightIcon className="w-3 h-3 text-gray-400" />
              ) : (
                <ChevronDownIcon className="w-3 h-3 text-gray-400" />
              )}
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {category}
              </span>
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddChannel?.({ category, type: 'text' });
              }}
              className="hidden group-hover:block text-gray-400 hover:text-white"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>
          
          {/* Channels in Category */}
          {!collapsedCategories[category] && (
            <div className="ml-2">
              {categoryChannels.map(channel => (
                <ChannelItem
                  key={channel._id}
                  channel={channel}
                  communityId={communityId}
                  onContextMenu={onChannelContextMenu}
                />
              ))}
            </div>
          )}
        </div>
      ))}
      
      {/* Add Channel Button */}
      <button
        onClick={() => onAddChannel?.()}
        className="flex items-center gap-2 px-2 py-1 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white w-full mt-2"
      >
        <PlusIcon className="w-4 h-4" />
        <span className="text-sm">Add Channel</span>
      </button>
    </div>
  );
};

export default ChannelList;