import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, Plus, Star, Edit, UserX, X, CheckCircle, UserCheck } from 'lucide-react';
import api, { getApiErrorMessage } from '../../../lib/api';

/* ── Modal ── */
const Modal = ({ title, children, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
    <div style={{ background: 'var(--bg-elevated,#141418)', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '480px', position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
      <h3 style={{ fontSize: '1.3rem', marginBottom: '24px' }}>{title}</h3>
      {children}
    </div>
  </div>
);

const inputStyle = { width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' };

const INITIAL_AGENTS = [
  { id: 'AGT-01', name: 'David Chen', specialty: 'Software', rating: 4.9, completed: 128, load: 85, avatar: 'DC', active: true },
  { id: 'AGT-02', name: 'Mike Ross', specialty: 'Network', rating: 4.8, completed: 94, load: 60, avatar: 'MR', active: true },
  { id: 'AGT-03', name: 'Sarah Jenkins', specialty: 'Hardware', rating: 5.0, completed: 142, load: 90, avatar: 'SJ', active: true },
  { id: 'AGT-04', name: 'Elena Rodriguez', specialty: 'Account', rating: 4.7, completed: 210, load: 75, avatar: 'ER', active: true },
  { id: 'AGT-05', name: 'James Wilson', specialty: 'Hardware', rating: 4.6, completed: 88, load: 40, avatar: 'JW', active: true },
  { id: 'AGT-06', name: 'Anita Patel', specialty: 'Software', rating: 4.9, completed: 156, load: 95, avatar: 'AP', active: true },
];

const toAgentCard = (user) => {
  const initials = user.name
    ?.split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'A';

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    specialty: 'IT Support',
    rating: 0,
    completed: 0,
    load: 0,
    avatar: initials,
    active: true,
  };
};

const Agents = () => {
  const container = useRef();
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [loadError, setLoadError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Add agent modal
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [addSpecialty, setAddSpecialty] = useState('Software');
  const [addSuccess, setAddSuccess] = useState(false);

  // Edit agent modal
  const [editAgent, setEditAgent] = useState(null);
  const [editName, setEditName] = useState('');
  const [editSpecialty, setEditSpecialty] = useState('');

  // Deactivate confirm
  const [deactivateTarget, setDeactivateTarget] = useState(null);

  useGSAP(() => {
    gsap.from('.agent-card', { opacity: 0, scale: 0.95, stagger: 0.05, duration: 0.4, ease: 'power2.out' });
  }, { scope: container });

  useEffect(() => {
    const loadAgents = async () => {
      setLoadError('');

      try {
        const { data } = await api.get('/admin/users');
        const users = data.data || data;
        const apiAgents = users
          .filter((user) => user.roles?.some((role) => role.name === 'agent'))
          .map(toAgentCard);

        setAgents(apiAgents);
      } catch (error) {
        setLoadError(getApiErrorMessage(error, 'Unable to load agents.'));
      }
    };

    loadAgents();
  }, []);

  const filtered = agents.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.specialty.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAdd = () => {
    if (!addName) return;
    const initials = addName.split(' ').map(n => n[0]).join('').toUpperCase();
    setAgents(prev => [...prev, { id: `AGT-${String(prev.length + 1).padStart(2, '0')}`, name: addName, specialty: addSpecialty, rating: 0, completed: 0, load: 0, avatar: initials, active: true }]);
    setAddSuccess(true);
    setTimeout(() => { setShowAdd(false); setAddSuccess(false); setAddName(''); setAddSpecialty('Software'); }, 1500);
  };

  const openEdit = (agent) => { setEditAgent(agent); setEditName(agent.name); setEditSpecialty(agent.specialty); };
  const handleEditSave = () => {
    setAgents(prev => prev.map(a => a.id === editAgent.id ? { ...a, name: editName, specialty: editSpecialty, avatar: editName.split(' ').map(n => n[0]).join('').toUpperCase() } : a));
    setEditAgent(null);
  };

  const handleToggleActive = (id) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
    setDeactivateTarget(null);
  };

  return (
    <div ref={container}>
      {/* Add Agent */}
      {showAdd && (
        <Modal title="Add New Agent" onClose={() => { setShowAdd(false); setAddSuccess(false); }}>
          {addSuccess ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle size={48} color="#1dd1a1" style={{ marginBottom: '12px' }} />
              <p style={{ color: '#1dd1a1', fontWeight: 600 }}>Agent added successfully!</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Full Name *</label>
                <input type="text" value={addName} onChange={e => setAddName(e.target.value)} placeholder="Jane Smith" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Specialty</label>
                <select value={addSpecialty} onChange={e => setAddSpecialty(e.target.value)} style={inputStyle}>
                  {['Software', 'Hardware', 'Network', 'Account', 'Email', 'Security'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button className="btn-primary" onClick={handleAdd} disabled={!addName} style={{ width: '100%', padding: '12px', opacity: !addName ? 0.5 : 1 }}>Add Agent</button>
            </>
          )}
        </Modal>
      )}

      {/* Edit Agent */}
      {editAgent && (
        <Modal title={`Edit ${editAgent.name}`} onClose={() => setEditAgent(null)}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Full Name</label>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Specialty</label>
            <select value={editSpecialty} onChange={e => setEditSpecialty(e.target.value)} style={inputStyle}>
              {['Software', 'Hardware', 'Network', 'Account', 'Email', 'Security'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button className="btn-primary" onClick={handleEditSave} style={{ width: '100%', padding: '12px' }}>Save Changes</button>
        </Modal>
      )}

      {/* Deactivate Confirm */}
      {deactivateTarget && (
        <Modal title={agents.find(a => a.id === deactivateTarget)?.active ? 'Deactivate Agent' : 'Reactivate Agent'} onClose={() => setDeactivateTarget(null)}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
            {agents.find(a => a.id === deactivateTarget)?.active
              ? <>Are you sure you want to deactivate <strong style={{ color: 'var(--text-primary)' }}>{agents.find(a => a.id === deactivateTarget)?.name}</strong>? They won't be able to accept new appointments.</>
              : <>Reactivate <strong style={{ color: 'var(--text-primary)' }}>{agents.find(a => a.id === deactivateTarget)?.name}</strong>?</>}
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setDeactivateTarget(null)}>Cancel</button>
            <button style={{ flex: 1, padding: '12px', background: agents.find(a => a.id === deactivateTarget)?.active ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${agents.find(a => a.id === deactivateTarget)?.active ? 'rgba(239,68,68,0.4)' : 'rgba(34,197,94,0.4)'}`, borderRadius: 'var(--radius-xs)', color: agents.find(a => a.id === deactivateTarget)?.active ? '#ef4444' : '#22c55e', cursor: 'pointer', fontWeight: 600 }}
              onClick={() => handleToggleActive(deactivateTarget)}>
              Confirm
            </button>
          </div>
        </Modal>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>AGENT MANAGEMENT</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor and manage IT support staff performance.</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add Agent
        </button>
      </div>

      <div style={{ marginBottom: '32px', position: 'relative', width: '300px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input type="text" placeholder="Search agents..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px 12px 36px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }} />
      </div>

      {loadError && (
        <div className="card" style={{ padding: '16px 20px', marginBottom: '24px', color: '#ff6b6b' }}>
          {loadError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {filtered.map(agent => (
          <div key={agent.id} className="agent-card card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', opacity: agent.active ? 1 : 0.5 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 700 }}>{agent.avatar}</div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{agent.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: agent.active ? '#22c55e' : '#ef4444' }} />
                    {agent.active ? 'Active' : 'Deactivated'}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Specialty</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{agent.specialty}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Rating</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 500 }}>
                  <Star size={14} color="var(--accent)" fill="var(--accent)" /> {agent.rating || 'N/A'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Completed</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>{agent.completed}</div>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Current Workload</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: agent.load > 90 ? '#ef4444' : 'var(--text-primary)' }}>{agent.load}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${agent.load}%`, height: '100%', background: agent.load > 90 ? '#ef4444' : 'var(--accent)', borderRadius: '3px', transition: 'width 0.3s' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button className="btn-secondary" onClick={() => openEdit(agent)} style={{ flex: 1, padding: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Edit size={14} /> Edit
              </button>
              <button className="btn-secondary" onClick={() => setDeactivateTarget(agent.id)}
                style={{ flex: 1, padding: '8px', fontSize: '0.85rem', color: agent.active ? '#ef4444' : '#22c55e', borderColor: agent.active ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                {agent.active ? <><UserX size={14} /> Deactivate</> : <><UserCheck size={14} /> Reactivate</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agents;
