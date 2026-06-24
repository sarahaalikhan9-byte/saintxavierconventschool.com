import React, { useState } from 'react';
import type { ActiveTab } from '../types';
import {
  ShieldCheck, Award, FileText, UserPlus, BookOpen, Cloud, Camera,
  LogOut, BadgeCheck, Video, Megaphone, Lock, Users, Share2,
  LayoutDashboard, ChevronRight, Menu, X, MessageSquare, Phone, Clock
} from 'lucide-react';
import { getTranslation } from '../utils/locale';

import MarksheetTab from './MarksheetTab';
import TCTab from './TCTab';
import AdmissionTab from './AdmissionTab';
import ScholarTab from './ScholarTab';
import ScholarRegisterTab from './ScholarRegisterTab';
import ERPTab from './ERPTab';
import AIClassroomTab from './AIClassroomTab';
import IDCardGeneratorTab from './IDCardGeneratorTab';
import CampusTourTab from './CampusTourTab';
import AnnouncementsTab from './AnnouncementsTab';
import UserSecurityTab from './UserSecurityTab';
import SocialMediaDashboardTab from './SocialMediaDashboardTab';

interface AdminTabProps {
  theme: 'original' | 'glassNavy' | 'sunriseOrange' | 'royalBlue' | 'emerald';
  setActiveTab: (tab: ActiveTab) => void;
  lang?: any;
}

type AdminTool =
  | 'dashboard' | 'marksheet' | 'tc' | 'admission' | 'scholar'
  | 'scholar_register' | 'erp' | 'camera' | 'id_card' | 'campus_tour'
  | 'social_media' | 'enquiries' | 'announcements' | 'security';

interface HubEnquiry {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  targetClass: string;
  message: string;
  submittedAt: string;
  status: 'New' | 'Contacted' | 'Closed';
}

const ENQUIRY_STORAGE_KEY = 'sxc_hub_enquiries';

const tools = [
  { id: 'marksheet',        label: 'Marksheet Builder',   icon: Award,          color: 'text-amber-500',   accent: '#F59E0B', bg: 'bg-amber-500/10',   desc: 'Generate & export student marksheets' },
  { id: 'tc',               label: 'TC Engine',           icon: FileText,        color: 'text-blue-500',    accent: '#3B82F6', bg: 'bg-blue-500/10',    desc: 'Issue Transfer Certificates instantly' },
  { id: 'admission',        label: 'Admission CRM',       icon: UserPlus,        color: 'text-rose-500',    accent: '#F43F5E', bg: 'bg-rose-500/10',    desc: 'Manage new student admissions' },
  { id: 'scholar',          label: 'Scholar Ledger',      icon: BookOpen,        color: 'text-purple-500',  accent: '#A855F7', bg: 'bg-purple-500/10',  desc: 'Track & manage scholarships' },
  { id: 'scholar_register', label: 'Scholar Register',    icon: Users,           color: 'text-emerald-500', accent: '#10B981', bg: 'bg-emerald-500/10', desc: 'Full scholarship student registry' },
  { id: 'erp',              label: 'Cloud ERP + LMS',     icon: Cloud,           color: 'text-cyan-500',    accent: '#06B6D4', bg: 'bg-cyan-500/10',    desc: 'ERP operations & learning modules' },
  { id: 'camera',           label: 'AI Classroom',        icon: Camera,          color: 'text-red-500',     accent: '#EF4444', bg: 'bg-red-500/10',     desc: 'Live classes, 16 cameras & AI insights' },
  { id: 'id_card',          label: 'ID Card Generator',   icon: BadgeCheck,      color: 'text-indigo-500',  accent: '#6366F1', bg: 'bg-indigo-500/10',  desc: 'Print & export student ID cards' },
  { id: 'campus_tour',      label: 'Campus Tours',        icon: Video,           color: 'text-pink-500',    accent: '#EC4899', bg: 'bg-pink-500/10',    desc: 'Virtual campus tour management' },
  { id: 'social_media',     label: 'Social & Campus Hub', icon: Share2,          color: 'text-teal-500',    accent: '#14B8A6', bg: 'bg-teal-500/10',    desc: 'Campus social media dashboard' },
  { id: 'enquiries',        label: 'Enquiry Inbox',       icon: MessageSquare,   color: 'text-sky-500',     accent: '#0EA5E9', bg: 'bg-sky-500/10',     desc: 'Hub enquiries from parents' },
  { id: 'announcements',    label: 'Announcements',       icon: Megaphone,       color: 'text-orange-500',  accent: '#F97316', bg: 'bg-orange-500/10',  desc: 'Broadcast school-wide notices' },
  { id: 'security',         label: 'User Security',       icon: Lock,            color: 'text-violet-500',  accent: '#8B5CF6', bg: 'bg-violet-500/10',  desc: 'Manage roles, passwords & access' },
] as const;

export default function AdminTab({ theme, setActiveTab, lang = 'en' }: AdminTabProps) {
  const isGlass = theme === 'glassNavy';

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('sxc_admin_session') === 'active';
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTool, setActiveTool] = useState<AdminTool>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Head@saintxavierconventschool.com' && password === 'Saint@1990') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('sxc_admin_session', 'active');
      window.dispatchEvent(new Event('sxc_admin_login_changed'));
      setError('');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('sxc_admin_session');
    window.dispatchEvent(new Event('sxc_admin_login_changed'));
    setActiveTool('dashboard');
  };

  const activeMeta = tools.find(t => t.id === activeTool);

  const loadEnquiries = (): HubEnquiry[] => {
    const saved = localStorage.getItem(ENQUIRY_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  };

  const [enquiries, setEnquiries] = useState<HubEnquiry[]>(loadEnquiries);

  React.useEffect(() => {
    const refreshEnquiries = () => setEnquiries(loadEnquiries());
    window.addEventListener('sxc_hub_enquiries_changed', refreshEnquiries);
    window.addEventListener('storage', refreshEnquiries);
    return () => {
      window.removeEventListener('sxc_hub_enquiries_changed', refreshEnquiries);
      window.removeEventListener('storage', refreshEnquiries);
    };
  }, []);

  const updateEnquiryStatus = (id: string, status: HubEnquiry['status']) => {
    const updated = enquiries.map(item => item.id === id ? { ...item, status } : item);
    setEnquiries(updated);
    localStorage.setItem(ENQUIRY_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('sxc_hub_enquiries_changed'));
  };

  // ─── LOGIN SCREEN ─────────────────────────────────────────────────────────
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
        style={{ background: isGlass ? 'linear-gradient(135deg,#e0f2fe 0%,#fce7f3 100%)' : 'linear-gradient(135deg,#09090b 0%,#18181b 100%)' }}>
        <div className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border ${isGlass ? 'bg-white/90 backdrop-blur-xl border-white/40 text-[#1e293b]' : 'bg-[#18181b] border-[#2c2c2e] text-white'}`}>
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-rose-600 to-rose-400 px-8 py-7 text-white text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-white/20 rounded-2xl p-3 backdrop-blur-sm">
                <ShieldCheck className="w-9 h-9 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-black tracking-tight">Admin Portal</h2>
            <p className="text-rose-100 text-sm mt-1 font-medium">Saint Xavier Convent School</p>
          </div>

          <div className="px-8 py-8">
            <p className={`text-center text-sm mb-6 font-medium ${isGlass ? 'text-slate-500' : 'text-slate-400'}`}>
              Authorized personnel only
            </p>
            {error && (
              <div className="mb-5 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-semibold px-4 py-3 rounded-xl">
                <span className="text-base">⚠</span> {error}
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${isGlass ? 'text-slate-500' : 'text-slate-400'}`}>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-mono outline-none transition-all focus:ring-2 focus:ring-rose-500/30 ${isGlass ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-400' : 'bg-[#0f0f12] border-[#3f3f46] text-white focus:border-rose-500'}`}
                  placeholder="admin@school.com"
                />
              </div>
              <div>
                <label className={`block text-xs font-bold mb-2 uppercase tracking-wider ${isGlass ? 'text-slate-500' : 'text-slate-400'}`}>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-mono outline-none transition-all focus:ring-2 focus:ring-rose-500/30 ${isGlass ? 'bg-slate-50 border-slate-200 text-slate-800 focus:border-rose-400' : 'bg-[#0f0f12] border-[#3f3f46] text-white focus:border-rose-500'}`}
                  placeholder="••••••••••"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-black rounded-xl transition-all shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 active:translate-y-0 text-sm tracking-wider"
              >
                AUTHENTICATE →
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD OVERVIEW CARDS ─────────────────────────────────────────────
  const DashboardOverview = () => (
    <div className="p-6 sm:p-8">
      {/* Welcome Banner */}
      <div className={`rounded-2xl p-6 mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border ${isGlass ? 'bg-gradient-to-r from-rose-50 to-pink-50 border-rose-100' : 'bg-gradient-to-r from-rose-500/10 to-rose-600/5 border-rose-500/20'}`}>
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isGlass ? 'text-rose-400' : 'text-rose-400'}`}>Welcome back</p>
          <h2 className={`text-xl sm:text-2xl font-black ${isGlass ? 'text-slate-800' : 'text-white'}`}>Master Admin Dashboard</h2>
          <p className={`text-sm mt-1 ${isGlass ? 'text-slate-500' : 'text-slate-400'}`}>Saint Xavier Convent School — {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}</p>
        </div>
        <div className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl border ${isGlass ? 'bg-white border-rose-100 text-rose-600' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse inline-block"></span>
          SECURE SESSION ACTIVE
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {tools.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id as AdminTool)}
            className={`group p-5 rounded-2xl border text-left motion-card interactive-lift transition-all duration-200 hover:scale-[1.02] hover:-translate-y-1 ${
              isGlass
                ? 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-xl text-slate-800'
                : 'bg-[#1c1c1f] border-[#2c2c2e] hover:bg-[#222226] hover:border-[#3f3f46] text-white'
            }`}
            style={{ '--accent': tool.accent } as React.CSSProperties}
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${tool.bg} ${tool.color} group-hover:scale-110 transition-transform duration-200`}>
                <tool.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`font-bold text-sm ${isGlass ? 'text-slate-800' : 'text-white'}`}>{tool.label}</h3>
                  <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200 ${tool.color}`} />
                </div>
                <p className={`text-xs mt-1 leading-relaxed ${isGlass ? 'text-slate-500' : 'text-slate-400'}`}>{tool.desc}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // ─── MAIN ADMIN LAYOUT WITH SIDEBAR ───────────────────────────────────────
  const EnquiryInbox = () => (
    <div className="p-6 sm:p-8">
      <div className={`rounded-2xl p-5 mb-5 border ${isGlass ? 'bg-sky-50 border-sky-100 text-slate-800' : 'bg-sky-500/10 border-sky-500/20 text-white'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-sky-500">Campus Hub Leads</p>
            <h2 className="text-2xl font-black">Enquiry Inbox</h2>
            <p className="text-sm opacity-65 mt-1">Admission enquiries submitted from the public hub appear here instantly.</p>
          </div>
          <div className="flex gap-3">
            <div className={`px-4 py-3 rounded-xl text-center ${isGlass ? 'bg-white' : 'bg-black/20'}`}>
              <p className="text-2xl font-black text-sky-500">{enquiries.length}</p>
              <p className="text-[10px] font-black uppercase opacity-55">Total</p>
            </div>
            <div className={`px-4 py-3 rounded-xl text-center ${isGlass ? 'bg-white' : 'bg-black/20'}`}>
              <p className="text-2xl font-black text-rose-500">{enquiries.filter(item => item.status === 'New').length}</p>
              <p className="text-[10px] font-black uppercase opacity-55">New</p>
            </div>
          </div>
        </div>
      </div>

      {enquiries.length === 0 ? (
        <div className={`p-8 rounded-2xl border text-center ${isGlass ? 'bg-white border-slate-100 text-slate-700' : 'bg-[#1c1c1f] border-[#2c2c2e] text-slate-300'}`}>
          <MessageSquare className="w-10 h-10 mx-auto mb-3 text-sky-500" />
          <h3 className="font-black">No enquiries yet</h3>
          <p className="text-sm opacity-60 mt-1">Hub form submit hote hi yahan list show hogi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {enquiries.map(item => (
            <div key={item.id} className={`p-5 rounded-2xl border ${isGlass ? 'bg-white border-slate-100 text-slate-800' : 'bg-[#1c1c1f] border-[#2c2c2e] text-white'}`}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-black">{item.studentName}</h3>
                  <p className="text-xs opacity-55 font-mono">{item.id}</p>
                </div>
                <select value={item.status} onChange={event => updateEnquiryStatus(item.id, event.target.value as HubEnquiry['status'])} className={`px-3 py-2 rounded-xl text-xs font-black outline-none ${isGlass ? 'bg-slate-50 border border-slate-200 text-slate-700' : 'bg-[#0f0f12] border border-[#3f3f46] text-white'}`}>
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Closed</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className={`p-3 rounded-xl ${isGlass ? 'bg-slate-50' : 'bg-[#0f0f12]'}`}>
                  <p className="text-[10px] uppercase font-black opacity-45">Parent</p>
                  <p className="font-bold">{item.parentName}</p>
                </div>
                <div className={`p-3 rounded-xl ${isGlass ? 'bg-slate-50' : 'bg-[#0f0f12]'}`}>
                  <p className="text-[10px] uppercase font-black opacity-45">Class</p>
                  <p className="font-bold">{item.targetClass}</p>
                </div>
                <a href={`tel:${item.phone}`} className={`p-3 rounded-xl flex items-center gap-2 ${isGlass ? 'bg-green-50 text-green-700' : 'bg-green-500/10 text-green-400'}`}>
                  <Phone className="w-4 h-4" />
                  <span className="font-bold">{item.phone}</span>
                </a>
                <div className={`p-3 rounded-xl flex items-center gap-2 ${isGlass ? 'bg-sky-50 text-sky-700' : 'bg-sky-500/10 text-sky-300'}`}>
                  <Clock className="w-4 h-4" />
                  <span className="font-bold text-xs">{item.submittedAt}</span>
                </div>
              </div>
              <div className={`mt-3 p-3 rounded-xl text-sm leading-relaxed ${isGlass ? 'bg-orange-50 text-orange-900' : 'bg-orange-500/10 text-orange-100'}`}>
                {item.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className={`flex h-screen max-h-[90vh] rounded-2xl overflow-hidden border shadow-2xl ${isGlass ? 'bg-white border-slate-200' : 'bg-[#09090b] border-[#1f1f22]'}`}>

      {/* ── Sidebar ── */}
      <aside className={`no-print flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out border-r ${
        sidebarOpen ? 'w-64' : 'w-[68px]'
      } ${isGlass ? 'bg-slate-50 border-slate-200' : 'bg-[#111113] border-[#1f1f22]'}`}>

        {/* Sidebar Header */}
        <div className={`flex items-center justify-between px-4 py-4 border-b flex-shrink-0 ${isGlass ? 'border-slate-200' : 'border-[#1f1f22]'}`}>
          {sidebarOpen && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="bg-rose-500/15 rounded-lg p-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-500 flex-shrink-0" />
              </div>
              <span className={`text-xs font-black tracking-widest truncate ${isGlass ? 'text-slate-700' : 'text-white'}`}>ADMIN</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(p => !p)}
            className={`p-2 rounded-xl transition flex-shrink-0 ${sidebarOpen ? '' : 'mx-auto'} ${isGlass ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-[#1f1f22] text-slate-400'}`}
          >
            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {/* Dashboard item */}
          <button
            onClick={() => setActiveTool('dashboard')}
            className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-left transition-all duration-150 group ${
              activeTool === 'dashboard'
                ? isGlass ? 'bg-rose-50 text-rose-600' : 'bg-rose-500/15 text-rose-400'
                : isGlass ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-400 hover:bg-[#1c1c1f]'
            }`}
            title={!sidebarOpen ? 'Dashboard' : undefined}
          >
            <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${activeTool === 'dashboard' ? 'bg-rose-500/20 text-rose-500' : isGlass ? 'bg-slate-200 text-slate-500' : 'bg-[#1f1f22] text-slate-400'}`}>
              <LayoutDashboard className="w-4 h-4" />
            </div>
            {sidebarOpen && <span className="text-xs font-bold truncate">Dashboard</span>}
          </button>

          {/* Divider */}
          {sidebarOpen && (
            <p className={`text-[10px] font-bold uppercase tracking-widest px-3 pt-4 pb-1 ${isGlass ? 'text-slate-400' : 'text-slate-600'}`}>Modules</p>
          )}
          {!sidebarOpen && <div className={`mx-2 my-2 border-t ${isGlass ? 'border-slate-200' : 'border-[#2c2c2e]'}`}></div>}

          {tools.map(tool => {
            const isActive = activeTool === tool.id;
            return (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id as AdminTool)}
                className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-left transition-all duration-150 group ${
                  isActive
                    ? isGlass ? 'bg-slate-100 text-slate-800' : 'bg-[#1f1f22] text-white'
                    : isGlass ? 'text-slate-500 hover:bg-slate-100 hover:text-slate-700' : 'text-slate-500 hover:bg-[#1c1c1f] hover:text-slate-300'
                }`}
                title={!sidebarOpen ? tool.label : undefined}
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isActive ? `${tool.bg} ${tool.color}` : isGlass ? 'bg-slate-200 text-slate-400' : 'bg-[#1f1f22] text-slate-500'}`}>
                  <tool.icon className="w-4 h-4" />
                </div>
                {sidebarOpen && (
                  <span className={`text-xs font-semibold truncate flex-1 ${isActive ? (isGlass ? 'text-slate-800 font-bold' : 'text-white font-bold') : ''}`}>
                    {tool.label}
                  </span>
                )}
                {sidebarOpen && isActive && (
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${tool.color.replace('text-', 'bg-')}`}></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer — Logout */}
        <div className={`flex-shrink-0 p-3 border-t ${isGlass ? 'border-slate-200' : 'border-[#1f1f22]'}`}>
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all text-red-500 hover:bg-red-500/10 group`}
            title={!sidebarOpen ? 'Logout' : undefined}
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
              <LogOut className="w-4 h-4" />
            </div>
            {sidebarOpen && <span className="text-xs font-bold">Terminate Session</span>}
          </button>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Navbar */}
        <header className={`no-print flex-shrink-0 flex items-center justify-between px-5 py-3 border-b ${isGlass ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#111113] border-[#1f1f22] text-white'}`}>
          <div className="flex items-center gap-3">
            {activeTool !== 'dashboard' && activeMeta && (
              <>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeMeta.bg} ${activeMeta.color}`}>
                  <activeMeta.icon className="w-4 h-4" />
                </div>
                <div>
                  <h1 className={`text-sm font-black leading-tight ${isGlass ? 'text-slate-800' : 'text-white'}`}>{activeMeta.label}</h1>
                  <p className={`text-xs ${isGlass ? 'text-slate-400' : 'text-slate-500'}`}>{activeMeta.desc}</p>
                </div>
              </>
            )}
            {activeTool === 'dashboard' && (
              <div>
                <h1 className={`text-sm font-black leading-tight ${isGlass ? 'text-slate-800' : 'text-white'}`}>Master Admin Dashboard</h1>
                <p className={`text-xs ${isGlass ? 'text-slate-400' : 'text-slate-500'}`}>All school management modules</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className={`hidden sm:flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-lg border ${isGlass ? 'border-rose-100 bg-rose-50 text-rose-600' : 'border-rose-500/20 bg-rose-500/10 text-rose-400'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse inline-block"></span>
              SECURE MODE
            </div>
          </div>
        </header>

        {/* Scrollable Tool Content */}
        <main className={`flex-1 overflow-y-auto ${isGlass ? 'bg-slate-50/50' : 'bg-[#09090b]'}`}>
          {activeTool === 'dashboard' && <DashboardOverview />}
          {activeTool === 'marksheet'        && <MarksheetTab theme={theme} />}
          {activeTool === 'tc'               && <TCTab theme={theme} />}
          {activeTool === 'admission'        && <AdmissionTab theme={theme} />}
          {activeTool === 'scholar'          && <ScholarTab theme={theme} lang={lang} />}
          {activeTool === 'scholar_register' && <ScholarRegisterTab theme={theme} />}
          {activeTool === 'erp'              && <ERPTab theme={theme} />}
          {activeTool === 'camera'           && <AIClassroomTab theme={theme} mode="admin" />}
          {activeTool === 'id_card'          && <IDCardGeneratorTab theme={theme} />}
          {activeTool === 'campus_tour'      && <CampusTourTab />}
          {activeTool === 'social_media'     && <SocialMediaDashboardTab />}
          {activeTool === 'enquiries'        && <EnquiryInbox />}
          {activeTool === 'announcements'    && <AnnouncementsTab theme={theme} />}
          {activeTool === 'security'         && <UserSecurityTab theme={theme} />}
        </main>
      </div>
    </div>
  );
}
