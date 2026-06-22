import React, { useState, useMemo } from 'react';
import {
  Calendar, Users, Award, BookOpen, Clock, Activity, ShieldCheck,
  DollarSign, FileText, Download, Plus, Trash2, ArrowRight,
  TrendingUp, BarChart2, Bell, FileSpreadsheet, CheckCircle, HelpCircle,
  Search, Filter, Edit2, Save, X, ChevronDown, ChevronUp, Eye, EyeOff,
  GraduationCap, UserCheck, ClipboardList, Star, AlertTriangle, Info,
  RefreshCw, Printer, Mail, Phone, MapPin, Hash, Percent, Target, Medal
} from 'lucide-react';

interface ERPTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
}

interface Notice {
  id: string;
  date: string;
  title: string;
  category: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  author?: string;
  pinned?: boolean;
}

interface TimeTableSlot {
  time: string;
  subject: string;
  teacher: string;
  room: string;
  color?: string;
}

interface Student {
  id: string;
  name: string;
  class: string;
  roll: string;
  parent: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  attendance: number;
  fee: 'Paid' | 'Pending' | 'Partial';
  marks: number;
}

interface Receipt {
  id: string;
  student: string;
  class: string;
  amount: number;
  type: string;
  date: string;
  mode: string;
  discount?: number;
  late_fee?: number;
}

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'] as const;
type Day = typeof DAYS[number];

const subjectColors: Record<string, string> = {
  Mathematics: 'bg-blue-500/10 text-blue-600 border-blue-200',
  Science: 'bg-green-500/10 text-green-600 border-green-200',
  English: 'bg-purple-500/10 text-purple-600 border-purple-200',
  Hindi: 'bg-orange-500/10 text-orange-600 border-orange-200',
  Social: 'bg-amber-500/10 text-amber-600 border-amber-200',
  Computer: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
  Physical: 'bg-rose-500/10 text-rose-600 border-rose-200',
  Art: 'bg-pink-500/10 text-pink-600 border-pink-200',
  Sanskrit: 'bg-yellow-500/10 text-yellow-700 border-yellow-200',
  General: 'bg-indigo-500/10 text-indigo-600 border-indigo-200',
  Library: 'bg-teal-500/10 text-teal-600 border-teal-200',
  Moral: 'bg-violet-500/10 text-violet-600 border-violet-200',
};

function getSubjectColor(subject: string): string {
  for (const key of Object.keys(subjectColors)) {
    if (subject.toLowerCase().includes(key.toLowerCase())) return subjectColors[key];
  }
  return 'bg-slate-100 text-slate-600 border-slate-200';
}

export default function ERPTab({ theme = 'glassNavy' }: ERPTabProps) {
  const isGlass = theme === 'glassNavy';

  const [erpSubTab, setErpSubTab] = useState<'dashboard' | 'fees' | 'timetable' | 'notices' | 'students'>('dashboard');

  // ─── STUDENT DATA ──────────────────────────────────────────────────────────
  const [students, setStudents] = useState<Student[]>([
    { id: 'S001', name: 'Rahul Sharma', class: 'Class VIII-A', roll: '08', parent: 'Deepak Sharma', phone: '9876543210', status: 'Active', attendance: 94, fee: 'Paid', marks: 88 },
    { id: 'S002', name: 'Priya Patel', class: 'Class VI-B', roll: '22', parent: 'Nilesh Patel', phone: '9823456789', status: 'Active', attendance: 97, fee: 'Partial', marks: 92 },
    { id: 'S003', name: 'Anuj Verma', class: 'Class IX-A', roll: '05', parent: 'Suresh Verma', phone: '9812345678', status: 'On Leave', attendance: 78, fee: 'Pending', marks: 75 },
    { id: 'S004', name: 'Sneha Mishra', class: 'Class VII-C', roll: '14', parent: 'Rajan Mishra', phone: '9901234567', status: 'Active', attendance: 99, fee: 'Paid', marks: 96 },
    { id: 'S005', name: 'Aryan Singh', class: 'Class X-B', roll: '31', parent: 'Hariom Singh', phone: '9756432109', status: 'Active', attendance: 88, fee: 'Paid', marks: 81 },
    { id: 'S006', name: 'Kavya Joshi', class: 'Class VIII-B', roll: '19', parent: 'Vinod Joshi', phone: '9845678901', status: 'Inactive', attendance: 65, fee: 'Pending', marks: 70 },
  ]);
  const [studentSearch, setStudentSearch] = useState('');
  const [studentFilter, setStudentFilter] = useState<'All' | 'Active' | 'Inactive' | 'On Leave'>('All');
  const [feeFilter, setFeeFilter] = useState<'All' | 'Paid' | 'Pending' | 'Partial'>('All');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.class.toLowerCase().includes(studentSearch.toLowerCase());
      const matchStatus = studentFilter === 'All' || s.status === studentFilter;
      const matchFee = feeFilter === 'All' || s.fee === feeFilter;
      return matchSearch && matchStatus && matchFee;
    });
  }, [students, studentSearch, studentFilter, feeFilter]);

  // ─── STATS ─────────────────────────────────────────────────────────────────
  const stats = [
    { label: 'Total Enrolled Pupils', value: '2,548', change: '+12% this session', icon: Users, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { label: 'Academic Staff / Teachers', value: '84 Roster', change: '100% Verified', icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Active Curriculums', value: '45 Subjects', change: 'CBSE & MP Board', icon: BookOpen, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { label: 'Average Board Rating', value: '9.8 / 10', change: 'First Division Honors', icon: Award, color: 'text-purple-500', bg: 'bg-purple-500/10' }
  ];

  // ─── FEES ──────────────────────────────────────────────────────────────────
  const [feeStudent, setFeeStudent] = useState('Rahul Sharma');
  const [feeClass, setFeeClass] = useState('Class VIII');
  const [feeAmount, setFeeAmount] = useState('12500');
  const [feeType, setFeeType] = useState('Quarterly Tuition Fee');
  const [feeMode, setFeeMode] = useState('UPI');
  const [feeDiscount, setFeeDiscount] = useState('0');
  const [feeLateFee, setFeeLateFee] = useState('0');
  const [receipts, setReceipts] = useState<Receipt[]>([
    { id: 'REC-9821', student: 'Rahul Sharma', class: 'Class VIII', amount: 12500, type: 'Quarterly Tuition Fee', date: '2026-06-18', mode: 'UPI', discount: 0, late_fee: 0 },
    { id: 'REC-9820', student: 'Priya Patel', class: 'Class VI', amount: 15000, type: 'Quarterly Tuition Fee', date: '2026-06-17', mode: 'Cash', discount: 500, late_fee: 0 }
  ]);
  const [activeReceipt, setActiveReceipt] = useState<Receipt | null>(null);
  const [receiptSearch, setReceiptSearch] = useState('');

  const filteredReceipts = receipts.filter(r =>
    r.student.toLowerCase().includes(receiptSearch.toLowerCase()) ||
    r.id.toLowerCase().includes(receiptSearch.toLowerCase())
  );

  const totalCollected = receipts.reduce((sum, r) => sum + r.amount, 0);

  const handleGenerateReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeStudent || !feeAmount) return;
    const disc = parseFloat(feeDiscount) || 0;
    const late = parseFloat(feeLateFee) || 0;
    const base = parseFloat(feeAmount);
    const newRec: Receipt = {
      id: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      student: feeStudent,
      class: feeClass,
      amount: base - disc + late,
      type: feeType,
      date: new Date().toISOString().split('T')[0],
      mode: feeMode,
      discount: disc,
      late_fee: late
    };
    setReceipts([newRec, ...receipts]);
    setActiveReceipt(newRec);
  };

  // ─── TIMETABLE ─────────────────────────────────────────────────────────────
  const [selectedDay, setSelectedDay] = useState<Day>('MON');
  const [selectedClass, setSelectedClass] = useState('Class VIII-A');
  const timetableData: Record<Day, TimeTableSlot[]> = {
    MON: [
      { time: '08:30 – 09:15', subject: 'Mathematics (Algebra)', teacher: 'Mr. Surendra Sharma', room: 'L-101' },
      { time: '09:15 – 10:00', subject: 'Science (Physics)', teacher: 'Mrs. Rekha Verma', room: 'Lab-A' },
      { time: '10:15 – 11:00', subject: 'English Grammar', teacher: 'Miss Priya Patel', room: 'L-101' },
      { time: '11:00 – 11:45', subject: 'Social Studies', teacher: 'Mr. Manoj Verma', room: 'L-101' },
      { time: '12:30 – 13:15', subject: 'Hindi Literature', teacher: 'Mrs. Savita Sharma', room: 'L-103' },
      { time: '13:15 – 14:00', subject: 'Computer Applications', teacher: 'Mrs. Radhika Patel', room: 'Lab-B' },
    ],
    TUE: [
      { time: '08:30 – 09:15', subject: 'Hindi Literature', teacher: 'Mrs. Savita Sharma', room: 'L-101' },
      { time: '09:15 – 10:00', subject: 'Mathematics (Geometry)', teacher: 'Mr. Surendra Sharma', room: 'L-101' },
      { time: '10:15 – 11:00', subject: 'Computer Applications', teacher: 'Mrs. Radhika Patel', room: 'Lab-B' },
      { time: '11:00 – 11:45', subject: 'Physical Education', teacher: 'Mr. Amit Sinha', room: 'Playground' },
      { time: '12:30 – 13:15', subject: 'Science (Biology)', teacher: 'Mrs. Rekha Verma', room: 'Lab-A' },
      { time: '13:15 – 14:00', subject: 'Art & Sketching', teacher: 'Mrs. Farah Khan', room: 'Art Hall' },
    ],
    WED: [
      { time: '08:30 – 09:15', subject: 'Science (Chemistry)', teacher: 'Mrs. Rekha Verma', room: 'Lab-A' },
      { time: '09:15 – 10:00', subject: 'English (Prose)', teacher: 'Miss Priya Patel', room: 'L-101' },
      { time: '10:15 – 11:00', subject: 'Sanskrit / Urdu', teacher: 'Mr. Jameel Alam', room: 'L-102' },
      { time: '11:00 – 11:45', subject: 'Social Studies (Civics)', teacher: 'Mr. Manoj Verma', room: 'L-101' },
      { time: '12:30 – 13:15', subject: 'Mathematics (Arithmetic)', teacher: 'Mr. Surendra Sharma', room: 'L-101' },
      { time: '13:15 – 14:00', subject: 'Physical Education', teacher: 'Mr. Amit Sinha', room: 'Playground' },
    ],
    THU: [
      { time: '08:30 – 09:15', subject: 'Mathematics (Arithmetic)', teacher: 'Mr. Surendra Sharma', room: 'L-101' },
      { time: '09:15 – 10:00', subject: 'Science (Biology)', teacher: 'Mrs. Rekha Verma', room: 'Lab-A' },
      { time: '10:15 – 11:00', subject: 'English Reading', teacher: 'Miss Priya Patel', room: 'L-101' },
      { time: '11:00 – 11:45', subject: 'Art & Sketching', teacher: 'Mrs. Farah Khan', room: 'Art Hall' },
      { time: '12:30 – 13:15', subject: 'Hindi Grammar', teacher: 'Mrs. Savita Sharma', room: 'L-101' },
      { time: '13:15 – 14:00', subject: 'General Knowledge Quiz', teacher: 'Mrs. Radhika Patel', room: 'Seminar Hall' },
    ],
    FRI: [
      { time: '08:30 – 09:15', subject: 'Social Studies (History)', teacher: 'Mr. Manoj Verma', room: 'L-101' },
      { time: '09:15 – 10:00', subject: 'Hindi Grammar', teacher: 'Mrs. Savita Sharma', room: 'L-101' },
      { time: '10:15 – 11:00', subject: 'Mathematics (Vedic Extra)', teacher: 'Mr. Surendra Sharma', room: 'L-101' },
      { time: '11:00 – 11:45', subject: 'Science Quiz', teacher: 'Mrs. Rekha Verma', room: 'Seminar Hall' },
      { time: '12:30 – 13:15', subject: 'Sanskrit / Urdu', teacher: 'Mr. Jameel Alam', room: 'L-102' },
      { time: '13:15 – 14:00', subject: 'English Grammar', teacher: 'Miss Priya Patel', room: 'L-101' },
    ],
    SAT: [
      { time: '08:30 – 09:15', subject: 'General Knowledge Quiz', teacher: 'Mrs. Radhika Patel', room: 'L-101' },
      { time: '09:15 – 10:00', subject: 'Moral Values & Ethics', teacher: 'Principal Desk', room: 'Seminar Hall' },
      { time: '10:15 – 11:00', subject: 'Physical Education', teacher: 'Mr. Amit Sinha', room: 'Playground' },
      { time: '11:00 – 11:45', subject: 'Library Hour', teacher: 'Librarian', room: 'Library' },
    ]
  };

  // ─── NOTICES ───────────────────────────────────────────────────────────────
  const [notices, setNotices] = useState<Notice[]>([
    { id: 'N-1', date: '2026-06-15', title: 'Summer Vacations extended by 5 days due to intense heat waves. School will reopen on 1st July 2026.', category: 'ADMIN', priority: 'HIGH', author: 'Principal Office', pinned: true },
    { id: 'N-2', date: '2026-06-12', title: 'Distribution of Board Marksheets and TC Clearance Forms. Students must collect by 20th June.', category: 'EXAMS', priority: 'MEDIUM', author: 'Exam Cell', pinned: false },
    { id: 'N-3', date: '2026-06-10', title: 'Interactive Science Exhibition Registration starts from 12th June. All classes from VI–X must participate.', category: 'EVENTS', priority: 'LOW', author: 'Science Dept.', pinned: false },
    { id: 'N-4', date: '2026-06-08', title: 'Annual Sports Day scheduled for 28th June. Trials begin 15th June at 7:00 AM in the school ground.', category: 'SPORTS', priority: 'MEDIUM', author: 'Sports Dept.', pinned: false },
  ]);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticePriority, setNewNoticePriority] = useState<'HIGH' | 'MEDIUM' | 'LOW'>('MEDIUM');
  const [newNoticeCat, setNewNoticeCat] = useState('ADMIN');
  const [newNoticeAuthor, setNewNoticeAuthor] = useState('Admin Office');
  const [noticeFilterCat, setNoticeFilterCat] = useState('ALL');
  const [noticeFilterPri, setNoticeFilterPri] = useState('ALL');

  const filteredNotices = useMemo(() => {
    return notices.filter(n => {
      const matchCat = noticeFilterCat === 'ALL' || n.category === noticeFilterCat;
      const matchPri = noticeFilterPri === 'ALL' || n.priority === noticeFilterPri;
      return matchCat && matchPri;
    }).sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [notices, noticeFilterCat, noticeFilterPri]);

  const addNotice = () => {
    if (!newNoticeTitle.trim()) return;
    const item: Notice = {
      id: `N-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: newNoticeTitle,
      category: newNoticeCat,
      priority: newNoticePriority,
      author: newNoticeAuthor,
      pinned: false
    };
    setNotices([item, ...notices]);
    setNewNoticeTitle('');
  };

  const removeNotice = (id: string) => setNotices(notices.filter(n => n.id !== id));
  const togglePin = (id: string) => setNotices(notices.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));

  // ─── THEME HELPERS ─────────────────────────────────────────────────────────
  const headerTextClass = isGlass ? 'text-[#431407]' : 'text-white';
  const textMutedClass = isGlass ? 'text-slate-500' : 'text-gray-400';
  const cardBg = isGlass
    ? 'bg-white/80 border border-white/60 backdrop-blur-md shadow-sm rounded-2xl'
    : 'bg-[#18181C] border border-[#2C2C2E] rounded-2xl';
  const panelBg = isGlass
    ? 'bg-white/50 border border-gray-100 shadow-sm rounded-2xl'
    : 'bg-[#0F0F12] border border-[#2C2C2E] rounded-2xl';
  const inputCls = isGlass
    ? 'w-full p-2.5 bg-white/70 border border-gray-200 rounded-xl text-xs outline-none focus:border-orange-400 transition'
    : 'w-full p-2.5 bg-[#1C1C1F] border border-[#2C2C2E] rounded-xl text-xs outline-none focus:border-[#EA580C] transition text-white';
  const tabBtn = (active: boolean) =>
    active
      ? (isGlass
        ? 'px-4 py-2 rounded-xl text-xs font-black bg-[#431407] text-[#FFF7ED] shadow'
        : 'px-4 py-2 rounded-xl text-xs font-extrabold bg-[#EA580C] text-black shadow-lg shadow-[#EA580C]/20')
      : (isGlass
        ? 'px-4 py-2 rounded-xl text-xs font-bold bg-white/40 hover:bg-white/75 border border-slate-200 text-[#431407]/75 transition'
        : 'px-4 py-2 rounded-xl text-xs font-medium bg-[#131316] hover:bg-[#202024] border border-[#242427] text-gray-400 hover:text-white transition');
  const primaryBtn = isGlass
    ? 'w-full py-2.5 rounded-xl text-xs font-bold text-white bg-[#F97316] hover:bg-orange-600 transition'
    : 'w-full py-2.5 rounded-xl text-xs font-bold text-black bg-[#EA580C] hover:bg-orange-500 transition';

  const priorityBadge = (p: string) =>
    p === 'HIGH' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
    p === 'MEDIUM' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
    'bg-blue-100 text-blue-700 border border-blue-200';

  const statusBadge = (s: string) =>
    s === 'Active' ? 'bg-emerald-100 text-emerald-700' :
    s === 'Inactive' ? 'bg-rose-100 text-rose-700' :
    'bg-amber-100 text-amber-700';

  const feeBadge = (f: string) =>
    f === 'Paid' ? 'bg-emerald-100 text-emerald-700' :
    f === 'Pending' ? 'bg-rose-100 text-rose-700' :
    'bg-amber-100 text-amber-700';

  return (
    <div className={`p-6 sm:p-8 rounded-3xl min-h-[600px] border ${isGlass ? 'bg-white/80 backdrop-blur-xl border-white/40 text-[#431407]' : 'bg-[#1C1C1F] border-[#2C2C2E] text-white'}`}>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black flex items-center gap-2">
            <BookOpen className="text-indigo-500" />
            Cloud School ERP & Learning Management System
          </h2>
          <p className={`text-sm mt-1 ${textMutedClass}`}>Manage students, fees, timetable, and circulars in one unified portal.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold font-mono no-print">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>PORTAL CLOUD SYNCED</span>
        </div>
      </div>

      {/* Sub-tab Nav */}
      <div className="flex flex-wrap gap-2.5 mb-6 border-b pb-4 border-slate-500/10 no-print">
        <button onClick={() => setErpSubTab('dashboard')} className={tabBtn(erpSubTab === 'dashboard')}>📊 Overview</button>
        <button onClick={() => setErpSubTab('students')} className={tabBtn(erpSubTab === 'students')}>🎓 Students</button>
        <button onClick={() => setErpSubTab('fees')} className={tabBtn(erpSubTab === 'fees')}>💵 Fee Invoicing</button>
        <button onClick={() => setErpSubTab('timetable')} className={tabBtn(erpSubTab === 'timetable')}>📅 Timetable</button>
        <button onClick={() => setErpSubTab('notices')} className={tabBtn(erpSubTab === 'notices')}>🔔 Notice Board</button>
      </div>

      {/* ═══════════════════════════════ DASHBOARD ══════════════════════════════ */}
      {erpSubTab === 'dashboard' && (
        <div className="space-y-8">

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className={`${cardBg} p-5`}>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[10px] font-bold ${textMutedClass} uppercase tracking-wider leading-tight`}>{stat.label}</span>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                    <stat.icon className="w-4 h-4" />
                  </div>
                </div>
                <div className={`text-2xl font-black ${headerTextClass}`}>{stat.value}</div>
                <div className="text-[10px] text-emerald-600 font-bold mt-1">✓ {stat.change}</div>
              </div>
            ))}
          </div>

          {/* Quick Metrics Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Fee Collection Summary */}
            <div className={`${panelBg} p-5`}>
              <h4 className="font-black text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />Fee Collection This Month
              </h4>
              <div className="text-2xl font-black text-emerald-600">₹ {(totalCollected).toLocaleString('en-IN')}</div>
              <div className={`text-[10px] mt-1 ${textMutedClass}`}>From {receipts.length} receipts</div>
              <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500" style={{ width: '72%' }} />
              </div>
              <div className={`text-[9px] mt-1 ${textMutedClass}`}>72% of monthly target</div>
            </div>

            {/* Attendance Summary */}
            <div className={`${panelBg} p-5`}>
              <h4 className="font-black text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />Attendance Today
              </h4>
              <div className="text-2xl font-black text-blue-600">2,311 <span className="text-base font-medium text-slate-400">/ 2,548</span></div>
              <div className={`text-[10px] mt-1 ${textMutedClass}`}>90.7% present — 237 absent</div>
              <div className="mt-3 h-2 rounded-full bg-slate-200 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-blue-400 to-indigo-500" style={{ width: '90.7%' }} />
              </div>
              <div className={`text-[9px] mt-1 ${textMutedClass}`}>Classes I–X combined</div>
            </div>

            {/* Pending Actions */}
            <div className={`${panelBg} p-5`}>
              <h4 className="font-black text-xs uppercase tracking-wider mb-3 flex items-center gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />Pending Actions
              </h4>
              <div className="space-y-2">
                {[
                  { label: 'Fee Pending Students', count: 48, color: 'text-rose-600' },
                  { label: 'Unread Circulars', count: 3, color: 'text-amber-600' },
                  { label: 'Leave Applications', count: 7, color: 'text-blue-600' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className={`text-[11px] font-medium ${textMutedClass}`}>{item.label}</span>
                    <span className={`text-sm font-black ${item.color}`}>{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Performance Bar Chart */}
          <div className={`${panelBg} p-6`}>
            <h3 className="font-black text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Annual Enrollment & Grade Pass Rate
            </h3>
            <p className={`text-[11px] mb-5 ${textMutedClass}`}>Session-wise pass percentage — hover bars for values</p>
            <div className="h-56 flex items-end gap-4 sm:gap-8 border-b border-l border-slate-500/15 px-4 relative">
              <div className={`absolute left-2 top-1 text-[9px] font-mono ${textMutedClass}`}>100%</div>
              <div className={`absolute left-2 top-1/2 text-[9px] font-mono ${textMutedClass}`}>50%</div>
              {[
                { year: '2022-23', pct: 78, color: 'from-indigo-600 to-indigo-400' },
                { year: '2023-24', pct: 84, color: 'from-amber-500 to-yellow-400' },
                { year: '2024-25', pct: 91, color: 'from-orange-500 to-orange-400' },
                { year: '2025-26', pct: 97, color: 'from-emerald-500 to-teal-400' },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                  <div
                    className={`w-full bg-gradient-to-t ${bar.color} rounded-t-lg relative group transition-all duration-300 hover:brightness-110 cursor-default`}
                    style={{ height: `${bar.pct}%` }}
                  >
                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white px-2 py-0.5 rounded shadow whitespace-nowrap">
                      {bar.pct}% Pass Rate
                    </span>
                  </div>
                  <span className={`text-[9px] mt-2 font-bold font-mono ${textMutedClass}`}>{bar.year}</span>
                </div>
              ))}
            </div>
            <div className={`mt-3 flex items-center gap-3 text-[10px] ${textMutedClass}`}>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full inline-block" /> CBSE Board Pass Rate</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 bg-indigo-500 rounded-full inline-block" /> MP State Enrollment</span>
              <span className="ml-auto font-semibold">Last sync: Real-time DB</span>
            </div>
          </div>

          {/* Subject-wise Performance Table */}
          <div className={`${panelBg} p-6`}>
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-500" />
              Subject-wise Performance (Current Session)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className={`${textMutedClass} text-[10px] uppercase tracking-wider border-b border-slate-500/10`}>
                    <th className="pb-2 text-left font-bold">Subject</th>
                    <th className="pb-2 text-center font-bold">Class Avg</th>
                    <th className="pb-2 text-center font-bold">Pass %</th>
                    <th className="pb-2 text-center font-bold">Top Score</th>
                    <th className="pb-2 font-bold">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-500/10">
                  {[
                    { sub: 'Mathematics', avg: 76, pass: 88, top: 99, trend: '+5%' },
                    { sub: 'Science', avg: 81, pass: 92, top: 100, trend: '+3%' },
                    { sub: 'English', avg: 79, pass: 95, top: 98, trend: '+7%' },
                    { sub: 'Hindi', avg: 85, pass: 97, top: 100, trend: '+2%' },
                    { sub: 'Social Studies', avg: 82, pass: 93, top: 97, trend: '+4%' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-500/5 transition">
                      <td className="py-2 font-bold">{row.sub}</td>
                      <td className="py-2 text-center font-mono">{row.avg}%</td>
                      <td className="py-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <div className="w-16 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-500" style={{ width: `${row.pass}%` }} />
                          </div>
                          <span className="font-mono text-[10px]">{row.pass}%</span>
                        </div>
                      </td>
                      <td className="py-2 text-center font-mono font-black text-indigo-500">{row.top}</td>
                      <td className="py-2 font-bold text-emerald-600 text-[10px]">↑ {row.trend}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════ STUDENTS ══════════════════════════════ */}
      {erpSubTab === 'students' && (
        <div className="space-y-5">
          {/* Filters Bar */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, ID, or class…"
                value={studentSearch}
                onChange={e => setStudentSearch(e.target.value)}
                className={`${inputCls} pl-9`}
              />
            </div>
            <select value={studentFilter} onChange={e => setStudentFilter(e.target.value as any)} className={`${inputCls} w-auto`}>
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </select>
            <select value={feeFilter} onChange={e => setFeeFilter(e.target.value as any)} className={`${inputCls} w-auto`}>
              <option value="All">All Fees</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Partial">Partial</option>
            </select>
            <span className={`text-xs font-bold ${textMutedClass}`}>{filteredStudents.length} students</span>
          </div>

          {/* Student Table */}
          <div className={`${panelBg} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className={`text-[10px] uppercase tracking-wider border-b ${isGlass ? 'border-gray-100 bg-slate-50/60' : 'border-[#2C2C2E] bg-[#18181C]'}`}>
                    {['ID', 'Student', 'Class', 'Roll', 'Parent / Phone', 'Attendance', 'Fee', 'Marks', 'Status', ''].map((h, i) => (
                      <th key={i} className={`px-4 py-3 text-left font-bold ${textMutedClass}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className={`divide-y ${isGlass ? 'divide-gray-50' : 'divide-[#1C1C1F]'}`}>
                  {filteredStudents.map(s => (
                    <tr key={s.id} className={`transition hover:${isGlass ? 'bg-orange-50/40' : 'bg-[#18181C]'}`}>
                      <td className="px-4 py-3 font-mono text-[10px] text-indigo-500 font-bold">{s.id}</td>
                      <td className="px-4 py-3 font-bold whitespace-nowrap">{s.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap">{s.class}</td>
                      <td className="px-4 py-3 font-mono">{s.roll}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{s.parent}</p>
                        <p className={`text-[10px] ${textMutedClass}`}>{s.phone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="w-14 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${s.attendance >= 90 ? 'bg-emerald-500' : s.attendance >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: `${s.attendance}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-[10px]">{s.attendance}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${feeBadge(s.fee)}`}>{s.fee}</span>
                      </td>
                      <td className="px-4 py-3 font-mono font-black text-indigo-500">{s.marks}/100</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusBadge(s.status)}`}>{s.status}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setEditingStudent(s)}
                          className="p-1.5 rounded-lg hover:bg-indigo-500/10 text-indigo-500 transition"
                          title="Edit student"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <div className={`flex flex-col items-center justify-center py-12 ${textMutedClass}`}>
                  <Users className="w-10 h-10 mb-2 opacity-20" />
                  <p className="font-bold text-sm">No students match your filters.</p>
                </div>
              )}
            </div>
          </div>

          {/* Edit Student Modal */}
          {editingStudent && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className={`w-full max-w-md rounded-2xl p-6 shadow-2xl ${isGlass ? 'bg-white text-[#431407]' : 'bg-[#18181C] text-white border border-[#2C2C2E]'}`}>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-indigo-500" />Edit Student Record
                  </h3>
                  <button onClick={() => setEditingStudent(null)} className="p-1 hover:bg-rose-100 rounded-lg text-rose-500 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Full Name', key: 'name' },
                    { label: 'Class', key: 'class' },
                    { label: 'Roll No.', key: 'roll' },
                    { label: 'Parent Name', key: 'parent' },
                    { label: 'Phone', key: 'phone' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">{field.label}</label>
                      <input
                        type="text"
                        value={(editingStudent as any)[field.key]}
                        onChange={e => setEditingStudent({ ...editingStudent, [field.key]: e.target.value })}
                        className={inputCls}
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Fee Status</label>
                      <select
                        value={editingStudent.fee}
                        onChange={e => setEditingStudent({ ...editingStudent, fee: e.target.value as any })}
                        className={inputCls}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Partial">Partial</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Status</label>
                      <select
                        value={editingStudent.status}
                        onChange={e => setEditingStudent({ ...editingStudent, status: e.target.value as any })}
                        className={inputCls}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
                      setEditingStudent(null);
                    }}
                    className={primaryBtn}
                  >
                    <Save className="w-3.5 h-3.5 inline mr-1.5" />Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════ FEES ══════════════════════════════ */}
      {erpSubTab === 'fees' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Generator Panel */}
          <div className={`${panelBg} p-6`}>
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />Receipt Generator
            </h3>
            <form onSubmit={handleGenerateReceipt} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Student Full Name</label>
                <input type="text" value={feeStudent} onChange={e => setFeeStudent(e.target.value)} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Class</label>
                  <input type="text" value={feeClass} onChange={e => setFeeClass(e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Base Amount (₹)</label>
                  <input type="number" value={feeAmount} onChange={e => setFeeAmount(e.target.value)} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Discount (₹)</label>
                  <input type="number" value={feeDiscount} onChange={e => setFeeDiscount(e.target.value)} className={inputCls} placeholder="0" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Late Fee (₹)</label>
                  <input type="number" value={feeLateFee} onChange={e => setFeeLateFee(e.target.value)} className={inputCls} placeholder="0" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Fee Type</label>
                <select value={feeType} onChange={e => setFeeType(e.target.value)} className={inputCls}>
                  <option>Quarterly Tuition Fee</option>
                  <option>Annual Maintenance Charges</option>
                  <option>Transport / Bus Fee</option>
                  <option>Library & Resource Fee</option>
                  <option>Examination & Assessment Fee</option>
                  <option>Admission & Registration Charges</option>
                  <option>Sports & Cultural Activity Fee</option>
                  <option>Lab Usage & Science Kit Fee</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Payment Mode</label>
                <select value={feeMode} onChange={e => setFeeMode(e.target.value)} className={inputCls}>
                  <option>UPI</option>
                  <option>Cash</option>
                  <option>Cheque</option>
                  <option>Bank Transfer / NEFT</option>
                  <option>DD (Demand Draft)</option>
                </select>
              </div>

              {/* Net Amount Preview */}
              <div className={`p-3 rounded-xl border ${isGlass ? 'bg-emerald-50 border-emerald-100' : 'bg-emerald-900/10 border-emerald-800/20'}`}>
                <div className="flex justify-between text-[11px]">
                  <span className={textMutedClass}>Base Amount</span>
                  <span className="font-mono font-bold">₹ {parseFloat(feeAmount || '0').toLocaleString('en-IN')}</span>
                </div>
                {parseFloat(feeDiscount) > 0 && (
                  <div className="flex justify-between text-[11px] text-emerald-600">
                    <span>- Discount</span>
                    <span className="font-mono font-bold">₹ {parseFloat(feeDiscount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                {parseFloat(feeLateFee) > 0 && (
                  <div className="flex justify-between text-[11px] text-rose-600">
                    <span>+ Late Fee</span>
                    <span className="font-mono font-bold">₹ {parseFloat(feeLateFee).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-sm border-t border-emerald-200 mt-2 pt-2 text-emerald-700">
                  <span>Net Payable</span>
                  <span className="font-mono">₹ {(parseFloat(feeAmount || '0') - parseFloat(feeDiscount || '0') + parseFloat(feeLateFee || '0')).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button type="submit" className={primaryBtn}>
                <FileText className="w-3.5 h-3.5 inline mr-1.5" />Generate Receipt
              </button>
            </form>

            {/* Receipt Log */}
            <div className="mt-5 border-t pt-4 border-slate-500/10">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] font-bold uppercase tracking-wider">Receipt Log</h4>
                <span className={`text-[10px] ${textMutedClass}`}>{receipts.length} records</span>
              </div>
              <div className="relative mb-2">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search receipts…"
                  value={receiptSearch}
                  onChange={e => setReceiptSearch(e.target.value)}
                  className={`${inputCls} pl-8 text-[11px]`}
                />
              </div>
              <div className="space-y-2 max-h-52 overflow-y-auto">
                {filteredReceipts.map(r => (
                  <div
                    key={r.id}
                    onClick={() => setActiveReceipt(r)}
                    className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                      activeReceipt?.id === r.id
                        ? (isGlass ? 'bg-orange-50 border-[#F97316]/40' : 'bg-[#EA580C]/10 border-[#EA580C]/40')
                        : (isGlass ? 'bg-white/50 border-gray-100 hover:bg-white' : 'bg-[#18181C] border-[#2C2C2E] hover:bg-[#202024]')
                    }`}
                  >
                    <div>
                      <p className="font-bold">{r.student}</p>
                      <p className={`text-[10px] ${textMutedClass}`}>{r.type.slice(0, 22)}…</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold">₹{r.amount.toLocaleString('en-IN')}</p>
                      <p className="text-[9px] text-orange-500 font-mono">{r.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Receipt Preview */}
          <div className="lg:col-span-2 flex justify-center items-start">
            {activeReceipt ? (
              <div className="w-full max-w-[148mm] bg-white text-slate-800 p-8 border border-slate-200 shadow-xl rounded-2xl relative font-sans text-xs flex flex-col justify-between min-h-[520px]">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-500 via-indigo-500 to-purple-600 rounded-t-2xl" />
                <div>
                  {/* School Header */}
                  <div className="flex justify-between items-start border-b pb-4 mt-2">
                    <div>
                      <h4 className="font-serif font-extrabold text-sm uppercase text-slate-900 tracking-wide">SAINT XAVIER CONVENT</h4>
                      <p className="text-[10px] text-slate-500 leading-tight mt-0.5">Sector D, Scheme 74, Vijay Nagar, Indore — 452010</p>
                      <p className="text-[9px] text-slate-400 font-mono mt-0.5">DISE: 23260519102 | CBSE Affil. No: 1030015</p>
                      <p className="text-[9px] text-slate-400 mt-0.5">📞 0731-2550440 | ✉ admin@sxcindore.edu.in</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1.5 rounded-lg bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wide">✓ PAYMENT CLEARED</span>
                      <p className="text-[10px] font-mono text-slate-500 mt-2">Receipt No: <span className="font-black text-slate-800">{activeReceipt.id}</span></p>
                      <p className="text-[10px] font-mono text-slate-500">Date: <span className="font-black text-slate-800">{activeReceipt.date}</span></p>
                    </div>
                  </div>

                  {/* Student Info Grid */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-3 my-5">
                    {[
                      { label: 'Received From', value: activeReceipt.student },
                      { label: 'Class / Grade', value: activeReceipt.class },
                      { label: 'Payment Mode', value: activeReceipt.mode },
                      { label: 'Academic Session', value: '2025-26' },
                    ].map((f, i) => (
                      <div key={i}>
                        <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">{f.label}</span>
                        <span className="text-sm font-black text-slate-900">{f.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Fee Table */}
                  <table className="w-full border-collapse border border-slate-200 text-left">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="border border-slate-200 p-2 font-bold uppercase text-[9px] tracking-wider">Fee Particulars</th>
                        <th className="border border-slate-200 p-2 text-right font-bold uppercase text-[9px] tracking-wider w-28">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-200 p-2 font-medium">{activeReceipt.type}</td>
                        <td className="border border-slate-200 p-2 text-right font-mono font-bold">
                          {parseFloat(feeAmount || String(activeReceipt.amount)).toLocaleString('en-IN')}.00
                        </td>
                      </tr>
                      {(activeReceipt.discount ?? 0) > 0 && (
                        <tr className="text-emerald-700">
                          <td className="border border-slate-200 p-2 font-medium">Concession / Scholarship</td>
                          <td className="border border-slate-200 p-2 text-right font-mono">- {activeReceipt.discount?.toLocaleString('en-IN')}.00</td>
                        </tr>
                      )}
                      {(activeReceipt.late_fee ?? 0) > 0 && (
                        <tr className="text-rose-700">
                          <td className="border border-slate-200 p-2 font-medium">Late Payment Penalty</td>
                          <td className="border border-slate-200 p-2 text-right font-mono">+ {activeReceipt.late_fee?.toLocaleString('en-IN')}.00</td>
                        </tr>
                      )}
                      <tr className="bg-slate-100 font-black">
                        <td className="border border-slate-200 p-2 text-right text-xs uppercase tracking-wide">Total Paid</td>
                        <td className="border border-slate-200 p-2 text-right font-mono text-indigo-700 text-sm">₹ {activeReceipt.amount.toLocaleString('en-IN')}.00</td>
                      </tr>
                    </tbody>
                  </table>

                  <p className="text-[9px] text-slate-400 italic mt-4 leading-relaxed">
                    Declaration: This is an auto-generated digital receipt. Amount collected is non-refundable unless officially reversed by the Finance Office. For disputes, contact: finance@sxcindore.edu.in
                  </p>
                </div>

                {/* Signature Row */}
                <div className="flex justify-between items-end border-t pt-4 mt-6">
                  <div className="text-center text-[9px]">
                    <div className="border-b border-slate-300 h-6 w-24 mx-auto mb-1" />
                    <p className="text-slate-400 font-medium">Cashier / Accountant</p>
                  </div>
                  <div className="text-[9px] text-center text-slate-400">
                    <div className="w-12 h-12 border border-slate-200 rounded flex items-center justify-center mx-auto mb-1">
                      <span className="text-[8px] text-slate-300">SEAL</span>
                    </div>
                    Official Seal
                  </div>
                  <div className="text-center text-[9px]">
                    <div className="border-b border-slate-300 h-6 w-24 mx-auto mb-1" />
                    <p className="text-slate-400 font-medium">Principal / HOD</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-slate-400 text-center border-2 border-dashed border-slate-400/20 rounded-2xl w-full max-w-[148mm] min-h-[400px]">
                <FileText className="w-12 h-12 mb-3 opacity-20 text-indigo-500" />
                <p className="font-bold">No Receipt Selected</p>
                <p className="text-xs mt-1">Generate a new receipt or click one from the log.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════ TIMETABLE ══════════════════════════════ */}
      {erpSubTab === 'timetable' && (
        <div className={`${panelBg} p-6`}>
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b pb-4 border-slate-500/10">
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" />Weekly Timetable & Class Roster
              </h3>
              <p className={`text-[11px] mt-0.5 ${textMutedClass}`}>{timetableData[selectedDay].length} periods scheduled · {selectedDay}</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
                className={`${inputCls} w-auto text-[11px]`}
              >
                {['Class VI-A', 'Class VII-B', 'Class VIII-A', 'Class VIII-B', 'Class IX-A', 'Class X-B'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {/* Day Selector */}
              <div className="flex flex-wrap gap-1">
                {DAYS.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                      selectedDay === day
                        ? (isGlass ? 'bg-[#431407] text-[#FFF7ED]' : 'bg-[#EA580C] text-black')
                        : (isGlass ? 'bg-white/60 hover:bg-white text-[#431407]' : 'bg-[#1C1C1F] text-gray-400 hover:text-white border border-[#2C2C2E]')
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Timetable Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {timetableData[selectedDay].map((slot, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl border flex justify-between items-start gap-4 transition hover:shadow-md ${
                  isGlass ? 'bg-white border-gray-100 hover:border-orange-200' : 'bg-[#18181C] border-[#2C2C2E] hover:border-[#EA580C]/30'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold bg-indigo-500/10 text-indigo-600 tracking-tight">
                      {slot.time}
                    </span>
                    <span className={`px-2 py-0.5 rounded border text-[8px] font-bold ${getSubjectColor(slot.subject)}`}>
                      {slot.subject.split(' ')[0]}
                    </span>
                  </div>
                  <h4 className="text-sm font-black leading-tight">{slot.subject}</h4>
                  <p className="text-[11px] font-medium">
                    <span className={textMutedClass}>Room:</span>{' '}
                    <span className="font-bold text-orange-500">{slot.room}</span>
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[9px] font-bold uppercase tracking-wider ${textMutedClass}`}>Instructor</span>
                  <span className="text-xs font-black block mt-0.5 leading-tight">{slot.teacher}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Period Summary */}
          <div className={`mt-5 p-4 rounded-xl border ${isGlass ? 'bg-slate-50 border-slate-100' : 'bg-[#18181C] border-[#2C2C2E]'}`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { label: 'Total Periods', value: timetableData[selectedDay].length, icon: Clock },
                { label: 'Total Hours', value: `${timetableData[selectedDay].length * 0.75}h`, icon: Activity },
                { label: 'Labs Scheduled', value: timetableData[selectedDay].filter(s => s.room.includes('Lab')).length, icon: BookOpen },
                { label: 'PE / Outdoor', value: timetableData[selectedDay].filter(s => s.room === 'Playground').length, icon: Star },
              ].map((m, i) => (
                <div key={i}>
                  <m.icon className={`w-4 h-4 mx-auto mb-1 ${textMutedClass}`} />
                  <div className="text-lg font-black">{m.value}</div>
                  <div className={`text-[9px] font-bold uppercase ${textMutedClass}`}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════ NOTICES ══════════════════════════════ */}
      {erpSubTab === 'notices' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Creator Panel */}
          <div className={`${panelBg} p-6`}>
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-orange-500" />Publish Circular
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Notice Content</label>
                <textarea
                  value={newNoticeTitle}
                  onChange={e => setNewNoticeTitle(e.target.value)}
                  rows={3}
                  placeholder="e.g. Science Fair scheduled for 25th June. All classes VI–X must enroll by 20th June."
                  className={`${inputCls} resize-none`}
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Issued By</label>
                <input type="text" value={newNoticeAuthor} onChange={e => setNewNoticeAuthor(e.target.value)} className={inputCls} placeholder="Admin Office" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Priority</label>
                  <select value={newNoticePriority} onChange={e => setNewNoticePriority(e.target.value as any)} className={inputCls}>
                    <option value="HIGH">🔴 HIGH</option>
                    <option value="MEDIUM">🟡 MEDIUM</option>
                    <option value="LOW">🔵 LOW</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider block mb-1">Category</label>
                  <select value={newNoticeCat} onChange={e => setNewNoticeCat(e.target.value)} className={inputCls}>
                    <option value="ADMIN">ADMIN</option>
                    <option value="EXAMS">EXAMS</option>
                    <option value="EVENTS">EVENTS</option>
                    <option value="SPORTS">SPORTS</option>
                    <option value="HOLIDAY">HOLIDAY</option>
                    <option value="HEALTH">HEALTH</option>
                  </select>
                </div>
              </div>
              <button onClick={addNotice} className={primaryBtn}>
                <Bell className="w-3.5 h-3.5 inline mr-1.5" />Broadcast Notice
              </button>
            </div>

            {/* Filter Controls */}
            <div className="mt-6 pt-4 border-t border-slate-500/10 space-y-2">
              <h4 className="text-[10px] font-bold uppercase tracking-wider">Filter Board</h4>
              <select value={noticeFilterCat} onChange={e => setNoticeFilterCat(e.target.value)} className={inputCls}>
                <option value="ALL">All Categories</option>
                {['ADMIN', 'EXAMS', 'EVENTS', 'SPORTS', 'HOLIDAY', 'HEALTH'].map(c => <option key={c}>{c}</option>)}
              </select>
              <select value={noticeFilterPri} onChange={e => setNoticeFilterPri(e.target.value)} className={inputCls}>
                <option value="ALL">All Priorities</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
              <div className={`text-[10px] font-medium ${textMutedClass}`}>
                Showing {filteredNotices.length} of {notices.length} notices
              </div>
            </div>
          </div>

          {/* Bulletin Board */}
          <div className={`lg:col-span-2 ${panelBg} p-6`}>
            <h3 className="font-black text-sm uppercase tracking-wider mb-4 flex items-center gap-2 border-b pb-3 border-slate-500/10">
              <Bell className="w-4 h-4 text-amber-500" />Official Bulletin Board
            </h3>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {filteredNotices.map(notice => (
                <div
                  key={notice.id}
                  className={`p-4 rounded-xl border relative transition hover:-translate-y-0.5 ${
                    notice.pinned
                      ? (isGlass ? 'bg-orange-50 border-orange-200' : 'bg-orange-900/10 border-orange-800/30')
                      : (isGlass ? 'bg-white border-gray-100' : 'bg-[#18181C] border-[#2C2C2E]')
                  }`}
                >
                  {notice.pinned && (
                    <span className="absolute top-3 right-10 text-[8px] font-black uppercase text-orange-500 tracking-wide">📌 PINNED</span>
                  )}
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${priorityBadge(notice.priority)}`}>
                        {notice.priority}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-wide ${textMutedClass}`}>
                        📂 {notice.category}
                      </span>
                      {notice.author && (
                        <span className={`text-[9px] font-medium ${textMutedClass}`}>— {notice.author}</span>
                      )}
                    </div>
                    <span className={`text-[10px] font-mono font-bold shrink-0 ${textMutedClass}`}>{notice.date}</span>
                  </div>

                  <p className="text-xs font-bold leading-relaxed pr-6">{notice.title}</p>

                  <div className="flex items-center gap-1 absolute right-3 bottom-3">
                    <button
                      onClick={() => togglePin(notice.id)}
                      title={notice.pinned ? 'Unpin' : 'Pin to top'}
                      className={`p-1 rounded-lg transition ${notice.pinned ? 'text-orange-500 hover:bg-orange-100' : `${textMutedClass} hover:bg-slate-100`}`}
                    >
                      <Star className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeNotice(notice.id)}
                      className="p-1 hover:bg-rose-100 rounded-lg text-rose-500 transition"
                      title="Remove notice"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}

              {filteredNotices.length === 0 && (
                <div className={`flex flex-col items-center justify-center py-12 ${textMutedClass}`}>
                  <Bell className="w-10 h-10 mb-2 opacity-20" />
                  <p className="font-bold text-sm">No notices match your filters.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
