import { useState } from 'react';
import { Ticket, Search, Filter } from 'lucide-react';

const AssignedTickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Mock data for Phase 1 UI
  const tickets = [
    { id: 'TKT-1029', subject: 'Laptop battery not charging', user: 'j.doe@example.com', status: 'Open', priority: 'High', date: '2026-07-15' },
    { id: 'TKT-1028', subject: 'Need access to VPN', user: 'm.smith@example.com', status: 'In Progress', priority: 'Medium', date: '2026-07-14' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#ff6b6b';
      case 'In Progress': return '#feca57';
      case 'Resolved': return '#1dd1a1';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div>
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
        <button style={{
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

      {/* Ticket List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tickets.map(ticket => (
          <div key={ticket.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            padding: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
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
