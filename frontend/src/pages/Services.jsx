import { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { 
  Monitor, 
  Cpu, 
  Wifi, 
  Printer, 
  Mail, 
  UserCog, 
  KeyRound, 
  ShieldAlert, 
  HeadphonesIcon, 
  Wrench 
} from 'lucide-react';

const services = [
  { icon: Monitor, title: 'Hardware Troubleshooting', desc: 'Diagnostics and repair for desktops, laptops, and peripherals.' },
  { icon: Cpu, title: 'Software Installation', desc: 'Setup and configuration of essential software and operating systems.' },
  { icon: Wifi, title: 'Network Support', desc: 'Wi-Fi troubleshooting, VPN access, and connectivity issues.' },
  { icon: Printer, title: 'Printer Setup', desc: 'Local and network printer configuration and maintenance.' },
  { icon: Mail, title: 'Email Support', desc: 'Email account recovery, client setup, and spam filtering.' },
  { icon: UserCog, title: 'Account Management', desc: 'Access control, role modifications, and account provisioning.' },
  { icon: KeyRound, title: 'Password Reset', desc: 'Secure recovery for locked accounts and forgotten passwords.' },
  { icon: ShieldAlert, title: 'Virus & Malware Removal', desc: 'Deep system scans, cleanup, and security hardening.' },
  { icon: HeadphonesIcon, title: 'Remote Assistance', desc: 'Instant support via secure remote desktop sessions.' },
  { icon: Wrench, title: 'On-site Support', desc: 'In-person technical assistance for critical infrastructure.' },
];

const Services = () => {
  const container = useRef();

  useGSAP(() => {
    gsap.from('.service-card', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }, { scope: container });

  return (
    <div ref={container} style={{ minHeight: 'calc(100vh - 72px)', paddingTop: '100px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Our IT <span style={{ color: 'var(--accent)' }}>Services</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Comprehensive technical support tailored to keep your systems running smoothly and securely.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '24px' 
        }}>
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div key={index} className="service-card" style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius)',
                padding: '32px',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 240, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(0, 240, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <Icon size={24} color="var(--accent)" />
                </div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '12px', color: 'var(--text-primary)' }}>
                  {service.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {service.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '40px',
            maxWidth: '600px'
          }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Need Help Now?</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Create a support ticket or book an appointment with our technicians to resolve your issue quickly.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <Link to="/dashboard/user/book" className="btn-primary" style={{ padding: '12px 24px', textDecoration: 'none' }}>
                Book Appointment
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Services;
