import { Link } from 'react-router-dom'

function Home() {
  return (
    <>
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div>
            <h1>Kira Psycho Clinics</h1>
            <p>Your Journey to Mental Wellness Starts Here</p>
          </div>
          <nav className="nav-links">
            <Link to="/therapists">Find Therapists</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <div className="auth-buttons">
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/register" className="btn-outline">Sign Up</Link>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h2>Professional Mental Health Support</h2>
          <p>Connect with licensed therapists for personalized care from the comfort of your home</p>
          <div className="hero-buttons">
            <Link to="/therapists" className="btn-large">Find Your Therapist</Link>
            <Link to="/register" className="btn-large-outline">Book First Session</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h3>Why Choose Kira Psycho Clinics?</h3>
          <div className="features-grid">
            <div className="feature-card">
              <h4> 50+ Licensed Therapists</h4>
              <p>Verified professionals specializing in various mental health areas</p>
            </div>
            <div className="feature-card">
              <h4> Online Sessions</h4>
              <p>Secure video calls from anywhere, anytime</p>
            </div>
            <div className="feature-card">
              <h4> Complete Privacy</h4>
              <p>Your sessions and data are encrypted and confidential</p>
            </div>
            <div className="feature-card">
              <h4> Flexible Scheduling</h4>
              <p>Book appointments that fit your schedule</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container">
          <p>&copy; 2024 Kira Psycho Clinics. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default Home
