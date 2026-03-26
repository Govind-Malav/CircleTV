import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateMemberRole, kickMember } from '../../store/communitySlice';
import { selectIsAdmin, selectIsModerator } from '../../store/communitySlice';
import { 
  ChevronDownIcon,
  ShieldCheckIcon,
  UserRemoveIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

const MemberItem = ({ member, communityId }) => {
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.auth.user);
  const isAdmin = useSelector(state => selectIsAdmin(state, communityId, currentUser?._id));
  const isModerator = useSelector(state => selectIsModerator(state, communityId, currentUser?._id));
  
  const canManage = isAdmin || (isModerator && member.role !== 'admin');
  const isCurrentUser = member.userId === currentUser?._id;
  
  const handleRoleChange = (newRole) => {
    dispatch(updateMemberRole({ communityId, userId: member.userId, role: newRole }));
    setShowMenu(false);
  };
  
  const handleKick = () => {
    if (window.confirm(`Kick ${member.name} from the community?`)) {
      dispatch(kickMember({ communityId, userId: member.userId }));
    }
    setShowMenu(false);
  };
  
  const handleMessage = () => {
    // Navigate to DM with member
    window.location.href = `/chat?user=${member.userId}`;
  };
  
  const getRoleIcon = () => {
    switch (member.role) {
      case 'admin':
        return <span className="text-yellow-500">👑</span>;
      case 'moderator':
        return <span className="text-blue-500">🛡️</span>;
      default:
        return null;
    }
  };
  
  const getRoleBadge = () => {
    switch (member.role) {
      case 'admin':
        return <span className="bg-yellow-500 bg-opacity-20 text-yellow-500 text-xs px-1.5 py-0.5 rounded">Admin</span>;
      case 'moderator':
        return <span className="bg-blue-500 bg-opacity-20 text-blue-500 text-xs px-1.5 py-0.5 rounded">Mod</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="relative group">
      <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-700 cursor-pointer">
        <div className="relative">
          <img
            src={member.avatar || '/default-avatar.png'}
            alt={member.name}
            className="w-8 h-8 rounded-full"
          />
          {member.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-gray-800" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1">
            <span className="text-sm text-white font-medium truncate">
              {member.name}
            </span>
            {getRoleIcon()}
            {isCurrentUser && (
              <span className="text-xs text-gray-400">(you)</span>
            )}
          </div>
          {member.activity && (
            <p className="text-xs text-gray-400 truncate">{member.activity}</p>
          )}
        </div>
        
        {getRoleBadge()}
        
        {/* Action Menu */}
        {canManage && !isCurrentUser && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-white rounded"
            >
              <ChevronDownIcon className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                <div className="py-1">
                  <button
                    onClick={handleMessage}
                    className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                  >
                    <ChatBubbleLeftIcon className="w-4 h-4" />
                    Message
                  </button>
                  
                  {member.role !== 'admin' && isAdmin && (
                    <button
                      onClick={() => handleRoleChange('moderator')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                    >
                      <ShieldCheckIcon className="w-4 h-4" />
                      Make Moderator
                    </button>
                  )}
                  
                  {member.role === 'moderator' && isAdmin && (
                    <button
                      onClick={() => handleRoleChange('member')}
                      className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                    >
                      Remove Moderator
                    </button>
                  )}
                  
                  <hr className="border-gray-700 my-1" />
                  
                  <button
                    onClick={handleKick}
                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
                  >
                    <UserRemoveIcon className="w-4 h-4" />
                    Kick Member
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberItem;