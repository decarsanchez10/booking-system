import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, Filter, MoreHorizontal, Edit, Trash2, Ban } from 'lucide-react';

const MOCK_USERS = [
  { id: 'USR-8921', name: 'Alex Rivera', email: 'arivera@obsidian.edu', dept: 'Computer Science', role: 'Student', status: 'Active', lastLogin: '2 mins ago' },
  { id: 'USR-8922', name: 'Dr. Patricia Kim', email: 'pkim@obsidian.edu', dept: 'Biology', role: 'Faculty', status: 'Active', lastLogin: '1 hour ago' },
  { id: 'USR-8923', name: 'Marcus Johnson', email: 'mjohnson@obsidian.edu', dept: 'Business', role: 'Student', status: 'Suspended', lastLogin: '5 days ago' },
  { id: 'USR-8924', name: 'Sarah Jenkins', email: 'sjenkins@obsidian.edu', dept: 'IT Services', role: 'Agent', status: 'Active', lastLogin: 'Online' },
  { id: 'USR-8925', name: 'James Wilson', email: 'jwilson@obsidian.edu', dept: 'Engineering', role: 'Student', status: 'Active', lastLogin: 'Yesterday' },
];

const Users = () => {
  const container = useRef();
  const [filter, setFilter] = useState('all');

  useGSAP(() => {
    gsap.from('.table-row', {
      opacity: 0,
      y: 10,
      stagger: 0.05,
      duration: 0.4,
      ease: 'power2.out'
    });
  }, { scope: container, dependencies: [filter] });

  return (
    <div ref={container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>USER MANAGEMENT</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage students, staff, and faculty accounts.</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 20px' }}>
          + Add User
        </button>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'students', 'faculty', 'agents', 'suspended'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 16px',
                  background: filter === f ? 'var(--text-primary)' : 'transparent',
                  color: filter === f ? 'var(--bg)' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: filter === f ? 'var(--text-primary)' : 'var(--border)',
                  borderRadius: '100px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s ease'
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" placeholder="Search users..." style={{ padding: '8px 16px 8px 36px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem', width: '250px' }} />
            </div>
            <button className="btn-secondary" style={{ padding: '8px 12px' }}>
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 16px 16px 0', width: '40px' }}>
                  <input type="checkbox" style={{ accentColor: 'var(--accent)', cursor: 'pointer' }} />
                </th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>User</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>Department</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>Role</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>Status</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)', fontWeight: 500 }}>Last Login</th>
                <th style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)', fontWeight: 500, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_USERS.map((u, i) => (
                <tr key={i} className="table-row" style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '16px 16px 16px 0' }}>
                    <input type="checkbox" style={{ accentColor: 'var(--accent)', cursor: 'pointer' }} />
                  </td>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                        {u.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{u.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.85rem' }}>{u.dept}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '4px', 
                      fontSize: '0.75rem', 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid rgba(255,255,255,0.1)',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    {u.status === 'Active' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#22c55e' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></div> Active
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#ef4444' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444' }}></div> Suspended
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.lastLogin}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                      <button style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '6px', cursor: 'pointer' }} title="Edit"><Edit size={16} /></button>
                      <button style={{ background: 'transparent', border: 'none', color: '#eab308', padding: '6px', cursor: 'pointer' }} title="Suspend"><Ban size={16} /></button>
                      <button style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '6px', cursor: 'pointer' }} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Showing 5 of 4,289 users</div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} disabled>Previous</button>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Next</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Users;
