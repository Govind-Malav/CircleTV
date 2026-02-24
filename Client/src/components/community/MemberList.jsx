import React from 'react';
import { useSelector } from 'react-redux';
import { 
  UserGroupIcon,
  ChevronDownIcon,
  ChevronUpIcon 
} from '@heroicons/react/24/outline';

const MemberList = ({ members = [] }) => {
  const [showOffline, setShowOffline] = useState(false);
  const currentUser = useSelector(state => state.auth.user);
  
  const onlineMembers = members.filter(m => m.online);
  const offlineMembers = members.filter(m => !m.online);
  
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return '👑';
      case 'moderator':
        return '🛡️';
      default:
        return null;
    }
  };
  
  return (
    <div className="w-60 h-screen bg-gray-800 flex flex-col">
      <div className="h-12 px-4 flex items-center border-b border-gray-700">
        <h2 className="font-bold text-white">Members</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {/* Online Members */}
        <div className="mb-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-semibold text-gray-400 uppercase">
              Online — {onlineMembers.length}
            </span>
          </div>
          
          {onlineMembers.map(member => (
            <div
              key={member.userId}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-700 cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={member.avatar || '/default-avatar.png'}
                  alt={member.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-secondary rounded-full border-2 border-gray-800" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-sm text-white font-medium truncate">
                    {member.name}
                  </span>
                  {getRoleIcon(member.role) && (
                    <span className="text-xs">{getRoleIcon(member.role)}</span>
                  )}
                </div>
                {member.activity && (
                  <p className="text-xs text-gray-400 truncate">
                    {member.activity}
                  </p>
                )}
              </div>
              
              {member.userId === currentUser?._id && (
                <span className="text-xs text-gray-400">(you)</span>
              )}
            </div>
          ))}
        </div>
        
        {/* Offline Members */}
        {showOffline && offlineMembers.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-xs font-semibold text-gray-400 uppercase">
                Offline — {offlineMembers.length}
              </span>
            </div>
            
            {offlineMembers.map(member => (
              <div
                key={member.userId}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-700 cursor-pointer opacity-50"
              >
                <div className="relative">
                  <img
                    src={member.avatar || '/default-avatar.png'}
                    alt={member.name}
                    className="w-8 h-8 rounded-full grayscale"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <span className="text-sm text-gray-400 truncate">
                    {member.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Toggle Offline Button */}
        {offlineMembers.length > 0 && (
          <button
            onClick={() => setShowOffline(!showOffline)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white mt-2 px-2"
          >
            {showOffline ? (
              <>
                <ChevronUpIcon className="w-3 h-3" />
                Hide offline
              </>
            ) : (
              <>
                <ChevronDownIcon className="w-3 h-3" />
                Show {offlineMembers.length} offline
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default MemberList;