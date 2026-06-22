import React, { useState, useEffect } from 'react';
import { Camera, RefreshCw, Layers, ShieldCheck, Plus, Trash2, Activity } from 'lucide-react';

interface CameraFeed {
  id: number;
  name: string;
  floor: string;
  details: string;
  status: 'active' | 'idle' | 'offline';
}

const STATUS_COLORS: Record<string, string> = {
  active: '#22c55e',
  idle: '#f59e0b',
  offline: '#ef4444',
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Live',
  idle: 'Idle',
  offline: 'Offline',
};

const DEFAULT_FEEDS: CameraFeed[] = [
  { id:  1, name: 'Class V-A Front',        floor: '1st Floor · Wing A',  details: 'Engagement: 92%',  status: 'active'  },
  { id:  2, name: 'Class V-B Rear',         floor: '1st Floor · Wing A',  details: 'Engagement: 87%',  status: 'active'  },
  { id:  3, name: 'Class VI-A Front',       floor: '1st Floor · Wing B',  details: 'Engagement: 90%',  status: 'active'  },
  { id:  4, name: 'Class VI-B Right',       floor: '1st Floor · Wing B',  details: 'Engagement: 88%',  status: 'active'  },
  { id:  5, name: 'Class VII-A Main',       floor: '2nd Floor · Wing A',  details: 'Board Vis: 99%',   status: 'active'  },
  { id:  6, name: 'Class VII-B Front',      floor: '2nd Floor · Wing A',  details: 'Engagement: 84%',  status: 'active'  },
  { id:  7, name: 'Class VIII-A Main',      floor: '2nd Floor · Wing B',  details: 'Engagement: 91%',  status: 'active'  },
  { id:  8, name: 'Class VIII-C Rear',      floor: '2nd Floor · Wing C',  details: 'Pupil Scan OK',    status: 'idle'    },
  { id:  9, name: 'Class IX-A Front',       floor: '3rd Floor · Wing A',  details: 'Engagement: 89%',  status: 'active'  },
  { id: 10, name: 'Class IX-B Main',        floor: '3rd Floor · Wing B',  details: 'Engagement: 86%',  status: 'active'  },
  { id: 11, name: 'Class X-A Front',        floor: '3rd Floor · Wing C',  details: 'Board Vis: 97%',   status: 'active'  },
  { id: 12, name: 'Class X-B Rear',         floor: '3rd Floor · Wing C',  details: 'Engagement: 83%',  status: 'idle'    },
  { id: 13, name: 'Pre-Primary Play Area',  floor: 'Ground Floor',        details: 'Outdoor Focus',    status: 'active'  },
  { id: 14, name: 'Main Corridor East',     floor: 'Ground Floor',        details: 'Motion: Clear',    status: 'active'  },
  { id: 15, name: 'Chemistry Laboratory',   floor: 'Basement Labs',       details: 'Safety Clear',     status: 'active'  },
  { id: 16, name: 'Computer Lab',           floor: 'Basement Labs',       details: 'Screen Active',    status: 'offline' },
];

const INITIAL_LOGS = [
  { time: '08:15:00', cam: 'SYS',    msg: 'All 16 cameras initialised successfully' },
  { time: '08:31:02', cam: 'CAM-01', msg: 'Class V-A: Lesson feed started' },
  { time: '09:04:18', cam: 'CAM-05', msg: 'Class VII-A: Board visibility 99%' },
  { time: '09:12:15', cam: 'CAM-09', msg: 'Class IX-A: Focus on tutor board' },
  { time: '10:04:42', cam: 'CAM-03', msg: 'Class VI-A: Attendance 28/28 present' },
  { time: '10:45:33', cam: 'CAM-16', msg: 'Computer Lab: Feed offline — check connection' },
  { time: '11:15:20', cam: 'CAM-08', msg: 'Class VIII-C: Pupil scan completed' },
  { time: '12:02:11', cam: 'SYS',    msg: 'AI engagement optimizer synced' },
];

function getStoredFeeds(): CameraFeed[] {
  try {
    const saved = localStorage.getItem('sxc_cameras');
    if (saved) return JSON.parse(saved);
  } catch (_) {}
  return DEFAULT_FEEDS;
}

export default function CameraSystemTab() {
  const [selectedCam, setSelectedCam] = useState<number | null>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feeds, setFeeds] = useState<CameraFeed[]>(getStoredFeeds);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [newName, setNewName] = useState('');
  const [newFloor, setNewFloor] = useState('');
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('sxc_cameras', JSON.stringify(feeds)); } catch (_) {}
  }, [feeds]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date().toLocaleTimeString('en-GB', { hour12: false });
      setLogs(prev => [{ time: now, cam: 'SYS', msg: 'Surveillance matrices refreshed' }, ...prev.slice(0, 6)]);
    }, 900);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newFloor.trim()) return;
    const newId = feeds.length > 0 ? Math.max(...feeds.map(f => f.id)) + 1 : 1;
    setFeeds(prev => [...prev, { id: newId, name: newName.trim(), floor: newFloor.trim(), details: 'Just added', status: 'active' }]);
    setNewName('');
    setNewFloor('');
    setAddOpen(false);
    const now = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setLogs(prev => [{ time: now, cam: `CAM-${String(newId).padStart(2,'0')}`, msg: `${newName.trim()}: Camera registered` }, ...prev.slice(0, 6)]);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFeeds(prev => prev.filter(f => f.id !== id));
    if (selectedCam === id) setSelectedCam(null);
  };

  const selectedFeed = feeds.find(f => f.id === selectedCam);

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#0a0a0f', minHeight: 600, borderRadius: 20, border: '1px solid #1e1e2e', color: '#e2e2e8', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, paddingBottom: 18, borderBottom: '1px solid #1e1e2e' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1.5s infinite', flexShrink: 0 }} />
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#e2e2e8', letterSpacing: '-0.3px' }}>
              Surveillance & AI Analytics
            </h2>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: '#555570' }}>Saint Xavier campus · {feeds.length} cameras registered</p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => setAddOpen(o => !o)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', background: addOpen ? '#6366f1' : 'transparent', border: `1px solid ${addOpen ? '#6366f1' : '#2a2a3e'}`, borderRadius: 10, color: addOpen ? '#fff' : '#a8a8be', fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
          >
            <Plus size={13} />
            Add Camera
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', background: 'transparent', border: '1px solid #2a2a3e', borderRadius: 10, color: '#a8a8be', fontSize: 12, fontWeight: 600, cursor: 'pointer', opacity: isRefreshing ? 0.5 : 1, transition: 'all 0.15s' }}
          >
            <RefreshCw size={13} style={{ animation: isRefreshing ? 'spin 0.7s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>
      </div>

      {/* Add Camera Form */}
      {addOpen && (
        <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: '14px 16px', background: '#0f0f1a', borderRadius: 12, border: '1px solid #2a2a3e' }}>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Camera name (e.g. Class IX-A Front)"
            required
            style={{ flex: '2 1 180px', padding: '7px 11px', background: '#141420', border: '1px solid #2a2a3e', borderRadius: 8, color: '#e2e2e8', fontSize: 12, outline: 'none' }}
          />
          <input
            value={newFloor}
            onChange={e => setNewFloor(e.target.value)}
            placeholder="Location (e.g. 3rd Floor · Wing D)"
            required
            style={{ flex: '2 1 180px', padding: '7px 11px', background: '#141420', border: '1px solid #2a2a3e', borderRadius: 8, color: '#e2e2e8', fontSize: 12, outline: 'none' }}
          />
          <button type="submit" style={{ flex: '0 0 auto', padding: '7px 16px', background: '#6366f1', border: 'none', borderRadius: 8, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            Register
          </button>
        </form>
      )}

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 280px', gap: 18, flex: 1 }}>

        {/* Camera grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {feeds.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 300, color: '#444460', gap: 12 }}>
              <Camera size={36} strokeWidth={1} />
              <p style={{ margin: 0, fontSize: 13 }}>No cameras registered yet</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {feeds.map(feed => {
                const isSelected = selectedCam === feed.id;
                return (
                  <div
                    key={feed.id}
                    onClick={() => setSelectedCam(feed.id)}
                    style={{
                      position: 'relative',
                      borderRadius: 14,
                      border: isSelected ? '1.5px solid #6366f1' : '1px solid #1e1e2e',
                      background: isSelected ? '#0f0f1e' : '#0d0d18',
                      cursor: 'pointer',
                      overflow: 'hidden',
                      aspectRatio: '16/9',
                      transition: 'border-color 0.15s, background 0.15s',
                      boxShadow: isSelected ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none',
                    }}
                    className="cam-card"
                  >
                    {/* Scanline overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)', pointerEvents: 'none', zIndex: 1 }} />

                    {/* Camera icon center */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, zIndex: 2 }}>
                      <Camera size={22} color={isSelected ? '#6366f1' : '#2a2a45'} strokeWidth={1.5} style={{ transition: 'color 0.15s' }} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#c0c0d8', letterSpacing: '0.02em', textAlign: 'center', padding: '0 12px' }}>{feed.name}</span>
                      <span style={{ fontSize: 9, color: '#44445a', letterSpacing: '0.03em' }}>{feed.floor}</span>
                    </div>

                    {/* Bottom bar */}
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 10px', background: 'linear-gradient(transparent, rgba(0,0,0,0.85))', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 3 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, fontFamily: 'monospace', color: '#555570' }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLORS[feed.status], display: 'inline-block', animation: feed.status === 'active' ? 'pulse 1.5s infinite' : 'none' }} />
                        {STATUS_LABELS[feed.status]} · CAM-{String(feed.id).padStart(2, '0')}
                      </span>
                      <span style={{ fontSize: 9, color: '#44445a', fontFamily: 'monospace' }}>{feed.details}</span>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={e => handleDelete(feed.id, e)}
                      style={{ position: 'absolute', top: 8, right: 8, width: 24, height: 24, borderRadius: 6, background: 'rgba(0,0,0,0.7)', border: '1px solid #2a2a3e', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0, transition: 'opacity 0.15s', zIndex: 4 }}
                      className="del-btn"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Selected camera detail strip */}
          {selectedFeed && (
            <div style={{ padding: '12px 16px', background: '#0f0f1a', borderRadius: 12, border: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1a1a2e', border: '1px solid #2a2a3e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={14} color="#6366f1" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#e2e2e8' }}>{selectedFeed.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#555570' }}>{selectedFeed.floor}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                {[
                  { label: 'Feed ID', val: `CAM-${String(selectedFeed.id).padStart(2, '0')}` },
                  { label: 'Status', val: STATUS_LABELS[selectedFeed.status] },
                  { label: 'Analytics', val: selectedFeed.details },
                ].map(({ label, val }) => (
                  <div key={label} style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: 9, color: '#444460', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#a0a0c0', fontFamily: 'monospace' }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar: logs + compliance */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

          {/* Live stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Online', val: feeds.filter(f => f.status === 'active').length, color: '#22c55e' },
              { label: 'Total', val: feeds.length, color: '#6366f1' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ padding: '10px 14px', background: '#0f0f1a', borderRadius: 10, border: '1px solid #1e1e2e', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color }}>{val}</p>
                <p style={{ margin: '2px 0 0', fontSize: 10, color: '#444460', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</p>
              </div>
            ))}
          </div>

          {/* Logs */}
          <div style={{ flex: 1, background: '#0f0f1a', borderRadius: 14, border: '1px solid #1e1e2e', padding: 16, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #1a1a28' }}>
              <Activity size={13} color="#6366f1" />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Telemetry Logs</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', maxHeight: 260 }}>
              {logs.map((log, i) => (
                <div key={i} style={{ padding: '6px 8px', borderLeft: '2px solid #2a2a3e', background: '#0a0a14', borderRadius: '0 6px 6px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#6366f1', fontWeight: 700 }}>{log.cam}</span>
                    <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#333348' }}>{log.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 10, color: '#787898', lineHeight: 1.4 }}>{log.msg}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Compliance badge */}
          <div style={{ padding: '12px 14px', background: '#0f0f1a', borderRadius: 12, border: '1px solid #1a2a1a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <ShieldCheck size={13} color="#22c55e" />
              <span style={{ fontSize: 10, fontWeight: 700, color: '#22c55e', letterSpacing: '0.06em', textTransform: 'uppercase' }}>On-premise · Compliant</span>
            </div>
            <p style={{ margin: 0, fontSize: 10, color: '#444460', lineHeight: 1.6 }}>
              Footage processed on-site. AI face mappings encrypted with AES-256 and stored on local servers only.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .cam-card:hover .del-btn {
          opacity: 1 !important;
        }
        .cam-card:hover {
          border-color: #2a2a45 !important;
        }
      `}</style>
    </div>
  );
}
