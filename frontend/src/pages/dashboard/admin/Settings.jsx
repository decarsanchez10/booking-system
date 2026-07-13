import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Save, Building, Mail, Shield, Clock, Layout } from 'lucide-react';

const Settings = () => {
  const container = useRef();
  const [activeTab, setActiveTab] = useState('organization');
  const [isSaving, setIsSaving] = useState(false);

  useGSAP(() => {
    gsap.from('.settings-content', {
      opacity: 0,
      y: 10,
      duration: 0.3,
      ease: 'power2.out'
    });
  }, { scope: container, dependencies: [activeTab] });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1000);
  };

  const TABS = [
    { id: 'organization', label: 'Organization', icon: <Building size={16} /> },
    { id: 'email', label: 'Email Server', icon: <Mail size={16} /> },
    { id: 'security', label: 'Security & JWT', icon: <Shield size={16} /> },
    { id: 'booking', label: 'Booking Rules', icon: <Clock size={16} /> },
    { id: 'theme', label: 'Theme & Brand', icon: <Layout size={16} /> },
  ];

  return (
    <div ref={container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>SYSTEM SETTINGS</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Configure global platform behavior and integrations.</p>
        </div>
        <button onClick={handleSave} className="btn-primary" disabled={isSaving} style={{ padding: '10px 20px' }}>
          <Save size={16} style={{ marginRight: '8px' }} />
          {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '32px' }}>
        
        {/* Sidebar Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                background: activeTab === tab.id ? 'var(--accent-soft)' : 'transparent',
                color: activeTab === tab.id ? 'var(--accent)' : 'var(--text-secondary)',
                border: '1px solid',
                borderColor: activeTab === tab.id ? 'var(--accent-border)' : 'transparent',
                borderRadius: 'var(--radius-xs)',
                fontSize: '0.9rem',
                fontWeight: activeTab === tab.id ? 600 : 500,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="card settings-content" style={{ padding: '32px', minHeight: '500px' }}>
          
          {activeTab === 'organization' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Organization Details</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Platform Name</label>
                  <input type="text" defaultValue="Obsidian Help Desk" style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Support Email</label>
                  <input type="email" defaultValue="support@obsidian.edu" style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Support Phone</label>
                  <input type="tel" defaultValue="+1 (555) 000-1234" style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Supported Departments</label>
                  <div style={{ padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {['Hardware', 'Software', 'Network', 'Account'].map(dept => (
                        <span key={dept} style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px', fontSize: '0.85rem' }}>{dept} ✕</span>
                      ))}
                      <input type="text" placeholder="Add department..." style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', outline: 'none', width: '120px' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Security & Authentication</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>JWT Secret Key</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <input type="password" defaultValue="************************" disabled style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-muted)', outline: 'none' }} />
                    <button className="btn-secondary" style={{ padding: '0 24px' }}>Rotate Key</button>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Token Expiration (Minutes)</label>
                  <input type="number" defaultValue="60" style={{ width: '200px', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }} />
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', marginTop: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked={true} style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }} />
                    <div>
                      <div style={{ fontWeight: 500 }}>Require Single Sign-On (SSO)</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Force users to authenticate via University Identity Provider.</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for other tabs */}
          {['email', 'booking', 'theme'].includes(activeTab) && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-muted)' }}>
              Configuration options for {TABS.find(t => t.id === activeTab).label} will appear here.
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
