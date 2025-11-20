import { useState, useEffect } from 'react'

function Therapists() {
  const [therapists, setTherapists] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data - will be replaced with API call
  useEffect(() => {
    setTimeout(() => {
      setTherapists([
        {
          id: 1,
          name: 'Dr. Sarah Johnson',
          specialization: 'Anxiety, Depression',
          experience: '8 years',
          rating: 4.9,
          bio: 'Specialized in cognitive behavioral therapy with a focus on anxiety disorders.',
          hourlyRate: 120
        },
        {
          id: 2,
          name: 'Dr. Michael Chen',
          specialization: 'PTSD, Trauma',
          experience: '12 years',
          rating: 4.8,
          bio: 'Experienced in trauma-focused therapy and EMDR techniques.',
          hourlyRate: 150
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading therapists...</div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Find Your Therapist</h1>
        <p>Connect with licensed mental health professionals</p>
      </div>

      <div className="therapists-grid">
        {therapists.map(therapist => (
          <div key={therapist.id} className="therapist-card">
            <div className="therapist-header">
              <h3>{therapist.name}</h3>
              <div className="rating">⭐ {therapist.rating}</div>
            </div>
            <div className="specialization">{therapist.specialization}</div>
            <div className="experience">Experience: {therapist.experience}</div>
            <p className="bio">{therapist.bio}</p>
            <div className="therapist-footer">
              <div className="rate">${therapist.hourlyRate}/hr</div>
              <button className="btn-primary">Book Session</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Therapists
