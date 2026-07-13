import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const container = useRef();
  const formRef = useRef();
  const successRef = useRef();

  useGSAP(() => {
    gsap.from('.forgot-card', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' });
  }, { scope: container });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);

      // Success animation
      gsap.to(formRef.current, { opacity: 0, y: -20, duration: 0.3, display: 'none' });
      gsap.fromTo(successRef.current, 
        { opacity: 0, scale: 0.8, display: 'none' },
        { opacity: 1, scale: 1, display: 'block', duration: 0.5, delay: 0.3, ease: 'back.out(1.7)' }
      );
      
      gsap.to('.success-icon', {
        boxShadow: '0 0 30px rgba(93, 0, 26, 0.8)',
        repeat: -1,
        yoyo: true,
        duration: 1
      });
    }, 1000);
  };

  return (
    <div ref={container} style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: 'calc(100vh - 72px)',
      paddingTop: '72px'
    }}>
      <div className="forgot-card" style={{ width: '100%', maxWidth: '440px', padding: '0 20px' }}>
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '48px 40px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--accent), transparent)'
          }}></div>

          <div ref={formRef}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>RESET PASSWORD</h2>
              <p style={{ 
                fontSize: '0.88rem', 
                color: 'var(--text-muted)', 
                fontFamily: 'var(--font-body)',
                textTransform: 'none',
                fontWeight: 400
              }}>
                Enter your email to receive a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-xs)',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.9rem',
                    outline: 'none',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary btn-large" 
                disabled={isLoading}
                style={{ width: '100%', opacity: isLoading ? 0.7 : 1, marginBottom: '24px' }}
              >
                {isLoading ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </form>

            <div style={{ textAlign: 'center' }}>
              <Link to="/login" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}>
                ← Back to Login
              </Link>
            </div>
          </div>

          <div ref={successRef} style={{ display: 'none', textAlign: 'center', padding: '20px 0' }}>
            <div className="success-icon" style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'var(--accent-soft)',
              border: '1px solid var(--accent-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              color: 'var(--accent)',
              fontSize: '1.5rem'
            }}>✓</div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Link Sent!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px', lineHeight: 1.6 }}>
              If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
            </p>
            <Link to="/login" className="btn-secondary" style={{ width: '100%' }}>
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
