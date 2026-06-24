import React, { useEffect, useState } from 'react';
import { Activity, Camera, Eye, HardDrive, Radio, RefreshCw, RotateCcw, ShieldCheck, Wifi } from 'lucide-react';

interface CameraFeed {
  id: number;
  name: string;
  floor: string;
  details: string;
  status: 'active' | 'idle' | 'offline';
  ip: string;
  zone: string;
  retention: string;
}

const STATUS_COLORS: Record<CameraFeed['status'], string> = {
  active: '#22c55e',
  idle: '#f59e0b',
  offline: '#ef4444',
};

const STATUS_LABELS: Record<CameraFeed['status'], string> = {
  active: 'Live',
  idle: 'Idle',
  offline: 'Offline',
};

const DEFAULT_FEEDS: CameraFeed[] = [
  { id: 1, name: 'Class V-A Front', floor: '1st Floor - Wing A', details: 'Engagement: 92%', status: 'active', ip: '10.10.16.101', zone: 'Primary Block', retention: '30 days' },
  { id: 2, name: 'Class V-B Rear', floor: '1st Floor - Wing A', details: 'Engagement: 87%', status: 'active', ip: '10.10.16.102', zone: 'Primary Block', retention: '30 days' },
  { id: 3, name: 'Class VI-A Front', floor: '1st Floor - Wing B', details: 'Engagement: 90%', status: 'active', ip: '10.10.16.103', zone: 'Middle Block', retention: '30 days' },
  { id: 4, name: 'Class VI-B Right', floor: '1st Floor - Wing B', details: 'Engagement: 88%', status: 'active', ip: '10.10.16.104', zone: 'Middle Block', retention: '30 days' },
  { id: 5, name: 'Class VII-A Main', floor: '2nd Floor - Wing A', details: 'Board Vis: 99%', status: 'active', ip: '10.10.16.105', zone: 'Middle Block', retention: '30 days' },
  { id: 6, name: 'Class VII-B Front', floor: '2nd Floor - Wing A', details: 'Engagement: 84%', status: 'active', ip: '10.10.16.106', zone: 'Middle Block', retention: '30 days' },
  { id: 7, name: 'Class VIII-A Main', floor: '2nd Floor - Wing B', details: 'Engagement: 91%', status: 'active', ip: '10.10.16.107', zone: 'Senior Block', retention: '45 days' },
  { id: 8, name: 'Class VIII-C Rear', floor: '2nd Floor - Wing C', details: 'Pupil Scan OK', status: 'idle', ip: '10.10.16.108', zone: 'Senior Block', retention: '45 days' },
  { id: 9, name: 'Class IX-A Front', floor: '3rd Floor - Wing A', details: 'Engagement: 89%', status: 'active', ip: '10.10.16.109', zone: 'Senior Block', retention: '45 days' },
  { id: 10, name: 'Class IX-B Main', floor: '3rd Floor - Wing B', details: 'Engagement: 86%', status: 'active', ip: '10.10.16.110', zone: 'Senior Block', retention: '45 days' },
  { id: 11, name: 'Class X-A Front', floor: '3rd Floor - Wing C', details: 'Board Vis: 97%', status: 'active', ip: '10.10.16.111', zone: 'Board Classes', retention: '60 days' },
  { id: 12, name: 'Class X-B Rear', floor: '3rd Floor - Wing C', details: 'Engagement: 83%', status: 'idle', ip: '10.10.16.112', zone: 'Board Classes', retention: '60 days' },
  { id: 13, name: 'Pre-Primary Play Area', floor: 'Ground Floor', details: 'Outdoor Focus', status: 'active', ip: '10.10.16.113', zone: 'Pre-Primary', retention: '15 days' },
  { id: 14, name: 'Main Corridor East', floor: 'Ground Floor', details: 'Motion: Clear', status: 'active', ip: '10.10.16.114', zone: 'Common Area', retention: '30 days' },
  { id: 15, name: 'Chemistry Laboratory', floor: 'Basement Labs', details: 'Safety Clear', status: 'active', ip: '10.10.16.115', zone: 'Laboratories', retention: '60 days' },
  { id: 16, name: 'Computer Lab', floor: 'Basement Labs', details: 'Screen Active', status: 'active', ip: '10.10.16.116', zone: 'Laboratories', retention: '60 days' },
];

const INITIAL_LOGS = [
  { time: '08:15:00', cam: 'SYS', msg: 'All 16 cameras initialised successfully' },
  { time: '08:31:02', cam: 'CAM-01', msg: 'Class V-A: lesson feed started' },
  { time: '09:04:18', cam: 'CAM-05', msg: 'Class VII-A: board visibility 99%' },
  { time: '09:12:15', cam: 'CAM-09', msg: 'Class IX-A: focus on tutor board' },
  { time: '10:04:42', cam: 'CAM-03', msg: 'Class VI-A: attendance 28/28 present' },
  { time: '10:45:33', cam: 'CAM-16', msg: 'Computer Lab: feed online and recording' },
  { time: '11:15:20', cam: 'CAM-08', msg: 'Class VIII-C: pupil scan completed' },
  { time: '12:02:11', cam: 'SYS', msg: 'AI engagement optimizer synced' },
];

function getStoredFeeds(): CameraFeed[] {
  try {
    const saved = localStorage.getItem('sxc_cameras');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length === 16 && parsed.every(feed => feed.ip && feed.zone)) {
        return parsed;
      }
    }
  } catch (_) {}
  return DEFAULT_FEEDS;
}

export default function CameraSystemTab() {
  const [selectedCam, setSelectedCam] = useState<number | null>(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feeds, setFeeds] = useState<CameraFeed[]>(getStoredFeeds);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  useEffect(() => {
    try { localStorage.setItem('sxc_cameras', JSON.stringify(feeds)); } catch (_) {}
  }, [feeds]);

  const selectedFeed = feeds.find(f => f.id === selectedCam);
  const onlineCount = feeds.filter(f => f.status === 'active').length;
  const idleCount = feeds.filter(f => f.status === 'idle').length;
  const offlineCount = feeds.filter(f => f.status === 'offline').length;
  const uptime = Math.round((onlineCount / Math.max(feeds.length, 1)) * 100);

  const pushLog = (cam: string, msg: string) => {
    const now = new Date().toLocaleTimeString('en-GB', { hour12: false });
    setLogs(prev => [{ time: now, cam, msg }, ...prev.slice(0, 6)]);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      pushLog('SYS', 'Surveillance health, storage, and classroom feeds refreshed');
    }, 700);
  };

  const handleReset = () => {
    setFeeds(DEFAULT_FEEDS);
    setSelectedCam(1);
    pushLog('SYS', '16 camera campus layout restored');
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', background: '#0a0a0f', minHeight: 600, borderRadius: 20, border: '1px solid #1e1e2e', color: '#e2e2e8', padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, paddingBottom: 18, borderBottom: '1px solid #1e1e2e' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1.5s infinite', flexShrink: 0 }} />
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#e2e2e8' }}>16 Camera Classroom Command Center</h2>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: '#555570' }}>Saint Xavier campus - fixed 16 camera grid - {uptime}% online health</p>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleReset} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', background: 'transparent', border: '1px solid #2a2a3e', borderRadius: 10, color: '#a8a8be', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
            <RotateCcw size={13} /> Restore 16 Setup
          </button>
          <button onClick={handleRefresh} disabled={isRefreshing} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 13px', background: 'transparent', border: '1px solid #2a2a3e', borderRadius: 10, color: '#a8a8be', fontSize: 12, fontWeight: 700, cursor: 'pointer', opacity: isRefreshing ? 0.5 : 1 }}>
            <RefreshCw size={13} style={{ animation: isRefreshing ? 'spin 0.7s linear infinite' : 'none' }} /> Refresh
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10 }}>
        {[
          { icon: Camera, label: 'Configured', value: `${feeds.length}/16`, color: '#6366f1' },
          { icon: Radio, label: 'Live Feeds', value: onlineCount, color: '#22c55e' },
          { icon: Wifi, label: 'Idle', value: idleCount, color: '#f59e0b' },
          { icon: HardDrive, label: 'Offline', value: offlineCount, color: '#ef4444' },
        ].map(item => (
          <div key={item.label} style={{ padding: '12px 14px', background: '#0f0f1a', borderRadius: 12, border: '1px solid #1e1e2e', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <item.icon size={16} color={item.color} />
            </div>
            <div>
              <p style={{ margin: 0, color: item.color, fontSize: 18, fontWeight: 800 }}>{item.value}</p>
              <p style={{ margin: 0, color: '#555570', fontSize: 10, fontWeight: 700, textTransform: 'uppercase' }}>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 290px', gap: 18, flex: 1 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 12 }}>
            {feeds.map(feed => {
              const isSelected = selectedCam === feed.id;
              return (
                <div key={feed.id} onClick={() => setSelectedCam(feed.id)} className="cam-card" style={{ position: 'relative', borderRadius: 14, border: isSelected ? '1.5px solid #6366f1' : '1px solid #1e1e2e', background: isSelected ? '#0f0f1e' : '#0d0d18', cursor: 'pointer', overflow: 'hidden', aspectRatio: '16/9', transition: 'border-color 0.15s, background 0.15s', boxShadow: isSelected ? '0 0 0 3px rgba(99,102,241,0.12)' : 'none' }}>
                  <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 20%, rgba(99,102,241,0.22), transparent 34%), repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)', pointerEvents: 'none', zIndex: 1 }} />
                  <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 3, display: 'flex', alignItems: 'center', gap: 5, fontSize: 9, fontFamily: 'monospace', color: '#d8d8f0', background: 'rgba(0,0,0,0.62)', padding: '4px 7px', borderRadius: 7 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLORS[feed.status], display: 'inline-block', animation: feed.status === 'active' ? 'pulse 1.5s infinite' : 'none' }} />
                    CAM-{String(feed.id).padStart(2, '0')}
                  </div>
                  <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 4, padding: '4px 7px', borderRadius: 7, background: 'rgba(0,0,0,0.7)', border: '1px solid #2a2a3e', color: '#a8a8be', fontSize: 9, fontFamily: 'monospace', zIndex: 4 }}>
                    <Eye size={10} /> AI
                  </div>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, zIndex: 2 }}>
                    <Camera size={24} color={isSelected ? '#6366f1' : '#444466'} strokeWidth={1.5} />
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#d4d4ef', textAlign: 'center', padding: '0 12px' }}>{feed.name}</span>
                    <span style={{ fontSize: 9, color: '#666680', textAlign: 'center' }}>{feed.floor}</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px 10px', background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 3 }}>
                    <span style={{ fontSize: 9, fontFamily: 'monospace', color: STATUS_COLORS[feed.status], fontWeight: 800 }}>{STATUS_LABELS[feed.status]}</span>
                    <span style={{ fontSize: 9, color: '#787898', fontFamily: 'monospace' }}>{feed.details}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedFeed && (
            <div style={{ padding: '14px 16px', background: '#0f0f1a', borderRadius: 12, border: '1px solid #1e1e2e', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, background: '#1a1a2e', border: '1px solid #2a2a3e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={15} color="#6366f1" />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 800, color: '#e2e2e8' }}>{selectedFeed.name}</p>
                  <p style={{ margin: 0, fontSize: 11, color: '#555570' }}>{selectedFeed.zone} - {selectedFeed.floor}</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {[
                  { label: 'Status', val: STATUS_LABELS[selectedFeed.status] },
                  { label: 'Analytics', val: selectedFeed.details },
                  { label: 'IP', val: selectedFeed.ip },
                  { label: 'Storage', val: selectedFeed.retention },
                ].map(({ label, val }) => (
                  <div key={label} style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: 9, color: '#444460', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{label}</p>
                    <p style={{ margin: 0, fontSize: 12, fontWeight: 800, color: '#a0a0c0', fontFamily: 'monospace' }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: '#0f0f1a', borderRadius: 14, border: '1px solid #1e1e2e', padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12, paddingBottom: 10, borderBottom: '1px solid #1a1a28' }}>
              <Activity size={13} color="#6366f1" />
              <span style={{ fontSize: 10, fontWeight: 800, color: '#6366f1', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Telemetry Logs</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'auto', maxHeight: 300 }}>
              {logs.map((log, i) => (
                <div key={i} style={{ padding: '7px 8px', borderLeft: '2px solid #2a2a3e', background: '#0a0a14', borderRadius: '0 6px 6px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#6366f1', fontWeight: 800 }}>{log.cam}</span>
                    <span style={{ fontSize: 9, fontFamily: 'monospace', color: '#333348' }}>{log.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 10, color: '#787898', lineHeight: 1.4 }}>{log.msg}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ padding: '12px 14px', background: '#0f0f1a', borderRadius: 12, border: '1px solid #1a2a1a' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
              <ShieldCheck size={13} color="#22c55e" />
              <span style={{ fontSize: 10, fontWeight: 800, color: '#22c55e', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Admin Only - Compliant</span>
            </div>
            <p style={{ margin: 0, fontSize: 10, color: '#555570', lineHeight: 1.6 }}>
              Footage is processed on-site. Access is limited to admin desktop with audit logs and encrypted local retention.
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
        .cam-card:hover {
          border-color: #2a2a45 !important;
        }
      `}</style>
    </div>
  );
}
