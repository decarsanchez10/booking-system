import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Mock data
const MY_BOOKINGS = [
  { id: 'BKG-5921', slotId: 'SLT-101', agent: 'Sarah Jenkins', date: '2023-11-20', time: '09:00 AM', issue: 'software', status: 'confirmed' },
];

const MyBookings = () => {
  const container = useRef();

  useGSAP(() => {
    gsap.from('.booking-item', { 
      opacity: 0, 
      x: -20, 
      stagger: 0.1,
      duration: 0.4,
      ease: 'power1.out'
    });
  }, { scope: container });

  return (
    <div ref={container}>
      <h1 style={{ marginBottom: '1rem' }}>My Bookings</h1>
      <div className="glowing-divider"></div>
      
      {MY_BOOKINGS.length === 0 ? (
        <p className="mono-text">No active bookings found.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {MY_BOOKINGS.map(booking => (
            <div key={booking.id} className="card booking-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0 }}>{booking.agent}</h3>
                  <span style={{ 
                    padding: '0.2rem 0.5rem', 
                    backgroundColor: 'var(--color-burgundy-glow)', 
                    color: 'var(--color-burgundy)',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    border: '1px solid var(--color-burgundy)'
                  }}>
                    {booking.status}
                  </span>
                </div>
                <p className="mono-text" style={{ margin: 0 }}>
                  {booking.date} at {booking.time} | Issue: {booking.issue.toUpperCase()}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="mono-text" style={{ color: '#666', marginBottom: '0.5rem' }}>ID: {booking.id}</p>
                <button className="btn btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>CANCEL</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
