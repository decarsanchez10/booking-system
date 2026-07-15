import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Home, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const container = useRef();

  useGSAP(() => {
    gsap.from('.not-found-content', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out'
    });
    
    gsap.to('.glitch-icon', {
      x: () => Math.random() * 4 - 2,
      y: () => Math.random() * 4 - 2,
      duration: 0.1,
      repeat: -1,
      yoyo: true,
      ease: 'none'
    });
  }, { scope: container });

  return (
    <div ref={container} style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: 'calc(100vh - 72px)',
      paddingTop: '72px'
    }}>
      <div className="not-found-content" style={{ textAlign: 'center', padding: '0 20px' }}>
        
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: '24px' }}>
          <AlertTriangle className="glitch-icon" size={80} color="var(--accent)" style={{ opacity: 0.8 }} />
        </div>
        
        <h1 style={{ 
          fontSize: '6rem', 
          lineHeight: '1', 
          margin: '0 0 16px', 
          fontFamily: 'var(--font-mono)',
          background: 'linear-gradient(135deg, #fff, var(--text-muted))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          404
        </h1>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
          System Not Found
        </h2>
        
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px', maxWidth: '400px', margin: '0 auto 32px' }}>
          The module you are trying to access does not exist or has been moved to a different sector.
        </p>
        
        <Link to="/" className="btn-primary" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          padding: '12px 24px', 
          textDecoration: 'none' 
        }}>
          <Home size={18} />
          Return to Dashboard
        </Link>
        
      </div>
    </div>
  );
};

export default NotFound;
