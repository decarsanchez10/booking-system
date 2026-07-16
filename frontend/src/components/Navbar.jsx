import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
        <Link to="/" className="nav-brand">
          <div className="nav-brand-icon">O</div>
          OBSIDIAN
        </Link>

        <div className="nav-center">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
          <Link to="/services" className={location.pathname === '/services' ? 'active' : ''}>Services</Link>
          <Link to="/knowledge-base" className={location.pathname === '/knowledge-base' ? 'active' : ''}>Knowledge Base</Link>
          <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''}>Contact</Link>
        </div>

        <div className="nav-right">
          <Link to="/login" className="btn-secondary">Log In</Link>
          <Link to="/signup" className="btn-primary">Get Started</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
