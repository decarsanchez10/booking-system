import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, Edit, Trash2, Ban, X, CheckCircle, Plus } from 'lucide-react';

/* ── Modal ── */
const Modal = ({ title, children, onClose, width }) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
    <div style={{ background: 'var(--bg-elevated,#141418)', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: width || '480px', position: 'relative' }} onClick={e => e.stopPropagation()}>
      <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
      <h3 style={{ fontSize: '1.3rem', marginBottom: '24px' }}>{title}</h3>
      {children}
    </div>
  </div>
);

const INITIAL_USERS = [
  { id: 'USR-8921', name: 'Alex Rivera', email: 'arivera@obsidian.edu', dept: 'Computer Science', role: 'Student', status: 'Active', lastLogin: '2 mins ago' },
  { id: 'USR-8922', name: 'Dr. Patricia Kim', email: 'pkim@obsidian.edu', dept: 'Biology', role: 'Faculty', status: 'Active', lastLogin: '1 hour ago' },
  { id: 'USR-8923', name: 'Marcus Johnson', email: 'mjohnson@obsidian.edu', dept: 'Business', role: 'Student', status: 'Suspended', lastLogin: '5 days ago' },
  { id: 'USR-8924', name: 'Sarah Jenkins', email: 'sjenkins@obsidian.edu', dept: 'IT Services', role: 'Agent', status: 'Active', lastLogin: 'Online' },
  { id: 'USR-8925', name: 'James Wilson', email: 'jwilson@obsidian.edu', dept: 'Engineering', role: 'Student', status: 'Active', lastLogin: 'Yesterday' },
];

const Users = () => {
  const container = useRef();
  const [users, setUsers] = useState(INITIAL_USERS);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Add user modal
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addDept, setAddDept] = useState('');
  const [addRole, setAddRole] = useState('Student');
  const [addSuccess, setAddSuccess] = useState(false);

  // Edit user modal
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editRole, setEditRole] = useState('');

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  useGSAP(() => {
    gsap.from('.table-row', { opacity: 0, y: 10, stagger: 0.05, duration: 0.4, ease: 'power2.out' });
  }, { scope: container, dependencies: [filter] });

  const filtered = users.filter(u => {
    const matchFilter = filter === 'all'
      || (filter === 'students' && u.role === 'Student')
      || (filter === 'faculty' && u.role === 'Faculty')
      || (filter === 'agents' && u.role === 'Agent')
      || (filter === 'suspended' && u.status === 'Suspended');
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleAddUser = () => {
    if (!addName || !addEmail) return;
    const newUser = {
      id: `USR-${Math.floor(Math.random() * 9000) + 1000}`,
      name: addName, email: addEmail, dept: addDept || 'Unassigned',
      role: addRole, status: 'Active', lastLogin: 'Never',
    };
    setUsers(prev => [newUser, ...prev]);
    setAddSuccess(true);
    setTimeout(() => { setShowAdd(false); setAddSuccess(false); setAddName(''); setAddEmail(''); setAddDept(''); setAddRole('Student'); }, 1500);
  };

  const handleEditSave = () => {
    setUsers(prev => prev.map(u => u.id === editUser.id ? { ...u, name: editName, dept: editDept, role: editRole } : u));
    setEditUser(null);
  };

  const openEdit = (u) => { setEditUser(u); setEditName(u.name); setEditDept(u.dept); setEditRole(u.role); };

  const handleDelete = (id) => { setUsers(prev => prev.filter(u => u.id !== id)); setDeleteTarget(null); };

  const handleToggleSuspend = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  const inputStyle = { width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' };

  return (
    <div ref={container}>
      {/* Add User Modal */}
      {showAdd && (
        <Modal title="Add New User" onClose={() => { setShowAdd(false); setAddSuccess(false); }}>
          {addSuccess ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircle size={48} color="#1dd1a1" style={{ marginBottom: '12px' }} />
              <p style={{ color: '#1dd1a1', fontWeight: 600 }}>User added successfully!</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Full Name *</label>
                <input type="text" value={addName} onChange={e => setAddName(e.target.value)} placeholder="John Doe" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Email *</label>
                <input type="email" value={addEmail} onChange={e => setAddEmail(e.target.value)} placeholder="john@obsidian.edu" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Department</label>
                  <input type="text" value={addDept} onChange={e => setAddDept(e.target.value)} placeholder="Computer Science" style={inputStyle} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Role</label>
                  <select value={addRole} onChange={e => setAddRole(e.target.value)} style={inputStyle}>
                    <option>Student</option><option>Faculty</option><option>Agent</option>
                  </select>
                </div>
              </div>
              <button className="btn-primary" onClick={handleAddUser} disabled={!addName || !addEmail} style={{ width: '100%', padding: '12px', opacity: (!addName || !addEmail) ? 0.5 : 1 }}>Add User</button>
            </>
          )}
        </Modal>
      )}

      {/* Edit User Modal */}
      {editUser && (
        <Modal title={`Edit ${editUser.name}`} onClose={() => setEditUser(null)}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Full Name</label>
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Department</label>
              <input type="text" value={editDept} onChange={e => setEditDept(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Role</label>
              <select value={editRole} onChange={e => setEditRole(e.target.value)} style={inputStyle}>
                <option>Student</option><option>Faculty</option><option>Agent</option>
              </select>
            </div>
          </div>
          <button className="btn-primary" onClick={handleEditSave} style={{ width: '100%', padding: '12px' }}>Save Changes</button>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <Modal title="Delete User" onClose={() => setDeleteTarget(null)}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.6' }}>
            Are you sure you want to permanently delete <strong style={{ color: 'var(--text-primary)' }}>{users.find(u => u.id === deleteTarget)?.name}</strong>? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" style={{ flex: 1, padding: '12px' }} onClick={() => setDeleteTarget(null)}>Cancel</button>
            <button style={{ flex: 1, padding: '12px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 'var(--radius-xs)', color: '#ef4444', cursor: 'pointer', fontWeight: 600 }} onClick={() => handleDelete(deleteTarget)}>Delete User</button>
          </div>
        </Modal>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>USER MANAGEMENT</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage students, staff, and faculty accounts.</p>
        </div>
        <button className="btn-primary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Add User
        </button>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        {/* Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['all', 'students', 'faculty', 'agents', 'suspended'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '8px 16px', background: filter === f ? 'var(--text-primary)' : 'transparent',
                color: filter === f ? 'var(--bg)' : 'var(--text-secondary)', border: '1px solid',
                borderColor: filter === f ? 'var(--text-primary)' : 'var(--border)', borderRadius: '100px',
                fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s ease'
              }}>{f}</button>
            ))}
          </div>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px 16px 8px 36px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.85rem', width: '250px' }} />
          </div>
        </div>

        {/* Table */}
        <div style={{ width: '100%', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['User', 'Department', 'Role', 'Status', 'Last Login', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '16px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontFamily: 'var(--font-mono)', fontWeight: 500, textAlign: h === 'Actions' ? 'right' : 'left' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="table-row" style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s ease' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
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
                    <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase', letterSpacing: '1px' }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: u.status === 'Active' ? '#22c55e' : '#ef4444' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: u.status === 'Active' ? '#22c55e' : '#ef4444' }} /> {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.lastLogin}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(u)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '6px', cursor: 'pointer' }} title="Edit"><Edit size={16} /></button>
                      <button onClick={() => handleToggleSuspend(u.id)} style={{ background: 'transparent', border: 'none', color: u.status === 'Suspended' ? '#22c55e' : '#eab308', padding: '6px', cursor: 'pointer' }} title={u.status === 'Suspended' ? 'Reactivate' : 'Suspend'}><Ban size={16} /></button>
                      <button onClick={() => setDeleteTarget(u.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', padding: '6px', cursor: 'pointer' }} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Showing {filtered.length} users</div>
        </div>
      </div>
    </div>
  );
};

export default Users;
