import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import HeroShader from '../components/HeroShader';

gsap.registerPlugin(ScrollTrigger);

import headsetImg from '../assets/headset.png';

const trustedLogos = [
  { id: 'microsoft', name: 'Microsoft', color: '#7fba00' },
  { id: 'cisco', name: 'Cisco', color: '#00bceb' },
  { id: 'aws', name: 'AWS', color: '#ff9900' },
  { id: 'google-cloud', name: 'Google Cloud', color: '#4285f4' },
  { id: 'vmware', name: 'VMware', color: '#60a5fa' },
  { id: 'dell', name: 'Dell Technologies', color: '#007db8' },
  { id: 'intel', name: 'Intel', color: '#00c7fd' },
  { id: 'oracle', name: 'Oracle', color: '#f80000' },
];

const testimonials = [
  {
    text: 'Booked a hardware appointment in under a minute. The agent had already reviewed my issue description before I arrived, and my laptop was back online before my next class.',
    name: 'Alex Rivera',
    role: 'Computer Science Student',
    organization: 'College of Engineering',
    initials: 'AR',
  },
  {
    text: 'As staff, I used to wait days for IT support. With RacedCore, I book a slot, describe the issue, and get a prepared technician the same day.',
    name: 'Dr. Patricia Kim',
    role: 'Faculty Member',
    organization: 'Biology Department',
    initials: 'PK',
  },
  {
    text: 'The network support team fixed my connectivity issues remotely during a scheduled session. No more walking to the IT office and waiting in line.',
    name: 'Marcus Johnson',
    role: 'Graduate Student',
    organization: 'Research Lab',
    initials: 'MJ',
  },
  {
    text: 'RacedCore gives our admin team visibility into requests, schedules, and resolution status without chasing email threads. It feels built for real operations.',
    name: 'Elena Santos',
    role: 'Operations Coordinator',
    organization: 'Student Services',
    initials: 'ES',
  },
  {
    text: 'The appointment flow is clean, secure, and predictable. Our department can route issues faster and students always know when help is coming.',
    name: 'Noah Bennett',
    role: 'IT Support Lead',
    organization: 'Campus Technology',
    initials: 'NB',
  },
  {
    text: 'I submitted an account access issue before lunch and had a verified support session booked immediately. The whole process felt polished and trustworthy.',
    name: 'Maya Chen',
    role: 'Administrative Staff',
    organization: 'Admissions Office',
    initials: 'MC',
  },
];

const TrustedLogoMark = ({ logo }) => {
  switch (logo.id) {
    case 'microsoft':
      return (
        <>
          <span className="logo-microsoft-grid" aria-hidden="true">
            <span></span><span></span><span></span><span></span>
          </span>
          <span className="logo-word logo-microsoft">Microsoft</span>
        </>
      );
    case 'cisco':
      return (
        <>
          <span className="logo-cisco-bars" aria-hidden="true">
            {[10, 18, 26, 18, 10, 22, 30, 22, 14].map((height, index) => (
              <span style={{ height: `${height}px` }} key={`${height}-${index}`}></span>
            ))}
          </span>
          <span className="logo-word logo-cisco">CISCO</span>
        </>
      );
    case 'aws':
      return (
        <span className="logo-aws">
          <span className="logo-word">aws</span>
          <svg viewBox="0 0 86 24" aria-hidden="true">
            <path d="M8 10c19 11 43 11 66 0" />
            <path d="M66 7l10 4-8 7" />
          </svg>
        </span>
      );
    case 'google-cloud':
      return (
        <>
          <svg className="logo-cloud-mark" viewBox="0 0 64 42" aria-hidden="true">
            <path className="g-red" d="M22 39h27a12 12 0 0 0 1-24 18 18 0 0 0-33-5" />
            <path className="g-yellow" d="M17 10A18 18 0 0 0 9 37" />
            <path className="g-green" d="M9 37a14 14 0 0 0 13 2" />
            <path className="g-blue" d="M22 39h27a12 12 0 0 0 1-24" />
          </svg>
          <span className="logo-word logo-google">Google Cloud</span>
        </>
      );
    case 'vmware':
      return <span className="logo-word logo-vmware">vmware</span>;
    case 'dell':
      return (
        <>
          <span className="logo-dell-ring" aria-hidden="true">DELL</span>
          <span className="logo-word logo-dell-sub">Technologies</span>
        </>
      );
    case 'intel':
      return <span className="logo-word logo-intel">intel</span>;
    case 'oracle':
      return <span className="logo-word logo-oracle">ORACLE</span>;
    default:
      return <span className="logo-word">{logo.name}</span>;
  }
};

const Home = () => {
  const container = useRef();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((current) => (current + 1) % testimonials.length);
    }, 5600);

    return () => clearInterval(timer);
  }, []);

  useGSAP(() => {
    // Hero animations
    gsap.from('.hero-badge', { opacity: 0, y: 10, duration: 0.6, delay: 0.2, ease: 'power3.out' });
    gsap.from('.hero-title-line', { opacity: 0, y: 30, stagger: 0.12, duration: 0.7, delay: 0.3, ease: 'power3.out' });
    gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.6, delay: 0.8, ease: 'power3.out' });
    gsap.from('.hero-buttons', { opacity: 0, y: 20, duration: 0.6, delay: 1.0, ease: 'power3.out' });
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

    // Trusted logos
    gsap.from('.trusted-heading', {
      scrollTrigger: { trigger: '.trusted-section', start: 'top 82%' },
      opacity: 0,
      y: 24,
      duration: 0.6,
      ease: 'power3.out'
    });

    gsap.from('.trusted-subtitle', {
      scrollTrigger: { trigger: '.trusted-section', start: 'top 82%' },
      opacity: 0,
      y: 18,
      duration: 0.6,
      delay: 0.12,
      ease: 'power3.out'
    });

    gsap.from('.trusted-logo', {
      scrollTrigger: { trigger: '.trusted-logos', start: 'top 88%' },
      y: 18,
      scale: 0.94,
      stagger: 0.08,
      duration: 0.5,
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





    // Testimonials
    gsap.from('.testimonials-section', {
      scrollTrigger: { trigger: '.testimonials-section', start: 'top 82%' },
      opacity: 0,
      y: 42,
      duration: 0.75,
      ease: 'power3.out'
    });

    gsap.from('.testimonial-reveal', {
      scrollTrigger: { trigger: '.testimonials-section', start: 'top 80%' },
      opacity: 0,
      y: 20,
      stagger: 0.12,
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.from('.testimonial-stage', {
      scrollTrigger: { trigger: '.testimonial-carousel', start: 'top 82%' },
      opacity: 0,
      scale: 0.9,
      duration: 0.7,
      delay: 0.15,
      ease: 'back.out(1.35)'
    });

    gsap.from('.testimonial-star', {
      scrollTrigger: { trigger: '.testimonial-carousel', start: 'top 82%' },
      opacity: 0,
      y: -8,
      scale: 0.6,
      stagger: 0.07,
      duration: 0.35,
      delay: 0.35,
      ease: 'back.out(1.7)'
    });

    gsap.from('.testimonial-quote-line', {
      scrollTrigger: { trigger: '.testimonial-carousel', start: 'top 82%' },
      opacity: 0,
      y: 12,
      stagger: 0.08,
      duration: 0.45,
      delay: 0.45,
      ease: 'power2.out'
    });

    gsap.from('.testimonial-person', {
      scrollTrigger: { trigger: '.testimonial-carousel', start: 'top 82%' },
      opacity: 0,
      y: 24,
      rotation: -3,
      duration: 0.55,
      delay: 0.62,
      ease: 'power2.out'
    });

    gsap.to('.testimonial-stage', {
      scrollTrigger: {
        trigger: '.testimonials-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.2
      },
      x: 120,
      scale: 1.02,
      transformOrigin: 'center center',
      ease: 'none'
    });

    gsap.to('.testimonial-glow-orbit', {
      scrollTrigger: {
        trigger: '.testimonials-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      },
      x: 150,
      ease: 'none'
    });
  }, { scope: container });

  const activeReview = testimonials[activeTestimonial];
  const previousReview = testimonials[(activeTestimonial - 1 + testimonials.length) % testimonials.length];
  const nextReview = testimonials[(activeTestimonial + 1) % testimonials.length];
  const quoteLines = activeReview.text.match(/.{1,82}(\s|$)/g) || [activeReview.text];

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

      <section className="trusted-section">
        <div className="trusted-gradient-line" aria-hidden="true"></div>
        <div className="section-container">
          <div className="trusted-panel">
            <div className="trusted-copy">
              <div className="trusted-label">// TRUSTED</div>
              <h2 className="trusted-heading">Trusted by Industry Leaders</h2>
              <p className="trusted-subtitle">
                We partner with innovative organizations worldwide to deliver secure, reliable, and enterprise-grade IT support.
              </p>
            </div>

            <div className="trusted-marquee" aria-label="Trusted company logos">
              <div className="trusted-logos">
                {trustedLogos.map((logo) => (
                  <div className={`trusted-logo trusted-logo-${logo.id}`} style={{ '--logo-color': logo.color }} key={logo.name}>
                    <TrustedLogoMark logo={logo} />
                  </div>
                ))}
              </div>
            </div>

            <div className="trusted-footnote">
              <span className="trusted-shield" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6l7-3z" />
                  <path d="M9 12l2 2 4-5" />
                </svg>
              </span>
              Trusted by 10,000+ organizations across 120+ countries
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
          WHY CHOOSE US
          ═══════════════════════════════════════ */}
      <section className="section" id="about">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">// WHY RACEDCORE</div>
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
                RacedCore keeps appointment booking, ticket tracking, agent schedules,
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
      <section className="section testimonials-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label testimonial-reveal">// FEEDBACK</div>
            <h2 className="section-title testimonial-reveal">WHAT USERS SAY</h2>
            <p className="section-subtitle testimonial-reveal">
              Hear from students and staff who rely on RacedCore Help Desk every day.
            </p>
          </div>

          <div className="testimonial-carousel">
            <div className="testimonial-glow-orbit" aria-hidden="true"></div>
            <div className="testimonial-stage">
              <article className="testimonial-side-card testimonial-side-left" aria-hidden="true">
                <div className="testimonial-mini-stars">★★★★★</div>
                <p>{previousReview.text}</p>
                <strong>{previousReview.name}</strong>
              </article>

              <article className="testimonial-featured-card" key={activeReview.name}>
                <div className="testimonial-stars" aria-label="Five star rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span className="testimonial-star" key={star}>★</span>
                  ))}
                </div>
                <div className="testimonial-quote-mark" aria-hidden="true">“</div>
                <blockquote className="testimonial-quote">
                  {quoteLines.map((line, index) => (
                    <span className="testimonial-quote-line" key={`${activeReview.name}-${index}`}>{line.trim()}</span>
                  ))}
                </blockquote>

                <div className="testimonial-card-footer">
                  <div className="testimonial-person">
                    <div className="testimonial-avatar">{activeReview.initials}</div>
                    <div>
                      <div className="testimonial-name">{activeReview.name}</div>
                      <div className="testimonial-role">{activeReview.role}</div>
                      <div className="testimonial-org">{activeReview.organization}</div>
                    </div>
                  </div>
                  <div className="verified-badge">
                    <span>✓</span>
                    Verified User
                  </div>
                </div>
              </article>

              <article className="testimonial-side-card testimonial-side-right" aria-hidden="true">
                <div className="testimonial-mini-stars">★★★★★</div>
                <p>{nextReview.text}</p>
                <strong>{nextReview.name}</strong>
              </article>
            </div>

            <div className="testimonial-dots" aria-label="Testimonial pagination">
              {testimonials.map((review, index) => (
                <button
                  className={`testimonial-dot ${index === activeTestimonial ? 'active' : ''}`}
                  type="button"
                  aria-label={`Show testimonial from ${review.name}`}
                  aria-current={index === activeTestimonial}
                  onClick={() => setActiveTestimonial(index)}
                  key={review.name}
                />
              ))}
            </div>

            <div className="testimonial-trust">
              <span className="testimonial-trust-stars">★★★★★</span>
              <strong>4.9/5 Average Rating</strong>
              <span>Trusted by 2,500+ students and staff</span>
            </div>
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
                <li><a href="mailto:support@racedcore.org">support@racedcore.edu</a></li>
                <li><a href="tel:+18001234567">(800) 123-4567</a></li>
                <li><a href="#">IT Building, Room 204</a></li>
                <li><a href="#">Mon–Fri, 8AM–8PM</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 RacedCore Help Desk. All rights reserved.</span>
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
