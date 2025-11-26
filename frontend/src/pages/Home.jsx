import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home-page">
      {/* Navigation Header */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <h2>Kira Psycho Clinics</h2>
          </div>
          <div className="nav-menu">
            <Link to="/therapists" className="nav-link">Find Therapists</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <div className="nav-auth">
              <Link to="/login" className="nav-login">Login</Link>
              <Link to="/register" className="nav-signup">Sign Up</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1>Professional Mental Health Support</h1>
            <p>Connect with licensed therapists for personalized care from the comfort of your home</p>
            <div className="hero-buttons">
              <Link to="/therapists" className="btn btn-primary">Find Your Therapist</Link>
              <Link to="/register" className="btn btn-secondary">Book First Session</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Why Choose Kira Psycho Clinics?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">👥</div>
              <h3>50+ Licensed Therapists</h3>
              <p>Verified professionals specializing in various mental health areas</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💻</div>
              <h3>Online Sessions</h3>
              <p>Secure video calls from anywhere, anytime</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🔒</div>
              <h3>Complete Privacy</h3>
              <p>Your sessions and data are encrypted and confidential</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⏰</div>
              <h3>Flexible Scheduling</h3>
              <p>Book appointments that fit your schedule</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; 2025 Kira Psycho Clinics. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
