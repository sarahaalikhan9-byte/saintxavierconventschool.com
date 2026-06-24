import React, { useState, useEffect } from 'react';
import { Calendar, Video, CheckCircle2, Phone, Trash2, Plus, Share2, Instagram, Facebook, MessageCircle } from 'lucide-react';

interface TourRecord {
  id: string;
  name: string;
  date: string;
  phone: string;
  tourType: 'In-Person' | 'Virtual';
  status: 'Pending' | 'Approved' | 'Completed';
  sharedTo?: string[]; // platforms this tour was promoted on
}

const STATUS_META = {
  Pending:   { bg: '#2a1f00', border: '#f59e0b33', text: '#f59e0b', dot: '#f59e0b' },
  Approved:  { bg: '#001a2e', border: '#3b82f633', text: '#60a5fa', dot: '#3b82f6' },
  Completed: { bg: '#001a0f', border: '#22c55e33', text: '#4ade80', dot: '#22c55e' },
};

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: '#e1306c', bg: '#2a0018' },
  { id: 'facebook',  label: 'Facebook',  color: '#1877f2', bg: '#001428' },
  { id: 'whatsapp',  label: 'WhatsApp',  color: '#25d366', bg: '#001a10' },
];

const DEFAULT_TOURS: TourRecord[] = [
  { id: 'tour-1', name: 'Rahul Sharma',  date: '2026-06-20', phone: '+91 98765 43210', tourType: 'In-Person', status: 'Pending',   sharedTo: [] },
  { id: 'tour-2', name: 'Priya Singh',   date: '2026-06-22', phone: '+91 87654 32109', tourType: 'Virtual',   status: 'Approved',  sharedTo: ['instagram'] },
  { id: 'tour-3', name: 'Ankit Verma',   date: '2026-06-25', phone: '+91 76543 21098', tourType: 'In-Person', status: 'Pending',   sharedTo: [] },
  { id: 'tour-4', name: 'Deepika Nair',  date: '2026-06-18', phone: '+91 65432 10987', tourType: 'Virtual',   status: 'Completed', sharedTo: ['instagram', 'facebook'] },
];

function formatDate(dateStr: string) {
  try { return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return dateStr; }
}

// Shared localStorage key so SocialMediaDashboardTab can read pending tours
const TOURS_KEY = 'sxc_campus_tours';

export default function CampusTourTab() {
  const [tours, setTours] = useState<TourRecord[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const [shareOpenId, setShareOpenId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', date: '', phone: '', tourType: 'In-Person' as 'In-Person' | 'Virtual' });
  const [filter, setFilter] = useState<'All' | 'Pending' | 'Approved' | 'Completed'>('All');

  useEffect(() => {
    const saved = localStorage.getItem(TOURS_KEY);
    if (saved) { try { setTours(JSON.parse(saved)); return; } catch (_) {} }
    setTours(DEFAULT_TOURS);
    localStorage.setItem(TOURS_KEY, JSON.stringify(DEFAULT_TOURS));
  }, []);

  const save = (updated: TourRecord[]) => {
    setTours(updated);
    localStorage.setItem(TOURS_KEY, JSON.stringify(updated));
  };

  const updateStatus = (id: string, newStatus: TourRecord['status']) =>
    save(tours.map(t => t.id === id ? { ...t, status: newStatus } : t));

  const deleteTour = (id: string) => save(tours.filter(t => t.id !== id));

  const toggleShare = (tourId: string, platform: string) => {
    save(tours.map(t => {
      if (t.id !== tourId) return t;
      const already = (t.sharedTo || []).includes(platform);
      return { ...t, sharedTo: already ? (t.sharedTo || []).filter(p => p !== platform) : [...(t.sharedTo || []), platform] };
    }));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.date || !form.phone.trim()) return;
    save([...tours, { id: `tour-${Date.now()}`, name: form.name.trim(), date: form.date, phone: form.phone.trim(), tourType: form.tourType, status: 'Pending', sharedTo: [] }]);
    setForm({ name: '', date: '', phone: '', tourType: 'In-Person' });
    setAddOpen(false);
  };

  const visible = filter === 'All' ? tours : tours.filter(t => t.status === filter);
  const counts = { Pending: tours.filter(t => t.status === 'Pending').length, Approved: tours.filter(t => t.status === 'Approved').length, Completed: tours.filter(t => t.status === 'Completed').length };

  return (
    <div style={{ background: '#09090f', minHeight: 600, borderRadius: 20, border: '1px solid #1a1a2a', color: '#e0e0ec', padding: 24, fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, paddingBottom: 18, borderBottom: '1px solid #1a1a2a' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#e0e0ec', display: 'flex', alignItems: 'center', gap: 9, letterSpacing: '-0.3px' }}>
            <Video size={18} color="#6366f1" />
            Campus Tour Management
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#44445a' }}>Schedule tours · promote on social · Saint Xavier School</p>
        </div>
        <button onClick={() => setAddOpen(o => !o)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: addOpen ? '#6366f1' : 'transparent', border: `1px solid ${addOpen ? '#6366f1' : '#2a2a3e'}`, borderRadius: 10, color: addOpen ? '#fff' : '#a0a0be', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
          <Plus size={13} /> Schedule Tour
        </button>
      </div>

      {/* Stat filters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {(['Pending', 'Approved', 'Completed'] as const).map(s => (
          <button key={s} onClick={() => setFilter(f => f === s ? 'All' : s)} style={{ padding: '10px 14px', background: filter === s ? STATUS_META[s].bg : '#0f0f1a', border: `1px solid ${filter === s ? STATUS_META[s].border : '#1a1a2a'}`, borderRadius: 12, cursor: 'pointer', textAlign: 'left' }}>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: STATUS_META[s].text }}>{counts[s]}</p>
            <p style={{ margin: '2px 0 0', fontSize: 10, color: '#44445a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s}</p>
          </button>
        ))}
      </div>

      {/* Add form */}
      {addOpen && (
        <form onSubmit={handleAdd} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8, padding: '14px 16px', background: '#0f0f1a', borderRadius: 12, border: '1px solid #2a2a3e' }}>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Family name" required style={inp} />
          <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone number" required style={inp} />
          <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required style={inp} />
          <select value={form.tourType} onChange={e => setForm(f => ({ ...f, tourType: e.target.value as any }))} style={inp}>
            <option value="In-Person">In-Person</option>
            <option value="Virtual">Virtual</option>
          </select>
          <button type="submit" style={{ padding: '8px 14px', background: '#6366f1', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Add Request</button>
        </form>
      )}

      {filter !== 'All' && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: '#44445a', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Showing: <span style={{ color: STATUS_META[filter].text }}>{filter}</span></span>
          <button onClick={() => setFilter('All')} style={{ fontSize: 11, color: '#44445a', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Clear</button>
        </div>
      )}

      {/* Tour list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#333348', fontSize: 13, border: '1px dashed #1a1a2a', borderRadius: 14 }}>No {filter !== 'All' ? filter.toLowerCase() + ' ' : ''}tour requests found.</div>
        ) : visible.map(tour => {
          const meta = STATUS_META[tour.status];
          const isShareOpen = shareOpenId === tour.id;
          return (
            <div key={tour.id} style={{ borderRadius: 14, border: '1px solid #1a1a2a', background: '#0f0f1a', overflow: 'hidden' }}>

              {/* Main row */}
              <div style={{ padding: '14px 18px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#d8d8ee' }}>{tour.name}'s Family</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 20, background: meta.bg, border: `1px solid ${meta.border}`, fontSize: 10, fontWeight: 700, color: meta.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: meta.dot }} />{tour.status}
                    </span>
                    <span style={{ padding: '3px 9px', borderRadius: 20, background: tour.tourType === 'Virtual' ? '#1a1030' : '#101a10', border: `1px solid ${tour.tourType === 'Virtual' ? '#6366f133' : '#22c55e33'}`, fontSize: 10, fontWeight: 600, color: tour.tourType === 'Virtual' ? '#818cf8' : '#4ade80' }}>
                      {tour.tourType === 'Virtual' ? '🎥 Virtual' : '📍 In-Person'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, fontSize: 11, color: '#555570' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Calendar size={11} />{formatDate(tour.date)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><Phone size={11} />{tour.phone}</span>
                  </div>

                  {/* Shared-to platform pills */}
                  {(tour.sharedTo || []).length > 0 && (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {(tour.sharedTo || []).map(p => {
                        const pl = PLATFORMS.find(x => x.id === p);
                        return pl ? <span key={p} style={{ padding: '2px 8px', borderRadius: 20, background: pl.bg, border: `1px solid ${pl.color}33`, fontSize: 9, fontWeight: 700, color: pl.color }}>✓ {pl.label}</span> : null;
                      })}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: 7, alignItems: 'center', flexShrink: 0 }}>
                  {tour.status === 'Pending' && (
                    <button onClick={() => updateStatus(tour.id, 'Approved')} style={actBtn('#1a2a3e', '#60a5fa')}>Approve</button>
                  )}
                  {tour.status === 'Approved' && (
                    <button onClick={() => updateStatus(tour.id, 'Completed')} style={{ ...actBtn('#001a0f', '#4ade80'), display: 'flex', alignItems: 'center', gap: 5 }}>
                      <CheckCircle2 size={12} /> Complete
                    </button>
                  )}
                  {tour.status === 'Completed' && (
                    <span style={{ fontSize: 11, color: '#4ade80', display: 'flex', alignItems: 'center', gap: 5 }}><CheckCircle2 size={12} /> Done</span>
                  )}
                  {/* Share toggle */}
                  <button onClick={() => setShareOpenId(isShareOpen ? null : tour.id)} style={{ ...actBtn(isShareOpen ? '#1a1030' : '#111', '#818cf8'), display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Share2 size={12} /> Share
                  </button>
                  <button onClick={() => deleteTour(tour.id)} style={{ width: 30, height: 30, borderRadius: 8, background: '#1a0a0a', border: '1px solid #2a1a1a', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              {/* Social share panel */}
              {isShareOpen && (
                <div style={{ padding: '12px 18px 14px', borderTop: '1px solid #1a1a2a', background: '#0a0a14', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: '#44445a', textTransform: 'uppercase', letterSpacing: '0.07em', marginRight: 4 }}>Promote on:</span>
                  {PLATFORMS.map(pl => {
                    const active = (tour.sharedTo || []).includes(pl.id);
                    return (
                      <button key={pl.id} onClick={() => toggleShare(tour.id, pl.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: active ? pl.bg : 'transparent', border: `1px solid ${active ? pl.color : '#2a2a3e'}`, borderRadius: 8, color: active ? pl.color : '#555570', fontSize: 11, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s' }}>
                        {active ? '✓ ' : ''}{pl.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const inp: React.CSSProperties = { padding: '8px 11px', background: '#141420', border: '1px solid #2a2a3e', borderRadius: 8, color: '#e0e0ec', fontSize: 12, outline: 'none', width: '100%', boxSizing: 'border-box' };
const actBtn = (bg: string, color: string): React.CSSProperties => ({ padding: '6px 13px', background: bg, border: `1px solid ${color}33`, borderRadius: 8, color, fontSize: 11, fontWeight: 700, cursor: 'pointer' });
