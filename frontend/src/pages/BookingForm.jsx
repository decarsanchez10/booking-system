import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issueType, setIssueType] = useState('software');
  const [description, setDescription] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);
  
  const container = useRef();
  const formRef = useRef();
  const successRef = useRef();

  useGSAP(() => {
    if (isConfirmed) {
      gsap.to(formRef.current, { opacity: 0, y: -20, duration: 0.3, display: 'none' });
      gsap.fromTo(successRef.current, 
        { opacity: 0, scale: 0.8, display: 'none' },
        { opacity: 1, scale: 1, display: 'block', duration: 0.5, delay: 0.3, ease: 'back.out(1.7)' }
      );
      // Pulse glow
      gsap.to(successRef.current, {
        boxShadow: '0 0 30px rgba(93, 0, 26, 0.8)',
        repeat: -1,
        yoyo: true,
        duration: 1
      });
    }
  }, { dependencies: [isConfirmed], scope: container });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate booking API call
    setTimeout(() => {
      setIsConfirmed(true);
      setTimeout(() => {
        navigate('/my-bookings');
      }, 3000);
    }, 1000); // Simulated loading
  };

  return (
    <div ref={container} style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div ref={formRef} className="card">
        <h2 style={{ marginBottom: '1rem' }}>Confirm Booking</h2>
        <p className="mono-text" style={{ marginBottom: '1.5rem' }}>SLOT ID: {id}</p>
        <div className="glowing-divider"></div>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>ISSUE TYPE</label>
            <select value={issueType} onChange={(e) => setIssueType(e.target.value)} required>
              <option value="hardware">Hardware Issue</option>
              <option value="software">Software Issue</option>
              <option value="network">Network/Connectivity</option>
              <option value="account">Account Access</option>
            </select>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>DESCRIPTION</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Describe the issue briefly..."
              required
            ></textarea>
          </div>
          
          <button type="submit" className="btn" style={{ width: '100%' }}>
            CONFIRM APPOINTMENT
          </button>
        </form>
      </div>

      <div ref={successRef} className="card glowing-border" style={{ display: 'none', textAlign: 'center', padding: '3rem' }}>
        <h2 style={{ color: 'var(--color-burgundy)', marginBottom: '1rem' }}>BOOKING CONFIRMED</h2>
        <p>Your appointment has been successfully scheduled.</p>
        <p className="mono-text" style={{ marginTop: '1rem' }}>Redirecting to your bookings...</p>
      </div>
    </div>
  );
};

export default BookingForm;
