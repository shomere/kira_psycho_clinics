import { useLocation, useNavigate } from 'react-router-dom';
import './BookingConfirm.css';

function BookingConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { therapist, date, time, sessionType } = location.state || {};

  // If no booking data, redirect back
  if (!therapist) {
    navigate('/therapists');
    return null;
  }

  const handleConfirmBooking = () => {
    // Here you would integrate with payment API
    console.log('Confirming booking:', {
      therapist: therapist.name,
      date,
      time,
      sessionType
    });
    
    // Simulate successful booking
    alert('Booking confirmed! You will receive a confirmation email.');
    navigate('/dashboard');
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
                  <span className="value">{therapist.price}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="payment-card">
              <h2>Payment Method</h2>
              <div className="payment-options">
                <label className="payment-option">
                  <input type="radio" name="payment" value="card" defaultChecked />
                  <span className="radio-custom"></span>
                  Credit/Debit Card
                </label>
                <label className="payment-option">
                  <input type="radio" name="payment" value="insurance" />
                  <span className="radio-custom"></span>
                  Use Insurance
                </label>
                <label className="payment-option">
                  <input type="radio" name="payment" value="paypal" />
                  <span className="radio-custom"></span>
                  PayPal
                </label>
              </div>

              {/* Card Form */}
              <div className="card-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input 
                      type="text" 
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input 
                      type="text" 
                      placeholder="MM/YY"
                      maxLength="5"
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      maxLength="3"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                  />
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
                  <span>
                    {therapist.price.replace('/session', '') + ' + $5.00'}
                  </span>
                </div>
              </div>

              <button 
                className="confirm-btn"
                onClick={handleConfirmBooking}
              >
                Confirm & Pay
              </button>

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
