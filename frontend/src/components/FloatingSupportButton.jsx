import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, X, Ticket, BookOpen, Calendar, Phone, ChevronRight } from 'lucide-react';

const actions = [
  { icon: Ticket, label: 'Open a Ticket', sub: 'Get help from a technician', path: '/dashboard/user/tickets', color: '#00F0FF' },
  { icon: Calendar, label: 'Book Appointment', sub: 'Schedule on-site or remote', path: '/dashboard/user/book', color: '#6C63FF' },
  { icon: BookOpen, label: 'Knowledge Base', sub: 'Browse FAQs & guides', path: '/knowledge-base', color: '#FECA57' },
  { icon: Phone, label: 'Contact Us', sub: 'Email, phone, or chat', path: '/contact', color: '#1DD1A1' },
];

const FloatingSupportButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '28px', right: '28px', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>

      {/* Action Menu */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        opacity: open ? 1 : 0,
        transform: open ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.95)',
        pointerEvents: open ? 'auto' : 'none',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        transformOrigin: 'bottom right',
      }}>
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} to={action.path} onClick={() => setOpen(false)} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '14px 18px',
              background: 'rgba(15,15,20,0.92)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              textDecoration: 'none',
              color: 'var(--text-primary)',
              transition: 'all 0.2s',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${action.color}40`; e.currentTarget.style.background = `rgba(15,15,20,0.98)`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(15,15,20,0.92)'; }}
            >
              <div style={{
                width: '38px', height: '38px', borderRadius: '10px',
                background: `${action.color}18`,
                border: `1px solid ${action.color}30`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={18} color={action.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{action.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{action.sub}</div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </Link>
          );
        })}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: open
            ? 'rgba(255,255,255,0.08)'
            : 'linear-gradient(135deg, #00F0FF, #6C63FF)',
          border: open ? '1px solid rgba(255,255,255,0.15)' : 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: open ? 'none' : '0 4px 24px rgba(0,240,255,0.35)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: open ? 'rotate(0deg)' : 'rotate(0deg)',
        }}
        aria-label="Support menu"
      >
        <div style={{
          transition: 'transform 0.25s, opacity 0.2s',
          transform: open ? 'rotate(90deg) scale(1.1)' : 'rotate(0deg) scale(1)',
        }}>
          {open ? <X size={22} color="#fff" /> : <MessageCircle size={22} color="#fff" />}
        </div>
      </button>
    </div>
  );
};

export default FloatingSupportButton;
