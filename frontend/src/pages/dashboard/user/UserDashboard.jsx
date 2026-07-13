import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../../../context/AuthContext';
import { Calendar, Clock, ArrowRight, Monitor, Wifi, Database } from 'lucide-react';

const UserDashboard = () => {
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
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>WELCOME, {user?.name?.toUpperCase()}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Here's an overview of your IT support activity.</p>
        </div>
        <Link to="/dashboard/user/book" className="btn-primary" style={{ padding: '12px 24px' }}>
          <Calendar size={18} /> Book New Appointment
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        {[
          { label: 'Upcoming', value: '1', color: 'var(--text-primary)' },
          { label: 'Completed', value: '12', color: 'var(--text-primary)' },
          { label: 'Pending', value: '0', color: 'var(--text-primary)' },
          { label: 'Cancelled', value: '2', color: 'var(--text-muted)' }
        ].map((stat, i) => (
          <div key={i} className="dash-card card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '2.5rem', fontFamily: 'var(--font-display)', color: stat.color, marginBottom: '8px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="dash-card card glowing-border" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent)' }}></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: 700 }}>
                  Next Appointment
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>Hardware Diagnostic</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>MacBook Pro Battery Replacement Consultation</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', marginBottom: '4px' }}>Today, 2:30 PM</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>in 45 mins</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '20px', alignItems: 'center' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 700 }}>SJ</div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sarah Jenkins</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hardware Specialist</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Reschedule</button>
                <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Join Meeting</button>
              </div>
            </div>
          </div>

          <div className="dash-card card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Recent Bookings
              <Link to="/dashboard/user/appointments" style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>View all <ArrowRight size={14}/></Link>
            </h3>
            
            {[
              { title: 'Campus Wi-Fi Connectivity', date: 'Nov 12, 2023', agent: 'Mike Ross', status: 'Completed' },
              { title: 'Software Installation (Adobe)', date: 'Oct 28, 2023', agent: 'David Chen', status: 'Completed' }
            ].map((booking, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '16px 0',
                borderBottom: i === 0 ? '1px solid var(--border)' : 'none'
              }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.95rem', marginBottom: '4px' }}>{booking.title}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{booking.date} • {booking.agent}</div>
                </div>
                <div style={{ 
                  padding: '4px 10px', 
                  borderRadius: '100px', 
                  fontSize: '0.75rem', 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)' 
                }}>
                  {booking.status}
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="dash-card card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Available Agents Today</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { name: 'David Chen', specialty: 'Software', icon: <Monitor size={16}/>, available: '14 slots' },
                { name: 'Mike Ross', specialty: 'Network', icon: <Wifi size={16}/>, available: '8 slots' },
                { name: 'Elena Rodriguez', specialty: 'Account', icon: <Database size={16}/>, available: '22 slots' },
              ].map((agent, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {agent.name.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{agent.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {agent.icon} {agent.specialty}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600 }}>{agent.available}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-card card" style={{ padding: '24px', background: 'var(--accent-soft)', borderColor: 'var(--accent-border)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--accent)' }}>System Announcement</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              The central campus Wi-Fi (OBSIDIAN-SECURE) will undergo scheduled maintenance tonight between 2:00 AM and 4:00 AM. Expect intermittent connectivity issues.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
