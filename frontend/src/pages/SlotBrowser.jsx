import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

// Mock data for initial UI dev
const MOCK_SLOTS = [
  { id: 'SLT-101', agent: 'Sarah Jenkins', specialty: 'software', date: '2023-11-20', time: '09:00 AM', status: 'available' },
  { id: 'SLT-102', agent: 'David Chen', specialty: 'hardware', date: '2023-11-20', time: '10:00 AM', status: 'available' },
  { id: 'SLT-103', agent: 'Mike Ross', specialty: 'network', date: '2023-11-20', time: '11:00 AM', status: 'available' },
  { id: 'SLT-104', agent: 'Sarah Jenkins', specialty: 'software', date: '2023-11-21', time: '01:00 PM', status: 'available' },
  { id: 'SLT-105', agent: 'Mike Ross', specialty: 'network', date: '2023-11-21', time: '02:00 PM', status: 'available' },
];

const SlotBrowser = () => {
  const [filterDate, setFilterDate] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('');
  const container = useRef();

  useGSAP(() => {
    gsap.from('.slot-card', { 
      opacity: 0, 
      y: 20, 
      stagger: 0.08,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, { scope: container });

  const filteredSlots = MOCK_SLOTS.filter(slot => {
    return (!filterDate || slot.date === filterDate) &&
           (!filterSpecialty || slot.specialty === filterSpecialty);
  });

  return (
    <div ref={container}>
      <h1 style={{ marginBottom: '1rem' }}>Available Time Slots</h1>
      <div className="glowing-divider"></div>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <input 
          type="date" 
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          style={{ maxWidth: '200px' }}
        />
        <select 
          value={filterSpecialty}
          onChange={(e) => setFilterSpecialty(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">All Specialties</option>
          <option value="hardware">Hardware</option>
          <option value="software">Software</option>
          <option value="network">Network</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredSlots.map(slot => (
          <div key={slot.id} className="card slot-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="mono-text">{slot.id}</span>
              <span className="mono-text" style={{ color: 'var(--color-burgundy)' }}>{slot.specialty.toUpperCase()}</span>
            </div>
            <h3 style={{ marginBottom: '0.5rem' }}>{slot.agent}</h3>
            <p style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>{slot.date} | {slot.time}</p>
            <div style={{ marginTop: '1.5rem' }}>
              <Link to={`/book/${slot.id}`} className="btn btn-outline" style={{ display: 'inline-block', width: '100%', textAlign: 'center', textDecoration: 'none' }}>
                BOOK SLOT
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlotBrowser;
