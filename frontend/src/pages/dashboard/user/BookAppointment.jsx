import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, Star, Clock, User, X, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../../lib/api';

const BookAppointment = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [specialty, setSpecialty] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [specialties, setSpecialties] = useState([]);

  // Booking form state
  const [bookDate, setBookDate] = useState('');
  const [bookTime, setBookTime] = useState('');
  const [bookCategory, setBookCategory] = useState('');
  const [bookDescription, setBookDescription] = useState('');
  const [bookError, setBookError] = useState('');

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
  }, { scope: container, dependencies: [agents] });

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const { data } = await api.get('/user/agents');
        setAgents(data);
      } catch (err) {
        console.error('Failed to load agents', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAgents();
  }, []);

  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const { data } = await api.get('/services/specialties');
        setSpecialties(data);
        if (data.length > 0) {
          setBookCategory(data[0].name);
        }
      } catch (err) {
        console.error('Failed to load specialties', err);
      }
    };
    fetchSpecialties();
  }, []);

  const openModal = (agent) => {
    setSelectedAgent(agent);
    setBookingConfirmed(false);
    setBookDate('');
    setBookTime('');
    setBookDescription('');
    setBookError('');
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

  const handleConfirm = async (e) => {
    e.preventDefault();
    setBookError('');
    if (!bookDate || !bookTime) return setBookError('Please select a date and time.');
    if (!bookDescription.trim()) return setBookError('Please describe your issue.');

    setSubmitting(true);
    try {
      const appointmentDate = `${bookDate} ${bookTime}:00`;
      await api.post('/user/appointments', {
        agent_id: selectedAgent.id,
        appointment_date: appointmentDate,
        category: bookCategory,
        description: bookDescription,
      });
      setBookingConfirmed(true);
      gsap.fromTo('.success-state',
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    } catch (err) {
      setBookError(err?.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredAgents = agents.filter(agent => {
    const agentSpecialties = (agent.specialties || []).map(s => s.toLowerCase());
    const matchesSpecialty = !specialty || agentSpecialties.includes(specialty.toLowerCase());
    const matchesSearch = !searchTerm ||
      agent.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agentSpecialties.some(s => s.includes(searchTerm.toLowerCase()));
    return matchesSpecialty && matchesSearch;
  });

  const initials = (name) => name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

  return (
    <div ref={container} style={{ position: 'relative' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>BOOK APPOINTMENT</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Find and schedule a session with our IT experts.</p>

      {/* Filter / Search Section */}
      <div className="card" style={{ padding: '24px', marginBottom: '40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
          <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Specialty</label>
              <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={{ width: '100%', padding: '10px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }}>
                <option value="">All Specialties</option>
                {specialties.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Search</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search agents..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '10px 16px 10px 36px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <button className="btn-secondary" type="button" style={{ height: '42px', padding: '0 24px' }} onClick={() => { setSpecialty(''); setSearchTerm(''); }}>
            Clear
          </button>
        </div>
      </div>

      {/* Agents Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading agents…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredAgents.map((agent) => (
            <div key={agent.id} className="book-card card glowing-border" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '16px' }}>
                  {agent.avatar ? (
                    <img src={agent.avatar} alt={agent.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-border)' }} />
                  ) : (
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 700 }}>
                      {initials(agent.name)}
                    </div>
                  )}
                  <div>
                    <h3 style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{agent.name}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{agent.specialty || 'IT Support'} Specialist</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                {(agent.specialties && agent.specialties.length > 0
                  ? agent.specialties
                  : ['IT Support']
                ).map(spec => (
                  <span key={spec} style={{
                    padding: '3px 10px',
                    background: 'rgba(139,92,246,0.15)',
                    border: '1px solid rgba(139,92,246,0.35)',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: '#a78bfa'
                  }}>{spec}</span>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Star size={14} color="var(--accent)" fill="var(--accent)" /> {agent.rating || 'N/A'} Rating
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <User size={14} /> {agent.completed_sessions || 0} Sessions
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <Clock size={14} /> {agent.email}
                </div>
              </div>

              <button onClick={() => openModal(agent)} className="btn-secondary" style={{ width: '100%', marginTop: 'auto' }}>
                Book Now
              </button>
            </div>
          ))}
          {filteredAgents.length === 0 && (
            <div className="card" style={{ padding: '32px', color: 'var(--text-secondary)', gridColumn: '1 / -1', textAlign: 'center' }}>
              No agents found.
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {selectedAgent && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div ref={modalRef} className="card" style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative' }}>
            <button onClick={closeModal} style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={24} />
            </button>

            {!bookingConfirmed ? (
              <>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Book Appointment</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>with {selectedAgent.name}</p>

                {bookError && (
                  <div style={{ display: 'flex', gap: '8px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', color: '#ef4444', fontSize: '0.85rem', marginBottom: '16px', alignItems: 'center' }}>
                    <AlertCircle size={16} /> {bookError}
                  </div>
                )}

                <form onSubmit={handleConfirm}>
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Date & Time</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} required
                        min={new Date().toISOString().split('T')[0]}
                        style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
                      <select value={bookTime} onChange={e => setBookTime(e.target.value)} required
                        style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }}>
                        <option value="">Select Time</option>
                        {['09:00','10:00','11:00','13:00','14:00','15:00','16:00'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Category</label>
                    <select value={bookCategory} onChange={e => setBookCategory(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }}>
                      {specialties.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    </select>
                  </div>

                  <div style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Issue Description</label>
                    <textarea required rows="3" placeholder="Briefly describe your issue..."
                      value={bookDescription} onChange={e => setBookDescription(e.target.value)}
                      style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }} />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={submitting}>
                    {submitting ? 'Booking…' : 'Confirm Appointment'}
                  </button>
                </form>
              </>
            ) : (
              <div className="success-state" style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle size={32} color="#22c55e" />
                </div>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>BOOKING CONFIRMED</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>Your appointment with {selectedAgent.name} has been scheduled. You'll receive a notification once it's approved.</p>
                <button onClick={closeModal} className="btn-secondary" style={{ width: '100%' }}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;
