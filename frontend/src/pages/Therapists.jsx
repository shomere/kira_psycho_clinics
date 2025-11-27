import { useState, useEffect } from 'react'; // ← Add useEffect import
import { Link } from 'react-router-dom';
import api from '../services/api'; // ← Add API import
import './Therapists.css';

function Therapists() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(false); // ← Add loading state

  // Mock data fallback - Add this array
  const mockTherapists = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Anxiety & Depression',
      experience: '8 years',
      rating: 4.9,
      reviews: 127,
      availability: 'available',
      description: 'Specialized in CBT and mindfulness techniques for anxiety disorders.',
      price: '$120/session'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Relationship Counseling',
      experience: '12 years',
      rating: 4.8,
      reviews: 89,
      availability: 'available',
      description: 'Focused on couples therapy and family relationship dynamics.',
      price: '$140/session'
    },
    // ... add all your other mock therapists
  ];

  const specialties = ['all', 'Anxiety & Depression', 'Relationship Counseling', 'Trauma Therapy', 'Child Psychology', 'Addiction Counseling', 'OCD Specialist'];

  useEffect(() => {
    const fetchTherapists = async () => {
      setLoading(true);
      try {
        const data = await api.getTherapists({
          specialty: selectedSpecialty !== 'all' ? selectedSpecialty : undefined,
          availability: selectedAvailability !== 'all' ? selectedAvailability : undefined
        });
        setTherapists(data.therapists || data.data || data);
      } catch (error) {
        console.log('API not available, using mock data');
        // Fallback to mock data
        setTherapists(mockTherapists);
      } finally {
        setLoading(false);
      }
    };
    fetchTherapists();
  }, [selectedSpecialty, selectedAvailability]);

  const filteredTherapists = therapists.filter(therapist => {
    const matchesSearch = therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || therapist.specialty === selectedSpecialty;
    const matchesAvailability = selectedAvailability === 'all' || therapist.availability === selectedAvailability;
    
    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  return (
    <div className="therapists-page">
      {/* Header Section */}
      <div className="therapists-hero">
        <div className="container">
          <h1>Find Your Therapist</h1>
          <p>Connect with licensed professionals who can help you on your mental wellness journey</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="therapists-filters">
        <div className="container">
          <div className="filters-grid">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <label>Specialty</label>
              <select 
                value={selectedSpecialty} 
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="filter-select"
              >
                {specialties.map(specialty => (
                  <option key={specialty} value={specialty}>
                    {specialty === 'all' ? 'All Specialties' : specialty}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Availability</label>
              <select 
                value={selectedAvailability} 
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Availability</option>
                <option value="available">Available Now</option>
                <option value="busy">Limited Availability</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Therapists Grid */}
      <div className="therapists-container">
        <div className="container">
          <div className="results-info">
            <h2>
              {loading ? 'Loading therapists...' : `${filteredTherapists.length} Therapists Found`}
            </h2>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading therapists...</div>
          ) : (
            <>
              <div className="therapists-grid">
                {filteredTherapists.map(therapist => (
                  <div key={therapist.id} className="therapist-card">
                    <div className="therapist-image">
                      <div className="image-placeholder">
                        {therapist.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className={`availability-badge ${therapist.availability}`}>
                        {therapist.availability === 'available' ? 'Available' : 'Busy'}
                      </div>
                    </div>

                    <div className="therapist-info">
                      <h3>{therapist.name}</h3>
                      <p className="specialty">{therapist.specialty}</p>
                      <p className="experience">Experience: {therapist.experience}</p>
                      <p className="description">{therapist.description}</p>
                      
                      <div className="therapist-meta">
                        <div className="rating">
                          ⭐ {therapist.rating} ({therapist.reviews} reviews)
                        </div>
                        <div className="price">{therapist.price}</div>
                      </div>

                      <div className="therapist-actions">
                        <Link to={`/therapist/${therapist.id}`} className="btn btn-outline">
                          View Profile
                        </Link>
                        <button className="btn btn-primary">
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredTherapists.length === 0 && !loading && (
                <div className="no-results">
                  <h3>No therapists found</h3>
                  <p>Try adjusting your search criteria</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Therapists;
