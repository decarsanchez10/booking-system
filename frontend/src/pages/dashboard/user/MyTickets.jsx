import { useState, useEffect } from 'react';
import { Ticket, Plus, Search, X, CheckCircle, Upload } from 'lucide-react';
import api from '../../../lib/api';

/* ── Modal ── */
const Modal = ({ title, children, onClose }) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }} onClick={onClose}>
    <div style={{ background: 'var(--bg-elevated, #141418)', border: '1px solid var(--border)', borderRadius: '20px', padding: '36px', width: '100%', maxWidth: '520px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
      <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={20} /></button>
      <h3 style={{ fontSize: '1.3rem', marginBottom: '24px' }}>{title}</h3>
      {children}
    </div>
  </div>
);

const CATEGORIES = ['Hardware', 'Software', 'Network', 'Printer', 'Email', 'Account', 'Password', 'Security', 'Remote Assistance', 'Other'];
const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];

const MyTickets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(null);

  // Create ticket form
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newDescription, setNewDescription] = useState('');
  const [newFile, setNewFile] = useState(null);
  const [creating, setCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState(false);

  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/user/tickets');
      setTickets(res.data.data || res.data || []);
    } catch (err) {
      console.error('Failed to fetch tickets', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#ff6b6b';
      case 'In Progress': return '#feca57';
      case 'Resolved': return '#1dd1a1';
      case 'Closed': return 'var(--text-muted)';
      default: return 'var(--text-muted)';
    }
  };

  const handleCreate = async () => {
    if (!newSubject || !newCategory || !newDescription) return;
    setCreating(true);
    try {
      await api.post('/user/tickets', {
        subject: newSubject,
        category: newCategory,
        priority: newPriority,
        description: newDescription,
      });
      setCreateSuccess(true);
      fetchTickets();
      setTimeout(() => {
        setShowCreate(false);
        setCreateSuccess(false);
        setNewSubject(''); setNewCategory(''); setNewPriority('Medium'); setNewDescription(''); setNewFile(null);
      }, 1500);
    } catch (err) {
      console.error('Failed to create ticket', err);
      alert('Failed to create ticket. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const filtered = tickets.filter(t => {
    const matchSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      {/* ── Create Ticket Modal ── */}
      {showCreate && (
        <Modal title="Create Support Ticket" onClose={() => { setShowCreate(false); setCreateSuccess(false); }}>
          {createSuccess ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <CheckCircle size={52} color="#1dd1a1" style={{ marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px' }}>Ticket Created!</h3>
              <p style={{ color: 'var(--text-muted)' }}>A technician will be assigned shortly.</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Subject *</label>
                <input type="text" value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Brief summary of the issue"
                  style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Category *</label>
                  <select value={newCategory} onChange={e => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Priority</label>
                  <select value={newPriority} onChange={e => setNewPriority(e.target.value)}
                    style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }}>
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Description *</label>
                <textarea value={newDescription} onChange={e => setNewDescription(e.target.value)} rows={4} placeholder="Describe your issue in detail..."
                  style={{ width: '100%', padding: '12px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.9rem', boxSizing: 'border-box' }} />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>Attachment (optional)</label>
                <label style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  padding: '16px', border: '2px dashed var(--border)', borderRadius: '10px',
                  cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.9rem',
                  transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                  <Upload size={18} />
                  {newFile ? newFile.name : 'Click to upload screenshot or file'}
                  <input type="file" style={{ display: 'none' }} onChange={e => setNewFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              <button className="btn-primary" onClick={handleCreate} disabled={creating || !newSubject || !newCategory || !newDescription}
                style={{ width: '100%', padding: '14px', opacity: (creating || !newSubject || !newCategory || !newDescription) ? 0.6 : 1 }}>
                {creating ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </>
          )}
        </Modal>
      )}

      {/* ── Ticket Detail Modal ── */}
      {showDetail && (
        <Modal title={`Ticket ${showDetail.id}`} onClose={() => setShowDetail(null)}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <span style={{ padding: '4px 12px', borderRadius: '999px', background: `${getStatusColor(showDetail.status)}18`, color: getStatusColor(showDetail.status), fontSize: '0.82rem', fontWeight: 600, border: `1px solid ${getStatusColor(showDetail.status)}30` }}>{showDetail.status}</span>
            <span style={{ padding: '4px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{showDetail.priority} Priority</span>
            <span style={{ padding: '4px 12px', borderRadius: '999px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{showDetail.category}</span>
          </div>
          <h4 style={{ marginBottom: '12px' }}>{showDetail.subject}</h4>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px', fontSize: '0.95rem' }}>{showDetail.description}</p>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Created: {showDetail.date}</div>

          {showDetail.status !== 'Resolved' && showDetail.status !== 'Closed' && (
            <button className="btn-secondary" style={{ width: '100%', padding: '12px', color: '#ff6b6b', borderColor: 'rgba(255,107,107,0.3)' }}
              onClick={() => { setTickets(prev => prev.map(t => t.id === showDetail.id ? { ...t, status: 'Closed' } : t)); setShowDetail(null); }}>
              Close Ticket
            </button>
          )}
        </Modal>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>My Tickets</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track and manage your IT support requests.</p>
        </div>
        <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px' }} onClick={() => setShowCreate(true)}>
          <Plus size={18} />
          Create Ticket
        </button>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, position: 'relative', minWidth: '200px' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search tickets by subject or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '12px 16px 12px 48px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '0 20px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', cursor: 'pointer', outline: 'none' }}>
          {['All', 'Open', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Ticket List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Ticket size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
          <p>{searchTerm ? `No tickets matching "${searchTerm}"` : 'No tickets yet. Click "Create Ticket" to get started.'}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(ticket => (
            <div key={ticket.id} onClick={() => setShowDetail(ticket)} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', padding: '20px', cursor: 'pointer', transition: 'all 0.2s ease',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ticket size={20} color="var(--accent)" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>{ticket.subject}</h3>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    <span>{ticket.id}</span><span>•</span><span>{ticket.category}</span><span>•</span><span>{ticket.date}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>Priority</div>
                  <div style={{ fontWeight: 500 }}>{ticket.priority}</div>
                </div>
                <div style={{ padding: '6px 12px', borderRadius: '20px', background: `${getStatusColor(ticket.status)}15`, color: getStatusColor(ticket.status), fontSize: '0.85rem', fontWeight: 600, minWidth: '100px', textAlign: 'center' }}>
                  {ticket.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTickets;
