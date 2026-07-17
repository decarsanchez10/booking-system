import { useRef, useState, useEffect } from 'react';
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
import api from '../lib/api';

const ICON_MAP = {
  'Hardware': Monitor,
  'Software': Cpu,
  'Network': Wifi,
  'Printer': Printer,
  'Email': Mail,
  'Account': UserCog,
  'Data Recovery': KeyRound,
  'Security': ShieldAlert,
  'Remote': HeadphonesIcon,
  'On-site': Wrench,
};

const Services = () => {
  const container = useRef();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        const servicesData = data.data || data;
        setServices(servicesData.filter(s => s.is_active));
      } catch (error) {
        console.error('Failed to load services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useGSAP(() => {
    gsap.from('.service-card', {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }, { scope: container, dependencies: [services] });

  const getIconForService = (serviceName) => {
    for (const [key, Icon] of Object.entries(ICON_MAP)) {
      if (serviceName.toLowerCase().includes(key.toLowerCase())) {
        return Icon;
      }
    }
    return Monitor; // Default icon
  };

  if (loading) {
    return (
      <div style={{ minHeight: 'calc(100vh - 72px)', paddingTop: '132px', paddingBottom: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--text-muted)' }}>Loading services...</div>
      </div>
    );
  }

  return (
    <div ref={container} style={{ minHeight: 'calc(100vh - 72px)', paddingTop: '132px', paddingBottom: '60px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '16px', color: 'var(--text-primary)' }}>
            Our IT <span style={{ color: 'var(--accent)' }}>Services</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
            Comprehensive technical support tailored to keep your systems running smoothly and securely.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service) => {
            const Icon = getIconForService(service.name);
            return (
              <div key={service.id} className="service-card" data-scroll-reveal="off" style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius)',
                padding: '32px',
                minHeight: '240px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                transition: 'background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
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
                  {service.name}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                  {service.description}
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
