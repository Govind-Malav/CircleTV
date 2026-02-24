import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  SpeakerWaveIcon,
  MicrophoneIcon,
  PhoneXMarkIcon 
} from '@heroicons/react/24/outline';

const VoiceChannel = ({ channel, community }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);
  const [participants, setParticipants] = useState([]);
  
  const user = useSelector(state => state.auth.user);
  
  useEffect(() => {
    if (isConnected) {
      // Connect to voice channel
      // This will use WebRTC (to be implemented later)
      connectToVoice();
    }
    
    return () => {
      if (isConnected) {
        disconnectFromVoice();
      }
    };
  }, [isConnected]);
  
  const connectToVoice = () => {
    // WebRTC connection logic
    console.log('Connecting to voice channel...');
  };
  
  const disconnectFromVoice = () => {
    // WebRTC disconnection logic
    console.log('Disconnecting from voice channel...');
  };
  
//   return (
//     <div className="flex-1 flex flex-col bg-gray-900">
//       {/* Channel Header */}
//       <div className="h-12 px-4 border-b border-gray-800 flex items-center">
//         <SpeakerWaveIcon className="w-5 h-5 text-gray-400 mr-2" />
//         <span className="font-semibold text-white">{channel?.name}</span>
//       </div>
      
//       {/* Participants */}
//       <div className="flex-1 p-4">
//         <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3">
//           Voice Connected ({participants.length})
//         </h3>
        
//         <div className="space-y-2">
//           {/* Current user */}
//           <div className="flex items-center gap-3 p-2 bg-gray-800 rounded-lg">
//             <div className="relative">
//               <img
//                 src={user?.avatar || '/default-avatar.png'}
//                 alt={user?.name}
//                 className="w-10 h-10 rounded-full"
//               />
//               <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-gray-800" />
//             </div>
//             <div className="flex-1">
//               <p className="font-medium text-white">{user?.name}</p>
//               <p className="text-xs text-gray-400">You</p>
//             </div>
//             {isMuted && <span className="text-error">🔇</span>}
//             {isDeafened && <span className="text-error">🔈</span>}
//           </div>
          
//           {/* Other participants (mock data) */}
//           <div className="flex items-center gap-3 p-2 hover:bg-gray-800 rounded-lg">
//             <div className="relative">
//               <img
//                 src="/default-avatar.png"
//                 alt="User"
//                 className="w-10 h-10 rounded-full"
//               />
//               <span className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-gray-800" />
//             </div>
//             <div className="flex-1">
//               <p className="font-medium text-white">John Doe</p>
//               <div className="flex items-center gap-1">
//                 <span className="w-1 h-1 bg-green-500 rounded-full" />
//                 <span className="text-xs text-gray-400">Speaking</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Voice Controls */}
//       {isConnected && (
//         <div className="p-4 border-t border-gray-800">
//           <div className="flex items-center justify-center gap-4">
//             <button
//               onClick={() => setIsMuted(!isMuted)}
//               className={`p-3 rounded-full transition ${
//                 isMuted ? 'bg-error text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
//               }`}
//             >
//               <MicrophoneIcon className="w-5 h-5" />
//             </button>
            
//             <button
//               onClick={() => setIsDeafened(!isDeafened)}
//               className={`p-3 rounded-full transition ${
//                 isDeafened ? 'bg-error text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
//               }`}
//             >
//               <SpeakerWaveIcon className="w-5 h-5" />
//             </button>
            
//             <button
//               onClick={() => setIsConnected(false)}
//               className="p-3 rounded-full bg-error text-white hover:bg-red-600 transition"
//             >
//               <PhoneXMarkIcon className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       )}
      
//       {/* Connect Button */}
//       {!isConnected && (
//         <div className="p-4">
//           <button
//             onClick={() => setIsConnected(true)}
//             className="btn-primary w-full"
//           >
//             Connect to Voice
//           </button>
//         </div>
//       )}
//     </div>
//   );
};

export default VoiceChannel;