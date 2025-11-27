import { useState, useEffect } from 'react'; // ← Add useEffect
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api'; // ← Add API import
import './TherapistProfile.css';

function TherapistProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [therapist, setTherapist] = useState(null); // ← Change to state
  const [loading, setLoading] = useState(true); // ← Add loading state

  // Mock therapist data fallback
  const mockTherapist = {
    id: 1,
    name: 'Dr. Sarah Johnson',
    specialty: 'Anxiety & Depression Specialist',
    experience: '8 years',
    rating: 4.9,
    reviews: 127,
    price: '$120/session',
    image: '/api/placeholder/300/300',
    bio: 'I am a licensed clinical psychologist specializing in cognitive behavioral therapy (CBT) and mindfulness-based approaches. My practice focuses on helping individuals overcome anxiety disorders, depression, and stress-related challenges.',
    education: [
      'PhD in Clinical Psychology - Stanford University',
      'Masters in Counseling Psychology - UCLA',
      'BA in Psychology - University of California, Berkeley'
    ],
    specialties: ['Anxiety Disorders', 'Depression', 'Stress Management', 'Cognitive Behavioral Therapy', 'Mindfulness'],
    languages: ['English', 'Spanish'],
    availability: ['mon', 'tue', 'wed', 'thu', 'fri'],
    sessionTypes: [
      { type: 'Individual Therapy', duration: '50 min', price: '$120' },
      { type: 'Couples Therapy', duration: '75 min', price: '$180' },
      { type: 'Group Therapy', duration: '90 min', price: '$80' }
    ],
    reviewsList: [
      {
        id: 1,
        patient: 'Michael T.',
        rating: 5,
        date: '2024-02-15',
        comment: 'Dr. Johnson has been incredibly helpful in managing my anxiety. Her CBT techniques are practical and effective.'
      },
      {
        id: 2,
        patient: 'Sarah L.',
        rating: 5,
        date: '2024-02-10',
        comment: 'Very professional and empathetic. I feel heard and understood in every session.'
      }
    ]
  };

  // Fetch therapist data from API
  useEffect(() => {
    const fetchTherapist = async () => {
      try {
        const response = await api.getTherapist(id);
        setTherapist(response.therapist || response.data || response);
      } catch (error) {
        console.log('API not available, using mock data');
        setTherapist(mockTherapist);
      } finally {
        setLoading(false);
      }
    };

    fetchTherapist();
  }, [id]);

  // Mock available time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'
  ];

  const handleBooking = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert('Please select both date and time');
      return;
    }
    
    if (!therapist) return;
    
    // Navigate to booking confirmation page
    navigate('/booking-confirm', {
      state: {
        therapist: therapist,
        date: selectedDate,
        time: selectedTime,
        sessionType: document.querySelector('.session-select')?.value || 'Individual Therapy'
      }
    });
  };

  // Calculate stars for reviews
  const renderStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  // Show loading state
  if (loading) {
    return (
      <div className="therapist-profile-page">
        <div className="container">
          <div className="loading">Loading therapist profile...</div>
        </div>
      </div>
    );
  }

  // Show error state if no therapist data
  if (!therapist) {
    return (
      <div className="therapist-profile-page">
        <div className="container">
          <div className="error">Therapist not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="therapist-profile-page">
      {/* Breadcrumb Navigation */}
      <div className="breadcrumb">
        <div className="container">
          <Link to="/therapists" className="breadcrumb-link">Therapists</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{therapist.name}</span>
        </div>
      </div>

      <div className="container">
        <div className="profile-layout">
          {/* Left Column - Therapist Info */}
          <div className="profile-info">
            <div className="therapist-header">
              <div className="therapist-avatar">
                <div className="avatar-placeholder">
                  {therapist.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
              <div className="therapist-basic-info">
                <h1>{therapist.name}</h1>
                <p className="specialty">{therapist.specialty}</p>
                <div className="rating-badge">
                  <span className="stars">{renderStars(therapist.rating)}</span>
                  <span className="rating-text">{therapist.rating} ({therapist.reviews} reviews)</span>
                </div>
                <p className="experience">Experience: {therapist.experience}</p>
              </div>
            </div>

            {/* Bio Section */}
            <div className="bio-section">
              <h2>About Me</h2>
              <p className="bio-text">{therapist.bio}</p>
            </div>

            {/* Education */}
            <div className="education-section">
              <h2>Education & Credentials</h2>
              <ul className="education-list">
                {therapist.education.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Specialties */}
            <div className="specialties-section">
              <h2>Specialties</h2>
              <div className="specialties-tags">
                {therapist.specialties.map((specialty, index) => (
                  <span key={index} className="specialty-tag">{specialty}</span>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="languages-section">
              <h2>Languages</h2>
              <div className="languages-list">
                {therapist.languages.map((language, index) => (
                  <span key={index} className="language-tag">{language}</span>
                ))}
              </div>
            </div>

            {/* Session Types */}
            <div className="sessions-section">
              <h2>Session Types</h2>
              <div className="session-types">
                {therapist.sessionTypes.map((session, index) => (
                  <div key={index} className="session-type">
                    <div className="session-info">
                      <h4>{session.type}</h4>
                      <p>{session.duration}</p>
                    </div>
                    <div className="session-price">{session.price}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="reviews-section">
              <h2>Patient Reviews</h2>
              <div className="reviews-list">
                {therapist.reviewsList.map(review => (
                  <div key={review.id} className="review-item">
                    <div className="review-header">
                      <span className="reviewer">{review.patient}</span>
                      <span className="review-date">{review.date}</span>
                    </div>
                    <div className="review-rating">
                      {renderStars(review.rating)}
                    </div>
                    <p className="review-comment">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Widget */}
          <div className="booking-widget">
            <div className="booking-card">
              <h3>Book a Session</h3>
              <p className="session-price">{therapist.price}</p>
              
              <form onSubmit={handleBooking} className="booking-form">
                <div className="form-group">
                  <label>Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Select Time</label>
                  <div className="time-slots">
                    {timeSlots.map((time, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Session Type</label>
                  <select className="session-select" defaultValue="Individual Therapy">
                    {therapist.sessionTypes.map((session, index) => (
                      <option key={index} value={session.type}>
                        {session.type} - {session.duration} ({session.price})
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className="book-now-btn">
                  Book Session
                </button>
              </form>

              <div className="booking-features">
                <div className="feature">
                  <span className="feature-icon">✅</span>
                  <span>Free 15-min consultation</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✅</span>
                  <span>Cancel anytime</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">✅</span>
                  <span>Insurance accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TherapistProfile;
