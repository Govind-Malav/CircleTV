import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  ChevronDownIcon,
  UserPlusIcon,
  Cog6ToothIcon,
  BellIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import { selectIsAdmin } from '../../store/communitySlice';

const CommunityHeader = ({ community, onInvite, onSettings, onSearch }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const currentUser = useSelector(state => state.auth.user);
  const isAdmin = useSelector(state => selectIsAdmin(state, community?._id, currentUser?._id));
  
  return (
    <div className="h-12 px-4 border-b border-gray-800 flex items-center justify-between bg-gray-800">
      {/* Community Name with Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-2 font-bold text-white hover:bg-gray-700 px-2 py-1 rounded"
        >
          <span className="truncate max-w-[200px]">{community?.name}</span>
          <ChevronDownIcon className="w-4 h-4" />
        </button>
        
        {showDropdown && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
            <div className="p-3 border-b border-gray-700">
              <p className="text-white font-medium">{community?.name}</p>
              <p className="text-xs text-gray-400 mt-1">{community?.description}</p>
            </div>
            
            <div className="py-1">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700">
                Community Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700">
                Privacy Settings
              </button>
              {isAdmin && (
                <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700">
                  Delete Community
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <button
          onClick={onSearch}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition"
          title="Search"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
        
        {/* Notifications */}
        <button
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition"
          title="Notifications"
        >
          <BellIcon className="w-5 h-5" />
        </button>
        
        {/* Invite */}
        <button
          onClick={onInvite}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition"
          title="Invite People"
        >
          <UserPlusIcon className="w-5 h-5" />
        </button>
        
        {/* Settings */}
        <button
          onClick={onSettings}
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition"
          title="Community Settings"
        >
          <Cog6ToothIcon className="w-5 h-5" />
        </button>
        
        {/* Info */}
        <button
          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition"
          title="Community Info"
        >
          <InformationCircleIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default CommunityHeader;