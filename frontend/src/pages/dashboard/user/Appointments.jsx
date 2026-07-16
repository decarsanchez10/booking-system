import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Calendar, Clock, Monitor, Wifi, Database, Search, MoreVertical, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const INITIAL_APPOINTMENTS = [
  { id: 'APT-1042', agent: 'Sarah Jenkins', type: 'Hardware', date: 'Today', time: '02:30 PM', status: 'upcoming', issue: 'MacBook Pro Battery Replacement Consultation' },
  { id: 'APT-1038', agent: 'Mike Ross', type: 'Network', date: 'Nov 12, 2023', time: '10:00 AM', status: 'completed', issue: 'Campus Wi-Fi Connectivity' },
  { id: 'APT-1035', agent: 'David Chen', type: 'Software', date: 'Oct 28, 2023', time: '01:15 PM', status: 'completed', issue: 'Software Installation (Adobe CC)' },
  { id: 'APT-1022', agent: 'Elena Rodriguez', type: 'Account', date: 'Sep 15, 2023', time: '09:30 AM', status: 'cancelled', issue: 'Password Reset / MFA Issue' },
  { id: 'APT-1045', agent: 'James Wilson', type: 'Hardware', date: 'Tomorrow', time: '11:00 AM', status: 'pending', issue: 'Monitor Display Flickering' },
];

const getStatusStyle = (status) => {
  switch (status) {
    case 'upcoming': return { text: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)', icon: <AlertCircle size={14} /> };
    case 'completed': return { text: 'var(--text-secondary)', bg: 'var(--overlay-soft)', border: 'var(--border)', icon: <CheckCircle size={14} /> };
    case 'cancelled': return { text: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', icon: <XCircle size={14} /> };
    case 'pending': return { text: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.2)', icon: <Clock size={14} /> };
    default: return { text: 'var(--text-secondary)', bg: 'var(--overlay-soft)', border: 'var(--border)', icon: null };
  }
};

const getTypeIcon = (type) => {
  switch (type) {
    case 'Hardware': return <Monitor size={16} />;
    case 'Network': return <Wifi size={16} />;
    case 'Account': return <Database size={16} />;
    default: return <Monitor size={16} />;
  }
};

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

const Appointments = () => {
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);

  // Cancel confirmation modal
  const [cancelTarget, setCancelTarget] = useState(null);

  // Reschedule modal
  const [rescheduleTarget, setRescheduleTarget] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  // View Ticket modal
  const [viewTicketTarget, setViewTicketTarget] = useState(null);

  const container = useRef();
  useGSAP(() => {
    gsap.from('.apt-card', { opacity: 0, x: -20, stagger: 0.1, duration: 0.5, ease: 'power2.out' });
  }, { scope: container, dependencies: [filter] });

  // Close kebab menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = () => setMenuOpen(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [menuOpen]);

  const filtered = appointments.filter(apt => {
    const matchFilter = filter === 'all' || apt.status === filter;
    const matchSearch = apt.issue.toLowerCase().includes(search.toLowerCase()) || apt.agent.toLowerCase().includes(search.toLowerCase()) || apt.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleCancel = (id) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));
    setCancelTarget(null);
  };

  const handleReschedule = () => {
    if (!newDate) return;
    const formattedDate = new Date(newDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    setAppointments(prev => prev.map(a => a.id === rescheduleTarget ? { ...a, date: formattedDate, time: newTime || a.time, status: 'pending' } : a));
    setRescheduleTarget(null);
    setNewDate('');
    setNewTime('');
  };

  return (
    <div ref={container}>

      {/* Cancel Confirm Modal */}
      {cancelTarget && (
        <Modal title="Cancel Appointment" onClose={() => setCancelTarget(null)}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
            Are you sure you want to cancel <strong style={{ color: 'var(--text-primary)' }}>{appointments.find(a => a.id === cancelTarget)?.issue}</strong>? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setCancelTarget(null)}>Keep Appointment</button>
            <button style={{ flex: 1, padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 'var(--radius-xs)', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }} onClick={() => handleCancel(cancelTarget)}>Yes, Cancel</button>
          </div>
        </Modal>
      )}

      {/* View Ticket Modal */}
      {viewTicketTarget && (
        <Modal title={`Appointment ${viewTicketTarget.id}`} onClose={() => setViewTicketTarget(null)}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>Issue</div>
            <div style={{ fontWeight: 600, fontSize: '1.05rem' }}>{viewTicketTarget.issue}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Agent</div>
              <div style={{ fontWeight: 600 }}>{viewTicketTarget.agent}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Type</div>
              <div style={{ fontWeight: 600 }}>{viewTicketTarget.type}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Date</div>
              <div style={{ fontWeight: 600 }}>{viewTicketTarget.date}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', padding: '16px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Time</div>
              <div style={{ fontWeight: 600 }}>{viewTicketTarget.time}</div>
            </div>
          </div>
          <div style={{ padding: '12px 16px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '10px', color: '#22c55e', fontSize: '0.9rem', marginBottom: '20px' }}>
            ✅ This appointment has been completed successfully.
          </div>
          <button className="btn-primary" style={{ width: '100%', padding: '12px' }} onClick={() => setViewTicketTarget(null)}>
            Close
          </button>
        </Modal>
      )}

      {/* Reschedule Modal */}
      {rescheduleTarget && (
        <Modal title="Reschedule Appointment" onClose={() => setRescheduleTarget(null)}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
            Rescheduling: <strong style={{ color: 'var(--text-primary)' }}>{appointments.find(a => a.id === rescheduleTarget)?.issue}</strong>
          </p>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>New Date</label>
            <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
              style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Preferred Time</label>
            <select value={newTime} onChange={e => setNewTime(e.target.value)}
              style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}>
              <option value="">Keep current time</option>
              {['09:00 AM','10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setRescheduleTarget(null)}>Cancel</button>
            <button className="btn-primary" style={{ flex: 1, padding: '12px' }} onClick={handleReschedule} disabled={!newDate}>Confirm Reschedule</button>
          </div>
        </Modal>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>MY APPOINTMENTS</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track and manage your IT support sessions.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '20px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['all', 'upcoming', 'pending', 'completed', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '8px 16px',
              background: filter === f ? 'var(--text-primary)' : 'transparent',
              color: filter === f ? 'var(--bg)' : 'var(--text-secondary)',
              border: '1px solid', borderColor: filter === f ? 'var(--text-primary)' : 'var(--border)',
              borderRadius: '100px', fontSize: '0.85rem', fontWeight: 500,
              cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s ease'
            }}>{f}</button>
          ))}
        </div>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 16px 8px 36px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }} />
        </div>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Calendar size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
          <p>No appointments found.</p>
        </div>
      )}

      {/* Appointment Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '32px', top: '24px', bottom: '24px', width: '2px', background: 'var(--border)', zIndex: 0 }} />

        {filtered.map((apt) => {
          const s = getStatusStyle(apt.status);
          return (
            <div key={apt.id} className="apt-card card" style={{ padding: '24px', display: 'flex', gap: '24px', position: 'relative', zIndex: 1, alignItems: 'center' }}>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: s.text, boxShadow: `0 0 10px ${s.text}40`, flexShrink: 0 }} />

              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div style={{ minWidth: '120px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', marginBottom: '4px' }}>{apt.date}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{apt.time}</div>
                  </div>
                  <div style={{ width: '1px', height: '40px', background: 'var(--border)' }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{apt.issue}</h3>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, color: s.text, background: s.bg, border: `1px solid ${s.border}` }}>
                        {s.icon} {apt.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '0.6rem', fontWeight: 700 }}>
                          {apt.agent.split(' ').map(n => n[0]).join('')}
                        </div>
                        {apt.agent}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>{getTypeIcon(apt.type)} {apt.type}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>ID: {apt.id}</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(apt.status === 'upcoming' || apt.status === 'pending') && (
                    <>
                      <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                        onClick={() => setRescheduleTarget(apt.id)}>Reschedule</button>
                      <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239,68,68,0.3)' }}
                        onClick={() => setCancelTarget(apt.id)}>Cancel</button>
                    </>
                  )}
                  {apt.status === 'completed' && (
                    <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}
                      onClick={() => setViewTicketTarget(apt)}>View Ticket</button>
                  )}
                  {/* Three-dot menu */}
                  <div style={{ position: 'relative' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === apt.id ? null : apt.id); }}
                      style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <MoreVertical size={16} />
                    </button>
                    {menuOpen === apt.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ position: 'absolute', right: 0, top: '44px', background: '#1a1a22', border: '1px solid var(--border)', borderRadius: '12px', padding: '6px', zIndex: 100, minWidth: '180px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                        {(apt.status === 'upcoming' || apt.status === 'pending') && (
                          <>
                            <button onClick={() => { setRescheduleTarget(apt.id); setMenuOpen(null); }}
                              style={{ width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                              📅 Reschedule
                            </button>
                            <button onClick={() => { setCancelTarget(apt.id); setMenuOpen(null); }}
                              style={{ width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}
                              onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                              ✕ Cancel Appointment
                            </button>
                          </>
                        )}
                        {apt.status === 'completed' && (
                          <button onClick={() => { setViewTicketTarget(apt); setMenuOpen(null); }}
                            style={{ width: '100%', padding: '10px 14px', background: 'transparent', border: 'none', color: 'var(--text-primary)', fontSize: '0.875rem', cursor: 'pointer', textAlign: 'left', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                            🎫 View Ticket
                          </button>
                        )}
                        {apt.status === 'cancelled' && (
                          <div style={{ padding: '10px 14px', color: 'var(--text-muted)', fontSize: '0.875rem' }}>No actions available</div>
                        )}
                        <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />
                        <div style={{ padding: '10px 14px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: {apt.id}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Appointments;
