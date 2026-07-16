import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Users, UserCheck, Calendar, Activity, Clock, ShieldAlert } from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

const WEEKLY_DATA = [
  { name: 'Mon', apts: 42, resolved: 38 },
  { name: 'Tue', apts: 56, resolved: 52 },
  { name: 'Wed', apts: 65, resolved: 60 },
  { name: 'Thu', apts: 48, resolved: 45 },
  { name: 'Fri', apts: 72, resolved: 70 },
  { name: 'Sat', apts: 15, resolved: 15 },
  { name: 'Sun', apts: 12, resolved: 10 },
];

const DEPT_DATA = [
  { name: 'Hardware', value: 45 },
  { name: 'Software', value: 30 },
  { name: 'Network', value: 15 },
  { name: 'Account', value: 10 },
];

const COLORS = ['#8b5cf6', '#a78bfa', '#06b6d4', '#67e8f9']; // Aurora palette

const AdminDashboard = () => {
  const container = useRef();

  useGSAP(() => {
    gsap.from('.dash-card', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, { scope: container });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: 'rgba(9, 9, 14, 0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '4px 0', color: entry.color, fontSize: '0.9rem', fontWeight: 600 }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '8px' }}>ADMINISTRATOR DASHBOARD</h1>
          <p style={{ color: 'var(--text-secondary)' }}>System overview, health, and analytics.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px rgba(34,197,94,0.5)' }}></span>
            System Online
          </div>
        </div>
      </div>

      {/* Top Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {[
          { label: 'Total Users', value: '4,289', icon: <Users size={18} />, color: 'var(--text-primary)' },
          { label: 'Active Agents', value: '24', icon: <UserCheck size={18} />, color: 'var(--text-primary)' },
          { label: 'Appts Today', value: '142', icon: <Calendar size={18} />, color: 'var(--accent)' },
          { label: 'Pending Req.', value: '18', icon: <Clock size={18} />, color: '#eab308' },
          { label: 'System Load', value: '14%', icon: <Activity size={18} />, color: '#22c55e' }
        ].map((stat, i) => (
          <div key={i} className="dash-card card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500 }}>
                {stat.label}
              </div>
              <div style={{ color: stat.color }}>{stat.icon}</div>
            </div>
            <div style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
        
        {/* Main Chart */}
        <div className="dash-card card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '24px' }}>Weekly Appointments vs Resolutions</h3>
          <div style={{ flex: 1, minHeight: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorApts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="apts" stroke="var(--accent)" fillOpacity={1} fill="url(#colorApts)" name="Appointments" strokeWidth={2} />
                <Area type="monotone" dataKey="resolved" stroke="#22c55e" fillOpacity={0} name="Resolved" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="dash-card card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '24px' }}>Issue Categories</h3>
          <div style={{ flex: 1, minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={DEPT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {DEPT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
              {DEPT_DATA.map((entry, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: COLORS[index % COLORS.length] }}></div>
                  {entry.name} ({entry.value}%)
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        
        <div className="dash-card card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>System Health Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '16px', padding: '16px', background: 'rgba(234, 179, 8, 0.05)', border: '1px solid rgba(234, 179, 8, 0.2)', borderRadius: 'var(--radius-xs)' }}>
              <ShieldAlert size={20} color="#eab308" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#eab308', marginBottom: '4px' }}>High Authentication Latency</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Login requests are taking &gt;800ms. Consider scaling the auth microservice.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '16px', padding: '16px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)' }}>
              <Activity size={20} color="var(--text-muted)" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>Database Backup Completed</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Automated full backup finished successfully at 03:00 AM.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="dash-card card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Agent Performance (Top 3)</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { name: 'Sarah Jenkins', score: 98, resolved: 142 },
              { name: 'David Chen', score: 95, resolved: 128 },
              { name: 'Mike Ross', score: 91, resolved: 94 },
            ].map((agent, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: i !== 2 ? '1px solid var(--border)' : 'none' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '4px' }}>{agent.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{agent.resolved} issues resolved</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{agent.score}%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>CSAT Score</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
