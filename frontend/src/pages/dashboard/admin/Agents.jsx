import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, Plus, Star, MoreVertical, Edit, UserX } from 'lucide-react';

const MOCK_AGENTS = [
  { id: 'AGT-01', name: 'David Chen', specialty: 'Software', rating: 4.9, completed: 128, load: 85, avatar: 'DC' },
  { id: 'AGT-02', name: 'Mike Ross', specialty: 'Network', rating: 4.8, completed: 94, load: 60, avatar: 'MR' },
  { id: 'AGT-03', name: 'Sarah Jenkins', specialty: 'Hardware', rating: 5.0, completed: 142, load: 90, avatar: 'SJ' },
  { id: 'AGT-04', name: 'Elena Rodriguez', specialty: 'Account', rating: 4.7, completed: 210, load: 75, avatar: 'ER' },
  { id: 'AGT-05', name: 'James Wilson', specialty: 'Hardware', rating: 4.6, completed: 88, load: 40, avatar: 'JW' },
  { id: 'AGT-06', name: 'Anita Patel', specialty: 'Software', rating: 4.9, completed: 156, load: 95, avatar: 'AP' },
];

const Agents = () => {
  const container = useRef();
  const [searchTerm, setSearchTerm] = useState('');

  useGSAP(() => {
    gsap.from('.agent-card', {
      opacity: 0,
      scale: 0.95,
      stagger: 0.05,
      duration: 0.4,
      ease: 'power2.out'
    });
  }, { scope: container });

  return (
    <div ref={container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>AGENT MANAGEMENT</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Monitor and manage IT support staff performance.</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 20px' }}>
          <Plus size={16} style={{ marginRight: '8px' }} /> Add Agent
        </button>
      </div>

      <div style={{ marginBottom: '32px', position: 'relative', width: '300px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input 
          type="text" 
          placeholder="Search agents by name or specialty..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '12px 16px 12px 36px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {MOCK_AGENTS.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.specialty.toLowerCase().includes(searchTerm.toLowerCase())).map((agent) => (
          <div key={agent.id} className="agent-card card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-soft)', border: '1px solid var(--accent-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', fontSize: '1.2rem', fontWeight: 700 }}>
                  {agent.avatar}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{agent.name}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></div> Active
                  </div>
                </div>
              </div>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <MoreVertical size={18} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Specialty</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{agent.specialty}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Rating</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.9rem', fontWeight: 500 }}>
                  <Star size={14} color="var(--accent)" fill="var(--accent)" /> {agent.rating}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Completed</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>{agent.completed}</div>
              </div>
            </div>

            {/* Workload Progress Bar */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Current Workload</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: agent.load > 90 ? '#ef4444' : 'var(--text-primary)' }}>{agent.load}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${agent.load}%`, 
                  height: '100%', 
                  background: agent.load > 90 ? '#ef4444' : 'var(--accent)',
                  borderRadius: '3px'
                }}></div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
              <button className="btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Edit size={14} /> Edit
              </button>
              <button className="btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '0.85rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <UserX size={14} /> Deactivate
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Agents;
