import { useMemo, useState } from 'react';
import { Download, FileText, Filter } from 'lucide-react';

const REPORTS = [
  { id: 'RPT-2026-07', name: 'July Service Summary', type: 'Service', status: 'Ready', generated: 'Jul 16, 2026' },
  { id: 'RPT-2026-Q2', name: 'Q2 Agent Performance', type: 'Agents', status: 'Ready', generated: 'Jul 1, 2026' },
  { id: 'RPT-SLA-30', name: '30-Day SLA Compliance', type: 'SLA', status: 'Draft', generated: 'Jul 15, 2026' },
];

const Reports = () => {
  const [filter, setFilter] = useState('all');
  const [downloaded, setDownloaded] = useState(null);

  const reports = useMemo(
    () => REPORTS.filter(report => filter === 'all' || report.type.toLowerCase() === filter),
    [filter]
  );

  const handleDownload = (report) => {
    setDownloaded(report.id);
    setTimeout(() => setDownloaded(null), 1400);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>REPORTS</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Review and export operational reports.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['all', 'service', 'agents', 'sla'].map(option => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                style={{
                  padding: '8px 16px',
                  background: filter === option ? 'var(--text-primary)' : 'transparent',
                  color: filter === option ? 'var(--bg)' : 'var(--text-secondary)',
                  border: '1px solid',
                  borderColor: filter === option ? 'var(--text-primary)' : 'var(--border)',
                  borderRadius: '100px',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <Filter size={16} /> {reports.length} shown
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {reports.map(report => (
            <div key={report.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px', border: '1px solid var(--border)', borderRadius: 'var(--radius-xs)', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--accent-soft)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{report.name}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{report.id} · {report.generated} · {report.status}</div>
              </div>
              <button className="btn-secondary" onClick={() => handleDownload(report)} style={{ padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Download size={16} /> {downloaded === report.id ? 'Queued' : 'Download'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
