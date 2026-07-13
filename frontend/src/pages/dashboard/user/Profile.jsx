import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../../../context/AuthContext';
import { Camera, Shield, Bell, Save } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const container = useRef();

  useGSAP(() => {
    gsap.from('.profile-section', {
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, { scope: container });

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  return (
    <div ref={container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>PROFILE SETTINGS</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your personal information and preferences.</p>
        </div>
        <button onClick={handleSave} className="btn-primary" disabled={isSaving}>
          <Save size={16} style={{ marginRight: '8px' }} />
          {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
        
        {/* Left Column: Avatar & Quick Stats */}
        <div className="profile-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '50%', 
              background: 'var(--accent-soft)', 
              border: '2px solid var(--accent)', 
              margin: '0 auto 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)',
              fontSize: '3rem',
              fontWeight: 700,
              position: 'relative'
            }}>
              {user?.name?.[0]?.toUpperCase()}
              <button style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                color: 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}>
                <Camera size={16} />
              </button>
            </div>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Student • Computer Science</p>
            <div style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '100px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              ID: STU-849201
            </div>
          </div>

          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="var(--accent)" /> Security
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Two-Factor Auth</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Not configured</div>
              </div>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Enable</button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Password</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last changed 3 months ago</div>
              </div>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Update</button>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="profile-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>First Name</label>
                <input type="text" defaultValue={user?.name?.split(' ')[0]} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Last Name</label>
                <input type="text" defaultValue={user?.name?.split(' ')[1] || ''} style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Email Address</label>
                <input type="email" defaultValue={user?.email} disabled style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-muted)', outline: 'none', cursor: 'not-allowed' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Phone Number</label>
                <input type="tel" defaultValue="+1 (555) 123-4567" style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Department / Major</label>
                <select style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }}>
                  <option>Computer Science</option>
                  <option>Engineering</option>
                  <option>Business</option>
                  <option>Arts</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} /> Notification Preferences
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: 'Appointment Reminders', desc: 'Receive emails 24 hours before your appointment.', default: true },
                { title: 'Status Updates', desc: 'Get notified when an agent accepts, completes, or cancels a booking.', default: true },
                { title: 'System Announcements', desc: 'Important network and system maintenance alerts.', default: false },
              ].map((pref, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', cursor: 'pointer' }}>
                  <input type="checkbox" defaultChecked={pref.default} style={{ marginTop: '4px', accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
                  <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 500, marginBottom: '2px' }}>{pref.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{pref.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
