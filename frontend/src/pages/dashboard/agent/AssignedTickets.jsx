import { useState } from 'react';
import { Ticket, Search, Filter, X, CheckCircle } from 'lucide-react';

const AssignedTickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketList, setTicketList] = useState([
    { id: 'TKT-1029', subject: 'Laptop battery not charging', user: 'j.doe@example.com', status: 'Open', priority: 'High', date: '2026-07-15', description: 'The laptop battery stopped charging. The charger LED does not light up at all.' },
    { id: 'TKT-1028', subject: 'Need access to VPN', user: 'm.smith@example.com', status: 'In Progress', priority: 'Medium', date: '2026-07-14', description: 'User needs VPN credentials configured for remote work from home.' },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#ff6b6b';
      case 'In Progress': return '#feca57';
      case 'Resolved': return '#1dd1a1';
      default: return 'var(--text-muted)';
    }
  };

  const handleResolve = (id) => {
    setTicketList(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
    setSelectedTicket(prev => prev ? { ...prev, status: 'Resolved' } : null);
  };

  return (
    <div>
      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={() => setSelectedTicket(null)}>
          <div style={{ background: 'var(--bg-elevated,#141418)', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '540px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedTicket(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
            <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Ticket {selectedTicket.id}</h3>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 12px', borderRadius: '999px', background: `${getStatusColor(selectedTicket.status)}18`, color: getStatusColor(selectedTicket.status), fontSize: '0.8rem', fontWeight: 600 }}>{selectedTicket.status}</span>
              <span style={{ padding: '4px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{selectedTicket.priority} Priority</span>
            </div>
            <h4 style={{ marginBottom: '12px' }}>{selectedTicket.subject}</h4>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '20px', fontSize: '0.95rem' }}>{selectedTicket.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>User</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedTicket.user}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '10px', padding: '14px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Date</div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{selectedTicket.date}</div>
              </div>
            </div>
            {selectedTicket.status !== 'Resolved' ? (
              <button className="btn-primary" style={{ width: '100%', padding: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={() => handleResolve(selectedTicket.id)}>
                <CheckCircle size={18} /> Mark as Resolved
              </button>
            ) : (
              <div style={{ textAlign: 'center', padding: '14px', background: 'rgba(29,209,161,0.08)', border: '1px solid rgba(29,209,161,0.2)', borderRadius: '10px', color: '#1dd1a1', fontWeight: 600 }}>
                ✅ Ticket Resolved
              </div>
            )}
          </div>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Assigned Tickets</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage and resolve tickets assigned to you.</p>
        </div>
      </div>

      {/* Controls */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        background: 'rgba(255, 255, 255, 0.02)',
        padding: '16px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border)'
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search assigned tickets..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 48px',
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xs)',
              color: 'var(--text-primary)',
              outline: 'none'
            }}
          />
        </div>
        <button onClick={() => setShowFilters(prev => !prev)} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '0 20px',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xs)',
          color: 'var(--text-primary)',
          cursor: 'pointer'
        }}>
          <Filter size={18} />
          Filter
        </button>
      </div>
      {showFilters && (
        <div style={{ display: 'flex', gap: '8px', margin: '-12px 0 24px', flexWrap: 'wrap' }}>
          {['All', 'Open', 'In Progress', 'Resolved'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '8px 14px',
                borderRadius: '999px',
                border: '1px solid',
                borderColor: statusFilter === status ? 'var(--accent-border)' : 'var(--border)',
                background: statusFilter === status ? 'var(--accent-soft)' : 'transparent',
                color: statusFilter === status ? 'var(--accent)' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {status}
            </button>
          ))}
        </div>
      )}

      {/* Ticket List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {ticketList.filter(t => {
          const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
          return matchesSearch && matchesStatus;
        }).map(ticket => (
          <div key={ticket.id}
            onClick={() => setSelectedTicket(ticket)}
            style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '20px',
            cursor: 'pointer',
            transition: 'border-color 0.2s, background-color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Ticket size={20} color="var(--accent)" />
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{ticket.subject}</h3>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  <span>{ticket.id}</span>
                  <span>•</span>
                  <span>User: {ticket.user}</span>
                  <span>•</span>
                  <span>{ticket.date}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>Priority</div>
                <div style={{ fontWeight: 500 }}>{ticket.priority}</div>
              </div>
              
              <div style={{
                padding: '6px 12px',
                borderRadius: '20px',
                background: `${getStatusColor(ticket.status)}15`,
                color: getStatusColor(ticket.status),
                fontSize: '0.85rem',
                fontWeight: 600,
                minWidth: '100px',
                textAlign: 'center'
              }}>
                {ticket.status}
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssignedTickets;
