import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../../../context/AuthContext';
import { Calendar, Users, Star, Clock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

const AgentDashboard = () => {
  const { user } = useAuth();
  const container = useRef();

  useGSAP(() => {
    gsap.from('.dash-card', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, { scope: container });

  return (
    <div ref={container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>AGENT PORTAL</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back, {user?.name}. Here is your schedule for today.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }}></span>
            Accepting Appointments
          </div>
          <Link to="/dashboard/agent/availability" className="btn-secondary" style={{ padding: '10px 20px' }}>
            Manage Schedule
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {[
          { label: "Today's Appts", value: '8', icon: <Calendar size={20} />, color: 'var(--text-primary)' },
          { label: 'Completed', value: '3', icon: <CheckCircle size={20} />, color: 'var(--text-primary)' },
          { label: 'Average Rating', value: '4.9', icon: <Star size={20} />, color: 'var(--accent)' },
          { label: 'Hours Logged', value: '3.5', icon: <Clock size={20} />, color: 'var(--text-muted)' }
        ].map((stat, i) => (
          <div key={i} className="dash-card card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                {stat.label}
              </div>
              <div style={{ color: stat.color }}>{stat.icon}</div>
            </div>
            <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column: Live Queue */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="dash-card card glowing-border" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent)' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                    Current Session
                  </div>
                  <span className="live-indicator" style={{ display: 'flex', width: '6px', height: '6px', background: '#ef4444', borderRadius: '50%', boxShadow: '0 0 8px rgba(239,68,68,0.8)' }}></span>
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Network Troubleshooting</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Alex Rivera • Computer Science Student</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', marginBottom: '4px', color: '#22c55e' }}>00:14:32</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Elapsed Time</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Ticket ID: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>APT-1048</span></div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>Add Notes</button>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.8rem', background: '#22c55e' }}>Complete Session</button>
              </div>
            </div>
          </div>

          <div className="dash-card card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Upcoming Queue
              <Link to="/dashboard/agent/appointments" style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>Manage all <ArrowRight size={14}/></Link>
            </h3>
            
            {[
              { time: '11:00 AM', name: 'James Wilson', issue: 'Monitor Display Flickering', type: 'Hardware' },
              { time: '01:30 PM', name: 'Dr. Patricia Kim', issue: 'Lab Software License Activation', type: 'Software' },
              { time: '02:00 PM', name: 'Marcus Johnson', issue: 'Unable to access student portal', type: 'Account' }
            ].map((booking, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                padding: '16px 0',
                borderBottom: i !== 2 ? '1px solid var(--border)' : 'none',
                gap: '24px'
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', width: '80px' }}>{booking.time}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: '0.95rem', marginBottom: '4px' }}>{booking.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{booking.issue}</div>
                </div>
                <div style={{ 
                  padding: '4px 10px', 
                  borderRadius: '4px', 
                  fontSize: '0.75rem', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {booking.type}
                </div>
                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>Start</button>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="dash-card card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Recent Feedback</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'Alex R.', rating: 5, comment: 'Super fast resolution. Thanks!' },
                { name: 'Prof. Davis', rating: 5, comment: 'Very knowledgeable agent.' },
              ].map((fb, i) => (
                <div key={i} style={{ paddingBottom: '16px', borderBottom: i === 0 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{fb.name}</div>
                    <div style={{ display: 'flex', gap: '2px', color: 'var(--accent)' }}>
                      {[...Array(5)].map((_, j) => <Star key={j} size={12} fill={j < fb.rating ? 'var(--accent)' : 'none'} />)}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{fb.comment}"</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
