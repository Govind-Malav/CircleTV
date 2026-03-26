import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  setActiveCommunity,
  leaveCommunity,
  selectUserRole
} from '../../store/communitySlice';

const CommunityItem = ({ community, isActive, onContextMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(state => state.auth.user);
  const userRole = useSelector(state => selectUserRole(state, community._id, currentUser?._id));
  
  const handleClick = () => {
    dispatch(setActiveCommunity(community));
    navigate(`/community/${community._id}`);
  };
  
  const handleLeave = (e) => {
    e.stopPropagation();
    if (window.confirm(`Leave ${community.name}? You can rejoin later.`)) {
      dispatch(leaveCommunity(community._id));
    }
  };
  
  const getRoleBadge = () => {
    switch (userRole) {
      case 'admin':
        return <span className="text-yellow-500 text-xs ml-1">👑</span>;
      case 'moderator':
        return <span className="text-blue-500 text-xs ml-1">🛡️</span>;
      default:
        return null;
    }
  };
  
  return (
    <div
      onClick={handleClick}
      onContextMenu={(e) => onContextMenu?.(e, community)}
      className={`group relative w-12 h-12 mb-2 cursor-pointer`}
      title={community.name}
    >
      {community.icon ? (
        <img
          src={community.icon}
          alt={community.name}
          className={`w-full h-full rounded-2xl group-hover:rounded-xl transition-all duration-200 object-cover
            ${isActive ? 'ring-2 ring-primary ring-offset-2 ring-offset-gray-900' : ''}`}
        />
      ) : (
        <div className={`w-full h-full rounded-2xl group-hover:rounded-xl transition-all duration-200 
          flex items-center justify-center text-white text-lg font-bold
          ${isActive ? 'bg-primary' : 'bg-gray-800 group-hover:bg-primary'}`}>
          {community.name.charAt(0).toUpperCase()}
        </div>
      )}
      
      {/* Online indicator */}
      {community.onlineCount > 0 && (
        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-gray-900" />
      )}
      
      {/* Role badge */}
      {getRoleBadge()}
      
      {/* Context menu indicator */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
        bg-black bg-opacity-50 flex items-center justify-center transition-opacity">
        <button
          onClick={handleLeave}
          className="text-white text-xs bg-red-500 rounded-full p-1"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default CommunityItem;