import React, { useState, useEffect } from 'react';
import {
  Megaphone, Trash2, PlusCircle, AlertTriangle, Bell,
  Clock, Pin, Filter, CheckCircle2, X, Send, Layers
} from 'lucide-react';

interface AnnouncementsTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
}

export interface AnnouncementType {
  id: string;
  title: string;
  message: string;
  date: string;
  isUrgent: boolean;
  category: 'general' | 'holiday' | 'exam' | 'event' | 'alert';
  isPinned: boolean;
}

const CATEGORY_META = {
  general:  { label: 'General',  color: 'text-blue-500',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20'   },
  holiday:  { label: 'Holiday',  color: 'text-emerald-500',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20'},
  exam:     { label: 'Exam',     color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
  event:    { label: 'Event',    color: 'text-cyan-500',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20'   },
  alert:    { label: 'Alert',    color: 'text-red-500',    bg: 'bg-red-500/10',    border: 'border-red-500/20'    },
} as const;

const DEFAULT_ANNOUNCEMENTS: AnnouncementType[] = [
  {
    id: 'ann-1',
    title: 'School Closed Tomorrow — Weather Alert',
    message: 'Due to severe weather conditions forecast by IMD, the school will remain closed tomorrow. All classes and activities are suspended. Stay safe.',
    date: new Date().toISOString(),
    isUrgent: true,
    category: 'alert',
    isPinned: true,
  },
  {
    id: 'ann-2',
    title: 'Annual Sports Day — 28th June 2026',
    message: 'All students are requested to report in sports uniform by 7:30 AM for the Annual Sports Day ceremony. Parents are cordially invited.',
    date: new Date(Date.now() - 86400000).toISOString(),
    isUrgent: false,
    category: 'event',
    isPinned: false,
  },
  {
    id: 'ann-3',
    title: 'Half-Yearly Examination Schedule Released',
    message: 'The half-yearly exam timetable for Classes I–XII has been uploaded to the parent portal. Exams begin 15th July 2026. Revision classes start Monday.',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    isUrgent: false,
    category: 'exam',
    isPinned: false,
  },
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function AnnouncementsTab({ theme = 'glassNavy' }: AnnouncementsTabProps) {
  const isGlass = theme === 'glassNavy';

  const [announcements, setAnnouncements] = useState<AnnouncementType[]>(() => {
    const saved = localStorage.getItem('sxc_announcements');
    if (saved) { try { return JSON.parse(saved); } catch (_) {} }
    localStorage.setItem('sxc_announcements', JSON.stringify(DEFAULT_ANNOUNCEMENTS));
    return DEFAULT_ANNOUNCEMENTS;
  });

  const [title, setTitle]       = useState('');
  const [message, setMessage]   = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [category, setCategory] = useState<AnnouncementType['category']>('general');
  const [filterCat, setFilterCat] = useState<AnnouncementType['category'] | 'all'>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const save = (list: AnnouncementType[]) => {
    setAnnouncements(list);
    localStorage.setItem('sxc_announcements', JSON.stringify(list));
  };

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;
    const newAnn: AnnouncementType = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      message: message.trim(),
      date: new Date().toISOString(),
      isUrgent,
      category,
      isPinned,
    };
    save([newAnn, ...announcements]);
    setTitle(''); setMessage(''); setIsUrgent(false); setIsPinned(false); setCategory('general');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleDelete = (id: string) => {
    save(announcements.filter(a => a.id !== id));
    setDeleteConfirm(null);
  };

  const togglePin = (id: string) => {
    save(announcements.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a));
  };

  const filtered = announcements
    .filter(a => filterCat === 'all' || a.category === filterCat)
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const urgentCount = announcements.filter(a => a.isUrgent).length;

  // ── Style tokens ───────────────────────────────────────────────────────────
  const surface  = isGlass ? 'bg-white border-slate-200' : 'bg-[#111113] border-[#1f1f22]';
  const surfaceInner = isGlass ? 'bg-slate-50 border-slate-100' : 'bg-[#0f0f12] border-[#1f1f22]';
  const txt      = isGlass ? 'text-slate-800' : 'text-white';
  const sub      = isGlass ? 'text-slate-500' : 'text-slate-400';
  const inputCls = isGlass
    ? 'w-full p-3 text-sm rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-300/30 outline-none transition'
    : 'w-full p-3 text-sm rounded-xl border border-[#2c2c2e] bg-[#0f0f12] text-white placeholder:text-slate-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition';

  return (
    <div className={`flex h-full min-h-[600px] overflow-hidden rounded-2xl border ${isGlass ? 'bg-slate-50 border-slate-200' : 'bg-[#09090b] border-[#1f1f22]'}`}>

      {/* ── LEFT: Compose Panel ──────────────────────────────────────────── */}
      <div className={`no-print w-96 flex-shrink-0 flex flex-col border-r ${surface}`}>

        {/* Header */}
        <div className={`px-5 py-4 border-b flex-shrink-0 ${isGlass ? 'border-slate-100' : 'border-[#1f1f22]'}`}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 bg-orange-500/15 rounded-xl flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-orange-500" />
            </div>
            <h2 className={`text-base font-black ${txt}`}>Announcements</h2>
          </div>
          <p className={`text-xs ${sub}`}>Broadcast school-wide notices instantly</p>

          {/* Stats row */}
          <div className="flex gap-2 mt-4">
            {[
              { label: 'Total',  val: announcements.length, color: 'text-slate-500', bg: isGlass ? 'bg-slate-100' : 'bg-[#1c1c1f]' },
              { label: 'Urgent', val: urgentCount, color: 'text-red-500', bg: 'bg-red-500/10' },
              { label: 'Pinned', val: announcements.filter(a => a.isPinned).length, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            ].map(s => (
              <div key={s.label} className={`flex-1 rounded-xl px-3 py-2 text-center ${s.bg}`}>
                <p className={`text-lg font-black leading-tight ${s.color}`}>{s.val}</p>
                <p className={`text-[10px] font-bold ${sub}`}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Compose Form */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${sub}`}>Compose New Notice</p>

          <form onSubmit={handlePost} className="space-y-4">
            {/* Title */}
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${sub}`}>Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. School Closed Tomorrow"
                className={inputCls}
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${sub}`}>Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Provide full details here..."
                rows={4}
                className={`${inputCls} resize-none`}
                required
              />
              <p className={`text-[10px] mt-1 text-right ${sub}`}>{message.length} chars</p>
            </div>

            {/* Category */}
            <div>
              <label className={`block text-xs font-bold mb-1.5 ${sub}`}>Category</label>
              <div className="grid grid-cols-5 gap-1.5">
                {(Object.entries(CATEGORY_META) as [AnnouncementType['category'], typeof CATEGORY_META[keyof typeof CATEGORY_META]][]).map(([key, meta]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    className={`py-1.5 rounded-lg text-[10px] font-bold border transition-all ${
                      category === key
                        ? `${meta.bg} ${meta.color} ${meta.border}`
                        : isGlass ? 'bg-slate-100 text-slate-500 border-transparent hover:bg-slate-200' : 'bg-[#1c1c1f] text-slate-600 border-transparent hover:bg-[#2c2c2e]'
                    }`}
                  >
                    {meta.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Flags */}
            <div className={`rounded-xl p-3 border space-y-2 ${isGlass ? 'bg-slate-50 border-slate-100' : 'bg-[#0f0f12] border-[#1f1f22]'}`}>
              {[
                { id: 'urgent', label: 'Mark as Urgent', sublabel: 'Shows red badge', checked: isUrgent, onChange: setIsUrgent, icon: AlertTriangle, iconColor: 'text-red-500' },
                { id: 'pinned', label: 'Pin to Top', sublabel: 'Always shows first', checked: isPinned, onChange: setIsPinned, icon: Pin, iconColor: 'text-orange-500' },
              ].map(f => (
                <label key={f.id} htmlFor={f.id} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${f.checked ? (f.id === 'urgent' ? 'bg-red-500/15' : 'bg-orange-500/15') : (isGlass ? 'bg-slate-200' : 'bg-[#1c1c1f]')}`}>
                    <f.icon className={`w-3.5 h-3.5 ${f.checked ? f.iconColor : sub}`} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-xs font-bold ${txt}`}>{f.label}</p>
                    <p className={`text-[10px] ${sub}`}>{f.sublabel}</p>
                  </div>
                  <div
                    onClick={() => f.onChange(!f.checked)}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                      f.checked
                        ? f.id === 'urgent' ? 'bg-red-500' : 'bg-orange-500'
                        : isGlass ? 'bg-slate-200' : 'bg-[#2c2c2e]'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${f.checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </div>
                  <input type="checkbox" id={f.id} checked={f.checked} onChange={e => f.onChange(e.target.checked)} className="hidden" />
                </label>
              ))}
            </div>

            {/* Submit */}
            {showSuccess && (
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-sm font-bold">
                <CheckCircle2 className="w-4 h-4" /> Published successfully!
              </div>
            )}
            <button
              type="submit"
              disabled={!title.trim() || !message.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-black rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Send className="w-4 h-4" /> Publish Announcement
            </button>
          </form>
        </div>
      </div>

      {/* ── RIGHT: Announcements Feed ────────────────────────────────────── */}
      <div className={`flex-1 flex flex-col min-w-0 ${isGlass ? 'bg-slate-50' : 'bg-[#09090b]'}`}>

        {/* Feed Header + Filters */}
        <div className={`flex-shrink-0 px-5 py-4 border-b ${isGlass ? 'bg-white border-slate-200' : 'bg-[#111113] border-[#1f1f22]'}`}>
          <div className="flex items-center justify-between mb-3">
            <p className={`text-sm font-black ${txt}`}>
              Live Board
              <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-lg ${isGlass ? 'bg-slate-100 text-slate-500' : 'bg-[#1c1c1f] text-slate-500'}`}>
                {filtered.length} notices
              </span>
            </p>
            <div className="flex items-center gap-1.5">
              <Filter className={`w-3.5 h-3.5 ${sub}`} />
              <span className={`text-xs font-bold ${sub}`}>Filter:</span>
            </div>
          </div>
          {/* Category filter pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilterCat('all')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                filterCat === 'all'
                  ? isGlass ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-900 border-white'
                  : isGlass ? 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50' : 'bg-[#1c1c1f] text-slate-500 border-[#2c2c2e] hover:bg-[#2c2c2e]'
              }`}
            >
              All
            </button>
            {(Object.entries(CATEGORY_META) as [AnnouncementType['category'], typeof CATEGORY_META[keyof typeof CATEGORY_META]][]).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setFilterCat(key)}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all border ${
                  filterCat === key
                    ? `${meta.bg} ${meta.color} ${meta.border}`
                    : isGlass ? 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50' : 'bg-[#1c1c1f] text-slate-500 border-[#2c2c2e] hover:bg-[#2c2c2e]'
                }`}
              >
                {meta.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feed List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {filtered.length === 0 && (
            <div className={`mt-12 text-center py-16 rounded-2xl border-2 border-dashed ${isGlass ? 'border-slate-200 text-slate-400' : 'border-[#1f1f22] text-slate-600'}`}>
              <Layers className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-bold">No notices in this category</p>
              <p className="text-xs mt-1">Compose one on the left panel</p>
            </div>
          )}

          {filtered.map(ann => {
            const meta = CATEGORY_META[ann.category];
            const isDeleting = deleteConfirm === ann.id;

            return (
              <div
                key={ann.id}
                className={`rounded-2xl border transition-all hover:shadow-md ${
                  ann.isUrgent
                    ? isGlass ? 'bg-red-50/80 border-red-200' : 'bg-red-500/5 border-red-500/20'
                    : isGlass ? 'bg-white border-slate-200' : 'bg-[#111113] border-[#1f1f22]'
                }`}
              >
                <div className="p-4">
                  {/* Top row */}
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 ${ann.isUrgent ? 'bg-red-500/15' : meta.bg}`}>
                      {ann.isUrgent
                        ? <AlertTriangle className="w-4 h-4 text-red-500" />
                        : <Bell className={`w-4 h-4 ${meta.color}`} />
                      }
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          {ann.isPinned && (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md bg-orange-500/15 text-orange-500 border border-orange-500/20`}>
                              📌 PINNED
                            </span>
                          )}
                          {ann.isUrgent && (
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-red-500/15 text-red-500 border border-red-500/20">
                              ⚡ URGENT
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${meta.bg} ${meta.color} border ${meta.border}`}>
                            {meta.label}
                          </span>
                        </div>
                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button
                            onClick={() => togglePin(ann.id)}
                            title={ann.isPinned ? 'Unpin' : 'Pin to top'}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${ann.isPinned ? 'bg-orange-500/15 text-orange-500' : isGlass ? 'bg-slate-100 text-slate-400 hover:bg-orange-500/10 hover:text-orange-500' : 'bg-[#1c1c1f] text-slate-600 hover:bg-orange-500/10 hover:text-orange-500'}`}
                          >
                            <Pin className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(ann.id)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center transition ${isGlass ? 'bg-slate-100 text-slate-400 hover:bg-red-500/10 hover:text-red-500' : 'bg-[#1c1c1f] text-slate-600 hover:bg-red-500/10 hover:text-red-500'}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className={`text-sm font-black mt-2 leading-snug ${txt}`}>{ann.title}</h4>
                      <p className={`text-xs leading-relaxed mt-1.5 ${sub}`}>{ann.message}</p>

                      <div className={`flex items-center gap-1.5 mt-3 text-[10px] font-bold ${sub}`}>
                        <Clock className="w-3 h-3" />
                        <span>{timeAgo(ann.date)}</span>
                        <span className="opacity-40">•</span>
                        <span>{new Date(ann.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delete confirm inline */}
                  {isDeleting && (
                    <div className={`mt-3 flex items-center gap-3 p-3 rounded-xl border ${isGlass ? 'bg-red-50 border-red-200' : 'bg-red-500/10 border-red-500/20'}`}>
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                      <p className={`text-xs font-bold flex-1 text-red-500`}>Delete this announcement permanently?</p>
                      <button onClick={() => handleDelete(ann.id)} className="px-3 py-1 bg-red-500 text-white text-xs font-black rounded-lg hover:bg-red-400 transition">
                        Delete
                      </button>
                      <button onClick={() => setDeleteConfirm(null)} className={`w-6 h-6 rounded-lg flex items-center justify-center transition ${isGlass ? 'bg-slate-200 text-slate-500 hover:bg-slate-300' : 'bg-[#2c2c2e] text-slate-400 hover:bg-[#3f3f46]'}`}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
