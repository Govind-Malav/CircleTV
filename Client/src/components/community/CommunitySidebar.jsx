import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchChannels,
  fetchMembers,
  selectChannelsByCommunityId,
  selectMembersByCommunityId,
  selectOnlineMembersCount,
  setActiveChannel,
  selectActiveChannel
} from '../../store/communitySlice';
import { 
  HashtagIcon,
  SpeakerWaveIcon,
  MegaphoneIcon,
  PlusIcon,
  Cog6ToothIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

const CommunitySidebar = ({ community, onInviteClick, onSettingsClick }) => {
  const dispatch = useDispatch();
  
  const channels = useSelector(state => 
    selectChannelsByCommunityId(state, community?._id)
  );
  const members = useSelector(state => 
    selectMembersByCommunityId(state, community?._id)
  );
  const onlineCount = useSelector(state => 
    selectOnlineMembersCount(state, community?._id)
  );
  const activeChannel = useSelector(selectActiveChannel);
  
  useEffect(() => {
    if (community?._id) {
      dispatch(fetchChannels(community._id));
      dispatch(fetchMembers(community._id));
    }
  }, [dispatch, community?._id]);
  
  const getChannelIcon = (type) => {
    switch (type) {
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
  
//   const groupChannelsByCategory = () => {
//     const categories = {};
    
//     channels.forEach(channel => {
//       const category = channel.category || 'Channels';
//       if (!categories[category]) {
//         categories[category] = [];
//       }
//       categories[category].push(channel);
//     });
    
//     return categories;
//   };
  
//   if (!community) return null;
  
//   const channelCategories = groupChannelsByCategory();
  
//   return (
//     <div className="w-60 h-screen bg-gray-800 flex flex-col">
//       {/* Community Header */}
//       <div className="h-12 px-4 flex items-center justify-between border-b border-gray-700 cursor-pointer hover:bg-gray-700 transition">
//         <h2 className="font-bold text-white truncate">{community.name}</h2>
//         <Cog6ToothIcon className="w-5 h-5 text-gray-400" />
//       </div>
      
//       {/* Channels */}
//       <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
//         {Object.entries(channelCategories).map(([category, categoryChannels]) => (
//           <div key={category} className="mb-4">
//             <div className="flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 px-2">
//               <span>{category}</span>
//               <PlusIcon className="w-4 h-4 cursor-pointer hover:text-white" />
//             </div>
            
//             {categoryChannels.map(channel => (
//               <div
//                 key={channel._id}
//                 onClick={() => dispatch(setActiveChannel(channel))}
//                 className={`flex items-center gap-2 px-2 py-1 rounded-lg mb-0.5 cursor-pointer group
//                   ${activeChannel?._id === channel._id 
//                     ? 'bg-gray-700 text-white' 
//                     : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'}`}
//               >
//                 {getChannelIcon(channel.type)}
//                 <span className="flex-1 text-sm truncate">{channel.name}</span>
                
//                 {channel.type === 'voice' && channel.userCount > 0 && (
//                   <span className="text-xs bg-gray-600 px-1.5 rounded-full">
//                     {channel.userCount}
//                   </span>
//                 )}
//               </div>
//             ))}
//           </div>
//         ))}
        
//         {/* Add Channel Button */}
//         <button className="flex items-center gap-2 px-2 py-1 rounded-lg text-gray-400 hover:bg-gray-700 hover:text-white w-full mt-2">
//           <PlusIcon className="w-5 h-5" />
//           <span className="text-sm">Add Channel</span>
//         </button>
//       </div>
      
//       {/* Members Section */}
//       <div className="border-t border-gray-700 p-2">
//         <div className="flex items-center justify-between mb-2 px-2">
//           <div className="flex items-center gap-1">
//             <span className="text-xs font-semibold text-gray-400 uppercase">
//               Members
//             </span>
//             <span className="text-xs text-gray-500">— {members.length}</span>
//           </div>
//           <div className="flex gap-1">
//             <button
//               onClick={onInviteClick}
//               className="p-1 text-gray-400 hover:text-white rounded"
//               title="Invite People"
//             >
//               <UserPlusIcon className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
        
//         <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
//           {members.slice(0, 5).map(member => (
//             <div key={member.userId} className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-700">
//               <div className="relative">
//                 <img
//                   src={member.avatar || '/default-avatar.png'}
//                   alt={member.name}
//                   className="w-6 h-6 rounded-full"
//                 />
//                 {member.online && (
//                   <span className="absolute bottom-0 right-0 w-2 h-2 bg-secondary rounded-full border border-gray-800" />
//                 )}
//               </div>
//               <span className="text-sm text-gray-300 truncate flex-1">
//                 {member.name}
//               </span>
//               {member.role === 'admin' && (
//                 <span className="text-xs text-yellow-500">👑</span>
//               )}
//             </div>
//           ))}
          
//           {members.length > 5 && (
//             <button className="text-xs text-gray-400 hover:text-white px-2 py-1">
//               View {members.length - 5} more...
//             </button>
//           )}
//         </div>
        
//         {/* Online Count */}
//         <div className="mt-2 px-2 text-xs text-gray-400">
//           <span className="inline-block w-2 h-2 bg-secondary rounded-full mr-2" />
//           {onlineCount} Online
//         </div>
//       </div>
      
//       {/* User Profile */}
//       <div className="p-2 border-t border-gray-700 flex items-center gap-2">
//         <img
//           src={useSelector(state => state.auth.user?.avatar) || '/default-avatar.png'}
//           alt="You"
//           className="w-8 h-8 rounded-full"
//         />
//         <div className="flex-1 min-w-0">
//           <p className="text-sm font-medium text-white truncate">
//             {useSelector(state => state.auth.user?.name)}
//           </p>
//           <div className="flex items-center gap-1">
//             <span className="inline-block w-2 h-2 bg-secondary rounded-full" />
//             <span className="text-xs text-gray-400">Online</span>
//           </div>
//         </div>
//         <Cog6ToothIcon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
//       </div>
//     </div>
//   );
};

export default CommunitySidebar;