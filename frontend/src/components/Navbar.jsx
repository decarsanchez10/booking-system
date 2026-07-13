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
      <Link to="/" className="nav-brand">
        <div className="nav-brand-icon">O</div>
        OBSIDIAN
      </Link>

      <div className="nav-center">
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link>
        <a href="#how-it-works">How It Works</a>
        <a href="#specialties">Agents</a>
        <Link to="/slots" className={location.pathname === '/slots' ? 'active' : ''}>Appointments</Link>
        <a href="#support">Support</a>
        <a href="#about">About</a>
      </div>

      <div className="nav-right">
        <Link to="/login" className="btn-secondary">Log In</Link>
        <Link to="/slots" className="btn-primary">Book Appointment</Link>
      </div>
    </nav>
  );
};

export default Navbar;
