import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import { useVideo } from '../context/VideoContext';
import api from '../services/api';
import ChatInterface from '../components/chat/ChatInterface';
import ChatList from '../components/chat/ChatList';
import VideoCallInterface from '../components/video/VideoCallInterface';
import './Dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const { currentUser, logout } = useAuth();
  const { activeChat, setActiveChat, allChats } = useChat();
  const { currentCall, joinVideoCall, leaveVideoCall, isJoining } = useVideo();
  
  // Add video state
  const [selectedChat, setSelectedChat] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // State for real data
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Mock data fallback
  const mockUpcomingAppointments = [
    {
      appointment_id: 1,
      therapist: 'Dr. Sarah Johnson',
      therapist_id: 2,
      scheduled_time: '2024-03-15T14:00:00Z',
      duration_minutes: 60,
      session_type: 'Video Session',
      status: 'confirmed',
      room_url: 'https://kira-psycho-clinics.daily.co/session-123'
    },
    {
      appointment_id: 2,
      therapist: 'Dr. Michael Chen',
      therapist_id: 3,
      scheduled_time: '2024-03-20T10:30:00Z',
      duration_minutes: 45,
      session_type: 'In-Person',
      status: 'confirmed'
    }
  ];

  const mockAppointmentHistory = [
    {
      appointment_id: 3,
      therapist: 'Dr. Emily Rodriguez',
      scheduled_time: '2024-02-10T09:00:00Z',
      duration_minutes: 60,
      session_type: 'Video Session',
      status: 'completed'
    }
  ];

  const mockJournalEntries = [
    {
      id: 1,
      date: '2024-03-10',
      title: 'Progress Reflection',
      preview: 'Feeling more positive about the coping strategies...',
      mood: '😊'
    }
  ];

  // Helper function to handle API errors
  const handleApiError = (error) => {
    console.error('API Error:', error);
    
    if (error.message.includes('401') || error.message.includes('Authentication')) {
      // Token expired, redirect to login
      logout();
      return true;
    }
    
    setError('Unable to load appointments. Showing demo data.');
    return false;
  };

  // Format appointment data for display
  const formatAppointmentForDisplay = (appointment) => {
    const date = new Date(appointment.scheduled_time || appointment.date);
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    return {
      id: appointment.appointment_id || appointment.id,
      therapist: appointment.therapist || appointment.therapist_name || 'Unknown Therapist',
      therapistId: appointment.therapist_id || appointment.therapistId,
      date: formattedDate,
      time: formattedTime,
      duration: `${appointment.duration_minutes || appointment.duration} min`,
      type: appointment.session_type || appointment.type || 'Session',
      status: appointment.status || 'scheduled',
      roomUrl: appointment.room_url || appointment.roomUrl
    };
  };

  // Fetch user appointments from API
  useEffect(() => {
    const fetchUserAppointments = async () => {
      console.log('Fetching appointments for user:', currentUser);
      console.log('API URL:', import.meta.env.VITE_API_URL);
      
      if (!currentUser || !currentUser.user_id) {
        console.warn('No user data found, using mock data');
        setError('User not authenticated. Showing demo data.');
        setUpcomingAppointments(mockUpcomingAppointments);
        setAppointmentHistory(mockAppointmentHistory);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError('');

      try {
        // Get token for debugging
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token);
        
        // FIX: Pass user ID to the API call
        const response = await api.getUserAppointments(currentUser.user_id);
        console.log('API Response:', response);
        
        // Handle different response structures
        let appointments = [];
        if (response && response.appointments) {
          appointments = response.appointments;
        } else if (Array.isArray(response)) {
          appointments = response;
        } else if (response && response.data) {
          appointments = response.data;
        }
        
        console.log('Processed appointments:', appointments);
        
        const now = new Date();
        const upcoming = appointments
          .filter(apt => {
            const appointmentDate = new Date(apt.scheduled_time || apt.date);
            return appointmentDate >= now && apt.status !== 'cancelled';
          })
          .map(formatAppointmentForDisplay);
        
        const history = appointments
          .filter(apt => {
            const appointmentDate = new Date(apt.scheduled_time || apt.date);
            return appointmentDate < now || apt.status === 'completed';
          })
          .map(formatAppointmentForDisplay);
        
        console.log('Upcoming appointments:', upcoming);
        console.log('History appointments:', history);
        
        setUpcomingAppointments(upcoming.length > 0 ? upcoming : mockUpcomingAppointments.map(formatAppointmentForDisplay));
        setAppointmentHistory(history.length > 0 ? history : mockAppointmentHistory.map(formatAppointmentForDisplay));
        
      } catch (error) {
        console.error('Error fetching appointments:', error);
        if (!handleApiError(error)) {
          setError('Unable to load appointments. Showing demo data.');
          setUpcomingAppointments(mockUpcomingAppointments.map(formatAppointmentForDisplay));
          setAppointmentHistory(mockAppointmentHistory.map(formatAppointmentForDisplay));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserAppointments();
  }, [currentUser]);

  // Handle chat selection
  const handleSelectChat = (chatId, user) => {
    setSelectedChat(chatId);
    setSelectedUser(user);
    setActiveChat(chatId);
    setShowChat(true);
  };

  // Handle starting new chat from appointment
  const handleStartChat = (therapistId, therapistName) => {
    const chatId = `chat-${therapistId}`;
    const user = {
      id: therapistId,
      name: therapistName,
      type: 'therapist'
    };
    handleSelectChat(chatId, user);
    setActiveTab('messages');
  };

  // Handle joining video session
  const handleJoinVideoSession = async (appointment) => {
    setSelectedAppointment(appointment);
    
    try {
      if (appointment.roomUrl) {
        // Join existing video room
        await joinVideoCall(appointment.roomUrl);
        setShowVideoModal(true);
      } else {
        // For appointments without room URLs, show join modal
        setShowVideoModal(true);
      }
    } catch (error) {
      console.error('Error joining video session:', error);
      setError('Failed to join video session. Please try again.');
    }
  };

  // Handle leaving video session
  const handleLeaveVideoSession = () => {
    leaveVideoCall();
    setShowVideoModal(false);
    setSelectedAppointment(null);
  };

  // Check if appointment is happening now (for demo purposes)
  const isAppointmentHappeningNow = (appointment) => {
    // For demo, assume all upcoming appointments are happening
    return upcomingAppointments.includes(appointment);
  };

  // Use real user data from AuthContext
  const userData = currentUser || {
    name: 'Guest User',
    email: 'guest@example.com',
    memberSince: 'Unknown',
    userType: 'patient'
  };

  const journalEntries = mockJournalEntries;

  // Show loading state
  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="container">
          <div className="loading">Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Video Call Modal */}
      {showVideoModal && (
        <div className="video-modal-overlay">
          <div className="video-modal">
            <div className="video-modal-header">
              <h2>Join Video Session</h2>
              <button 
                className="close-btn"
                onClick={() => setShowVideoModal(false)}
              >
                ×
              </button>
            </div>
            
            <div className="video-modal-content">
              {currentCall ? (
                <VideoCallInterface 
                  roomUrl={currentCall.url}
                  onLeave={handleLeaveVideoSession}
                />
              ) : (
                <div className="video-join-section">
                  <div className="session-info">
                    <h3>Session with {selectedAppointment?.therapist}</h3>
                    <p>Date: {selectedAppointment?.date} at {selectedAppointment?.time}</p>
                    <p>Duration: {selectedAppointment?.duration}</p>
                  </div>
                  
                  <div className="video-join-options">
                    <button 
                      className="btn btn-primary btn-large"
                      onClick={() => handleJoinVideoSession(selectedAppointment)}
                      disabled={isJoining}
                    >
                      {isJoining ? 'Joining...' : 'Join Video Session'}
                    </button>
                    
                    <button 
                      className="btn btn-outline"
                      onClick={() => setShowVideoModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                  
                  <div className="video-tips">
                    <h4>Before joining:</h4>
                    <ul>
                      <li>✓ Ensure you're in a quiet, private space</li>
                      <li>✓ Test your microphone and camera</li>
                      <li>✓ Use a stable internet connection</li>
                      <li>✓ Close unnecessary applications</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="welcome-section">
              <h1>Welcome back, {userData.name}!</h1>
              <p>Here's your mental wellness overview</p>
            </div>
            <div className="user-info">
              <div className="user-avatar">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="user-details">
                <span className="user-name">{userData.name}</span>
                <span className="user-email">{userData.email}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-nav">
        <div className="container">
          <div className="nav-tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
              onClick={() => setActiveTab('appointments')}
            >
              Appointments
            </button>
            <button 
              className={`tab ${activeTab === 'messages' ? 'active' : ''}`}
              onClick={() => setActiveTab('messages')}
            >
              Messages
            </button>
            <button 
              className={`tab ${activeTab === 'journal' ? 'active' : ''}`}
              onClick={() => setActiveTab('journal')}
            >
              Journal
            </button>
            <button 
              className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-content">
        <div className="container">
          {error && (
            <div className="error-banner">
              ⚠️ {error}
            </div>
          )}

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-info">
                    <h3>Upcoming Sessions</h3>
                    <p className="stat-number">{upcomingAppointments.length}</p>
                    <p className="stat-desc">Next: {upcomingAppointments[0]?.date || 'No upcoming sessions'}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>Completed Sessions</h3>
                    <p className="stat-number">{appointmentHistory.length}</p>
                    <p className="stat-desc">Total sessions attended</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📝</div>
                  <div className="stat-info">
                    <h3>Journal Entries</h3>
                    <p className="stat-number">{journalEntries.length}</p>
                    <p className="stat-desc">Your reflections</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🎥</div>
                  <div className="stat-info">
                    <h3>Video Sessions</h3>
                    <p className="stat-number">
                      {upcomingAppointments.filter(apt => apt.type === 'Video Session').length}
                    </p>
                    <p className="stat-desc">Scheduled video calls</p>
                  </div>
                </div>
              </div>

              <div className="overview-grid">
                {/* Upcoming Appointments */}
                <div className="overview-section">
                  <div className="section-header">
                    <h2>Upcoming Appointments</h2>
                    <Link to="/therapists" className="view-all">Book New</Link>
                  </div>
                  <div className="appointments-list">
                    {upcomingAppointments.map(appointment => (
                      <div key={appointment.id} className="appointment-item">
                        <div className="appointment-info">
                          <h4>{appointment.therapist}</h4>
                          <p>{appointment.date} {appointment.time && `at ${appointment.time}`}</p>
                          <span className="appointment-type">{appointment.type}</span>
                          {isAppointmentHappeningNow(appointment) && (
                            <span className="live-indicator">● Live Now</span>
                          )}
                        </div>
                        <div className="appointment-actions">
                          <button 
                            className="btn btn-outline btn-small"
                            onClick={() => handleStartChat(appointment.therapistId, appointment.therapist)}
                          >
                            Message
                          </button>
                          {appointment.type === 'Video Session' && (
                            <button 
                              className="btn btn-primary btn-small"
                              onClick={() => handleJoinVideoSession(appointment)}
                            >
                              Join Video
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {upcomingAppointments.length === 0 && (
                      <div className="no-appointments">
                        <p>No upcoming appointments</p>
                        <Link to="/therapists" className="btn btn-primary">Book Your First Session</Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Messages Preview */}
                <div className="overview-section">
                  <div className="section-header">
                    <h2>Recent Messages</h2>
                    <button 
                      className="view-all" 
                      onClick={() => setActiveTab('messages')}
                    >
                      View All
                    </button>
                  </div>
                  <div className="messages-preview">
                    {allChats.slice(0, 3).map(chat => (
                      <div 
                        key={chat.id} 
                        className="message-preview-item"
                        onClick={() => handleSelectChat(chat.id, chat.otherUser)}
                      >
                        <div className="message-avatar">
                          {chat.otherUser?.name?.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="message-preview-content">
                          <h4>{chat.otherUser?.name}</h4>
                          <p>{chat.lastMessage?.content || chat.lastMessage}</p>
                        </div>
                        {chat.unread > 0 && (
                          <div className="preview-unread">{chat.unread}</div>
                        )}
                      </div>
                    ))}
                    {allChats.length === 0 && (
                      <div className="no-messages">
                        <p>No messages yet</p>
                        <p className="text-muted">Start a conversation with your therapist</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="appointments-tab">
              <h2>Your Appointments</h2>
              <div className="appointments-full">
                {[...upcomingAppointments, ...appointmentHistory].map(appointment => (
                  <div key={appointment.id} className="appointment-full-item">
                    <div className="appointment-main">
                      <h3>{appointment.therapist}</h3>
                      <p>{appointment.date} • {appointment.duration}</p>
                      <span className={`status ${appointment.status}`}>
                        {appointment.status}
                      </span>
                      {appointment.type === 'Video Session' && (
                        <span className="video-badge">🎥 Video</span>
                      )}
                    </div>
                    <div className="appointment-details">
                      <span className="type">{appointment.type}</span>
                      {appointment.time && <span className="time">{appointment.time}</span>}
                      {appointment.therapistId && (
                        <button 
                          className="btn btn-outline btn-small"
                          onClick={() => handleStartChat(appointment.therapistId, appointment.therapist)}
                        >
                          Message
                        </button>
                      )}
                      {appointment.type === 'Video Session' && appointment.status === 'confirmed' && (
                        <button 
                          className="btn btn-primary btn-small"
                          onClick={() => handleJoinVideoSession(appointment)}
                        >
                          Join Video
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {upcomingAppointments.length === 0 && appointmentHistory.length === 0 && (
                  <div className="no-appointments">
                    <h3>No appointments yet</h3>
                    <p>Book your first session to get started</p>
                    <Link to="/therapists" className="btn btn-primary">Find a Therapist</Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="messages-tab">
              <div className="chat-layout">
                <ChatList 
                  chats={allChats}
                  onSelectChat={handleSelectChat}
                  activeChat={selectedChat}
                />
                <ChatInterface 
                  chatId={selectedChat}
                  otherUser={selectedUser}
                />
              </div>
            </div>
          )}

          {/* Journal Tab */}
          {activeTab === 'journal' && (
            <div className="journal-tab">
              <div className="journal-header">
                <h2>Your Journal</h2>
                <button className="btn btn-primary">New Entry</button>
              </div>
              <div className="journal-full">
                {journalEntries.map(entry => (
                  <div key={entry.id} className="journal-full-item">
                    <div className="journal-full-mood">{entry.mood}</div>
                    <div className="journal-full-content">
                      <h3>{entry.title}</h3>
                      <p className="journal-full-preview">{entry.preview}</p>
                      <div className="journal-full-meta">
                        <span className="date">{entry.date}</span>
                        <button className="btn-text">Read More</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="profile-tab">
              <h2>Your Profile</h2>
              <div className="profile-card">
                <div className="profile-header">
                  <div className="profile-avatar">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="profile-info">
                    <h3>{userData.name}</h3>
                    <p>{userData.email}</p>
                    <span className="member-since">Member since {userData.memberSince || 'recently'}</span>
                  </div>
                </div>
                <div className="profile-actions">
                  <button className="btn btn-outline">Edit Profile</button>
                  <button className="btn btn-outline">Change Password</button>
                  <button className="btn btn-primary" onClick={logout}>Logout</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;