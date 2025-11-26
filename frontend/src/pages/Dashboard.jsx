import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock user data
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    memberSince: 'January 2024',
    userType: 'patient'
  };

  // Mock upcoming appointments
  const upcomingAppointments = [
    {
      id: 1,
      therapist: 'Dr. Sarah Johnson',
      date: '2024-03-15',
      time: '14:00',
      duration: '60 min',
      type: 'Video Session',
      status: 'confirmed'
    },
    {
      id: 2,
      therapist: 'Dr. Michael Chen',
      date: '2024-03-20',
      time: '10:30',
      duration: '45 min',
      type: 'In-Person',
      status: 'confirmed'
    }
  ];

  // Mock appointment history
  const appointmentHistory = [
    {
      id: 1,
      therapist: 'Dr. Emily Rodriguez',
      date: '2024-02-10',
      duration: '60 min',
      type: 'Video Session',
      status: 'completed'
    },
    {
      id: 2,
      therapist: 'Dr. James Wilson',
      date: '2024-01-25',
      duration: '45 min',
      type: 'In-Person',
      status: 'completed'
    }
  ];

  // Mock journal entries
  const journalEntries = [
    {
      id: 1,
      date: '2024-03-10',
      title: 'Progress Reflection',
      preview: 'Feeling more positive about the coping strategies...',
      mood: '😊'
    },
    {
      id: 2,
      date: '2024-03-05',
      title: 'Session Notes',
      preview: 'Discussed anxiety triggers and breathing techniques...',
      mood: '😌'
    }
  ];

  return (
    <div className="dashboard-page">
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-info">
                    <h3>Upcoming Sessions</h3>
                    <p className="stat-number">{upcomingAppointments.length}</p>
                    <p className="stat-desc">Next: {upcomingAppointments[0]?.date}</p>
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
                  <div className="stat-icon">⭐</div>
                  <div className="stat-info">
                    <h3>Wellness Streak</h3>
                    <p className="stat-number">12 days</p>
                    <p className="stat-desc">Keep it up!</p>
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
                          <p>{appointment.date} at {appointment.time}</p>
                          <span className="appointment-type">{appointment.type}</span>
                        </div>
                        <div className="appointment-actions">
                          <button className="btn btn-outline btn-small">Reschedule</button>
                          <button className="btn btn-primary btn-small">Join</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Journal Entries */}
                <div className="overview-section">
                  <div className="section-header">
                    <h2>Recent Journal Entries</h2>
                    <Link to="/journal" className="view-all">View All</Link>
                  </div>
                  <div className="journal-list">
                    {journalEntries.map(entry => (
                      <div key={entry.id} className="journal-item">
                        <div className="journal-mood">{entry.mood}</div>
                        <div className="journal-content">
                          <h4>{entry.title}</h4>
                          <p>{entry.preview}</p>
                          <span className="journal-date">{entry.date}</span>
                        </div>
                      </div>
                    ))}
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
                    </div>
                    <div className="appointment-details">
                      <span className="type">{appointment.type}</span>
                      {appointment.time && <span className="time">{appointment.time}</span>}
                    </div>
                  </div>
                ))}
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
                    <span className="member-since">Member since {userData.memberSince}</span>
                  </div>
                </div>
                <div className="profile-actions">
                  <button className="btn btn-outline">Edit Profile</button>
                  <button className="btn btn-outline">Change Password</button>
                  <button className="btn btn-primary">Upgrade Plan</button>
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
