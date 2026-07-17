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

import { useEffect } from 'react';
import api from '../../../lib/api';

const Users = () => {
  const container = useRef();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.get('/admin/roles');
      setRoles(res.data);
      if (res.data.length > 0 && addRole === 'user') {
        setAddRole(res.data[0].name);
      }
    } catch (error) {
      console.error('Failed to fetch roles:', error);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data || res.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add user modal
  const [showAdd, setShowAdd] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addDept, setAddDept] = useState('');
  const [addRole, setAddRole] = useState('user');
  const [addSuccess, setAddSuccess] = useState(false);

  // Edit user modal
  const [editUser, setEditUser] = useState(null);
  const [editName, setEditName] = useState('');
  const [editDept, setEditDept] = useState('');
  const [editRole, setEditRole] = useState('');

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);

  useGSAP(() => {
    if (filtered.length > 0) {
      gsap.from('.table-row', { opacity: 0, y: 10, stagger: 0.05, duration: 0.4, ease: 'power2.out' });
    }
  }, { scope: container, dependencies: [filter, users] });

  const filtered = users.filter(u => {
    const roleName = u.roles?.[0]?.name || 'user';
    const matchFilter = filter === 'all'
      || (filter === 'users' && roleName === 'user')
      || (filter === 'agents' && roleName === 'agent')
      || (filter === 'admins' && roleName === 'admin');
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleAddUser = async () => {
    if (!addName || !addEmail) return;
    setLoading(true);
    try {
      const res = await api.post('/admin/users', {
        name: addName,
        email: addEmail,
        role: addRole.toLowerCase(),
        password: 'Password123!',
        password_confirmation: 'Password123!'
      });
      setUsers(prev => [res.data, ...prev]);
      setAddSuccess(true);
      setTimeout(() => { setShowAdd(false); setAddSuccess(false); setAddName(''); setAddEmail(''); setAddDept(''); setAddRole('user'); }, 1500);
    } catch (err) {
      console.error(err);
      alert('Failed to add user');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSave = async () => {
    setLoading(true);
    try {
      const res = await api.put(`/admin/users/${editUser.id}`, { name: editName });
      if (editRole.toLowerCase() !== editUser.roles?.[0]?.name) {
        await api.put(`/admin/users/${editUser.id}/role`, { role: editRole.toLowerCase() });
      }
      fetchUsers();
      setEditUser(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (u) => { setEditUser(u); setEditName(u.name); setEditRole(u.roles?.[0]?.name || 'user'); };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
      alert('Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

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
                <input type="email" value={addEmail} onChange={e => setAddEmail(e.target.value)} placeholder="john@gmail.com" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Role</label>
                <select value={addRole} onChange={e => setAddRole(e.target.value)} style={inputStyle}>
                  {roles.map(role => <option key={role.id} value={role.name}>{role.name}</option>)}
                </select>
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
            <input type="text" value={editName} onChange={e => setEditName(e.target.value)} disabled={editUser.roles?.[0]?.name === 'agent' || editUser.roles?.[0]?.name === 'user'} style={{...inputStyle, opacity: (editUser.roles?.[0]?.name === 'agent' || editUser.roles?.[0]?.name === 'user') ? 0.5 : 1}} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Role</label>
            <select value={editRole} onChange={e => setEditRole(e.target.value)} style={inputStyle}>
              {roles.map(role => <option key={role.id} value={role.name}>{role.name}</option>)}
            </select>
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
            {['all', 'users', 'agents', 'admins'].map(f => (
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
                {['User', 'Role', 'Joined', 'Actions'].map((h) => (
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
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 600 }}>
                          {u.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </div>
                      )}
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '2px' }}>{u.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', textTransform: 'uppercase', letterSpacing: '1px' }}>{u.roles?.[0]?.name || 'user'}</span>
                  </td>
                  <td style={{ padding: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(u)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', padding: '6px', cursor: 'pointer' }} title="Edit"><Edit size={16} /></button>
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
