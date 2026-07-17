import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, Filter, CheckCircle, XCircle, MoreHorizontal } from 'lucide-react';

import api from '../../../lib/api';

const MOCK_QUEUE = [];

const getStatusBadge = (status) => {
  switch(status?.toLowerCase()) {
    case 'approved': return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Approved</span>;
    case 'pending': return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', background: 'rgba(234, 179, 8, 0.1)', color: '#eab308', border: '1px solid rgba(234, 179, 8, 0.2)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Pending</span>;
    case 'cancelled': return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Cancelled</span>;
    case 'completed': return <span style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', background: 'var(--overlay-soft)', color: 'var(--text-secondary)', border: '1px solid var(--border)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>Completed</span>;
    default: return null;
  }
};

const Appointments = () => {
  const container = useRef();
  const [filter, setFilter] = useState('all');
  const [queue, setQueue] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showTypeFilter, setShowTypeFilter] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);


  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/agent/appointments');
      setQueue(res.data.data);
    } catch (err) {
      console.error('Failed to fetch agent appointments', err);
    }
  };

  useGSAP(() => {
    if (filteredQueue.length > 0) {
      gsap.from('.table-row', {
        opacity: 0,
        y: 10,
        stagger: 0.05,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  }, { scope: container, dependencies: [filter, queue] });

  const filteredQueue = queue.filter(apt => {
    const matchesStatus = filter === 'all' || apt.status?.toLowerCase() === filter;
    const matchesType = typeFilter === 'all' || apt.category?.toLowerCase() === typeFilter;
    const term = search.toLowerCase();
    const matchesSearch = !term || apt.id.toString().includes(term) || apt.user?.name.toLowerCase().includes(term) || apt.description?.toLowerCase().includes(term);
    return matchesStatus && matchesType && matchesSearch;
  });

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/agent/appointments/${id}/status`, { status });
      setQueue(prev => prev.map(apt => apt.id === id ? { ...apt, status } : apt));
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update appointment status');
    }
  };

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
            {['all', 'approved', 'pending', 'completed', 'cancelled'].map(f => (
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
              <input type="text" placeholder="Search ID or Name..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '8px 16px 8px 36px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem', width: '250px' }} />
            </div>
            <button className="btn-secondary" type="button" onClick={() => setShowTypeFilter(prev => !prev)} style={{ padding: '8px 12px' }}>
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>
        {showTypeFilter && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', margin: '-12px 0 20px' }}>
            {['all', 'hardware', 'software', 'network'].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '100px',
                  border: '1px solid',
                  borderColor: typeFilter === type ? 'var(--accent-border)' : 'var(--border)',
                  background: typeFilter === type ? 'var(--accent-soft)' : 'transparent',
                  color: typeFilter === type ? 'var(--accent)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        )}

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
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>{apt.user?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{apt.description || apt.category}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>{new Date(apt.appointment_date).toLocaleDateString()}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(apt.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {getStatusBadge(apt.status)}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      {apt.status?.toLowerCase() === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(apt.id, 'Approved')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.3)' }}><CheckCircle size={14} style={{ marginRight: '4px' }}/> Accept</button>
                          <button onClick={() => updateStatus(apt.id, 'Cancelled')} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}><XCircle size={14} style={{ marginRight: '4px' }}/> Reject</button>
                        </>
                      )}
                      {apt.status?.toLowerCase() === 'approved' && (
                        <button onClick={() => updateStatus(apt.id, 'Completed')} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', background: '#22c55e' }}>Complete</button>
                      )}
                      <button onClick={() => setSelectedAppointment(apt)} className="btn-secondary" style={{ padding: '6px', width: '30px' }}><MoreHorizontal size={14}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Showing {filteredQueue.length} of {queue.length} entries</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} disabled>Previous</button>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} disabled>Next</button>
          </div>
        </div>

      </div>
      {selectedAppointment && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedAppointment(null)}>
          <div className="card" style={{ padding: '28px', width: '100%', maxWidth: '420px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: '16px' }}>{selectedAppointment.id}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>{selectedAppointment.user?.name}</p>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>{selectedAppointment.description || selectedAppointment.category} · {new Date(selectedAppointment.appointment_date).toLocaleDateString()} at {new Date(selectedAppointment.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            <button className="btn-primary" onClick={() => setSelectedAppointment(null)} style={{ width: '100%', padding: '10px' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
