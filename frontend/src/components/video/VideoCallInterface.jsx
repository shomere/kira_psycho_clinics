// src/components/video/VideoCallInterface.jsx
import React, { useEffect, useRef } from 'react';
import { useVideo } from '../../context/VideoContext';
import './VideoCallInterface.css';

function VideoCallInterface({ roomUrl, onLeave }) {
  const videoRef = useRef(null);
  const { currentCall, leaveVideoCall, callState } = useVideo();

  useEffect(() => {
    // In real implementation, this would initialize Daily.co call frame
    console.log('Initializing video call for:', roomUrl);
    
    // Simulate video call
    const timer = setTimeout(() => {
      if (videoRef.current) {
        // In real app, this would be the Daily.co video frame
        console.log('Video call active');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [roomUrl]);

  const handleLeaveCall = () => {
    leaveVideoCall();
    onLeave?.();
  };

  return (
    <div className="video-call-interface">
      {/* Video Header */}
      <div className="video-header">
        <div className="call-info">
          <h3>Therapy Session</h3>
          <div className="call-duration">00:00</div>
        </div>
        <div className="call-controls">
          <button className="control-btn mute">
            🎤
          </button>
          <button className="control-btn video">
            📹
          </button>
          <button className="control-btn share">
            📺
          </button>
          <button 
            className="control-btn leave"
            onClick={handleLeaveCall}
          >
            📞
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div className="video-container">
        {/* Local Video */}
        <div className="video-participant local">
          <div className="video-placeholder">
            <div className="video-feed">
              <div className="video-overlay">
                <div className="user-avatar">You</div>
                <div className="user-name">You</div>
              </div>
            </div>
            <div className="participant-controls">
              <span className="status-indicator">● Live</span>
            </div>
          </div>
        </div>

        {/* Remote Video */}
        <div className="video-participant remote">
          <div className="video-placeholder">
            <div className="video-feed">
              <div className="video-overlay">
                <div className="user-avatar">Therapist</div>
                <div className="user-name">Dr. Sarah Johnson</div>
              </div>
            </div>
            <div className="participant-controls">
              <span className="status-indicator">● Live</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Sidebar (optional) */}
      <div className="video-chat-sidebar">
        <div className="chat-header">
          <h4>Session Chat</h4>
        </div>
        <div className="chat-messages">
          <div className="system-message">
            Video session started. Please ensure you're in a private location.
          </div>
        </div>
        <div className="chat-input">
          <input 
            type="text" 
            placeholder="Type a message..."
            className="message-input"
          />
          <button className="send-btn">Send</button>
        </div>
      </div>
    </div>
  );
}

export default VideoCallInterface;
