// src/context/VideoContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { useAuth } from './AuthContext';

const VideoContext = createContext();

export function useVideo() {
  return useContext(VideoContext);
}

export function VideoProvider({ children }) {
  const [currentCall, setCurrentCall] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [callState, setCallState] = useState('idle'); // idle, joining, in-call, left
  const { currentUser } = useAuth();

  const createVideoRoom = async (appointmentId, therapistName) => {
    try {
      const roomName = `kira-${appointmentId}-${Date.now()}`;
      
      // In production, this would call your backend to create a Daily.co room
      const roomData = {
        name: roomName,
        privacy: 'private',
        properties: {
          start_audio_off: false,
          start_video_off: false,
          enable_chat: true,
          enable_prejoin_ui: true,
          exp: Math.round(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
        }
      };

      // For demo, we'll simulate room creation
      console.log('Creating video room:', roomData);
      
      return {
        url: `https://kira-psycho-clinics.daily.co/${roomName}`,
        name: roomName
      };
    } catch (error) {
      console.error('Failed to create video room:', error);
      throw error;
    }
  };

  const joinVideoCall = async (roomUrl) => {
    setIsJoining(true);
    setCallState('joining');
    
    try {
      // Simulate joining process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCurrentCall({
        url: roomUrl,
        joinedAt: new Date().toISOString()
      });
      setCallState('in-call');
      
      return true;
    } catch (error) {
      console.error('Failed to join video call:', error);
      setCallState('idle');
      throw error;
    } finally {
      setIsJoining(false);
    }
  };

  const leaveVideoCall = () => {
    setCurrentCall(null);
    setCallState('left');
    // In real implementation, you'd also call Daily.co to leave the call
  };

  const value = {
    currentCall,
    isJoining,
    callState,
    createVideoRoom,
    joinVideoCall,
    leaveVideoCall
  };

  return (
    <VideoContext.Provider value={value}>
      {children}
    </VideoContext.Provider>
  );
}
