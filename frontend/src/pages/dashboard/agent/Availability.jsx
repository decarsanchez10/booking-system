import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Calendar as CalendarIcon, Clock, Save, Copy, Plus } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

const Availability = () => {
  const container = useRef();
  const [schedule, setSchedule] = useState({
    Monday: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'],
    Tuesday: ['10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM'],
    Wednesday: ['09:00 AM', '10:00 AM', '01:00 PM', '02:00 PM'],
    Thursday: ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
    Friday: ['09:00 AM', '10:00 AM', '11:00 AM'],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [holidayMode, setHolidayMode] = useState(false);

  useGSAP(() => {
    gsap.from('.sched-row', {
      opacity: 0,
      x: -20,
      stagger: 0.1,
      duration: 0.4,
      ease: 'power2.out'
    });
  }, { scope: container });

  const toggleSlot = (day, time) => {
    setSchedule(prev => {
      const daySlots = prev[day];
      if (daySlots.includes(time)) {
        return { ...prev, [day]: daySlots.filter(t => t !== time) };
      } else {
        return { ...prev, [day]: [...daySlots, time].sort((a, b) => {
          // simple sort logic since all slots follow PM/AM pattern in TIME_SLOTS order
          return TIME_SLOTS.indexOf(a) - TIME_SLOTS.indexOf(b);
        }) };
      }
    });
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 800);
  };

  return (
    <div ref={container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>AVAILABILITY MANAGEMENT</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Configure your recurring weekly schedule and time slots.</p>
        </div>
        <button onClick={handleSave} className="btn-primary" disabled={isSaving}>
          <Save size={16} style={{ marginRight: '8px' }} />
          {isSaving ? 'SAVING...' : 'SAVE SCHEDULE'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px' }}>
        
        {/* Left Column: Schedule Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {DAYS.map((day) => (
            <div key={day} className="sched-row card" style={{ padding: '24px', opacity: holidayMode ? 0.5 : 1, pointerEvents: holidayMode ? 'none' : 'auto', transition: 'opacity 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                    {day.substring(0, 3)}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{day}</h3>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}><Copy size={14}/> Copy to all</button>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Active</span>
                    <input type="checkbox" defaultChecked={true} style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }} />
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {TIME_SLOTS.map((time) => {
                  const isActive = schedule[day].includes(time);
                  return (
                    <button
                      key={time}
                      onClick={() => toggleSlot(day, time)}
                      style={{
                        padding: '8px 16px',
                        background: isActive ? 'var(--accent-soft)' : 'transparent',
                        color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                        border: '1px solid',
                        borderColor: isActive ? 'var(--accent-border)' : 'var(--border)',
                        borderRadius: 'var(--radius-xs)',
                        fontSize: '0.85rem',
                        fontFamily: 'var(--font-mono)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {isActive ? <CheckCircle size={14} /> : <Plus size={14} />} {time}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

        </div>

        {/* Right Column: Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--accent)" /> Global Settings
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Meeting Duration</label>
              <select style={{ width: '100%', padding: '10px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }}>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginBottom: '8px' }}>Buffer Time (Between meetings)</label>
              <select style={{ width: '100%', padding: '10px 16px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', outline: 'none' }}>
                <option value="0">None</option>
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
              </select>
            </div>

            <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-xs)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: 600, color: '#ef4444' }}>Holiday Mode</div>
                <input 
                  type="checkbox" 
                  checked={holidayMode}
                  onChange={(e) => setHolidayMode(e.target.checked)}
                  style={{ accentColor: '#ef4444', width: '18px', height: '18px', cursor: 'pointer' }} 
                />
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Temporarily disable all booking slots. Useful for vacations or sick leave.
              </p>
            </div>
          </div>

          <div className="card" style={{ padding: '24px', background: 'var(--accent-soft)', borderColor: 'var(--accent-border)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--accent)' }}>Note on Timezones</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              All time slots are displayed in your local timezone. Students will automatically see these converted to their local timezone when booking.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Availability;
