import { useState } from 'react'; // ← Make sure useState is imported
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import PaymentForm from '../components/payment/PaymentForm'; // ← Add PaymentForm import
import './BookingConfirm.css';

function BookingConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { therapist, date, time, sessionType } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false); // ← Add payment state
  const [paymentCompleted, setPaymentCompleted] = useState(false); // ← Track payment status

  // If no booking data, redirect back
  if (!therapist) {
    navigate('/therapists');
    return null;
  }

  // Calculate total amount in cents for Stripe
  const calculateTotalAmount = () => {
    // Extract price number from string like "$120/session"
    const sessionPrice = parseInt(therapist.price.replace(/[^0-9]/g, ''));
    const platformFee = 5; // $5 platform fee
    const totalInDollars = sessionPrice + platformFee;
    return totalInDollars * 100; // Convert to cents for Stripe
  };

  const handlePaymentSuccess = async (paymentMethod) => {
    console.log('Payment successful:', paymentMethod);
    setPaymentCompleted(true);
    // Now complete the booking after payment success
    await handleConfirmBooking();
  };

  const handlePaymentError = (error) => {
    setError(`Payment failed: ${error}`);
    setPaymentProcessing(false);
  };

  const handleConfirmBooking = async () => {
    if (!currentUser) {
      alert('Please log in to book an appointment');
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create appointment data for API
      const appointmentData = {
        therapistId: therapist.id,
        therapistName: therapist.name,
        date: date,
        time: time,
        sessionType: sessionType,
        duration: '50 minutes',
        price: therapist.price,
        patientId: currentUser.id,
        patientName: currentUser.name,
        patientEmail: currentUser.email,
        paymentStatus: paymentCompleted ? 'paid' : 'pending' // ← Add payment status
      };

      // Send booking to API
      const response = await api.bookAppointment(appointmentData);
      
      if (response.success) {
        alert('Booking confirmed! You will receive a confirmation email.');
        navigate('/dashboard');
      } else {
        setError(response.message || 'Booking failed. Please try again.');
      }
    } catch (error) {
      console.log('API not available, using mock booking');
      // Fallback to mock booking
      alert('Booking confirmed! (Demo mode - API unavailable)');
      navigate('/dashboard');
    } finally {
      setLoading(false);
      setPaymentProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="booking-confirm-page">
      <div className="container">
        <div className="booking-header">
          <h1>Confirm Your Booking</h1>
          <p>Review your appointment details before confirming</p>
        </div>

        {error && (
          <div className="error-banner">
            ⚠️ {error}
          </div>
        )}

        <div className="booking-layout">
          {/* Booking Summary */}
          <div className="booking-summary">
            <div className="summary-card">
              <h2>Appointment Details</h2>
              
              <div className="therapist-summary">
                <div className="therapist-avatar-small">
                  {therapist.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="therapist-details">
                  <h3>{therapist.name}</h3>
                  <p className="specialty">{therapist.specialty}</p>
                </div>
              </div>

              <div className="appointment-details">
                <div className="detail-item">
                  <span className="label">Date:</span>
                  <span className="value">{formatDate(date)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Time:</span>
                  <span className="value">{time}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Session Type:</span>
                  <span className="value">{sessionType}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Duration:</span>
                  <span className="value">50 minutes</span>
                </div>
                <div className="detail-item total">
                  <span className="label">Total Amount:</span>
                  <span className="value">{therapist.price} + $5.00 platform fee</span>
                </div>
              </div>
            </div>

            {/* Payment Method - UPDATED WITH STRIPE */}
            <div className="payment-card">
              <h2>Payment Method</h2>
              
              {/* Stripe Payment Form */}
              <PaymentForm
                amount={calculateTotalAmount()}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />

              <div className="payment-features">
                <div className="feature">
                  <span className="feature-icon">🔒</span>
                  <span>PCI compliant security</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">💳</span>
                  <span>Cards accepted: Visa, Mastercard, Amex</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <div className="order-card">
              <h3>Order Summary</h3>
              
              <div className="order-details">
                <div className="order-item">
                  <span>Session Fee</span>
                  <span>{therapist.price}</span>
                </div>
                <div className="order-item">
                  <span>Platform Fee</span>
                  <span>$5.00</span>
                </div>
                <div className="order-item total">
                  <span>Total</span>
                  <span>${(calculateTotalAmount() / 100).toFixed(2)}</span>
                </div>
              </div>

              {/* Show different button based on payment status */}
              {paymentCompleted ? (
                <button 
                  className="confirm-btn"
                  onClick={handleConfirmBooking}
                  disabled={loading}
                >
                  {loading ? 'Completing Booking...' : 'Complete Booking'}
                </button>
              ) : (
                <div className="payment-notice">
                  <p>💳 Enter your card details to secure your booking</p>
                </div>
              )}

              <div className="booking-guarantee">
                <div className="guarantee-item">
                  <span className="icon">🔒</span>
                  <span>Secure payment encrypted</span>
                </div>
                <div className="guarantee-item">
                  <span className="icon">↩️</span>
                  <span>Free cancellation up to 24 hours</span>
                </div>
                <div className="guarantee-item">
                  <span className="icon">📧</span>
                  <span>Instant confirmation email</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirm;
