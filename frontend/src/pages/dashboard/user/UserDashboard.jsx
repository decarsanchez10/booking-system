import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../../../context/AuthContext';
import { Calendar, ArrowRight, Monitor, Wifi, Database } from 'lucide-react';
import api from '../../../lib/api';

const UserDashboard = () => {
  const { user } = useAuth();
  const container = useRef();
  const [stats, setStats] = useState(null);
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, agentsRes] = await Promise.all([
          api.get('/user/dashboard'),
          api.get('/user/agents')
        ]);
        setStats(dashRes.data);
        setAgents(agentsRes.data);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };
    fetchData();
  }, []);

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
          { label: 'Upcoming', value: stats?.upcoming || '0', color: 'var(--text-primary)' },
          { label: 'Completed', value: stats?.completed || '0', color: 'var(--text-primary)' },
          { label: 'Pending', value: stats?.pending || '0', color: 'var(--text-primary)' },
          { label: 'Cancelled', value: stats?.cancelled || '0', color: 'var(--text-muted)' }
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
          
          {stats?.recent_appointments && stats.recent_appointments.length > 0 ? (
            <div className="dash-card card glowing-border" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--accent)' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', fontWeight: 700 }}>
                    Next Appointment
                  </div>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{stats.recent_appointments[0].category || 'Consultation'}</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{stats.recent_appointments[0].description}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', marginBottom: '4px' }}>{new Date(stats.recent_appointments[0].appointment_date).toLocaleDateString()}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(stats.recent_appointments[0].appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', borderTop: '1px solid var(--border)', paddingTop: '20px', alignItems: 'center' }}>
                {stats.recent_appointments[0].agent?.avatar ? (
                  <img src={stats.recent_appointments[0].agent.avatar} alt="Agent" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '0.8rem', fontWeight: 700 }}>
                    {stats.recent_appointments[0].agent ? stats.recent_appointments[0].agent.name.charAt(0) : '?'}
                  </div>
                )}
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{stats.recent_appointments[0].agent ? stats.recent_appointments[0].agent.name : 'Unassigned'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>IT Support Agent</div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                  <Link to="/dashboard/user/appointments" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Reschedule</Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="dash-card card" style={{ padding: '32px', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-secondary)' }}>You have no upcoming appointments.</p>
              <Link to="/dashboard/user/book" className="btn-primary" style={{ display: 'inline-block', marginTop: '16px', padding: '10px 20px' }}>Book Now</Link>
            </div>
          )}

          <div className="dash-card card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Recent Bookings
              <Link to="/dashboard/user/appointments" style={{ fontSize: '0.85rem', color: 'var(--accent)', textTransform: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>View all <ArrowRight size={14}/></Link>
            </h3>
            
            {stats?.recent_appointments && stats.recent_appointments.length > 0 ? stats.recent_appointments.slice(0, 3).map((booking, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '16px 0',
                borderBottom: i === 0 ? '1px solid var(--border)' : 'none'
              }}>
                <div>
                  <div style={{ fontWeight: 500, fontSize: '0.95rem', marginBottom: '4px' }}>{booking.category}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{new Date(booking.appointment_date).toLocaleDateString()} • {booking.agent ? booking.agent.name : 'Unassigned'}</div>
                </div>
                <div style={{ 
                  padding: '4px 10px', 
                  borderRadius: '100px', 
                  fontSize: '0.75rem', 
                  background: 'var(--overlay-soft)', 
                  border: '1px solid var(--overlay-medium)' 
                }}>
                  {booking.status}
                </div>
              </div>
            )) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No recent bookings found.</p>
            )}
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="dash-card card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Available Agents Today</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {agents.length > 0 ? agents.slice(0, 3).map((agent, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {agent.avatar ? (
                    <img src={agent.avatar} alt={agent.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {agent.name.charAt(0)}
                    </div>
                  )}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{agent.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Monitor size={14}/> Support Agent
                    </div>
                  </div>
                  <Link to="/dashboard/user/book" style={{ fontSize: '0.8rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Book</Link>
                </div>
              )) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>No agents currently available.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
