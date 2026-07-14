import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Calendar, Clock, Monitor, Wifi, Database, Search, Filter, MoreVertical, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const MOCK_APPOINTMENTS = [
  { id: 'APT-1042', agent: 'Sarah Jenkins', type: 'Hardware', date: 'Today', time: '02:30 PM', status: 'upcoming', issue: 'MacBook Pro Battery Replacement Consultation' },
  { id: 'APT-1038', agent: 'Mike Ross', type: 'Network', date: 'Nov 12, 2023', time: '10:00 AM', status: 'completed', issue: 'Campus Wi-Fi Connectivity' },
  { id: 'APT-1035', agent: 'David Chen', type: 'Software', date: 'Oct 28, 2023', time: '01:15 PM', status: 'completed', issue: 'Software Installation (Adobe CC)' },
  { id: 'APT-1022', agent: 'Elena Rodriguez', type: 'Account', date: 'Sep 15, 2023', time: '09:30 AM', status: 'cancelled', issue: 'Password Reset / MFA Issue' },
  { id: 'APT-1045', agent: 'James Wilson', type: 'Hardware', date: 'Tomorrow', time: '11:00 AM', status: 'pending', issue: 'Monitor Display Flickering' },
];

const getStatusColor = (status) => {
  switch(status) {
    case 'upcoming': return { text: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)', icon: <AlertCircle size={14} /> };
    case 'completed': return { text: 'var(--text-secondary)', bg: 'var(--overlay-soft)', border: 'var(--border)', icon: <CheckCircle size={14} /> };
    case 'cancelled': return { text: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', icon: <XCircle size={14} /> };
    case 'pending': return { text: '#eab308', bg: 'rgba(234, 179, 8, 0.1)', border: 'rgba(234, 179, 8, 0.2)', icon: <Clock size={14} /> };
    default: return { text: 'var(--text-secondary)', bg: 'var(--overlay-soft)', border: 'var(--border)', icon: null };
  }
};

const getTypeIcon = (type) => {
  switch(type) {
    case 'Hardware': return <Monitor size={16} />;
    case 'Network': return <Wifi size={16} />;
    case 'Software': return <Monitor size={16} />;
    case 'Account': return <Database size={16} />;
    default: return <Monitor size={16} />;
  }
};

const Appointments = () => {
  const [filter, setFilter] = useState('all');
  const container = useRef();

  useGSAP(() => {
    gsap.from('.apt-card', {
      opacity: 0,
      x: -20,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, { scope: container, dependencies: [filter] });

  const filteredAppointments = MOCK_APPOINTMENTS.filter(apt => filter === 'all' || apt.status === filter);

  return (
    <div ref={container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>MY APPOINTMENTS</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Track and manage your IT support sessions.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '20px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'upcoming', 'pending', 'completed', 'cancelled'].map(f => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                background: filter === f ? 'var(--text-primary)' : 'transparent',
                color: filter === f ? 'var(--bg)' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: filter === f ? 'var(--text-primary)' : 'var(--border)',
                borderRadius: '100px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease'
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search..." style={{ padding: '8px 16px 8px 36px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem' }} />
          </div>
          <button className="btn-secondary" style={{ padding: '8px 12px' }}>
            <Filter size={16} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
        {/* Timeline line */}
        <div style={{ position: 'absolute', left: '32px', top: '24px', bottom: '24px', width: '2px', background: 'var(--border)', zIndex: 0 }}></div>

        {filteredAppointments.map((apt) => {
          const statusStyle = getStatusColor(apt.status);
          
          return (
            <div key={apt.id} className="apt-card card" style={{ padding: '24px', display: 'flex', gap: '24px', position: 'relative', zIndex: 1, alignItems: 'center' }}>
              
              {/* Timeline Dot */}
              <div style={{ 
                width: '16px', 
                height: '16px', 
                borderRadius: '50%', 
                background: statusStyle.text, 
                boxShadow: `0 0 10px ${statusStyle.text}40`,
                marginLeft: '1px' // align with line
              }}></div>

              <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                  <div style={{ minWidth: '120px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', marginBottom: '4px' }}>{apt.date}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{apt.time}</div>
                  </div>

                  <div style={{ width: '1px', height: '40px', background: 'var(--border)' }}></div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{apt.issue}</h3>
                      <span style={{ 
                        display: 'flex', alignItems: 'center', gap: '4px',
                        padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600,
                        color: statusStyle.text, background: statusStyle.bg, border: `1px solid ${statusStyle.border}`
                      }}>
                        {statusStyle.icon} {apt.status}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '0.6rem', fontWeight: 700 }}>
                          {apt.agent.split(' ').map(n => n[0]).join('')}
                        </div>
                        {apt.agent}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {getTypeIcon(apt.type)} {apt.type}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>ID: {apt.id}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  {(apt.status === 'upcoming' || apt.status === 'pending') && (
                    <>
                      <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Reschedule</button>
                      <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}>Cancel</button>
                    </>
                  )}
                  {apt.status === 'completed' && (
                    <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>View Ticket</button>
                  )}
                  <button style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <MoreVertical size={16} />
                  </button>
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
