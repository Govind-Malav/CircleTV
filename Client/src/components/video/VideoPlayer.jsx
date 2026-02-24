import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useDispatch, useSelector } from 'react-redux';
import { likeVideo, dislikeVideo } from '../../store/videoSlice';

const VideoPlayer = ({ video }) => {
  const [playing, setPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [played, setPlayed] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const playerRef = useRef(null);
  
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  
  const handlePlayPause = () => setPlaying(!playing);
  
  const handleVolumeChange = (e) => setVolume(parseFloat(e.target.value));
  
  const handleProgress = (state) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };
  
//   const handleSeekChange = (e) => {
//     setPlayed(parseFloat(e.target.value));
//   };
  
//   const handleSeekMouseDown = () => setSeeking(true);
  
//   const handleSeekMouseUp = (e) => {
//     setSeeking(false);
//     playerRef.current.seekTo(parseFloat(e.target.value));
//   };
  
//   const handleLike = () => dispatch(likeVideo(video._id));
//   const handleDislike = () => dispatch(dislikeVideo(video._id));
  
//   const formatTime = (seconds) => {
//     const date = new Date(seconds * 1000);
//     const hh = date.getUTCHours();
//     const mm = date.getUTCMinutes();
//     const ss = date.getUTCSeconds().toString().padStart(2, '0');
    
//     if (hh) {
//       return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
//     }
//     return `${mm}:${ss}`;
//   };
  
//   return (
//     <div className="relative bg-black aspect-video">
//       <ReactPlayer
//         ref={playerRef}
//         url={video.videoUrl}
//         width="100%"
//         height="100%"
//         playing={playing}
//         volume={volume}
//         onProgress={handleProgress}
//         config={{
//           file: {
//             attributes: {
//               controlsList: 'nodownload'
//             }
//           }
//         }}
//       />
      
//       {/* Custom Controls */}
//       <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
//         {/* Progress bar */}
//         <div className="flex items-center gap-2 mb-2">
//           <span className="text-white text-sm">{formatTime(played * video.duration)}</span>
//           <input
//             type="range"
//             min={0}
//             max={1}
//             step="any"
//             value={played}
//             onMouseDown={handleSeekMouseDown}
//             onMouseUp={handleSeekMouseUp}
//             onChange={handleSeekChange}
//             className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
//           />
//           <span className="text-white text-sm">{formatTime(video.duration)}</span>
//         </div>
        
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button onClick={handlePlayPause} className="text-white text-xl">
//               {playing ? '⏸️' : '▶️'}
//             </button>
            
//             <div className="flex items-center gap-2">
//               <button onClick={handleLike} className="text-white">
//                 👍 {video.likes || 0}
//               </button>
//               <button onClick={handleDislike} className="text-white">
//                 👎 {video.dislikes || 0}
//               </button>
//             </div>
//           </div>
          
//           <div className="flex items-center gap-2">
//             <input
//               type="range"
//               min={0}
//               max={1}
//               step="any"
//               value={volume}
//               onChange={handleVolumeChange}
//               className="w-20 h-1 bg-gray-600 rounded-lg"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
};

export default VideoPlayer;