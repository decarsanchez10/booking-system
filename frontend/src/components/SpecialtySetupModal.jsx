import { useState, useEffect } from 'react';
import { Zap, CheckCircle } from 'lucide-react';
import api from '../lib/api';

const ICON_MAP = {
  'Hardware': '💻',
  'Software': '⚙️',
  'Network': '🌐',
  'Account Access': '🔑',
  'Data Recovery': '💾',
  'Security': '🛡️',
  'Email': '📧',
};

const SpecialtySetupModal = ({ onComplete }) => {
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const { data } = await api.get('/services/specialties');
        setSpecialties(data);
      } catch (err) {
        setError('Failed to load specialties. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    loadSpecialties();
  }, []);

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (selected.length === 0) return setError('Please select at least one specialty.');
    setSaving(true);
    setError('');
    try {
      const { data } = await api.put('/agent/specialties', { specialties: selected });
      onComplete(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save. Please try again.');
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-elevated, #141418)',
        border: '1px solid var(--border)',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '680px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 60px rgba(139,92,246,0.15)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 0 30px rgba(139,92,246,0.4)'
          }}>
            <Zap size={28} color="#fff" />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
            Welcome! Let's set up your profile.
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
            Select the specialties you offer so users can book the right expert.
          </p>
        </div>

        {/* Specialty Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            Loading specialties...
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '28px'
          }}>
            {specialties.map((spec) => {
              const isSelected = selected.includes(spec.name);
              const icon = ICON_MAP[spec.name] || '🔧';
              return (
                <button
                  key={spec.id}
                  onClick={() => toggle(spec.name)}
                  style={{
                    background: isSelected
                      ? 'linear-gradient(135deg, rgba(139,92,246,0.25), rgba(99,102,241,0.15))'
                      : 'var(--bg-card, rgba(255,255,255,0.04))',
                    border: isSelected
                      ? '1px solid rgba(139,92,246,0.7)'
                      : '1px solid var(--border)',
                    borderRadius: '14px',
                    padding: '20px 16px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    color: 'var(--text-primary)',
                    position: 'relative',
                    boxShadow: isSelected ? '0 0 20px rgba(139,92,246,0.2)' : 'none',
                  }}
                >
                  {isSelected && (
                    <div style={{
                      position: 'absolute', top: '10px', right: '10px',
                      color: '#8b5cf6'
                    }}>
                      <CheckCircle size={16} />
                    </div>
                  )}
                  <div style={{ fontSize: '1.8rem', marginBottom: '10px' }}>{icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>{spec.name}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', lineHeight: 1.4 }}>
                    {spec.description}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {error && (
          <p style={{ color: '#f87171', fontSize: '0.875rem', marginBottom: '16px', textAlign: 'center' }}>
            {error}
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {selected.length} specialty{selected.length !== 1 ? 'ies' : ''} selected
          </span>
          <button
            onClick={handleSave}
            disabled={saving || selected.length === 0}
            style={{
              background: selected.length > 0
                ? 'linear-gradient(135deg, #8b5cf6, #6366f1)'
                : 'var(--bg-card)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 32px',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
              opacity: saving ? 0.7 : 1,
              transition: 'all 0.2s ease',
              boxShadow: selected.length > 0 ? '0 0 20px rgba(139,92,246,0.4)' : 'none',
            }}
          >
            {saving ? 'Saving...' : 'Save & Continue →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialtySetupModal;
