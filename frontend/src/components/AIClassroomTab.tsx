import React, { useMemo, useState } from 'react';
import {
  Activity,
  BarChart3,
  Camera,
  CheckCircle2,
  Clock,
  Eye,
  Play,
  Radio,
  Send,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import { SCHOOL_YOUTUBE_CHANNEL_URL } from '../settings';

interface AIClassroomTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange' | 'royalBlue' | 'emerald';
  mode?: 'admin' | 'portal';
}

const cameraFeeds = [
  'Class V-A', 'Class V-B', 'Class VI-A', 'Class VI-B',
  'Class VII-A', 'Class VII-B', 'Class VIII-A', 'Class VIII-C',
  'Class IX-A', 'Class IX-B', 'Class X-A', 'Class X-B',
  'Pre-Primary', 'Main Corridor', 'Chemistry Lab', 'Computer Lab',
].map((name, index) => ({
  id: index + 1,
  name,
  room: index < 12 ? `Academic Block ${Math.floor(index / 4) + 1}` : index < 14 ? 'Ground Floor' : 'Laboratory Wing',
  status: index === 7 || index === 11 ? 'idle' : 'live',
  focus: [92, 87, 90, 88, 99, 84, 91, 78, 89, 86, 97, 83, 94, 96, 98, 93][index],
}));

const liveClasses = [
  { id: 'lc-1', className: 'Class VIII-A', subject: 'Mathematics', teacher: 'Mr. Rajesh Sharma', topic: 'Linear Equations', time: '09:00 AM', students: 42, status: 'Live' },
  { id: 'lc-2', className: 'Class VI-B', subject: 'Science', teacher: 'Mrs. Archana Dubey', topic: 'Components of Food', time: '10:30 AM', students: 36, status: 'Next' },
  { id: 'lc-3', className: 'Class X-A', subject: 'Physics', teacher: 'Mr. S. K. Nair', topic: 'Electricity Revision', time: '12:00 PM', students: 39, status: 'Ready' },
];

const insights = [
  'Class VIII-A board visibility is excellent. Keep camera angle locked.',
  'Class VI-B has 2 students below attention threshold; teacher prompt recommended.',
  'Computer Lab feed is live with screen activity detected.',
  'All classroom recordings are mapped to today\'s lesson archive.',
];

export default function AIClassroomTab({ theme = 'glassNavy', mode = 'admin' }: AIClassroomTabProps) {
  const isGlass = theme === 'glassNavy';
  const [selectedClassId, setSelectedClassId] = useState(liveClasses[0].id);
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([
    { id: 'm1', sender: 'Teacher', text: 'Today we will revise the main concept and solve two practice questions.', time: '09:01' },
    { id: 'm2', sender: 'AI Assistant', text: 'Attendance synced. 42 students connected, 39 active notebooks detected.', time: '09:03' },
  ]);

  const selectedClass = liveClasses.find(item => item.id === selectedClassId) || liveClasses[0];
  const liveCount = cameraFeeds.filter(feed => feed.status === 'live').length;
  const averageFocus = useMemo(() => Math.round(cameraFeeds.reduce((sum, feed) => sum + feed.focus, 0) / cameraFeeds.length), []);

  const submitQuestion = (event: React.FormEvent) => {
    event.preventDefault();
    if (!question.trim()) return;
    setMessages(prev => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender: mode === 'admin' ? 'Admin Desk' : 'Student Desk',
        text: question.trim(),
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setQuestion('');
  };

  return (
    <div className={`p-5 sm:p-6 rounded-3xl min-h-[680px] border ${isGlass ? 'bg-white/90 border-white/40 text-slate-900' : 'bg-[#0a0a0f] border-[#1e1e2e] text-white'}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 text-[10px] font-black uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" /> AI Classroom Complete
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">AI Classroom Command Center</h2>
          <p className="text-sm opacity-65 mt-1">Live classes, 16 camera monitoring, attendance, focus analytics, and lesson archive in one dashboard.</p>
        </div>
        <a href={SCHOOL_YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-red-500 text-white text-xs font-black shadow-lg">
          <Video className="w-4 h-4" /> Open Lesson Archive
        </a>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { icon: Camera, label: 'Cameras', value: '16/16', color: 'text-purple-500', bg: 'bg-purple-500/10' },
          { icon: Radio, label: 'Live Feeds', value: liveCount, color: 'text-green-500', bg: 'bg-green-500/10' },
          { icon: Users, label: 'Students Online', value: '117', color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { icon: BarChart3, label: 'Avg Focus', value: `${averageFocus}%`, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        ].map(item => (
          <div key={item.label} className={`p-4 rounded-2xl border ${isGlass ? 'bg-white border-slate-100' : 'bg-[#0f0f1a] border-[#1e1e2e]'}`}>
            <div className={`w-10 h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-3`}>
              <item.icon className="w-5 h-5" />
            </div>
            <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
            <p className="text-[10px] uppercase tracking-widest font-black opacity-55">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8 space-y-5">
          <div className={`rounded-3xl overflow-hidden border ${isGlass ? 'bg-slate-950 border-slate-200' : 'bg-black border-[#1e1e2e]'}`}>
            <div className="relative aspect-video">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-black" />
              <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
              <div className="relative z-10 h-full text-white p-4 flex flex-col justify-between">
                <div className="flex items-start justify-between text-[10px] font-mono">
                  <span className="px-2 py-1 rounded bg-red-500 font-black animate-pulse">LIVE AI CLASS</span>
                  <span className="px-2 py-1 rounded bg-black/60">1080P HD - Smart Board Synced</span>
                </div>
                <div className="text-center mx-auto max-w-lg">
                  <button className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500 flex items-center justify-center shadow-2xl hover:scale-105 transition">
                    <Play className="w-7 h-7 fill-white" />
                  </button>
                  <p className="text-xs font-black tracking-widest text-red-200 uppercase">{selectedClass.className} - {selectedClass.subject}</p>
                  <h3 className="text-2xl sm:text-3xl font-black mt-1">{selectedClass.topic}</h3>
                  <p className="text-xs opacity-75 mt-2">{selectedClass.teacher} - {selectedClass.students} students connected</p>
                </div>
                <div className="bg-black/80 rounded-2xl p-3 flex items-center gap-3">
                  <Activity className="w-4 h-4 text-red-400" />
                  <div className="flex-1 h-1.5 rounded-full bg-white/15 overflow-hidden">
                    <div className="h-full rounded-full bg-red-500" style={{ width: '68%' }} />
                  </div>
                  <span className="text-[10px] font-mono opacity-75">42 min remaining</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {liveClasses.map(item => (
              <button key={item.id} onClick={() => setSelectedClassId(item.id)} className={`text-left p-4 rounded-2xl border transition ${selectedClassId === item.id ? 'border-red-500 bg-red-500/10' : isGlass ? 'bg-white border-slate-100 hover:border-red-200' : 'bg-[#0f0f1a] border-[#1e1e2e] hover:border-red-500/30'}`}>
                <div className="flex justify-between gap-2 mb-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${item.status === 'Live' ? 'bg-red-500 text-white' : 'bg-blue-500/10 text-blue-500'}`}>{item.status}</span>
                  <span className="text-[10px] font-mono opacity-55">{item.time}</span>
                </div>
                <h4 className="font-black text-sm">{item.className} - {item.subject}</h4>
                <p className="text-xs opacity-65 mt-1">{item.topic}</p>
              </button>
            ))}
          </div>

          <div className={`p-4 rounded-3xl border ${isGlass ? 'bg-white border-slate-100' : 'bg-[#0f0f1a] border-[#1e1e2e]'}`}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-black flex items-center gap-2"><Camera className="w-5 h-5 text-purple-500" /> 16 Classroom Camera Grid</h3>
              <span className="text-[10px] font-black uppercase text-green-500">Encrypted Local Monitoring</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {cameraFeeds.map(feed => (
                <div key={feed.id} className={`relative rounded-2xl overflow-hidden aspect-video border ${isGlass ? 'bg-slate-950 border-slate-200' : 'bg-black border-[#25253a]'}`}>
                  <div className="absolute inset-0 bg-radial from-purple-500/25 via-slate-900 to-black" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <Camera className="w-5 h-5 opacity-70 mb-1" />
                    <span className="text-[10px] font-black text-center px-2">{feed.name}</span>
                    <span className="text-[8px] opacity-55">{feed.focus}% focus</span>
                  </div>
                  <div className="absolute top-2 left-2 flex items-center gap-1 text-[8px] font-mono text-white bg-black/55 px-1.5 py-0.5 rounded">
                    <span className={`w-1.5 h-1.5 rounded-full ${feed.status === 'live' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                    CAM-{String(feed.id).padStart(2, '0')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4 space-y-5">
          <div className={`rounded-3xl border overflow-hidden ${isGlass ? 'bg-white border-slate-100' : 'bg-[#0f0f1a] border-[#1e1e2e]'}`}>
            <div className="p-4 border-b border-gray-500/10">
              <h3 className="font-black flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500" /> AI Insights</h3>
              <p className="text-xs opacity-55">Auto-generated classroom guidance</p>
            </div>
            <div className="p-4 space-y-3">
              {insights.map((item, index) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold opacity-80 leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-3xl border overflow-hidden flex flex-col h-[360px] ${isGlass ? 'bg-white border-slate-100' : 'bg-[#0f0f1a] border-[#1e1e2e]'}`}>
            <div className="p-4 border-b border-gray-500/10">
              <h3 className="font-black flex items-center gap-2"><Send className="w-4 h-4 text-red-500" /> Live Class Desk</h3>
              <p className="text-xs opacity-55">Teacher, admin, and student Q/A stream</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(message => (
                <div key={message.id} className="p-3 rounded-2xl bg-gray-500/10">
                  <div className="flex justify-between text-[10px] font-black mb-1">
                    <span className="text-indigo-500">{message.sender}</span>
                    <span className="font-mono opacity-45">{message.time}</span>
                  </div>
                  <p className="text-xs opacity-85 font-medium">{message.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={submitQuestion} className="p-3 border-t border-gray-500/10 flex gap-2">
              <input value={question} onChange={event => setQuestion(event.target.value)} placeholder="Type classroom note..." className={`min-w-0 flex-1 p-2 rounded-xl border text-xs outline-none ${isGlass ? 'bg-slate-50 border-slate-200 focus:border-red-400' : 'bg-[#171724] border-[#2a2a3e] focus:border-red-500'}`} />
              <button type="submit" className="p-2 rounded-xl bg-red-500 text-white">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className={`p-4 rounded-3xl border ${isGlass ? 'bg-emerald-50 border-emerald-100' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
            <h3 className="font-black flex items-center gap-2 text-emerald-600"><ShieldCheck className="w-5 h-5" /> Safety & Privacy</h3>
            <p className="text-xs opacity-75 mt-2 leading-relaxed">
              AI classroom access stays inside the school portal. Camera feeds are for learning safety, attendance support, and classroom quality monitoring.
            </p>
            <div className="grid grid-cols-3 gap-2 mt-4 text-center text-[10px] font-black">
              <span className="p-2 rounded-xl bg-white/60 text-emerald-700"><Eye className="w-3.5 h-3.5 mx-auto mb-1" /> Admin</span>
              <span className="p-2 rounded-xl bg-white/60 text-emerald-700"><Clock className="w-3.5 h-3.5 mx-auto mb-1" /> Logs</span>
              <span className="p-2 rounded-xl bg-white/60 text-emerald-700"><ShieldCheck className="w-3.5 h-3.5 mx-auto mb-1" /> Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
