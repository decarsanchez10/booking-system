import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';
import { Camera, Shield, Bell, Save, X, Eye, EyeOff, CheckCircle } from 'lucide-react';

/* ── tiny re-usable modal ─────────────────────────── */
const Modal = ({ title, children, onClose }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9999,
    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
  }} onClick={onClose}>
    <div style={{
      background: 'var(--bg-elevated, #141418)',
      border: '1px solid var(--border)',
      borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '440px',
      position: 'relative'
    }} onClick={e => e.stopPropagation()}>
      <button onClick={onClose} style={{
        position: 'absolute', top: '16px', right: '16px',
        background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
      }}><X size={20} /></button>
      <h3 style={{ fontSize: '1.3rem', marginBottom: '24px' }}>{title}</h3>
      {children}
    </div>
  </div>
);

const Profile = () => {
  const { user, updateUser } = useAuth();

  /* form state */
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName]   = useState(user?.name?.split(' ').slice(1).join(' ') || '');
  const [phone, setPhone]         = useState(user?.phone || '');
  const [department, setDepartment] = useState(user?.department || 'Computer Science');

  /* avatar – initialise from backend/stored URL */
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef();

  /* save */
  const [isSaving, setIsSaving]   = useState(false);
  const [saved, setSaved]          = useState(false);

  /* password modal */
  const [showPwModal, setShowPwModal]   = useState(false);
  const [currentPw, setCurrentPw]       = useState('');
  const [newPw, setNewPw]               = useState('');
  const [confirmPw, setConfirmPw]       = useState('');
  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [pwError, setPwError]           = useState('');
  const [pwSuccess, setPwSuccess]       = useState(false);
  const [savingPw, setSavingPw]         = useState(false);

  /* 2FA modal */
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  /* notifications */
  const [notifPrefs, setNotifPrefs] = useState({
    reminders: true,
    status: true,
    announcements: false,
  });

  const container = useRef();
  useGSAP(() => {
    gsap.from('.profile-section', { opacity: 0, y: 20, stagger: 0.15, duration: 0.5, ease: 'power2.out' });
  }, { scope: container });

  /* ── handlers ── */
  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Show preview immediately
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target.result);
    reader.readAsDataURL(file);
    // Upload to server
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const { data } = await api.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Update context so sidebar & other views see new avatar immediately
      updateUser({ avatar: data.avatar_url });
      setAvatar(data.avatar_url);
    } catch (err) {
      console.error('Avatar upload failed', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);
    try {
      const name = [firstName, lastName].filter(Boolean).join(' ');
      await api.put('/user/profile', { name, phone, department });
      updateUser({ name, phone, department });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Save failed', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSave = async () => {
    setPwError('');
    if (!currentPw) return setPwError('Enter your current password.');
    if (newPw.length < 6) return setPwError('New password must be at least 6 characters.');
    if (newPw !== confirmPw) return setPwError('Passwords do not match.');
    setSavingPw(true);
    try {
      await api.put('/user/profile/password', { current_password: currentPw, password: newPw, password_confirmation: confirmPw });
      setPwSuccess(true);
      setTimeout(() => { setShowPwModal(false); setPwSuccess(false); setCurrentPw(''); setNewPw(''); setConfirmPw(''); }, 1500);
    } catch (err) {
      setPwError(err?.response?.data?.message || 'Failed to update password.');
    } finally {
      setSavingPw(false);
    }
  };

  const handleEnable2FA = () => {
    setTwoFAEnabled(true);
    setShow2FAModal(false);
  };

  return (
    <div ref={container}>
      {/* ── Password Modal ── */}
      {showPwModal && (
        <Modal title="Change Password" onClose={() => setShowPwModal(false)}>
          {pwSuccess ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle size={48} color="#1dd1a1" style={{ marginBottom: '12px' }} />
              <p style={{ color: '#1dd1a1', fontWeight: 600 }}>Password updated successfully!</p>
            </div>
          ) : (
            <>
              {pwError && <div style={{ padding: '10px 14px', background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.3)', borderRadius: '10px', color: '#ff6b6b', fontSize: '0.85rem', marginBottom: '16px' }}>{pwError}</div>}
              {[
                { label: 'Current Password', value: currentPw, set: setCurrentPw, show: showCurrent, toggle: () => setShowCurrent(p => !p) },
                { label: 'New Password', value: newPw, set: setNewPw, show: showNew, toggle: () => setShowNew(p => !p) },
                { label: 'Confirm New Password', value: confirmPw, set: setConfirmPw, show: showNew, toggle: null },
              ].map(field => (
                <div key={field.label} style={{ marginBottom: '16px', position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{field.label}</label>
                  <input
                    type={field.show ? 'text' : 'password'}
                    value={field.value}
                    onChange={e => field.set(e.target.value)}
                    style={{ width: '100%', padding: '12px 40px 12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                  />
                  {field.toggle && (
                    <button onClick={field.toggle} style={{ position: 'absolute', right: '12px', top: '34px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                      {field.show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
              ))}
              <button onClick={handlePasswordSave} className="btn-primary" disabled={savingPw} style={{ width: '100%', padding: '12px', marginTop: '8px' }}>
                {savingPw ? 'Updating...' : 'Update Password'}
              </button>
            </>
          )}
        </Modal>
      )}

      {/* ── 2FA Modal ── */}
      {show2FAModal && (
        <Modal title={twoFAEnabled ? 'Two-Factor Auth Enabled' : 'Enable Two-Factor Auth'} onClose={() => setShow2FAModal(false)}>
          {twoFAEnabled ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <CheckCircle size={48} color="#1dd1a1" style={{ marginBottom: '12px' }} />
              <p style={{ color: '#1dd1a1', fontWeight: 600 }}>2FA is already enabled on your account.</p>
              <button onClick={() => { setTwoFAEnabled(false); setShow2FAModal(false); }} className="btn-secondary" style={{ marginTop: '16px', padding: '10px 20px', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}>Disable 2FA</button>
            </div>
          ) : (
            <>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                Two-factor authentication adds an extra layer of security to your account. Once enabled, you'll need to enter a code from your authenticator app when logging in.
              </p>
              <div style={{ background: 'rgba(0,240,255,0.06)', border: '1px solid rgba(0,240,255,0.2)', borderRadius: '10px', padding: '16px', marginBottom: '20px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                💡 You will need an authenticator app like Google Authenticator or Authy.
              </div>
              <button onClick={handleEnable2FA} className="btn-primary" style={{ width: '100%', padding: '12px' }}>Enable 2FA</button>
            </>
          )}
        </Modal>
      )}

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>PROFILE SETTINGS</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your personal information and preferences.</p>
        </div>
        <button onClick={handleSave} className="btn-primary" disabled={isSaving} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {isSaving ? 'SAVING...' : saved ? 'SAVED!' : 'SAVE CHANGES'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>

        {/* ── Left Column ── */}
        <div className="profile-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ padding: '32px', textAlign: 'center' }}>

            {/* Avatar */}
            <div style={{ position: 'relative', width: '120px', margin: '0 auto 24px' }}>
              <div style={{
                width: '120px', height: '120px', borderRadius: '50%',
                background: avatar ? 'transparent' : 'var(--accent-soft)',
                border: '2px solid var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)', fontSize: '3rem', fontWeight: 700,
                overflow: 'hidden',
              }}>
                {avatar
                  ? <img src={avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (user?.name?.[0]?.toUpperCase() || 'U')}
              </div>

              {/* Camera button */}
              <button
                onClick={handleAvatarClick}
                title="Upload profile photo"
                disabled={uploadingAvatar}
                style={{
                  position: 'absolute', bottom: 0, right: 0,
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'var(--bg-elevated, #1a1a1f)',
                  border: '2px solid var(--accent)',
                  color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: uploadingAvatar ? 'not-allowed' : 'pointer', transition: 'background 0.2s',
                  opacity: uploadingAvatar ? 0.6 : 1,
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--accent-soft)'}
                onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-elevated, #1a1a1f)'}
              >
                {uploadingAvatar ? '…' : <Camera size={16} />}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            </div>

            {avatar && avatar !== user?.avatar && (
              <button
                onClick={async () => {
                  setAvatar(user?.avatar || null);
                }}
                style={{ fontSize: '0.78rem', color: '#ff6b6b', background: 'transparent', border: 'none', cursor: 'pointer', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px', margin: '0 auto 8px' }}
              >
                <X size={12} /> Remove photo
              </button>
            )}

            <h2 style={{ fontSize: '1.2rem', marginBottom: '4px' }}>{firstName} {lastName}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>{user?.email}</p>
            <div style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--overlay-soft)', borderRadius: '100px', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              ID: {user?.id}
            </div>
          </div>

          {/* Security Card */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Shield size={16} color="var(--accent)" /> Security
            </h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Two-Factor Auth</div>
                <div style={{ fontSize: '0.8rem', color: twoFAEnabled ? '#1dd1a1' : 'var(--text-muted)' }}>
                  {twoFAEnabled ? '✓ Enabled' : 'Not configured'}
                </div>
              </div>
              <button
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.8rem', color: twoFAEnabled ? '#ff6b6b' : undefined }}
                onClick={() => setShow2FAModal(true)}
              >
                {twoFAEnabled ? 'Manage' : 'Enable'}
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>Password</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last changed 3 months ago</div>
              </div>
              <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setShowPwModal(true)}>
                Update
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="profile-section" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Personal Info */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>Personal Information</h3>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>First Name</label>
                  <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Last Name</label>
                  <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Email Address</label>
                  <input type="email" value={user?.email} disabled
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--overlay-subtle)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-muted)', outline: 'none', cursor: 'not-allowed', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Phone Number</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Department / Major</label>
                  <input 
                    type="text" 
                    value={department} 
                    onChange={e => setDepartment(e.target.value)}
                    placeholder="e.g., Computer Science"
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Notification Prefs */}
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bell size={18} /> Notification Preferences
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { key: 'reminders', title: 'Appointment Reminders', desc: 'Receive emails 24 hours before your appointment.' },
                { key: 'status',    title: 'Status Updates',        desc: 'Get notified when an agent accepts, completes, or cancels a booking.' },
                { key: 'announcements', title: 'System Announcements', desc: 'Important network and system maintenance alerts.' },
              ].map(pref => (
                <label key={pref.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notifPrefs[pref.key]}
                    onChange={() => setNotifPrefs(prev => ({ ...prev, [pref.key]: !prev[pref.key] }))}
                    style={{ marginTop: '4px', accentColor: 'var(--accent)', width: '16px', height: '16px', cursor: 'pointer' }}
                  />
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
