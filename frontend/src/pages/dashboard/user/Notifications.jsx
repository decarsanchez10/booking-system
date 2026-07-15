import { useRef } from 'react';
import { Bell, CheckCheck, Calendar, Ticket, AlertCircle, Info } from 'lucide-react';

const getIcon = (type) => {
  switch (type) {
    case 'appointment': return <Calendar size={18} color="#6C63FF" />;
    case 'ticket': return <Ticket size={18} color="var(--accent)" />;
    case 'alert': return <AlertCircle size={18} color="#FF6B6B" />;
    default: return <Info size={18} color="#1DD1A1" />;
  }
};

const getIconBg = (type) => {
  switch (type) {
    case 'appointment': return 'rgba(108, 99, 255, 0.12)';
    case 'ticket': return 'rgba(0, 240, 255, 0.12)';
    case 'alert': return 'rgba(255, 107, 107, 0.12)';
    default: return 'rgba(29, 209, 161, 0.12)';
  }
};

const mockNotifications = [
  {
    id: 1,
    type: 'appointment',
    title: 'Appointment Reminder',
    message: 'Your appointment with Agent Mike is tomorrow at 10:00 AM.',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'ticket',
    title: 'Ticket #TKT-1029 Updated',
    message: 'Your ticket status has been updated to "In Progress".',
    time: '4 hours ago',
    read: false,
  },
  {
    id: 3,
    type: 'alert',
    title: 'Scheduled Maintenance',
    message: 'System maintenance scheduled for July 20, 2026 from 2AM–4AM.',
    time: '1 day ago',
    read: true,
  },
  {
    id: 4,
    type: 'info',
    title: 'Welcome to Obsidian IT Support!',
    message: 'Your account is set up. Book your first appointment or browse the knowledge base.',
    time: '3 days ago',
    read: true,
  },
];

const Notifications = () => {
  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{ fontSize: '0.85rem', padding: '2px 10px', borderRadius: '999px', background: 'rgba(0,240,255,0.12)', color: 'var(--accent)', border: '1px solid rgba(0,240,255,0.2)', fontWeight: 600 }}>
                {unreadCount} new
              </span>
            )}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Stay updated on your tickets, appointments, and announcements.</p>
        </div>
        <button style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
          background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)',
          color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.9rem',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
          <CheckCheck size={16} />
          Mark all as read
        </button>
      </div>

      {mockNotifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <Bell size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <p>You're all caught up! No new notifications.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {mockNotifications.map(notif => (
            <div key={notif.id} style={{
              display: 'flex',
              gap: '16px',
              padding: '20px',
              background: notif.read ? 'rgba(255,255,255,0.02)' : 'rgba(0,240,255,0.04)',
              border: `1px solid ${notif.read ? 'var(--border)' : 'rgba(0,240,255,0.15)'}`,
              borderRadius: '14px',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,240,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = notif.read ? 'var(--border)' : 'rgba(0,240,255,0.15)'}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: getIconBg(notif.type),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {getIcon(notif.type)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: notif.read ? 400 : 600 }}>{notif.title}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '12px' }}>{notif.time}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{notif.message}</p>
              </div>

              {!notif.read && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: '8px' }} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
