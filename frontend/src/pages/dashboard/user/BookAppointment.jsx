import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, Filter, Star, Clock, User, X } from 'lucide-react';

// Mock Data
const MOCK_AGENTS = [
  { id: 1, name: 'David Chen', specialty: 'Software', rating: 4.9, exp: '5 yrs', slots: 14, avatar: 'DC' },
  { id: 2, name: 'Mike Ross', specialty: 'Network', rating: 4.8, exp: '3 yrs', slots: 8, avatar: 'MR' },
  { id: 3, name: 'Sarah Jenkins', specialty: 'Hardware', rating: 5.0, exp: '7 yrs', slots: 4, avatar: 'SJ' },
  { id: 4, name: 'Elena Rodriguez', specialty: 'Account', rating: 4.7, exp: '2 yrs', slots: 22, avatar: 'ER' },
  { id: 5, name: 'James Wilson', specialty: 'Hardware', rating: 4.6, exp: '4 yrs', slots: 11, avatar: 'JW' },
];

const BookAppointment = () => {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const container = useRef();
  const modalRef = useRef();

  useGSAP(() => {
    gsap.from('.book-card', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, { scope: container });

  const openModal = (agent) => {
    setSelectedAgent(agent);
    setBookingConfirmed(false);
    setTimeout(() => {
      gsap.fromTo(modalRef.current, 
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out' }
      );
    }, 10);
  };

  const closeModal = () => {
    gsap.to(modalRef.current, { 
      opacity: 0, 
      scale: 0.95, 
      duration: 0.2, 
      onComplete: () => setSelectedAgent(null) 
    });
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    setBookingConfirmed(true);
    // Success animation inside modal
    gsap.fromTo('.success-state', 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
    );
    gsap.to('.success-icon-glow', {
      boxShadow: '0 0 30px rgba(93, 0, 26, 0.8)',
      repeat: -1,
      yoyo: true,
      duration: 1
    });
  };

  return (
    <div ref={container} style={{ position: 'relative' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>BOOK APPOINTMENT</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Find and schedule a session with our IT experts.</p>

      {/* Large Search Section */}
      <div className="card" style={{ padding: '24px', marginBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Specialty</label>
            <select style={{ width: '100%', padding: '10px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }}>
              <option value="">All Specialties</option>
              <option value="hardware">Hardware</option>
              <option value="software">Software</option>
              <option value="network">Network</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Date</label>
            <input type="date" style={{ width: '100%', padding: '10px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Time</label>
            <select style={{ width: '100%', padding: '10px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }}>
              <option value="">Any Time</option>
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Issue Type</label>
            <select style={{ width: '100%', padding: '10px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }}>
              <option value="">Select Issue</option>
              <option value="repair">Repair</option>
              <option value="setup">Setup</option>
            </select>
          </div>
          <button className="btn-primary" style={{ height: '42px', padding: '0 24px' }}>
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Agents Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {MOCK_AGENTS.map((agent) => (
          <div key={agent.id} className="book-card card glowing-border" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 700 }}>
                  {agent.avatar}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{agent.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{agent.specialty} Specialist</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Star size={14} color="var(--accent)" fill="var(--accent)" /> {agent.rating} Rating
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <User size={14} /> {agent.exp} Exp
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <Clock size={14} /> {agent.slots} Slots Today
              </div>
            </div>

            <button onClick={() => openModal(agent)} className="btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>
              View Availability
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedAgent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          backdropFilter: 'blur(10px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div ref={modalRef} className="card" style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={24} />
            </button>

            {!bookingConfirmed ? (
              <>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Book Appointment</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>with {selectedAgent.name}</p>

                <form onSubmit={handleConfirm}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Date & Time</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <input type="date" required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }} />
                      <select required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }}>
                        <option value="">Select Time</option>
                        <option value="09:00">09:00 AM</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="14:00">02:00 PM</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Issue Description</label>
                    <textarea required rows="3" placeholder="Briefly describe your issue..." style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }}></textarea>
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Preferred Contact</label>
                    <select required style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }}>
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                    Confirm Appointment
                  </button>
                </form>
              </>
            ) : (
              <div className="success-state" style={{ textAlign: 'center', padding: '32px 0' }}>
                <div className="success-icon-glow" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '1.5rem', margin: '0 auto 24px' }}>
                  ✓
                </div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>BOOKING CONFIRMED</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Your appointment with {selectedAgent.name} has been scheduled.</p>
                <button onClick={closeModal} className="btn-secondary" style={{ width: '100%' }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
