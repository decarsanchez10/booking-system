import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, BookOpen, HelpCircle, Play, ChevronRight, TrendingUp } from 'lucide-react';

const categories = [
  { label: 'Getting Started', count: 8, color: '#6C63FF' },
  { label: 'Network & Connectivity', count: 12, color: '#00F0FF' },
  { label: 'Hardware Issues', count: 9, color: '#FF6B6B' },
  { label: 'Software & Apps', count: 15, color: '#FECA57' },
  { label: 'Account & Security', count: 7, color: '#1DD1A1' },
  { label: 'Email & Communication', count: 6, color: '#FF9FF3' },
];

const faqs = [
  {
    id: 1,
    category: 'Account & Security',
    title: 'How do I reset my password?',
    excerpt: 'Step-by-step guide to resetting your account password securely using our self-service portal.',
    popular: true,
    readTime: '2 min',
  },
  {
    id: 2,
    category: 'Network & Connectivity',
    title: 'Why can\'t I connect to the VPN?',
    excerpt: 'Common causes and fixes for VPN connectivity issues, including firewall configuration and credential errors.',
    popular: true,
    readTime: '4 min',
  },
  {
    id: 3,
    category: 'Hardware Issues',
    title: 'My laptop won\'t charge — what do I do?',
    excerpt: 'Diagnose battery and charging port problems step-by-step before submitting a hardware ticket.',
    popular: false,
    readTime: '3 min',
  },
  {
    id: 4,
    category: 'Software & Apps',
    title: 'How to install Microsoft Office on a new device?',
    excerpt: 'Follow this guide to activate your Office 365 license and install all applications correctly.',
    popular: true,
    readTime: '5 min',
  },
  {
    id: 5,
    category: 'Email & Communication',
    title: 'Setting up your company email on mobile',
    excerpt: 'Configure your corporate email account on iOS or Android using Microsoft Exchange settings.',
    popular: false,
    readTime: '3 min',
  },
  {
    id: 6,
    category: 'Getting Started',
    title: 'How to submit a support ticket?',
    excerpt: 'Learn the best way to describe your issue so our technicians can resolve it as fast as possible.',
    popular: true,
    readTime: '2 min',
  },
];

const KnowledgeBase = () => {
  const container = useRef();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState(null);

  useGSAP(() => {
    gsap.from('.kb-hero', { opacity: 0, y: -20, duration: 0.6, ease: 'power3.out' });
    gsap.from('.kb-card', { opacity: 0, y: 30, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.2 });
  }, { scope: container });

  const filtered = faqs.filter(f => {
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase()) || f.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || f.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div ref={container} style={{ minHeight: 'calc(100vh - 72px)', paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>

        {/* Hero */}
        <div className="kb-hero" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            fontSize: '0.8rem',
            color: 'var(--accent)',
            marginBottom: '20px'
          }}>
            <BookOpen size={14} />
            Knowledge Base
          </div>
          <h1 style={{ fontSize: '2.8rem', marginBottom: '16px' }}>
            How can we <span style={{ color: 'var(--accent)' }}>help you?</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '32px' }}>
            Search our documentation, guides, and FAQs to find instant answers.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
            <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search articles, guides, FAQs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '18px 20px 18px 56px',
                fontSize: '1rem',
                background: 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--border)',
                borderRadius: '16px',
                color: 'var(--text-primary)',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />
          </div>
        </div>

        {/* Category Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '48px' }}>
          {categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(activeCategory === cat.label ? 'All' : cat.label)}
              className="kb-card"
              style={{
                padding: '20px',
                background: activeCategory === cat.label ? `${cat.color}15` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${activeCategory === cat.label ? cat.color : 'var(--border)'}`,
                borderRadius: '14px',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.2s, border-color 0.2s, transform 0.2s',
              }}
            >
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cat.color, marginBottom: '12px' }} />
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>{cat.label}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{cat.count} articles</div>
            </button>
          ))}
        </div>

        {/* Popular Articles Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
          <TrendingUp size={18} color="var(--accent)" />
          <h2 style={{ fontSize: '1.3rem' }}>
            {activeCategory !== 'All' ? activeCategory : 'Popular Articles'}
          </h2>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({filtered.length} articles)</span>
        </div>

        {/* Article List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '60px' }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
              <HelpCircle size={40} style={{ marginBottom: '12px', opacity: 0.4 }} />
              <p>No articles found for "{search}"</p>
            </div>
          )}
          {filtered.map(article => (
            <div
              key={article.id}
              className="kb-card"
              onClick={() => setExpandedFaq(expandedFaq === article.id ? null : article.id)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)',
                borderRadius: '14px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'background-color 0.2s, border-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,240,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '999px', background: 'rgba(108, 99, 255, 0.1)', color: '#6C63FF', border: '1px solid rgba(108, 99, 255, 0.2)' }}>
                      {article.category}
                    </span>
                    {article.popular && (
                      <span style={{ fontSize: '0.75rem', padding: '3px 10px', borderRadius: '999px', background: 'rgba(0,240,255,0.08)', color: 'var(--accent)', border: '1px solid rgba(0,240,255,0.2)' }}>
                        🔥 Popular
                      </span>
                    )}
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{article.readTime} read</span>
                  </div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: expandedFaq === article.id ? '12px' : 0 }}>{article.title}</h3>
                  {expandedFaq === article.id && (
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>{article.excerpt}</p>
                  )}
                </div>
                <ChevronRight size={20} color="var(--text-muted)" style={{ transform: expandedFaq === article.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0, marginLeft: '16px' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Still need help? */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
        }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
            <HelpCircle size={32} color="var(--accent)" style={{ marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '12px' }}>Can't find your answer?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>
              Submit a support ticket and a technician will get back to you within 24 hours.
            </p>
            <Link to="/dashboard/user/tickets" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', display: 'inline-block' }}>
              Open a Ticket
            </Link>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: '16px', padding: '32px' }}>
            <Play size={32} color="#FF6B6B" style={{ marginBottom: '16px' }} />
            <h3 style={{ marginBottom: '12px' }}>Video Tutorials</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.95rem' }}>
              Watch step-by-step video walkthroughs for the most common IT issues.
            </p>
            <Link to="/contact" className="btn-secondary" style={{ textDecoration: 'none', padding: '10px 20px', display: 'inline-block' }}>
              Browse Videos
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default KnowledgeBase;
