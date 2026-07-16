import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../context/AuthContext';
import ReCAPTCHA from 'react-google-recaptcha';
import { CheckCircle } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [captchaValue, setCaptchaValue] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [createdAccount, setCreatedAccount] = useState(null);
  const { signup } = useAuth();
  const location = useLocation();
  const container = useRef();

  const from = location.state?.from || null;

  useGSAP(() => {
    gsap.from('.signup-card', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' });
  }, { scope: container });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!captchaValue) {
      setError('Please verify you are not a robot');
      return;
    }

    setIsLoading(true);
    try {
      const userData = await signup(name, email, password, role);
      setCreatedAccount(userData);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={container} style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: 'calc(100vh - 72px)',
      paddingTop: '72px'
    }}>
      <div className="signup-card" style={{ width: '100%', maxWidth: '440px', padding: '0 20px' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius)',
          padding: '48px 40px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Top accent line */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, var(--accent), var(--accent-secondary), transparent)'
          }}></div>

          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>CREATE ACCOUNT</h2>
            <p style={{ 
              fontSize: '0.88rem', 
              color: 'var(--text-muted)', 
              fontFamily: 'var(--font-body)',
              textTransform: 'none',
              fontWeight: 400
            }}>
              Sign up to book IT support appointments
            </p>
          </div>

          {createdAccount ? (
            <div style={{ textAlign: 'center' }}>
              <CheckCircle size={56} color="#22c55e" style={{ marginBottom: '18px' }} />
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Account Created</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Your {createdAccount.role === 'agent' ? 'IT support agent' : 'user'} account is ready. You can now log in with your email and password.
              </p>
              <Link
                to="/login"
                state={{ from }}
                className="btn-primary btn-large"
                style={{ display: 'inline-flex', width: '100%', justifyContent: 'center', textDecoration: 'none' }}
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <>
          {error && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(93, 0, 26, 0.15)',
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius-xs)',
              color: '#ff6b6b',
              fontSize: '0.85rem',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
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

            <div style={{ marginBottom: '16px' }}>
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

            <div style={{ marginBottom: '16px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
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

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '6px', 
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
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

            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '10px', 
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Account Type</label>
              <div style={{ display: 'flex', gap: '12px' }}>
                <label style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  background: role === 'user' ? 'rgba(0, 240, 255, 0.1)' : 'var(--bg)',
                  border: role === 'user' ? '1px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  color: role === 'user' ? 'var(--accent)' : 'var(--text-primary)'
                }}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="user" 
                    checked={role === 'user'} 
                    onChange={() => setRole('user')}
                    style={{ display: 'none' }}
                  />
                  User (Student/Staff)
                </label>
                <label style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  background: role === 'agent' ? 'rgba(0, 240, 255, 0.1)' : 'var(--bg)',
                  border: role === 'agent' ? '1px solid var(--accent)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius-xs)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  color: role === 'agent' ? 'var(--accent)' : 'var(--text-primary)'
                }}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="agent" 
                    checked={role === 'agent'} 
                    onChange={() => setRole('agent')}
                    style={{ display: 'none' }}
                  />
                  IT Support Agent
                </label>
              </div>
            </div>

            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
              <ReCAPTCHA
                sitekey="6LeUWlQtAAAAAIoHexsoNB6orG3wn6wF5GkMQlgb"
                onChange={(val) => setCaptchaValue(val)}
                theme="dark"
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary btn-large" 
              disabled={isLoading}
              style={{ width: '100%', opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p style={{ 
            textAlign: 'center', 
            marginTop: '24px', 
            fontSize: '0.85rem', 
            color: 'var(--text-muted)' 
          }}>
            Already have an account?{' '}
            <Link to="/login" state={{ from }} style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Log In
            </Link>
          </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
