import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Mail, Phone, MapPin, MessageSquare, Send, Clock, CheckCircle } from 'lucide-react';

const Contact = () => {
  const container = useRef();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useGSAP(() => {
    gsap.from('.contact-card', { opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
  }, { scope: container });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  const contactInfo = [
    { icon: Mail, label: 'Email Us', value: 'support@obsidian.com', sub: 'Response within 24 hours' },
    { icon: Phone, label: 'Call Us', value: '+1 (800) 555-0199', sub: 'Mon–Fri 8am–6pm' },
    { icon: MapPin, label: 'Visit Us', value: '123 Tech Plaza, Suite 400', sub: 'San Francisco, CA 94102' },
    { icon: Clock, label: 'Emergency Line', value: '+1 (800) 555-0911', sub: '24/7 Critical Support' },
  ];

  return (
    <div ref={container} style={{ minHeight: 'calc(100vh - 72px)', paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
            Get in <span style={{ color: 'var(--accent)' }}>Touch</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto' }}>
            Our IT support team is ready to help. Reach out via any channel below.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '32px' }}>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="contact-card" style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '24px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid var(--border)',
                  borderRadius: '14px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,240,255,0.3)'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateX(0)'; }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(0,240,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={20} color="var(--accent)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontWeight: 600, marginBottom: '2px' }}>{item.value}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="contact-card" style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid var(--border)',
            borderRadius: '20px',
            padding: '40px',
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{
                  width: '72px', height: '72px', borderRadius: '50%',
                  background: 'rgba(29, 209, 161, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  border: '1px solid rgba(29, 209, 161, 0.3)'
                }}>
                  <CheckCircle size={36} color="#1DD1A1" />
                </div>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Message Sent!</h3>
                <p style={{ color: 'var(--text-muted)' }}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                  <MessageSquare size={24} color="var(--accent)" />
                  <h2 style={{ fontSize: '1.4rem' }}>Send a Message</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  {[
                    { id: 'name', label: 'Your Name', placeholder: 'John Doe', type: 'text' },
                    { id: 'email', label: 'Email Address', placeholder: 'john@example.com', type: 'email' },
                  ].map(field => (
                    <div key={field.id}>
                      <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>{field.label}</label>
                      <input
                        type={field.type}
                        required
                        placeholder={field.placeholder}
                        value={form[field.id]}
                        onChange={e => setForm({ ...form, [field.id]: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'var(--bg)',
                          border: '1px solid var(--border)',
                          borderRadius: '10px',
                          color: 'var(--text-primary)',
                          outline: 'none',
                          boxSizing: 'border-box',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                        onBlur={e => e.target.style.borderColor = 'var(--border)'}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="How can we help you?"
                    value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Describe your issue in detail..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    style={{ width: '100%', padding: '12px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '10px', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.95rem', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                    onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                </div>

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem' }}>
                  {loading ? (
                    <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  ) : (
                    <><Send size={18} /> Send Message</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
