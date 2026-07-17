import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  Users, 
  Settings, 
  LogOut, 
  Activity, 
  FileText,
  Shield,
  Briefcase,
  Ticket,
  Bell,
  MessageSquare
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const role = user?.role || 'user';

  // Define links based on role
  const links = {
    user: [
      { name: 'Dashboard', path: '/dashboard/user', icon: <LayoutDashboard size={18} /> },
      { name: 'Book Appointment', path: '/dashboard/user/book', icon: <Calendar size={18} /> },
      { name: 'My Appointments', path: '/dashboard/user/appointments', icon: <Clock size={18} /> },
      { name: 'My Tickets', path: '/dashboard/user/tickets', icon: <Ticket size={18} /> },
      { name: 'Messages', path: '/dashboard/user', icon: <MessageSquare size={18} />, action: 'chat' },
      { name: 'Notifications', path: '/dashboard/user/notifications', icon: <Bell size={18} /> },
      { name: 'Profile', path: '/dashboard/user/profile', icon: <Settings size={18} /> },
    ],
    agent: [
      { name: 'Dashboard', path: '/dashboard/agent', icon: <LayoutDashboard size={18} /> },
      { name: 'Appointments', path: '/dashboard/agent/appointments', icon: <Calendar size={18} /> },
      { name: 'Assigned Tickets', path: '/dashboard/agent/tickets', icon: <Ticket size={18} /> },
      { name: 'Messages', path: '/dashboard/agent', icon: <MessageSquare size={18} />, action: 'chat' },
      { name: 'Availability', path: '/dashboard/agent/availability', icon: <Clock size={18} /> },
    ],
    admin: [
      { name: 'Dashboard', path: '/dashboard/admin', icon: <Activity size={18} /> },
      { name: 'Users', path: '/dashboard/admin/users', icon: <Users size={18} /> },
      { name: 'Agents', path: '/dashboard/admin/agents', icon: <Briefcase size={18} /> },
      { name: 'Reports', path: '/dashboard/admin/reports', icon: <FileText size={18} /> },
      { name: 'System Settings', path: '/dashboard/admin/settings', icon: <Shield size={18} /> },
    ]
  };

  const navLinks = links[role] || links.user;

  return (
    <div className="glass-sidebar" style={{
      width: '260px',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      zIndex: 100,
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      <div style={{ padding: '24px', borderBottom: '1px solid var(--border)' }}>
        <Link to="/" className="nav-brand" style={{ fontSize: '1rem' }}>
          RacedCore
        </Link>
      </div>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ 
          fontSize: '0.7rem', 
          fontFamily: 'var(--font-mono)', 
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '12px'
        }}>
          {role.toUpperCase()} PORTAL
        </div>

        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const handleClick = (e) => {
            if (link.action === 'chat') {
              e.preventDefault();
              const chatBtn = document.getElementById('chat-widget-btn');
              if (chatBtn) chatBtn.click();
            }
          };
          return (
            <Link
              key={link.name}
              to={link.path}
              onClick={handleClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: 'var(--radius-xs)',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-soft)' : 'transparent',
                border: '1px solid',
                borderColor: isActive ? 'var(--accent-border)' : 'transparent',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--overlay-light)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span style={{ color: isActive ? 'var(--accent)' : 'inherit' }}>{link.icon}</span>
              {link.name}
            </Link>
          );
        })}
      </div>

      <div style={{ padding: '24px', borderTop: '1px solid var(--border)' }}>


        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          {user?.avatar ? (
            <img src={user.avatar} alt="Profile" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--accent-border)' }} />
          ) : (
            <div style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              background: 'var(--accent-soft)',
              border: '1px solid var(--accent-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.email}</div>
          </div>
        </div>

        <button 
          onClick={logout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xs)',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,0,0,0.1)';
            e.currentTarget.style.borderColor = 'rgba(255,0,0,0.3)';
            e.currentTarget.style.color = '#ff6b6b';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
