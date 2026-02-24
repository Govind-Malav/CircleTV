import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCommunities, 
  selectAllCommunities,
  setActiveCommunity 
} from '../../store/communitySlice';
import { PlusIcon } from '@heroicons/react/24/outline';

const CommunityList = ({ onSelectCommunity, onCreateClick }) => {
  const dispatch = useDispatch();
  const communities = useSelector(selectAllCommunities);
  const loading = useSelector(state => state.community.loading);
  
  useEffect(() => {
    dispatch(fetchCommunities());
  }, [dispatch]);
  
  const handleCommunityClick = (community) => {
    dispatch(setActiveCommunity(community));
    if (onSelectCommunity) onSelectCommunity(community);
  };
  
  if (loading && communities.length === 0) {
    return (
      <div className="w-20 h-screen bg-gray-900 flex flex-col items-center py-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-12 h-12 bg-gray-800 rounded-2xl mb-2 animate-pulse" />
        ))}
      </div>
    );
  }
  
//   return (
//     <div className="w-20 h-screen bg-gray-900 flex flex-col items-center py-4 overflow-y-auto custom-scrollbar">
//       {/* Home button */}
//       <button
//         onClick={() => handleCommunityClick({ _id: 'home', name: 'Home' })}
//         className="w-12 h-12 bg-primary rounded-2xl mb-2 flex items-center justify-center text-white hover:rounded-xl transition-all duration-200"
//         title="Home"
//       >
//         🏠
//       </button>
      
//       <div className="w-8 h-0.5 bg-gray-700 my-2" />
      
//       {/* Community list */}
//       {communities.map(community => (
//         <button
//           key={community._id}
//           onClick={() => handleCommunityClick(community)}
//           className="group relative w-12 h-12 mb-2"
//           title={community.name}
//         >
//           {community.icon ? (
//             <img
//               src={community.icon}
//               alt={community.name}
//               className="w-full h-full rounded-2xl group-hover:rounded-xl transition-all duration-200 object-cover"
//             />
//           ) : (
//             <div className="w-full h-full bg-gray-800 rounded-2xl group-hover:rounded-xl transition-all duration-200 flex items-center justify-center text-white text-lg font-bold">
//               {community.name.charAt(0).toUpperCase()}
//             </div>
//           )}
          
//           {/* Online indicator (if any members online) */}
//           {community.onlineCount > 0 && (
//             <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-gray-900" />
//           )}
//         </button>
//       ))}
      
//       {/* Create community button */}
//       <button
//         onClick={onCreateClick}
//         className="w-12 h-12 bg-gray-800 rounded-2xl hover:bg-green-600 hover:rounded-xl transition-all duration-200 flex items-center justify-center text-green-500 hover:text-white mt-2"
//         title="Create Community"
//       >
//         <PlusIcon className="w-6 h-6" />
//       </button>
//     </div>
//   );
};

export default CommunityList;