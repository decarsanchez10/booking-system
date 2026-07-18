import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck, Calendar, Ticket, AlertCircle, Info } from 'lucide-react';
import api from '../../../lib/api';

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

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const pollRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data || []);
    } catch (err) {
      console.error('Failed to fetch notifications', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    pollRef.current = setInterval(fetchNotifications, 5000);
    return () => clearInterval(pollRef.current);
  }, []);

  const unreadCount = notifications.filter(n => !n.read_at).length;

  const markAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
    } catch (err) {
      console.error(err);
    }
  };

  const markOneRead = async (id) => {
    try {
      await api.post(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const parseData = (dataStr) => {
    try {
      return JSON.parse(dataStr);
    } catch {
      return {};
    }
  };

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
        <button onClick={markAllRead} disabled={unreadCount === 0} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
          background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)',
          color: 'var(--text-secondary)', cursor: unreadCount === 0 ? 'not-allowed' : 'pointer', fontSize: '0.9rem',
          transition: 'all 0.2s',
          opacity: unreadCount === 0 ? 0.55 : 1,
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>
          <CheckCheck size={16} />
          Mark all as read
        </button>
      </div>

      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <Bell size={48} style={{ marginBottom: '16px', opacity: 0.3 }} />
          <p>You're all caught up! No new notifications.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map(notif => {
            const parsedData = parseData(notif.data);
            const isRead = !!notif.read_at;
            const notifType = parsedData.type || 'info';
            
            return (
            <div key={notif.id} style={{
              display: 'flex',
              gap: '16px',
              padding: '20px',
              background: isRead ? 'rgba(255,255,255,0.02)' : 'rgba(0,240,255,0.04)',
              border: `1px solid ${isRead ? 'var(--border)' : 'rgba(0,240,255,0.15)'}`,
              borderRadius: '14px',
              transition: 'all 0.2s',
              cursor: 'pointer',
            }}
              onClick={() => !isRead && markOneRead(notif.id)}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(0,240,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = isRead ? 'var(--border)' : 'rgba(0,240,255,0.15)'}
            >
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: getIconBg(notifType),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {getIcon(notifType)}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: isRead ? 400 : 600 }}>{parsedData.title || notif.type}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', flexShrink: 0, marginLeft: '12px' }}>
                    {new Date(notif.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{parsedData.message}</p>
              </div>

              {!isRead && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent)', flexShrink: 0, marginTop: '8px' }} />
              )}
            </div>
          )})}
        </div>
      )}
    </div>
  );
};

export default Notifications;
