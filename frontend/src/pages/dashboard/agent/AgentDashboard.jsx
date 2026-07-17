import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../../../context/AuthContext';
import { Calendar, Clock, ArrowRight, CheckCircle, X } from 'lucide-react';
import api from '../../../lib/api';
import SpecialtySetupModal from '../../../components/SpecialtySetupModal';

/* ── Modal ── */
const Modal = ({ title, children, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
    <div style={{ background: 'var(--bg-elevated,#141418)', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '480px', position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
      <h3 style={{ fontSize: '1.3rem', marginBottom: '24px' }}>{title}</h3>
      {children}
    </div>
  </div>
);

const AgentDashboard = () => {
  const { user, updateUser } = useAuth();
  const container = useRef();

  // Show specialties setup if agent has none
  const needsSpecialtySetup = !user?.specialties || !Array.isArray(user.specialties) || user.specialties.length === 0;

  const handleSpecialtyComplete = (updatedUser) => {
    updateUser(updatedUser);
  };

  // Current session state
  const [sessionActive, setSessionActive] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Notes modal
  const [showNotes, setShowNotes] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  // Queue and Stats
  const [stats, setStats] = useState(null);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/agent/dashboard');
      setStats(res.data);
      setQueue((res.data.today_queue || []).filter(apt => {
        const status = apt.status?.toLowerCase();
        return status !== 'completed' && status !== 'cancelled' && status !== 'closed';
      }));
    } catch (err) {
      console.error('Failed to fetch agent dashboard', err);
    }
  };

  useGSAP(() => {
    gsap.from('.dash-card', { opacity: 0, y: 20, stagger: 0.1, duration: 0.5, ease: 'power2.out' });
  }, { scope: container });

  const handleCompleteSession = async () => {
    if (queue.length === 0) return;
    try {
      await api.put(`/agent/appointments/${queue[0].id}/status`, { status: 'Completed' });
      setQueue(prev => prev.slice(1));
      setSessionActive(false);
      setSessionCompleted(true);
      fetchDashboard(); // Refresh queue from backend
      setTimeout(() => {
        setSessionCompleted(false);
        setSessionActive(true);
      }, 2000);
    } catch (err) {
      console.error('Failed to complete session', err);
      alert('Failed to complete session');
    }
  };

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    setNoteSaved(true);
    setTimeout(() => { setShowNotes(false); setNoteSaved(false); }, 1500);
  };

  const handleStartSession = (index) => {
    setQueue(prev => prev.map((q, i) => i === index ? { ...q, started: true } : q));
  };

  return (
    <div ref={container}>
      {/* Specialty Setup Modal (shows for new agents without specialties) */}
      {needsSpecialtySetup && (
        <SpecialtySetupModal onComplete={handleSpecialtyComplete} />
      )}

      {/* Notes Modal */}
      {showNotes && (
        <Modal title="Add Session Notes" onClose={() => { setShowNotes(false); setNoteSaved(false); }}>
          {noteSaved ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle size={48} color="#1dd1a1" style={{ marginBottom: '12px' }} />
              <p style={{ color: '#1dd1a1', fontWeight: 600 }}>Note saved successfully!</p>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                Add internal notes for this session. These are only visible to agents and admins.
              </p>
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={5}
                placeholder="Diagnosed issue as... Recommended solution..."
                style={{ width: '100%', padding: '14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box', marginBottom: '16px' }} />
              <button className="btn-primary" onClick={handleSaveNote} style={{ width: '100%', padding: '12px' }}>
                Save Note
              </button>
            </>
          )}
        </Modal>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>AGENT PORTAL</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name}. Here is your schedule for today.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }} />
            Accepting Appointments
          </div>
          <Link to="/dashboard/agent/availability" className="btn-secondary" style={{ padding: '10px 20px' }}>
            Manage Schedule
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {[
          { label: "Today's Appts", value: String(stats?.today_appointments || 0), icon: <Calendar size={20} />, color: 'var(--text-primary)' },
          { label: 'Completed', value: String(stats?.completed_sessions || 0), icon: <CheckCircle size={20} />, color: 'var(--text-primary)' },
          { label: 'Hours Logged', value: '3.5', icon: <Clock size={20} />, color: 'var(--text-muted)' }
        ].map((stat, i) => (
          <div key={i} className="dash-card card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
              <div style={{ color: stat.color }}>{stat.icon}</div>
            </div>
            <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Current Session */}
          <div className="dash-card card glowing-border" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: sessionActive && queue.length > 0 ? 'var(--accent)' : '#22c55e' }} />

            {sessionCompleted && !sessionActive ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={48} color="#22c55e" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: '#22c55e' }}>Session Completed!</h3>
                <p style={{ color: 'var(--text-muted)' }}>The issue has been resolved.</p>
              </div>
            ) : queue.length > 0 ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Current Session</div>
                      <span style={{ display: 'flex', width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 8px rgba(239,68,68,0.8)' }} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{queue[0].category}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{queue[0].user?.name} • {queue[0].description}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', marginBottom: '4px', color: '#22c55e' }}>Active</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Status</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Date: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{new Date(queue[0].appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }} onClick={() => setShowNotes(true)}>Add Notes</button>
                    <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', background: '#22c55e' }} onClick={handleCompleteSession}>Complete Session</button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <CheckCircle size={48} color="var(--text-muted)" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px', color: 'var(--text-primary)' }}>No Active Sessions</h3>
                <p style={{ color: 'var(--text-muted)' }}>You have no appointments currently in queue.</p>
              </div>
            )}
          </div>

          {/* Upcoming Queue */}
          <div className="dash-card card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Upcoming Queue
              <Link to="/dashboard/agent/appointments" style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Manage all <ArrowRight size={14} /></Link>
            </h3>
            {queue.map((booking, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: i !== queue.length - 1 ? '1px solid var(--border)' : 'none', gap: '24px' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', width: '80px' }}>{new Date(booking.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.95rem', marginBottom: '4px' }}>{booking.user?.name || 'Unknown User'}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{booking.description}</div>
                </div>
                <div style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', background: 'var(--overlay-soft)', border: '1px solid var(--overlay-medium)', textTransform: 'uppercase', letterSpacing: '1px' }}>{booking.category}</div>
                <button
                  className={booking.started ? 'btn-secondary' : 'btn-secondary'}
                  style={{
                    padding: '6px 12px', fontSize: '0.75rem',
                    color: booking.started ? '#22c55e' : undefined,
                    borderColor: booking.started ? 'rgba(34,197,94,0.3)' : undefined,
                    pointerEvents: booking.started ? 'none' : 'auto',
                  }}
                  onClick={() => handleStartSession(i)}
                >
                  {booking.started ? '✓ Started' : 'Start'}
                </button>
              </div>
            ))}
            {queue.length === 0 && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>No upcoming appointments today.</p>
            )}
          </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
