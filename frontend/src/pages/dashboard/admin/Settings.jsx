import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Save, Building, Mail, Shield, Clock, Layout } from 'lucide-react';
import api from '../../../lib/api';

const Settings = () => {
  const container = useRef();
  const [activeTab, setActiveTab] = useState('organization');
  const [isSaving, setIsSaving] = useState(false);
  const [keyRotated, setKeyRotated] = useState(false);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useGSAP(() => {
    gsap.from('.settings-content', {
      opacity: 0,
      y: 10,
      duration: 0.3,
      ease: 'power2.out'
    });
  }, { scope: container, dependencies: [activeTab] });

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data } = await api.get('/admin/settings');
        setSettings(data || {});
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/admin/settings', { settings });
      setTimeout(() => setIsSaving(false), 1000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setIsSaving(false);
    }
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleRotateKey = () => {
    setKeyRotated(true);
    setTimeout(() => setKeyRotated(false), 1600);
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
                  <input 
                    type="text" 
                    value={settings.platform_name || ''} 
                    onChange={e => updateSetting('platform_name', e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Support Email</label>
                  <input 
                    type="email" 
                    value={settings.support_email || ''} 
                    onChange={e => updateSetting('support_email', e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }} 
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Support Phone</label>
                  <input 
                    type="tel" 
                    value={settings.support_phone || ''} 
                    onChange={e => updateSetting('support_phone', e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }} 
                  />
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
                    <input type="password" value="************************" disabled style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-muted)', outline: 'none' }} />
                    <button type="button" onClick={handleRotateKey} className="btn-secondary" style={{ padding: '0 24px' }}>
                      {keyRotated ? 'Key Rotated' : 'Rotate Key'}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Token Expiration (Minutes)</label>
                  <input 
                    type="number" 
                    value={settings.token_expiration || 60} 
                    onChange={e => updateSetting('token_expiration', parseInt(e.target.value))}
                    style={{ width: '200px', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }} 
                  />
                </div>
                <div style={{ padding: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', marginTop: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={settings.require_sso || false}
                      onChange={e => updateSetting('require_sso', e.target.checked)}
                      style={{ accentColor: 'var(--accent)', width: '18px', height: '18px' }} 
                    />
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
