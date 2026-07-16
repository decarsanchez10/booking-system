import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import HeroShader from '../components/HeroShader';

gsap.registerPlugin(ScrollTrigger);

import headsetImg from '../assets/headset.png';

const Home = () => {
  const container = useRef();

  useGSAP(() => {
    // Hero animations
    gsap.from('.hero-badge', { opacity: 0, y: 10, duration: 0.6, delay: 0.2, ease: 'power3.out' });
    gsap.from('.hero-title-line', { opacity: 0, y: 30, stagger: 0.12, duration: 0.7, delay: 0.3, ease: 'power3.out' });
    gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.6, delay: 0.8, ease: 'power3.out' });
    gsap.from('.hero-buttons', { opacity: 0, y: 20, duration: 0.6, delay: 1.0, ease: 'power3.out' });
    gsap.from('.hero-trust-item', { opacity: 0, y: 10, stagger: 0.08, duration: 0.5, delay: 1.2, ease: 'power3.out' });
    gsap.from('.hero-visual', { opacity: 0, scale: 0.95, duration: 1, delay: 0.5, ease: 'power3.out' });

    // Stats
    gsap.from('.stat-item', {
      scrollTrigger: { trigger: '.stats-bar', start: 'top 85%' },
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out'
    });

    // Feature cards
    gsap.from('.feature-card', {
      scrollTrigger: { trigger: '.features-grid', start: 'top 85%' },
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power2.out'
    });

    // Timeline steps
    gsap.from('.timeline-step', {
      scrollTrigger: { trigger: '.timeline-grid', start: 'top 85%' },
      opacity: 0,
      y: 20,
      stagger: 0.12,
      duration: 0.5,
      ease: 'power2.out'
    });

    // Specialty cards
    gsap.from('.specialty-card', {
      scrollTrigger: { trigger: '.specialties-grid', start: 'top 85%' },
      opacity: 0,
      y: 20,
      stagger: 0.08,
      duration: 0.5,
      ease: 'power2.out'
    });

    // Why stats
    gsap.from('.why-stat', {
      scrollTrigger: { trigger: '.why-stats', start: 'top 85%' },
      opacity: 0,
      scale: 0.95,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out'
    });

    // Testimonials
    gsap.from('.testimonial-card', {
      scrollTrigger: { trigger: '.testimonials-grid', start: 'top 85%' },
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, { scope: container });

  return (
    <div ref={container}>

      {/* ═══════════════════════════════════════
          HERO
          ═══════════════════════════════════════ */}
      <section className="hero" style={{ position: 'relative', overflow: 'hidden' }}>
        <HeroShader />
        <div className="section-container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <span className="hero-badge-dot"></span>
                System Online — All Agents Available
              </div>

              <h1 className="hero-title">
                <span className="hero-title-line" style={{ display: 'block' }}>FAST.</span>
                <span className="hero-title-line" style={{ display: 'block' }}>RELIABLE.</span>
                <span className="hero-title-line accent" style={{ display: 'block' }}>IT SUPPORT</span>
                <span className="hero-title-line" style={{ display: 'block', fontSize: '0.6em', color: 'var(--text-secondary)', marginTop: '8px' }}>WHEN YOU NEED IT.</span>
              </h1>

              <p className="hero-subtitle">
                Book appointments with certified IT Support Agents in seconds.
                Resolve hardware, software, network, and account issues faster
                through scheduled support sessions.
              </p>

              <div className="hero-buttons">
                <Link to="/slots" className="btn-primary btn-large">
                  Book Appointment →
                </Link>
                <Link to="/slots" className="btn-secondary btn-large">
                  Browse Slots
                </Link>
              </div>
            </div>

            <div className="hero-visual">
              <img
                src={headsetImg}
                alt="Support headset"
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LIVE STATS BAR
          ═══════════════════════════════════════ */}
      <section className="stats-bar">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value"><span className="stat-dot"></span>ONLINE</div>
              <div className="stat-label">System Status</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">12</div>
              <div className="stat-label">Agents Available</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">~15<span className="accent"> min</span></div>
              <div className="stat-label">Average Wait</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">184</div>
              <div className="stat-label">Today's Appointments</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">98<span className="accent">%</span></div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURE CARDS
          ═══════════════════════════════════════ */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">// CAPABILITIES</div>
            <h2 className="section-title">ENTERPRISE-GRADE IT SUPPORT</h2>
            <p className="section-subtitle">
              Everything you need to resolve technical issues quickly, efficiently,
              and with full transparency.
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🛡</div>
              <h3 className="feature-title">Expert IT Agents</h3>
              <p className="feature-desc">
                Certified professionals specializing in hardware, software,
                network infrastructure, and account management.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3 className="feature-title">Secure Authentication</h3>
              <p className="feature-desc">
                JWT-based authentication ensures your data and appointments
                remain private and protected at all times.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📅</div>
              <h3 className="feature-title">Easy Booking</h3>
              <p className="feature-desc">
                Book appointments in under 30 seconds with our streamlined
                scheduling interface. No phone calls needed.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3 className="feature-title">Real-Time Availability</h3>
              <p className="feature-desc">
                Live slot availability ensures you always see the most
                up-to-date schedule with zero conflicts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════ */}
      <section className="section" id="how-it-works">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">// WORKFLOW</div>
            <h2 className="section-title">HOW IT WORKS</h2>
            <p className="section-subtitle">
              From issue to resolution in five simple steps.
            </p>
          </div>

          <div className="timeline-grid">
            <div className="timeline-line"></div>
            {[
              { num: '01', title: 'Select Specialty', desc: 'Choose hardware, software, network, or account support.' },
              { num: '02', title: 'Choose Date', desc: 'Pick the most convenient date from the calendar.' },
              { num: '03', title: 'Pick Available Slot', desc: 'Browse open time slots for your chosen specialty.' },
              { num: '04', title: 'Describe Issue', desc: 'Provide details so the agent can prepare in advance.' },
              { num: '05', title: 'Get Confirmation', desc: 'Receive instant confirmation with appointment details.' },
            ].map((step) => (
              <div className="timeline-step" key={step.num}>
                <div className="timeline-dot"></div>
                <div className="step-card">
                  <div className="step-number">Step {step.num}</div>
                  <h4 className="step-title">{step.title}</h4>
                  <p className="step-desc">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SEARCH APPOINTMENTS
          ═══════════════════════════════════════ */}
      <section className="section" id="support">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">// QUICK SEARCH</div>
            <h2 className="section-title">FIND YOUR APPOINTMENT</h2>
            <p className="section-subtitle">
              Use the panel below to search for available slots that match your needs.
            </p>
          </div>

          <div className="booking-panel">
            <div className="booking-grid">
              <div className="booking-field">
                <label>Specialty</label>
                <select defaultValue="">
                  <option value="" disabled>Select type</option>
                  <option value="hardware">Hardware</option>
                  <option value="software">Software</option>
                  <option value="network">Network</option>
                  <option value="account">Account Access</option>
                </select>
              </div>
              <div className="booking-field">
                <label>Date</label>
                <input type="date" />
              </div>
              <div className="booking-field">
                <label>Time</label>
                <select defaultValue="">
                  <option value="" disabled>Any time</option>
                  <option value="morning">Morning (8–12)</option>
                  <option value="afternoon">Afternoon (12–5)</option>
                  <option value="evening">Evening (5–8)</option>
                </select>
              </div>
              <div className="booking-field">
                <label>Issue Type</label>
                <select defaultValue="">
                  <option value="" disabled>Select issue</option>
                  <option value="repair">Repair</option>
                  <option value="setup">Setup</option>
                  <option value="troubleshoot">Troubleshoot</option>
                  <option value="consultation">Consultation</option>
                </select>
              </div>
              <Link to="/slots" className="btn-primary btn-large" style={{ height: '46px', alignSelf: 'end' }}>
                Search →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          POPULAR SPECIALTIES
          ═══════════════════════════════════════ */}
      <section className="section" id="specialties">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">// SPECIALTIES</div>
            <h2 className="section-title">POPULAR CATEGORIES</h2>
            <p className="section-subtitle">
              Browse by category to find the right agent for your issue.
            </p>
          </div>

          <div className="specialties-grid">
            {[
              { icon: '🖥', name: 'Hardware', agents: 4, wait: '12 min' },
              { icon: '💻', name: 'Software', agents: 3, wait: '10 min' },
              { icon: '🌐', name: 'Network', agents: 2, wait: '18 min' },
              { icon: '🔑', name: 'Account Access', agents: 2, wait: '8 min' },
              { icon: '🖨', name: 'Printer', agents: 1, wait: '15 min' },
              { icon: '📧', name: 'Email', agents: 2, wait: '9 min' },
            ].map((s) => (
              <div className="specialty-card" key={s.name}>
                <div className="specialty-icon">{s.icon}</div>
                <div className="specialty-info">
                  <h4>{s.name}</h4>
                  <div className="specialty-meta">
                    <span>👤 {s.agents} agents</span>
                    <span>⏱ ~{s.wait}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          WHY CHOOSE US
          ═══════════════════════════════════════ */}
      <section className="section" id="about">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">// WHY OBSIDIAN</div>
            <h2 className="section-title">TRUSTED BY THOUSANDS</h2>
            <p className="section-subtitle">
              Our track record speaks for itself. Fast resolutions, expert agents,
              and a platform built for reliability.
            </p>
          </div>

          <div className="why-grid">
            <div className="why-summary">
              <div className="section-label">// PLATFORM OVERVIEW</div>
              <h3>Built for fast campus IT support.</h3>
              <p>
                Obsidian keeps appointment booking, ticket tracking, agent schedules,
                and support updates in one place so students and staff know exactly
                where their request stands.
              </p>
              <div className="why-checklist">
                <span>Centralized appointment scheduling</span>
                <span>Role-based user, agent, and admin dashboards</span>
                <span>Live support visibility and ticket history</span>
              </div>
            </div>
            <div className="why-stats">
              <div className="why-stat">
                <div className="why-stat-value">5,000+</div>
                <div className="why-stat-label">Appointments Completed</div>
              </div>
              <div className="why-stat">
                <div className="why-stat-value">99%</div>
                <div className="why-stat-label">Resolution Rate</div>
              </div>
              <div className="why-stat">
                <div className="why-stat-value">12</div>
                <div className="why-stat-label">Certified IT Experts</div>
              </div>
              <div className="why-stat">
                <div className="why-stat-value">24/7</div>
                <div className="why-stat-label">System Monitoring</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════ */}
      <section className="section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">// FEEDBACK</div>
            <h2 className="section-title">WHAT USERS SAY</h2>
            <p className="section-subtitle">
              Hear from students and staff who rely on Obsidian Help Desk every day.
            </p>
          </div>

          <div className="testimonials-grid">
            {[
              {
                text: 'Booked a hardware appointment in under a minute. The agent had already reviewed my issue description before I arrived. Incredibly efficient.',
                name: 'Alex Rivera',
                role: 'Computer Science Student',
                initials: 'AR',
                stars: 5,
              },
              {
                text: 'As staff, I used to wait days for IT support. With Obsidian, I book a slot, describe the issue, and it is resolved the same day. Game changer.',
                name: 'Dr. Patricia Kim',
                role: 'Faculty — Biology Dept.',
                initials: 'PK',
                stars: 5,
              },
              {
                text: 'The network support team fixed my connectivity issues remotely during a scheduled session. No more walking to the IT office and waiting in line.',
                name: 'Marcus Johnson',
                role: 'Graduate Student',
                initials: 'MJ',
                stars: 4,
              },
            ].map((t, i) => (
              <div className="testimonial-card" key={i}>
                <div className="testimonial-stars">
                  {'★'.repeat(t.stars)}{'☆'.repeat(5 - t.stars)}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">{t.initials}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA
          ═══════════════════════════════════════ */}
      <section className="cta-section">
        <div className="section-container" style={{ position: 'relative' }}>
          <h2 className="cta-title">READY TO RESOLVE YOUR ISSUE?</h2>
          <p className="cta-subtitle">
            Book your appointment now. Most issues are resolved within a single session.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <Link to="/slots" className="btn-primary btn-large">
              Book Appointment →
            </Link>
            <Link to="/login" className="btn-secondary btn-large">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════ */}
      <footer className="footer">
        <div className="section-container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">OBSIDIAN <span>HELP DESK</span></div>
              <p className="footer-desc">
                Enterprise-grade IT support booking for students and staff.
                Fast scheduling. Certified agents. Reliable resolutions.
              </p>
            </div>

            <div>
              <h5 className="footer-heading">Quick Links</h5>
              <ul className="footer-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/slots">Book Appointment</Link></li>
                <li><Link to="/my-bookings">My Bookings</Link></li>
                <li><a href="#how-it-works">How It Works</a></li>
              </ul>
            </div>

            <div>
              <h5 className="footer-heading">Support</h5>
              <ul className="footer-links">
                <li><a href="#specialties">Specialties</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Status Page</a></li>
              </ul>
            </div>

            <div>
              <h5 className="footer-heading">Contact</h5>
              <ul className="footer-links">
                <li><a href="mailto:support@obsidian.edu">support@obsidian.edu</a></li>
                <li><a href="tel:+18001234567">(800) 123-4567</a></li>
                <li><a href="#">IT Building, Room 204</a></li>
                <li><a href="#">Mon–Fri, 8AM–8PM</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Obsidian Help Desk. All rights reserved.</span>
            <div className="footer-socials">
              <a href="#" aria-label="Twitter">𝕏</a>
              <a href="#" aria-label="GitHub">⌘</a>
              <a href="#" aria-label="LinkedIn">in</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;
