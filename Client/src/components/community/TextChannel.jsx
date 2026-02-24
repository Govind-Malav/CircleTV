import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSocket } from '../../context/SocketContext';
import { format } from 'timeago.js';
import { 
  HashtagIcon,
  PaperAirplaneIcon,
  FaceSmileIcon 
} from '@heroicons/react/24/outline';

const TextChannel = ({ channel, community }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef();
  
  const dispatch = useDispatch();
  const socket = useSocket();
  const user = useSelector(state => state.auth.user);
  
  useEffect(() => {
    if (channel) {
      // Join channel room
      socket.joinChannel(channel._id);
      
      // Load messages from API
      loadMessages();
      
      return () => {
        socket.leaveChannel(channel._id);
      };
    }
  }, [channel, socket]);
  
//   useEffect(() => {
//     // Listen for new messages
//     socket.on('channel-message', (message) => {
//       setMessages(prev => [...prev, message]);
//     });
    
//     // Listen for typing indicators
//     socket.on('channel-typing', ({ userId, isTyping }) => {
//       setTypingUsers(prev => {
//         if (isTyping) {
//           return prev.includes(userId) ? prev : [...prev, userId];
//         } else {
//           return prev.filter(id => id !== userId);
//         }
//       });
//     });
    
//     return () => {
//       socket.off('channel-message');
//       socket.off('channel-typing');
//     };
//   }, [socket]);
  
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);
  
//   const loadMessages = async () => {
//     // API call to load message history
//     // This will be implemented later
//   };
  
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };
  
//   const handleSend = () => {
//     if (input.trim()) {
//       const message = {
//         _id: Date.now().toString(),
//         content: input,
//         sender: user,
//         channelId: channel._id,
//         createdAt: new Date().toISOString()
//       };
      
//       socket.sendChannelMessage(channel._id, message);
//       setInput('');
//     }
//   };
  
//   const handleTyping = (isTyping) => {
//     socket.sendTyping(channel._id, isTyping);
//   };
  
//   return (
//     <div className="flex-1 flex flex-col bg-gray-900">
//       {/* Channel Header */}
//       <div className="h-12 px-4 border-b border-gray-800 flex items-center">
//         <HashtagIcon className="w-5 h-5 text-gray-400 mr-2" />
//         <span className="font-semibold text-white">{channel?.name}</span>
//       </div>
      
//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
//         {messages.map((msg, index) => (
//           <div key={msg._id} className="flex gap-3 mb-4 hover:bg-gray-800 p-2 rounded-lg">
//             <img
//               src={msg.sender?.avatar || '/default-avatar.png'}
//               alt={msg.sender?.name}
//               className="w-10 h-10 rounded-full"
//             />
//             <div className="flex-1">
//               <div className="flex items-center gap-2">
//                 <span className="font-semibold text-white">{msg.sender?.name}</span>
//                 <span className="text-xs text-gray-400">
//                   {format(msg.createdAt)}
//                 </span>
//               </div>
//               <p className="text-gray-300 mt-1">{msg.content}</p>
//             </div>
//           </div>
//         ))}
        
//         {/* Typing indicator */}
//         {typingUsers.length > 0 && (
//           <div className="flex gap-2 items-center text-gray-400 text-sm">
//             <div className="flex gap-1">
//               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
//               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-200" />
//               <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce animation-delay-400" />
//             </div>
//             <span>{typingUsers.length} typing...</span>
//           </div>
//         )}
        
//         <div ref={messagesEndRef} />
//       </div>
      
//       {/* Input */}
//       <div className="p-4 border-t border-gray-800">
//         <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-4 py-2">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onFocus={() => handleTyping(true)}
//             onBlur={() => handleTyping(false)}
//             onKeyPress={(e) => e.key === 'Enter' && handleSend()}
//             placeholder={`Message #${channel?.name}`}
//             className="flex-1 bg-transparent text-white focus:outline-none"
//           />
          
//           <button
//             onClick={() => {/* Open emoji picker */}}
//             className="text-gray-400 hover:text-white"
//           >
//             <FaceSmileIcon className="w-5 h-5" />
//           </button>
          
//           <button
//             onClick={handleSend}
//             disabled={!input.trim()}
//             className={`p-1 rounded ${
//               input.trim() 
//                 ? 'text-primary hover:bg-gray-700' 
//                 : 'text-gray-600 cursor-not-allowed'
//             }`}
//           >
//             <PaperAirplaneIcon className="w-5 h-5" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
};

export default TextChannel;