import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Therapists.css';

function Therapists() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');

  // Mock data - replace with actual API data later
  const therapists = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Anxiety & Depression',
      experience: '8 years',
      rating: 4.9,
      reviews: 127,
      availability: 'available',
      image: '/api/placeholder/150/150',
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
      image: '/api/placeholder/150/150',
      description: 'Focused on couples therapy and family relationship dynamics.',
      price: '$140/session'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Trauma Therapy',
      experience: '6 years',
      rating: 4.7,
      reviews: 64,
      availability: 'busy',
      image: '/api/placeholder/150/150',
      description: 'EMDR certified therapist specializing in trauma recovery.',
      price: '$130/session'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Child Psychology',
      experience: '10 years',
      rating: 4.9,
      reviews: 156,
      availability: 'available',
      image: '/api/placeholder/150/150',
      description: 'Expert in child and adolescent mental health development.',
      price: '$125/session'
    },
    {
      id: 5,
      name: 'Dr. Lisa Park',
      specialty: 'Addiction Counseling',
      experience: '9 years',
      rating: 4.8,
      reviews: 93,
      availability: 'available',
      image: '/api/placeholder/150/150',
      description: 'Specialized in substance abuse and behavioral addiction treatment.',
      price: '$135/session'
    },
    {
      id: 6,
      name: 'Dr. Robert Brown',
      specialty: 'OCD Specialist',
      experience: '7 years',
      rating: 4.7,
      reviews: 78,
      availability: 'busy',
      image: '/api/placeholder/150/150',
      description: 'Expert in OCD and related anxiety disorders using exposure therapy.',
      price: '$145/session'
    }
  ];

  const specialties = ['all', 'Anxiety & Depression', 'Relationship Counseling', 'Trauma Therapy', 'Child Psychology', 'Addiction Counseling', 'OCD Specialist'];

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
            <h2>{filteredTherapists.length} Therapists Found</h2>
          </div>

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
		    Book Now  {/* Changed from "Book Session" */}
		  </button>
		</div>
                </div>
              </div>
            ))}
          </div>

          {filteredTherapists.length === 0 && (
            <div className="no-results">
              <h3>No therapists found</h3>
              <p>Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Therapists;
