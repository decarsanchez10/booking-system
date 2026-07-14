import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, Filter, CheckCircle, XCircle, Clock, MoreHorizontal } from 'lucide-react';

const MOCK_QUEUE = [
  { id: 'APT-1048', name: 'Alex Rivera', issue: 'Network Troubleshooting', date: 'Today', time: '10:00 AM', status: 'active', type: 'Network' },
  { id: 'APT-1049', name: 'James Wilson', issue: 'Monitor Display Flickering', date: 'Today', time: '11:00 AM', status: 'pending', type: 'Hardware' },
  { id: 'APT-1050', name: 'Dr. Patricia Kim', issue: 'Lab Software License', date: 'Today', time: '01:30 PM', status: 'pending', type: 'Software' },
  { id: 'APT-1042', name: 'Sarah Jenkins', issue: 'Battery Replacement', date: 'Yesterday', time: '02:30 PM', status: 'completed', type: 'Hardware' },
  { id: 'APT-1035', name: 'David Chen', issue: 'Adobe CC Install', date: 'Oct 28', time: '01:15 PM', status: 'completed', type: 'Software' },
];

const getStatusBadge = (status) => {
  switch(status) {
    case 'active': return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Active</span>;
    case 'pending': return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.2)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Pending</span>;
    case 'completed': return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', background: 'var(--overlay-soft)', color: 'var(--text-secondary)', border: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Completed</span>;
    default: return null;
  }
};

const Appointments = () => {
  const container = useRef();
  const [filter, setFilter] = useState('all');

  useGSAP(() => {
    gsap.from('.table-row', {
      opacity: 0,
      y: 10,
      stagger: 0.05,
      duration: 0.4,
      ease: 'power2.out'
    });
  }, { scope: container, dependencies: [filter] });

  const filteredQueue = MOCK_QUEUE.filter(apt => filter === 'all' || apt.status === filter);

  return (
    <div ref={container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>APPOINTMENT QUEUE</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your assigned tickets and upcoming sessions.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'active', 'pending', 'completed'].map(f => (
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
              <input type="text" placeholder="Search ID or Name..." style={{ padding: '8px 16px 8px 36px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem', width: '250px' }} />
            </div>
            <button className="btn-secondary" style={{ padding: '8px 12px' }}>
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>Ticket ID</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>User / Issue</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>Schedule</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueue.map((apt, i) => (
                <tr key={i} className="table-row" style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--overlay-subtle)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>{apt.id}</td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{apt.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{apt.issue}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{apt.date}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{apt.time}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {getStatusBadge(apt.status)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {apt.status === 'pending' && (
                        <>
                          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.3)' }}><CheckCircle size={14} style={{ marginRight: '4px' }}/> Accept</button>
                          <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}><XCircle size={14} style={{ marginRight: '4px' }}/> Reject</button>
                        </>
                      )}
                      {apt.status === 'active' && (
                        <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', background: '#22c55e' }}>Complete</button>
                      )}
                      <button className="btn-secondary" style={{ padding: '6px', width: '30px' }}><MoreHorizontal size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Showing {filteredQueue.length} of {MOCK_QUEUE.length} entries</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} disabled>Previous</button>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Next</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Appointments;
