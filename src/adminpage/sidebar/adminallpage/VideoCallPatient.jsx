// import {
//   Mic,
//   MicOff,
//   Phone,
//   PhoneOff,
//   Settings,
//   Users,
//   Video,
//   VideoOff,
// } from "lucide-react";
// import React, { useEffect, useRef, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { connect } from "twilio-video";

// const VideoCallPatient = () => {
//   const { id: roomParam, name: nameParam } = useParams();
//   const navigate = useNavigate();
//   const [identity, setIdentity] = useState("");
//   const [roomName, setRoomName] = useState("");
//   const [room, setRoom] = useState(null);
//   const [tracks, setTracks] = useState([]);
//   const [remoteTracks, setRemoteTracks] = useState([]);
//   const [isConnecting, setIsConnecting] = useState(false);
//   const [isVideoEnabled, setIsVideoEnabled] = useState(true);
//   const [isAudioEnabled, setIsAudioEnabled] = useState(true);
//   const inputRef = useRef();

//   useEffect(() => {
//     // if (roomParam+1) setRoomName(roomParam+1);
//     if (nameParam) setIdentity(nameParam.replace(/_/g, " "));
//   }, [nameParam]);

//   // useEffect(() => {
//   //   if ( roomName && !room) {
//   //     joinRoom();
//   //   }
//   //   // eslint-disable-next-line
//   // }, [identity, roomName]);
//   const joinRoom = async () => {
//     if (!identity || !roomName) return;

//     setIsConnecting(true);
//     try {
//       const response = await fetch(
//         `https://api.yodoc.co.uk/api/token?identity=${identity}&room=${roomName}`
//       );
//       const data = await response.json();

//       const joinedRoom = await connect(data.accessToken, {
//         name: roomName,
//         audio: isAudioEnabled,
//         video: isVideoEnabled,
//       });

//       // ✅ Local video tracks
//       const localTracks = Array.from(
//         joinedRoom.localParticipant.tracks.values()
//       )
//         .map((p) => p.track)
//         .filter((track) => track && track.kind === "video");
//       setTracks(localTracks);

//       // ✅ Function to subscribe only video tracks
//       const handleTrackSubscribed = (track) => {
//         if (track.kind === "video") {
//           setRemoteTracks((prev) => [...prev, track]);
//         }
//       };

//       const handleTrackUnsubscribed = (track) => {
//         if (track.kind === "video") {
//           setRemoteTracks((prev) => prev.filter((t) => t !== track));
//         }
//       };

//       // ✅ Existing participants
//       joinedRoom.participants.forEach((participant) => {
//         participant.tracks.forEach((publication) => {
//           if (publication.isSubscribed && publication.track.kind === "video") {
//             handleTrackSubscribed(publication.track);
//           }
//         });

//         participant.on("trackSubscribed", handleTrackSubscribed);
//         participant.on("trackUnsubscribed", handleTrackUnsubscribed);
//       });

//       // ✅ New participants
//       joinedRoom.on("participantConnected", (participant) => {
//         participant.on("trackSubscribed", handleTrackSubscribed);
//         participant.on("trackUnsubscribed", handleTrackUnsubscribed);
//       });

//       // ✅ Participant disconnected
//       joinedRoom.on("participantDisconnected", (participant) => {
//         participant.tracks.forEach((publication) => {
//           if (publication.track && publication.track.kind === "video") {
//             handleTrackUnsubscribed(publication.track);
//           }
//         });
//       });

//       setRoom(joinedRoom);
//     } catch (err) {
//       console.error("Error connecting to room:", err);
//     } finally {
//       setIsConnecting(false);
//     }
//   };

//   const leaveRoom = () => {
//     room?.disconnect();
//     setRoom(null);
//     setTracks([]);
//     setRemoteTracks([]);
//     navigate("/");
//   };

//   const toggleVideo = () => {
//     setIsVideoEnabled(!isVideoEnabled);
//     // Add actual video toggle logic here
//   };

//   const toggleAudio = () => {
//     setIsAudioEnabled(!isAudioEnabled);
//     // Add actual audio toggle logic here
//   };

//   return (
//     <>
//       <div className="video-call-app">
//         {!room ? (
//           <div className="lobby-container">
//             <div className="lobby-card">
//               <div className="logo-section">
//                 <div className="logo">
//                   <Video size={32} />
//                 </div>
//                 <h1>Video Call</h1>
//                 <p>Connect with anyone, anywhere</p>
//               </div>

//               <div className="form-section">
//                 <div className="input-group">
//                   <input
//                     ref={inputRef}
//                     placeholder="Your name"
//                     value={identity}
//                     onChange={(e) => setIdentity(e.target.value)}
//                     onClick={() => (inputRef.current.placeholder = "")}
//                     className="form-input"
//                   />
//                 </div>

//                 <div className="input-group">
//                   <input
//                     type="text"
//                     placeholder="Room name"
//                     value={roomName}
//                     onChange={(e) => setRoomName(e.target.value)}
//                     className="form-input"
//                   />
//                 </div>

//                 <div className="media-controls">
//                   <button
//                     className={`media-btn ${
//                       isVideoEnabled ? "active" : "inactive"
//                     }`}
//                     onClick={toggleVideo}
//                   >
//                     {isVideoEnabled ? (
//                       <Video size={20} />
//                     ) : (
//                       <VideoOff size={20} />
//                     )}
//                   </button>
//                   <button
//                     className={`media-btn ${
//                       isAudioEnabled ? "active" : "inactive"
//                     }`}
//                     onClick={toggleAudio}
//                   >
//                     {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
//                   </button>
//                 </div>

//                 <button
//                   disabled={!identity || !roomName || isConnecting}
//                   onClick={joinRoom}
//                   className="join-btn"
//                 >
//                   {isConnecting ? (
//                     <div className="loading-spinner"></div>
//                   ) : (
//                     <>
//                       <Phone size={20} />
//                       Join Room
//                     </>
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className="room-container">
//             <div className="room-header">
//               <div className="room-info">
//                 <h2>{room.localParticipant.identity}</h2>
//                 <div className="participant-count">
//                   <Users size={16} />
//                   <span>{remoteTracks.length + 1} participants</span>
//                 </div>
//               </div>
//               <div className="room-actions">
//                 <button className="settings-btn">
//                   <Settings size={20} />
//                 </button>
//               </div>
//             </div>

//             <div className="video-grid">
//               {/* Local Video */}
//               {/* {tracks.map((track) => (
//                 <div
//                   key={track.sid || track.name}
//                   className="video-item local-video"
//                 >
//                   <VideoTrack key={track.sid || track.name} track={track} />
//                   <div className="video-overlay">
//                     <span className="participant-name">You</span>
//                     <div className="video-controls">
//                       {!isVideoEnabled && <VideoOff size={16} />}
//                       {!isAudioEnabled && <MicOff size={16} />}
//                     </div>
//                   </div>
//                 </div>
//               ))} */}

//               {tracks.map((track) => (
//                 <div
//                   key={track.sid || track.name}
//                   className="video-item local-video"
//                 >
//                   <VideoTrack key={track.sid || track.name} track={track} />
//                 </div>
//               ))}

//               {/* Remote Videos */}
//               {/* {remoteTracks.map((track, index) => (
//                 <div
//                   key={track.sid || track.name}
//                   className="video-item remote-video"
//                 >
//                   <VideoTrack key={track.sid || track.name} track={track} />
//                   <div className="video-overlay">
//                     <span className="participant-name">
//                       Participant {index + 1}
//                     </span>
//                   </div>
//                 </div>
//               ))} */}

//               {remoteTracks.map((track) => (
//                 <div
//                   key={track.sid || track.name}
//                   className="video-item remote-video"
//                 >
//                   <VideoTrack key={track.sid || track.name} track={track} />
//                 </div>
//               ))}

//               {/* Show placeholder if no tracks */}
//               {tracks.length === 0 && remoteTracks.length === 0 && (
//                 <div className="video-item empty-slot">
//                   <div className="empty-content">
//                     <Users size={48} />
//                     <p>Connecting to video...</p>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="call-controls">
//               <button
//                 className={`control-btn ${isAudioEnabled ? "active" : "muted"}`}
//                 onClick={toggleAudio}
//               >
//                 {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
//               </button>

//               <button
//                 className={`control-btn ${isVideoEnabled ? "active" : "muted"}`}
//                 onClick={toggleVideo}
//               >
//                 {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
//               </button>

//               <button className="control-btn end-call" onClick={leaveRoom}>
//                 <PhoneOff size={24} />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         * {
//           box-sizing: border-box;
//           margin: 0;
//           padding: 0;
//         }

//         .video-call-app {
//           min-height: 100vh;
//           background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
//             sans-serif;
//           position: relative;
//           overflow-x: hidden;
//         }

//         /* ======================
//            LOBBY STYLES
//         ====================== */
//         .lobby-container {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           min-height: 100vh;
//           padding: 20px;
//         }

//         .lobby-card {
//           background: rgba(255, 255, 255, 0.95);
//           backdrop-filter: blur(20px);
//           border-radius: 24px;
//           padding: 40px;
//           box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
//           max-width: 400px;
//           width: 100%;
//           text-align: center;
//         }

//         .logo-section {
//           margin-bottom: 32px;
//         }

//         .logo {
//           width: 64px;
//           height: 64px;
//           background: linear-gradient(135deg, #667eea, #764ba2);
//           border-radius: 16px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           margin: 0 auto 16px;
//           color: white;
//         }

//         .lobby-card h1 {
//           font-size: 28px;
//           font-weight: 500;
//           color: #1a1a1a;
//           margin: 0 0 8px;
//         }

//         .lobby-card p {
//           color: #666;
//           font-size: 16px;
//           margin: 0;
//         }

//         .form-section {
//           display: flex;
//           flex-direction: column;
//           gap: 20px;
//         }

//         .input-group {
//           display: flex;
//           flex-direction: column;
//         }

//         .form-input {
//           padding: 16px 20px;
//           border: 2px solid #e1e5e9;
//           border-radius: 12px;
//           font-size: 16px;
//           background: white;
//           transition: all 0.3s ease;
//           outline: none;
//           width: 100%;
//         }

//         .form-input:focus {
//           border-color: #667eea;
//           box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
//         }

//         .media-controls {
//           display: flex;
//           gap: 12px;
//           justify-content: center;
//         }

//         .media-btn {
//           width: 48px;
//           height: 48px;
//           border-radius: 12px;
//           border: none;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: all 0.3s ease;
//         }

//         .media-btn.active {
//           background: #e8f2ff;
//           color: #667eea;
//         }

//         .media-btn.inactive {
//           background: #ffe8e8;
//           color: #e74c3c;
//         }

//         .join-btn {
//           background: linear-gradient(135deg, #667eea, #764ba2);
//           color: white;
//           border: none;
//           padding: 16px 24px;
//           border-radius: 12px;
//           font-size: 16px;
//           font-weight: 600;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 8px;
//           transition: all 0.3s ease;
//           min-height: 56px;
//           width: 100%;
//         }

//         .join-btn:hover:not(:disabled) {
//           transform: translateY(-2px);
//           box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
//         }

//         .join-btn:disabled {
//           opacity: 0.6;
//           cursor: not-allowed;
//         }

//         .loading-spinner {
//           width: 20px;
//           height: 20px;
//           border: 2px solid rgba(255, 255, 255, 0.3);
//           border-radius: 50%;
//           border-top-color: white;
//           animation: spin 1s ease-in-out infinite;
//         }

//         @keyframes spin {
//           to {
//             transform: rotate(360deg);
//           }
//         }

//         /* ======================
//            ROOM STYLES
//         ====================== */
//         .room-container {
//           display: flex;
//           flex-direction: column;
//           height: 100vh;
//           padding: 20px;
//           gap: 20px;
//         }

//         .room-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           background: rgba(255, 255, 255, 0.1);
//           backdrop-filter: blur(20px);
//           padding: 16px 24px;
//           border-radius: 16px;
//           color: white;
//           flex-shrink: 0;
//         }

//         .room-info h2 {
//           margin: 0 0 4px;
//           font-size: 24px;
//           font-weight: 600;
//         }

//         .participant-count {
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 14px;
//           opacity: 0.8;
//         }

//         .settings-btn {
//           background: rgba(255, 255, 255, 0.1);
//           border: none;
//           padding: 12px;
//           border-radius: 12px;
//           color: white;
//           cursor: pointer;
//           transition: all 0.3s ease;
//         }

//         .settings-btn:hover {
//           background: rgba(255, 255, 255, 0.2);
//         }

//         .video-grid {
//           flex: 1;
//           display: grid;
//           grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
//           gap: 16px;
//           min-height: 0;
//           overflow-y: auto;
//         }

//         .video-item {
//           position: relative;
//           background: #1a1a1a;
//           border-radius: 16px;
//           overflow: hidden;
//           min-height: 200px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .video-item video {
//           width: 100%;
//           height: 100%;
//           object-fit: cover;
//         }

//         .local-video {
//           border: 3px solid #667eea;
//         }

//         .remote-video {
//           border: 3px solid rgba(255, 255, 255, 0.2);
//         }

//         .empty-slot {
//           background: rgba(255, 255, 255, 0.05);
//           border: 2px dashed rgba(255, 255, 255, 0.2);
//         }

//         .empty-content {
//           text-align: center;
//           color: rgba(255, 255, 255, 0.5);
//         }

//         .empty-content p {
//           margin: 12px 0 0;
//           font-size: 14px;
//         }

//         .video-overlay {
//           position: absolute;
//           bottom: 12px;
//           left: 12px;
//           right: 12px;
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           background: rgba(0, 0, 0, 0.6);
//           backdrop-filter: blur(10px);
//           padding: 8px 12px;
//           border-radius: 8px;
//           color: white;
//           font-size: 14px;
//           font-weight: 500;
//         }

//         .video-controls {
//           display: flex;
//           gap: 8px;
//         }

//         .call-controls {
//           display: flex;
//           justify-content: center;
//           gap: 16px;
//           padding: 20px;
//           background: rgba(255, 255, 255, 0.1);
//           backdrop-filter: blur(20px);
//           border-radius: 16px;
//           flex-shrink: 0;
//         }

//         .control-btn {
//           width: 56px;
//           height: 56px;
//           border-radius: 50%;
//           border: none;
//           cursor: pointer;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: all 0.3s ease;
//           color: white;
//         }

//         .control-btn.active {
//           background: rgba(255, 255, 255, 0.2);
//         }

//         .control-btn.muted {
//           background: rgba(231, 76, 60, 0.8);
//         }

//         .control-btn.end-call {
//           background: #e74c3c;
//         }

//         .control-btn:hover {
//           transform: scale(1.1);
//         }

//         /* ======================
//            TABLET RESPONSIVE
//         ====================== */
//         @media (max-width: 1024px) {
//           .video-grid {
//             grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
//           }

//           .room-container {
//             padding: 16px;
//           }
//         }

//         /* ======================
//            MOBILE RESPONSIVE
//         ====================== */
//         @media (max-width: 768px) {
//           .room-container {
//             padding: 12px;
//             gap: 12px;
//           }

//           .video-grid {
//             grid-template-columns: 1fr;
//             gap: 12px;
//           }

//           .video-item {
//             min-height: 220px;
//           }

//           .room-header {
//             padding: 12px 16px;
//             flex-wrap: wrap;
//             gap: 8px;
//           }

//           .room-info h2 {
//             font-size: 20px;
//           }

//           .call-controls {
//             padding: 16px;
//             gap: 12px;
//           }

//           .control-btn {
//             width: 52px;
//             height: 52px;
//           }

//           .lobby-card {
//             padding: 32px 24px;
//             margin: 12px;
//             max-width: 350px;
//           }

//           .logo {
//             width: 56px;
//             height: 56px;
//           }

//           .lobby-card h1 {
//             font-size: 24px;
//           }
//         }

//         /* ======================
//            SMALL MOBILE RESPONSIVE
//         ====================== */
//         @media (max-width: 480px) {
//           .room-container {
//             padding: 8px;
//             gap: 8px;
//           }

//           .video-grid {
//             gap: 8px;
//           }

//           .video-item {
//             min-height: 180px;
//           }

//           .room-header {
//             padding: 8px 12px;
//           }

//           .room-info h2 {
//             font-size: 18px;
//           }

//           .call-controls {
//             padding: 12px;
//             gap: 8px;
//           }

//           .control-btn {
//             width: 48px;
//             height: 48px;
//           }

//           .lobby-card {
//             padding: 24px 16px;
//             margin: 8px;
//             border-radius: 20px;
//           }

//           .form-input {
//             padding: 14px 16px;
//             font-size: 16px;
//           }

//           .join-btn {
//             padding: 14px 20px;
//             font-size: 15px;
//             min-height: 52px;
//           }

//           .media-btn {
//             width: 44px;
//             height: 44px;
//           }

//           .video-overlay {
//             bottom: 8px;
//             left: 8px;
//             right: 8px;
//             padding: 6px 10px;
//             font-size: 13px;
//           }
//         }

//         /* ======================
//            LANDSCAPE MOBILE
//         ====================== */
//         @media (max-width: 768px) and (orientation: landscape) {
//           .room-container {
//             padding: 8px;
//           }

//           .room-header {
//             padding: 8px 16px;
//           }

//           .video-grid {
//             grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
//           }

//           .video-item {
//             min-height: 140px;
//           }

//           .call-controls {
//             padding: 8px 16px;
//           }
//         }

//         /* ======================
//            ULTRA WIDE SCREENS
//         ====================== */
//         @media (min-width: 1440px) {
//           .video-grid {
//             grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
//             max-width: 1200px;
//             margin: 0 auto;
//           }

//           .room-container {
//             max-width: 1400px;
//             margin: 0 auto;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// const VideoTrack = ({ track }) => {
//   const ref = useRef();

//   useEffect(() => {
//     if (track && ref.current) {
//       const element = track.attach();
//       ref.current.appendChild(element);

//       return () => {
//         track.detach().forEach((el) => el.remove());
//       };
//     }
//   }, [track]);

//   return <div ref={ref} />;
// };

// export default VideoCallPatient;

import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Settings,
  Users,
  Video,
  VideoOff,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { connect } from "twilio-video";

const VideoCallPatient = () => {
  const {
    id: roomParam,
    name: nameParam,
    slot_id: slotID,
    appt_id: appt_id,
  } = useParams();
  const navigate = useNavigate();
  const [identity, setIdentity] = useState("");
  const [roomName, setRoomName] = useState(`${slotID}`);
  const [room, setRoom] = useState(null);
  const [localTracks, setLocalTracks] = useState([]);
  const [remoteTracks, setRemoteTracks] = useState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const inputRef = useRef();

  useEffect(() => {
    if (nameParam) setIdentity(nameParam.replace(/_/g, " "));
  }, [nameParam]);

  const joinRoom = async () => {
    if (!identity || !roomName) return;

    setIsConnecting(true);
    try {
      const response = await fetch(
        `https://api.yodoc.co.uk/api/token?identity=${identity}&room=${roomName}`
      );
      const data = await response.json();

      const joinedRoom = await connect(data.accessToken, {
        name: roomName,
        audio: isAudioEnabled,
        video: isVideoEnabled,
      });

      // Local video/audio tracks
      const tracks = Array.from(joinedRoom.localParticipant.tracks.values())
        .map((p) => p.track)
        .filter(Boolean);
      setLocalTracks(tracks);

      // Function to add a remote track
      const handleTrackSubscribed = (track) => {
        setRemoteTracks((prev) => [...prev, track]);
      };

      // Function to remove a remote track
      const handleTrackUnsubscribed = (track) => {
        setRemoteTracks((prev) => prev.filter((t) => t !== track));
      };

      // Existing participants
      joinedRoom.participants.forEach((participant) => {
        participant.tracks.forEach((publication) => {
          if (publication.isSubscribed && publication.track) {
            handleTrackSubscribed(publication.track);
          }
        });

        participant.on("trackSubscribed", handleTrackSubscribed);
        participant.on("trackUnsubscribed", handleTrackUnsubscribed);
      });

      // New participants
      joinedRoom.on("participantConnected", (participant) => {
        participant.on("trackSubscribed", handleTrackSubscribed);
        participant.on("trackUnsubscribed", handleTrackUnsubscribed);
      });

      // Participant disconnected
      joinedRoom.on("participantDisconnected", (participant) => {
        participant.tracks.forEach((publication) => {
          if (publication.track) handleTrackUnsubscribed(publication.track);
        });
      });

      setRoom(joinedRoom);
    } catch (err) {
      console.error("Error connecting to room:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const leaveRoom = () => {
    room?.disconnect();
    setRoom(null);
    setLocalTracks([]);
    setRemoteTracks([]);

    // Swal.fire({
    //   title: "Do you want to continue for next week?",
    //   icon: "question",
    //   showCancelButton: true,
    //   confirmButtonText: "Yes",
    //   cancelButtonText: "No",
    //   reverseButtons: true,
    // }).then((result) => {
    //   navigate("/admin/appointments");
    // });
    navigate("/");
  };

  const toggleVideo = () => {
    if (!room) return;
    room.localParticipant.videoTracks.forEach((pub) =>
      pub.track.enable(!isVideoEnabled)
    );
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = () => {
    if (!room) return;
    room.localParticipant.audioTracks.forEach((pub) =>
      pub.track.enable(!isAudioEnabled)
    );
    setIsAudioEnabled(!isAudioEnabled);
  };

  return (
    <>
      <div className="video-call-app">
        {!room ? (
          <Lobby
            identity={identity}
            setIdentity={setIdentity}
            roomName={roomName}
            setRoomName={setRoomName}
            joinRoom={joinRoom}
            isConnecting={isConnecting}
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
            inputRef={inputRef}
          />
        ) : (
          <Room
            room={room}
            localTracks={localTracks}
            remoteTracks={remoteTracks}
            isVideoEnabled={isVideoEnabled}
            isAudioEnabled={isAudioEnabled}
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
            leaveRoom={leaveRoom}
          />
        )}
      </div>

      <style jsx>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .video-call-app {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* ======================
                   LOBBY STYLES
                ====================== */
        .lobby-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
        }

        .lobby-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 40px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
          text-align: center;
        }

        .logo-section {
          margin-bottom: 32px;
        }

        .logo {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
          color: white;
        }

        .lobby-card h1 {
          font-size: 28px;
          font-weight: 500;
          color: #1a1a1a;
          margin: 0 0 8px;
        }

        .lobby-card p {
          color: #666;
          font-size: 16px;
          margin: 0;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .input-group {
          display: flex;
          flex-direction: column;
        }

        .form-input {
          padding: 16px 20px;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          font-size: 16px;
          background: white;
          transition: all 0.3s ease;
          outline: none;
          width: 100%;
        }

        .form-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .media-controls {
          display: flex;
          gap: 12px;
          justify-content: center;
        }

        .media-btn {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .media-btn.active {
          background: #e8f2ff;
          color: #667eea;
        }

        .media-btn.inactive {
          background: #ffe8e8;
          color: #e74c3c;
        }

        .join-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          padding: 16px 24px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
          min-height: 56px;
          width: 100%;
        }

        .join-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .join-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ======================
                   ROOM STYLES
                ====================== */
        .room-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          padding: 20px;
          gap: 20px;
        }

        .room-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          padding: 16px 24px;
          border-radius: 16px;
          color: white;
          flex-shrink: 0;
        }

        .room-info h2 {
          margin: 0 0 4px;
          font-size: 24px;
          font-weight: 600;
        }

        .participant-count {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          opacity: 0.8;
        }

        .settings-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          padding: 12px;
          border-radius: 12px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .settings-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .video-grid {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          min-height: 0;
          overflow-y: auto;
        }

        .video-item {
          position: relative;
          background: #1a1a1a;
          border-radius: 16px;
          overflow: hidden;
          min-height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .video-item video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .local-video {
          border: 3px solid #667eea;
        }

        .remote-video {
          border: 3px solid rgba(255, 255, 255, 0.2);
        }

        .empty-slot {
          background: rgba(255, 255, 255, 0.05);
          border: 2px dashed rgba(255, 255, 255, 0.2);
        }

        .empty-content {
          text-align: center;
          color: rgba(255, 255, 255, 0.5);
        }

        .empty-content p {
          margin: 12px 0 0;
          font-size: 14px;
        }

        .video-overlay {
          position: absolute;
          bottom: 12px;
          left: 12px;
          right: 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          padding: 8px 12px;
          border-radius: 8px;
          color: white;
          font-size: 14px;
          font-weight: 500;
        }

        .video-controls {
          display: flex;
          gap: 8px;
        }

        .call-controls {
          display: flex;
          justify-content: center;
          gap: 16px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          flex-shrink: 0;
        }

        .control-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          color: white;
        }

        .control-btn.active {
          background: rgba(255, 255, 255, 0.2);
        }

        .control-btn.muted {
          background: rgba(231, 76, 60, 0.8);
        }

        .control-btn.end-call {
          background: #e74c3c;
        }

        .control-btn:hover {
          transform: scale(1.1);
        }

        /* ======================
                   TABLET RESPONSIVE
                ====================== */
        @media (max-width: 1024px) {
          .video-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          }

          .room-container {
            padding: 16px;
          }
        }

        /* ======================
                   MOBILE RESPONSIVE
                ====================== */
        @media (max-width: 768px) {
          .room-container {
            padding: 12px;
            gap: 12px;
          }

          .video-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .video-item {
            min-height: 220px;
          }

          .room-header {
            padding: 12px 16px;
            flex-wrap: wrap;
            gap: 8px;
          }

          .room-info h2 {
            font-size: 20px;
          }

          .call-controls {
            padding: 16px;
            gap: 12px;
          }

          .control-btn {
            width: 52px;
            height: 52px;
          }

          .lobby-card {
            padding: 32px 24px;
            margin: 12px;
            max-width: 350px;
          }

          .logo {
            width: 56px;
            height: 56px;
          }

          .lobby-card h1 {
            font-size: 24px;
          }
        }

        /* ======================
                   SMALL MOBILE RESPONSIVE
                ====================== */
        @media (max-width: 480px) {
          .room-container {
            padding: 8px;
            gap: 8px;
          }

          .video-grid {
            gap: 8px;
          }

          .video-item {
            min-height: 180px;
          }

          .room-header {
            padding: 8px 12px;
          }

          .room-info h2 {
            font-size: 18px;
          }

          .call-controls {
            padding: 12px;
            gap: 8px;
          }

          .control-btn {
            width: 48px;
            height: 48px;
          }

          .lobby-card {
            padding: 24px 16px;
            margin: 8px;
            border-radius: 20px;
          }

          .form-input {
            padding: 14px 16px;
            font-size: 16px;
          }

          .join-btn {
            padding: 14px 20px;
            font-size: 15px;
            min-height: 52px;
          }

          .media-btn {
            width: 44px;
            height: 44px;
          }

          .video-overlay {
            bottom: 8px;
            left: 8px;
            right: 8px;
            padding: 6px 10px;
            font-size: 13px;
          }
        }

        /* ======================
                   LANDSCAPE MOBILE
                ====================== */
        @media (max-width: 768px) and (orientation: landscape) {
          .room-container {
            padding: 8px;
          }

          .room-header {
            padding: 8px 16px;
          }

          .video-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          }

          .video-item {
            min-height: 140px;
          }

          .call-controls {
            padding: 8px 16px;
          }
        }

        /* ======================
                   ULTRA WIDE SCREENS
                ====================== */
        @media (min-width: 1440px) {
          .video-grid {
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            max-width: 1200px;
            margin: 0 auto;
          }

          .room-container {
            max-width: 1400px;
            margin: 0 auto;
          }
        }
      `}</style>
    </>
  );
};

// LOBBY COMPONENT
const Lobby = ({
  identity,
  setIdentity,
  roomName,
  setRoomName,
  joinRoom,
  isConnecting,
  isVideoEnabled,
  isAudioEnabled,
  toggleVideo,
  toggleAudio,
  inputRef,
}) => (
  <div className="lobby-container">
    <div className="lobby-card">
      <div className="logo-section">
        <div className="logo">
          <Video size={32} />
        </div>
        <h1>Video Call</h1>
        <p>Connect with anyone, anywhere</p>
      </div>
      <div className="form-section">
        <input
          ref={inputRef}
          placeholder="Your name"
          value={identity}
          onChange={(e) => setIdentity(e.target.value)}
          className="form-input"
          disabled
        />
        <input
          placeholder="Room name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="form-input"
          disabled
        />
        <div className="media-controls">
          <button
            className={`media-btn ${isVideoEnabled ? "active" : "inactive"}`}
            onClick={toggleVideo}
          >
            {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
          </button>
          <button
            className={`media-btn ${isAudioEnabled ? "active" : "inactive"}`}
            onClick={toggleAudio}
          >
            {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>
        </div>
        <button
          disabled={!identity || !roomName || isConnecting}
          onClick={joinRoom}
          className="join-btn"
        >
          {isConnecting ? <div className="loading-spinner"></div> : <>Join</>}
        </button>
      </div>
    </div>
  </div>
);

// ROOM COMPONENT
const Room = ({
  room,
  localTracks,
  remoteTracks,
  isVideoEnabled,
  isAudioEnabled,
  toggleVideo,
  toggleAudio,
  leaveRoom,
}) => (
  <div className="room-container">
    <div className="room-header">
      <div className="room-info">
        <h2>{room.localParticipant.identity}</h2>
        <div className="participant-count">
          <Users size={16} />
          <span>{remoteTracks.length} participants</span>
        </div>
      </div>
      <div className="room-actions">
        <button className="settings-btn">
          <Settings size={20} />
        </button>
      </div>
    </div>

    <div className="video-grid">
      {localTracks
        .filter((t) => t.kind === "video")
        .map((track) => (
          <VideoTrack key={track.sid || track.name} track={track} />
        ))}

      {remoteTracks
        .filter((t) => t.kind === "video")
        .map((track) => (
          <VideoTrack key={track.sid || track.name} track={track} />
        ))}

      {remoteTracks
        .filter((t) => t.kind === "audio")
        .map((track) => (
          <AudioTrack key={track.sid || track.name} track={track} />
        ))}
    </div>

    <div className="call-controls">
      <button
        className={`control-btn ${isAudioEnabled ? "active" : "muted"}`}
        onClick={toggleAudio}
      >
        {isAudioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
      </button>

      <button
        className={`control-btn ${isVideoEnabled ? "active" : "muted"}`}
        onClick={toggleVideo}
      >
        {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
      </button>

      <button className="control-btn end-call" onClick={leaveRoom}>
        <PhoneOff size={24} />
      </button>
    </div>
  </div>
);

const VideoTrack = ({ track }) => {
  const ref = useRef();

  useEffect(() => {
    if (track && ref.current) {
      const el = track.attach();
      ref.current.appendChild(el);
      return () => {
        track.detach().forEach((e) => e.remove());
      };
    }
  }, [track]);

  return <div ref={ref} className="video-item" />;
};

const AudioTrack = ({ track }) => {
  const ref = useRef();

  useEffect(() => {
    if (track && ref.current) {
      const el = track.attach();
      el.autoplay = true;
      el.muted = false;
      ref.current.appendChild(el);
      return () => {
        track.detach().forEach((e) => e.remove());
      };
    }
  }, [track]);

  return <div ref={ref} style={{ display: "none" }} />;
};

export default VideoCallPatient;
