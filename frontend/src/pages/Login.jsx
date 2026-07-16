import { useState, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const container = useRef();

  const getDashboardPath = (role) => {
    if (role === 'admin') return '/dashboard/admin';
    if (role === 'agent') return '/dashboard/agent';
    return '/dashboard/user';
  };

  // Where to redirect after login
  const from = location.state?.from || null;

  useGSAP(() => {
    gsap.from('.login-card', { opacity: 0, y: 20, duration: 0.6, ease: 'power3.out' });
  }, { scope: container });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userData = await login(email, password);
      const dest = from || getDashboardPath(userData.role);
      navigate(dest, { replace: true });
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
      <div className="login-card" style={{ width: '100%', maxWidth: '440px', padding: '0 20px' }}>
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
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>WELCOME BACK</h2>
            <p style={{ 
              fontSize: '0.88rem', 
              color: 'var(--text-muted)', 
              fontFamily: 'var(--font-body)',
              textTransform: 'none',
              fontWeight: 400
            }}>
              Log in to manage your appointments
            </p>
          </div>

          {/* Show redirect notice if they were sent here from a protected route */}
          {location.state?.from && (
            <div style={{
              padding: '12px 16px',
              background: 'rgba(93, 0, 26, 0.1)',
              border: '1px solid var(--accent-border)',
              borderRadius: 'var(--radius-xs)',
              color: 'var(--text-secondary)',
              fontSize: '0.82rem',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              ✦ Please log in or sign up to continue booking
            </div>
          )}

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

            <div style={{ marginBottom: '24px' }}>
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
                placeholder="Enter your password"
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-12px', marginBottom: '20px' }}>
            <Link to="/forgot-password" style={{ color: 'var(--text-muted)', fontSize: '0.82rem', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--accent)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
            >Forgot password?</Link>
          </div>

          <button 
            type="submit" 
            className="btn-primary btn-large" 
            disabled={isLoading}
            style={{ width: '100%', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Authenticating...' : 'Log In'}
          </button>
          </form>

          <p style={{ 
            textAlign: 'center', 
            marginTop: '24px', 
            fontSize: '0.85rem', 
            color: 'var(--text-muted)' 
          }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 600 }}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
