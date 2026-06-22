import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { speakText } from '../utils/tts';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, BookOpen, Users, Video, Camera, Calendar, 
  Clock, ShieldCheck, ArrowRight, Award, Bell, MapPin, Phone, Mail,
  CheckCircle2, XCircle, Sparkles, User, Lock, Key, LogOut, MessageSquare,
  Send, FileText, CheckCircle, AlertCircle, Play, Volume2, UserCheck, Smartphone, Check, HelpCircle,
  Facebook, Youtube, Instagram, Twitter, Star
} from 'lucide-react';
import ParentDashboard from './ParentDashboard';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import DigitalLibraryTab from './DigitalLibraryTab';
import ParticleBackground from './ParticleBackground';
import {
  CAMPUS_HUB_STORAGE_KEY,
  DEFAULT_CAMPUS_HUB_ITEMS,
  DEFAULT_SOCIAL_LINKS,
  SOCIAL_LINKS_STORAGE_KEY,
  getSocialIcon,
  loadSettings,
  type CampusHubItem,
  type SocialLinkSetting
} from '../settings';

interface PortalsTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
  initialSubTab?: string;
  lang?: any;
}

export default function PortalsTab({ theme = 'glassNavy', initialSubTab = 'home', lang = 'en' }: PortalsTabProps) {
  const { t, i18n } = useTranslation();
  const isGlass = theme === 'glassNavy';
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLinkSetting[]>(() =>
    loadSettings(SOCIAL_LINKS_STORAGE_KEY, DEFAULT_SOCIAL_LINKS)
  );
  const [campusHubItems, setCampusHubItems] = useState<CampusHubItem[]>(() =>
    loadSettings(CAMPUS_HUB_STORAGE_KEY, DEFAULT_CAMPUS_HUB_ITEMS)
  );

  // --- Login States ---
  const [isParentLoggedIn, setIsParentLoggedIn] = useState(() => {
    return localStorage.getItem('sxc_parent_logged_in') === 'true';
  });
  const [isStudentLoggedIn, setIsStudentLoggedIn] = useState(() => {
    return localStorage.getItem('sxc_student_logged_in') === 'true';
  });
  const [isTeacherLoggedIn, setIsTeacherLoggedIn] = useState(() => {
    return localStorage.getItem('sxc_teacher_logged_in') === 'true';
  });

  const [studentsList, setStudentsList] = useState(() => {
    const saved = localStorage.getItem('sxc_all_marksheets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'mk-default',
        rollNo: '24',
        scholarsNo: 'A-4928',
        name: 'AYAN KHAN',
        fatherName: 'MR. AMIR KHAN',
        motherName: 'MRS. FARAH KHAN',
        className: 'CLASS VIII',
        section: 'A',
        dob: '2012-05-14',
        session: '2025-26',
        attendance: '194/210',
        height: '145 cm',
        weight: '38 kg',
        disciplineGrade: 'A',
        remarks: 'Excellent concentration and diligent academic performance in standard curriculum.',
        subjects: [
          { name: 'Hindi', maxTheory: 140, obtTheory: 120, monthlyTestObt: 18, terminalObt: 44, halfObt: 43, projectObt: 15 },
          { name: 'English', maxTheory: 140, obtTheory: 115, monthlyTestObt: 16, terminalObt: 41, halfObt: 42, projectObt: 16 },
          { name: 'Mathematics', maxTheory: 140, obtTheory: 132, monthlyTestObt: 19, terminalObt: 47, halfObt: 46, projectObt: 20 },
          { name: 'Science', maxTheory: 140, obtTheory: 128, monthlyTestObt: 18, terminalObt: 45, halfObt: 45, projectObt: 20 },
          { name: 'Social Science', maxTheory: 140, obtTheory: 121, monthlyTestObt: 17, terminalObt: 43, halfObt: 42, projectObt: 19 },
          { name: 'General Knowledge', maxTheory: 140, obtTheory: 95, monthlyTestObt: 15, terminalObt: 30, halfObt: 30, projectObt: 20 }
        ]
      },
      {
        id: 'mk-sample-2',
        rollNo: '12',
        scholarsNo: 'A-5014',
        name: 'KABIR GUPTA',
        fatherName: 'MR. ANIL GUPTA',
        motherName: 'MRS. NISHA GUPTA',
        className: 'CLASS V',
        section: 'B',
        dob: '2015-09-02',
        session: '2025-26',
        attendance: '204/210',
        height: '138 cm',
        weight: '32 kg',
        disciplineGrade: 'A',
        remarks: 'Consistent academic performer, very quiet and highly analytical.',
        subjects: [
          { name: 'Hindi', maxTheory: 140, obtTheory: 126, monthlyTestObt: 18, terminalObt: 45, halfObt: 45, projectObt: 18 },
          { name: 'English', maxTheory: 140, obtTheory: 121, monthlyTestObt: 17, terminalObt: 43, halfObt: 43, projectObt: 18 },
          { name: 'Mathematics', maxTheory: 140, obtTheory: 138, monthlyTestObt: 20, terminalObt: 49, halfObt: 49, projectObt: 20 },
          { name: 'Science', maxTheory: 140, obtTheory: 133, monthlyTestObt: 19, terminalObt: 47, halfObt: 48, projectObt: 19 },
          { name: 'Social Science', maxTheory: 140, obtTheory: 127, monthlyTestObt: 18, terminalObt: 46, halfObt: 45, projectObt: 18 },
          { name: 'General Knowledge', maxTheory: 140, obtTheory: 80, monthlyTestObt: 16, terminalObt: 24, halfObt: 24, projectObt: 16 }
        ]
      },
      {
        id: 'mk-sample-3',
        rollNo: '37',
        scholarsNo: 'A-4839',
        name: 'DIVYA SINHA',
        fatherName: 'MR. AMIT SINHA',
        motherName: 'MRS. KANCHAN SINHA',
        className: 'CLASS VII',
        section: 'A',
        dob: '2013-11-20',
        session: '2025-26',
        attendance: '188/210',
        height: '142 cm',
        weight: '35 kg',
        disciplineGrade: 'A',
        remarks: 'Divya shows excellent leadership features and participates enthusiastically in assignments.',
        subjects: [
          { name: 'Hindi', maxTheory: 140, obtTheory: 110, monthlyTestObt: 15, terminalObt: 40, halfObt: 40, projectObt: 15 },
          { name: 'English', maxTheory: 140, obtTheory: 130, monthlyTestObt: 19, terminalObt: 46, halfObt: 47, projectObt: 18 },
          { name: 'Mathematics', maxTheory: 140, obtTheory: 105, monthlyTestObt: 14, terminalObt: 36, halfObt: 37, projectObt: 18 },
          { name: 'Science', maxTheory: 140, obtTheory: 122, monthlyTestObt: 17, terminalObt: 43, halfObt: 43, projectObt: 19 },
          { name: 'Social Science', maxTheory: 140, obtTheory: 118, monthlyTestObt: 16, terminalObt: 42, halfObt: 42, projectObt: 18 },
          { name: 'General Knowledge', maxTheory: 140, obtTheory: 100, monthlyTestObt: 18, terminalObt: 35, halfObt: 35, projectObt: 12 }
        ]
      }
    ];
  });

  const [activeChildId, setActiveChildId] = useState(() => {
    return localStorage.getItem('sxc_parent_active_child_id') || 'mk-default';
  });

  const activeChild = studentsList.find(s => s.id === activeChildId) || studentsList[0];

  const [dashboardTab, setDashboardTab] = useState('progress');

  // Load chat logs specific to each selected child layout
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Initialize messages for parent teacher chat based on active child
  useEffect(() => {
    const saved = localStorage.getItem(`sxc_parent_chat_${activeChildId}`);
    if (saved) {
      try {
        setChatMessages(JSON.parse(saved));
        return;
      } catch (e) {}
    }
    setChatMessages([
      { id: 'm1', sender: 'teacher', text: `Welcome to Saint Xavier Convent Virtual Parent Helpdesk! This is Mrs. Archana Dubey, Senior Class Coordinator for ${activeChild?.name}'s standard (${activeChild?.className}-${activeChild?.section || 'A'}). Here you can directly sync guidelines, register class feedback, or inquire about assignments. How may I assist you today?`, timestamp: '09:00 AM' }
    ]);
  }, [activeChildId, activeChild?.name, activeChild?.className, activeChild?.section]);

  const [liveStreamMessages, setLiveStreamMessages] = useState<any[]>([
    { id: 1, sender: 'Teacher (Live)', text: 'Good morning students! Today we are discussing practical applications of energy conservation.', time: '09:35 AM' },
    { id: 2, sender: 'Abhishek Roy', text: 'Present Maam! Looking forward to physics session numerical challenges.', time: '09:36 AM' },
    { id: 3, sender: 'Shreya Patel', text: 'Are these topics covered in the upcoming terminal exams?', time: '09:37 AM' },
  ]);
  const [liveInput, setLiveInput] = useState('');

  // Mock Homework Data
  const [homeworkList, setHomeworkList] = useState(() => {
    return [
      { id: 'hw-1', subject: 'Mathematics', title: 'Chapter 5 Theory Examples', details: 'Complete exercise 5.2 (Questions 1 to 10) in your homework notebook.', due: 'Tomorrow, 10:00 AM', status: 'Pending', requiredForGrading: 'High Priority' },
      { id: 'hw-2', subject: 'Science / Physics', title: 'Thermal Energy Diagram', details: 'Draw the heat radiation graph with labels as explained in lecture video.', due: 'In 2 days', status: 'Submitted', requiredForGrading: 'Standard' },
      { id: 'hw-3', subject: 'English Grammar', title: 'Creative Writing Task', details: 'Write a 250-word story starting with "The unexpected storm..." using complex adjectives.', due: 'Next Monday', status: 'Pending', requiredForGrading: 'Medium Priority' }
    ];
  });

  const [notices, setNotices] = useState([
    { id: 'n1', date: 'June 15, 2026', tag: 'Academic', title: 'First Terminal Board Examinations Schedule', desc: 'SXC schedule for the upcoming First Terminal exams across classes I-X has been updated. Please check the school board for detailed worksheets.' },
    { id: 'n2', date: 'June 10, 2026', tag: 'Activities', title: 'Annual Inter-House Sports & Yoga Camp', desc: 'Sports registrations are officially open at the physical education desk. All student entries should be signed off by a parent.' },
    { id: 'n3', date: 'June 05, 2026', tag: 'Administration', title: 'Monsoon Uniform Guidelines & Bus Timings', desc: 'Given heavy rainfall alerts around Scheme 78, buses will run 15 minutes early. Parents are advised to make suitable pick-up arrangements.' }
  ]);

  useEffect(() => {
    const refreshPublicSettings = () => {
      setSocialLinks(loadSettings(SOCIAL_LINKS_STORAGE_KEY, DEFAULT_SOCIAL_LINKS));
      setCampusHubItems(loadSettings(CAMPUS_HUB_STORAGE_KEY, DEFAULT_CAMPUS_HUB_ITEMS));
    };
    window.addEventListener('sxc_public_settings_changed', refreshPublicSettings);
    window.addEventListener('storage', refreshPublicSettings);
    return () => {
      window.removeEventListener('sxc_public_settings_changed', refreshPublicSettings);
      window.removeEventListener('storage', refreshPublicSettings);
    };
  }, []);

  // 1. School Home Concept
  if (initialSubTab === 'home') {
    return (
      <div className={`rounded-3xl overflow-hidden ${isGlass ? 'text-[#431407]' : 'text-white'}`}>
        {/* Hero Section */}
        <div className={`relative px-8 py-24 flex flex-col items-center justify-center text-center overflow-hidden ${isGlass ? 'bg-linear-to-br from-[#FFEDD5] via-[#FEEBD8] to-[#FED7AA]' : 'bg-linear-to-br from-[#022c22] via-[#064e3b] to-[#0f172a]'}`}>
          <ParticleBackground isGlass={isGlass} />
          {/* Animated Background Orbs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className={`absolute -top-20 -left-20 w-96 h-96 rounded-full blur-[100px] opacity-40 animate-pulse-glow ${isGlass ? 'bg-[#F97316]' : 'bg-[#10B981]'}`}></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-120 h-120 rounded-full blur-[120px] opacity-30 animate-pulse-glow bg-[#3B82F6]" style={{ animationDelay: '1.5s' }}></div>
          </div>
          
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
          
          {/* Floating Icons */}
          <div className="absolute inset-0 pointer-events-none">
            <GraduationCap className={`absolute top-1/4 left-1/4 w-12 h-12 opacity-30 animate-float ${isGlass ? 'text-[#F97316]' : 'text-[#EA580C]'}`} />
            <BookOpen className={`absolute bottom-1/4 right-1/4 w-10 h-10 opacity-30 animate-float-delayed ${isGlass ? 'text-blue-500' : 'text-blue-400'}`} />
            <Sparkles className={`absolute top-1/3 right-1/3 w-8 h-8 opacity-40 animate-pulse-glow ${isGlass ? 'text-amber-500' : 'text-amber-400'}`} />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <div className={`w-24 h-24 mb-8 rounded-3xl flex items-center justify-center shadow-2xl animate-float ${isGlass ? 'bg-white shadow-[#F97316]/20' : 'bg-[#1C1C1F] shadow-[#EA580C]/20 border border-white/10'}`}>
              <GraduationCap className={`w-14 h-14 ${isGlass ? 'text-[#F97316]' : 'text-[#EA580C]'}`} />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight animate-slideUp">
              <span className={`text-transparent bg-clip-text bg-linear-to-r ${isGlass ? 'from-[#431407] via-[#F97316] to-[#431407]' : 'from-white via-[#EA580C] to-white'} animate-shimmer`} style={{ backgroundSize: '200% auto' }}>
                Saint Xavier Convent
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl font-medium max-w-3xl opacity-80 mb-10 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              {t('heroTagline')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <button 
                onClick={() => {
                  const studentName = prompt(t('promptEnterStudentName'));
                  if (!studentName) return;
                  const fatherName = prompt(t('promptFatherName'));
                  if (!fatherName) return;
                  const classTarget = prompt(t('promptTargetClass'));
                  if (!classTarget) return;
                  
                  const pastRecords = JSON.parse(localStorage.getItem('sxc_all_admissions') || '[]');
                  const newApp = {
                    id: `adm-${Date.now()}`,
                    docketNo: `SXC-REG-2026-${studentName.slice(0, 3).toUpperCase()}-${Math.floor(100+Math.random()*899)}`,
                    name: studentName.toUpperCase(),
                    fatherName: fatherName.toUpperCase(),
                    motherName: '',
                    dob: '2020-01-01',
                    classTarget,
                    prevSchool: '',
                    address: '',
                    phone: '',
                    email: '',
                    photoUrl: null,
                    enrollmentDate: new Date().toISOString().split('T')[0]
                  };
                  pastRecords.push(newApp);
                  localStorage.setItem('sxc_all_admissions', JSON.stringify(pastRecords));
                  confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#F97316', '#EA580C', '#ffffff']
                  });
                  alert(t('alertAdmissionSuccess'));
                }}
                className={`px-8 py-4 rounded-full text-lg font-bold flex items-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${isGlass ? 'bg-linear-to-r from-[#F97316] to-orange-400 text-white shadow-orange-400/30' : 'bg-linear-to-r from-[#EA580C] to-rose-500 text-black shadow-rose-500/30'}`}
              >
                {t('applyForAdmission')} <ArrowRight className="w-5 h-5 animate-pulse" />
              </button>
              <button 
                onClick={() => {
                  const name = prompt(t('promptTourName'));
                  if (!name) return;
                  const date = prompt(t('promptTourDate'));
                  if (!date) return;
                  const phone = prompt(t('promptTourPhone'));
                  if (!phone) return;
                  const pastRecords = JSON.parse(localStorage.getItem('sxc_campus_tours') || '[]');
                  pastRecords.push({ id: `tour-${Date.now()}`, name, date, phone, status: 'Pending' });
                  localStorage.setItem('sxc_campus_tours', JSON.stringify(pastRecords));
                  confetti({
                    particleCount: 100,
                    spread: 60,
                    origin: { y: 0.6 },
                    colors: ['#F6E05E', '#D69E2E', '#ffffff']
                  });
                  alert(t('alertTourSuccess'));
                }}
                className={`px-8 py-4 rounded-full text-lg font-bold flex items-center gap-3 transition-all duration-300 hover:-translate-y-1 border backdrop-blur-md ${isGlass ? 'bg-white/40 border-white/60 hover:bg-white/60 shadow-sm' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
              >
                <Video className="w-5 h-5" /> {t('campusTour')}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 sm:px-8 -mt-8 relative z-20">
          {[
            { label: t('statPassRate'), value: '100%', icon: Award, color: 'text-amber-500' },
            { label: t('statStudents'), value: '2,500+', icon: Users, color: 'text-blue-500' },
            { label: t('statCourses'), value: '50+', icon: BookOpen, color: 'text-purple-500' },
            { label: t('statEst'), value: '1995', icon: CheckCircle2, color: 'text-rose-500' },
          ].map((stat, i) => (
            <div key={i} className={`p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-2 ${isGlass ? 'bg-white/90 shadow-lg border border-white/50 backdrop-blur-xl' : 'bg-[#1C1C1F] border border-white/10 shadow-2xl'}`}>
              <stat.icon className={`w-8 h-8 mb-3 ${stat.color} animate-pulse-glow`} />
              <div className="text-3xl font-black mb-1">{stat.value}</div>
              <div className="text-sm font-bold opacity-60 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Campus Tour Video Hub */}
        <div className="px-6 sm:px-8 mt-14 animate-slideUp">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black flex items-center gap-3">
                <Video className="w-8 h-8 text-red-500" />
                {t('campusTourVideoHub')}
              </h2>
              <p className="text-sm opacity-60 mt-2 font-medium">{t('campusTourSubtitle')}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campusHubItems.map(item => (
              <div key={item.id} className={`overflow-hidden rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-2xl ${isGlass ? 'bg-white/80 border-white/50' : 'bg-[#1C1C1F] border-white/10'}`}>
                <div className="relative aspect-video overflow-hidden">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
                  <div className="absolute left-4 bottom-4 w-11 h-11 rounded-full bg-white/90 text-red-500 flex items-center justify-center shadow-lg">
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-black mb-2">{item.title}</h3>
                  <p className="text-sm opacity-70 font-medium leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Heroes & Stars Section */}
        <div className="px-6 sm:px-8 mt-16 animate-slideUp">
          <div className={`p-8 sm:p-10 rounded-3xl border ${isGlass ? 'bg-white/60 border-white/40 backdrop-blur-xl' : 'bg-[#1C1C1F]/60 border-white/10 backdrop-blur-xl'} shadow-xl`}>
            <div className="flex items-center justify-center gap-3 mb-10">
              <Star className="w-8 h-8 text-amber-500 fill-amber-500 animate-pulse-glow" />
              <h2 className="text-3xl md:text-4xl font-black text-center">{t('hallOfFame')}</h2>
              <Star className="w-8 h-8 text-amber-500 fill-amber-500 animate-pulse-glow" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-10">
              {/* Star of the Week */}
              <div className="flex flex-col items-center justify-center text-center group">
                <div className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full p-2 mb-6 transition-transform duration-500 group-hover:scale-105 ${isGlass ? 'bg-linear-to-tr from-rose-400 to-orange-400' : 'bg-linear-to-tr from-rose-500 to-orange-500'} shadow-lg`}>
                  <img src="https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&q=80&w=300&h=300" referrerPolicy="no-referrer" alt="Star of the Week" className="w-full h-full object-cover rounded-full border-4 border-white dark:border-[#1C1C1F]" />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white uppercase tracking-widest text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                    {t('starOfWeek')}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Kabir Mehra</h3>
                <p className="text-sm opacity-70 font-medium">Class V • Outstanding Creativity</p>
              </div>

              {/* Our Hero */}
              <div className="flex flex-col items-center justify-center text-center group md:-mt-8">
                <div className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-2 mb-6 transition-transform duration-500 group-hover:scale-105 ${isGlass ? 'bg-linear-to-tr from-amber-300 to-yellow-500' : 'bg-linear-to-tr from-amber-400 to-yellow-600'} shadow-2xl`}>
                  <img src="https://images.unsplash.com/photo-1577880216142-8549e9488dad?auto=format&fit=crop&q=80&w=300&h=300" referrerPolicy="no-referrer" alt="Our Hero" className="w-full h-full object-cover rounded-full border-4 border-white dark:border-[#1C1C1F]" />
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-amber-500 text-white uppercase tracking-widest text-xs font-black px-6 py-2 rounded-full shadow-lg whitespace-nowrap">
                    {t('ourHero')}
                  </div>
                  <Award className="absolute -top-3 -right-3 w-12 h-12 text-amber-500 drop-shadow-md" />
                </div>
                <h3 className="text-2xl font-black mb-1 text-amber-600 dark:text-amber-500">Ayan Khan</h3>
                <p className="text-sm opacity-80 font-bold mb-2">{t('heroAchievement')}</p>
                <p className="text-xs opacity-60 font-medium max-w-xs mx-auto">{t('heroDesc')}</p>
              </div>

              {/* Star of the Month */}
              <div className="flex flex-col items-center justify-center text-center group">
                <div className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full p-2 mb-6 transition-transform duration-500 group-hover:scale-105 ${isGlass ? 'bg-linear-to-tr from-teal-400 to-emerald-400' : 'bg-linear-to-tr from-orange-400 to-rose-500'} shadow-lg`}>
                  <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300" referrerPolicy="no-referrer" alt="Star of the Month" className="w-full h-full object-cover rounded-full border-4 border-white dark:border-[#1C1C1F]" />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white uppercase tracking-widest text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                    {t('starOfMonth')}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Divya Sharma</h3>
                <p className="text-sm opacity-70 font-medium">Class VII • Perfect Attendance & Academics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 mt-4">
          {/* News Card */}
          <div className={`group p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isGlass ? 'bg-white/70 border-white/50 backdrop-blur-lg hover:bg-white/90' : 'bg-[#1C1C1F]/80 border-white/10 backdrop-blur-lg hover:bg-[#2C2C2E]/90'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6 ${isGlass ? 'bg-amber-100 text-amber-600' : 'bg-amber-500/20 text-amber-500'}`}>
              <Bell className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black mb-4">{t('latestNews')}</h3>
            <ul className="space-y-4 opacity-80 font-medium">
              <li className="flex items-start gap-3 group/item">
                <span className="text-amber-500 mt-1 transition-transform group-hover/item:translate-x-1">→</span> 
                <span className="group-hover/item:text-amber-500 transition-colors">{t('news1')}</span>
              </li>
              <li className="flex items-start gap-3 group/item">
                <span className="text-amber-500 mt-1 transition-transform group-hover/item:translate-x-1">→</span> 
                <span className="group-hover/item:text-amber-500 transition-colors">{t('news2')}</span>
              </li>
              <li className="flex items-start gap-3 group/item">
                <span className="text-amber-500 mt-1 transition-transform group-hover/item:translate-x-1">→</span> 
                <span className="group-hover/item:text-amber-500 transition-colors">{t('news3')}</span>
              </li>
            </ul>
          </div>
          
          {/* Achievements Card */}
          <div className={`group p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isGlass ? 'bg-white/70 border-white/50 backdrop-blur-lg hover:bg-white/90' : 'bg-[#1C1C1F]/80 border-white/10 backdrop-blur-lg hover:bg-[#2C2C2E]/90'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:-rotate-6 ${isGlass ? 'bg-purple-100 text-purple-600' : 'bg-purple-500/20 text-purple-500'}`}>
              <Award className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black mb-4">{t('achievements')}</h3>
            <ul className="space-y-4 opacity-80 font-medium">
              <li className="flex items-start gap-3 group/item">
                <span className="text-purple-500 mt-1 transition-transform group-hover/item:translate-x-1">★</span> 
                <span className="group-hover/item:text-purple-500 transition-colors">{t('achievement1')}</span>
              </li>
              <li className="flex items-start gap-3 group/item">
                <span className="text-purple-500 mt-1 transition-transform group-hover/item:translate-x-1">★</span> 
                <span className="group-hover/item:text-purple-500 transition-colors">{t('achievement2')}</span>
              </li>
              <li className="flex items-start gap-3 group/item">
                <span className="text-purple-500 mt-1 transition-transform group-hover/item:translate-x-1">★</span> 
                <span className="group-hover/item:text-purple-500 transition-colors">{t('achievement3')}</span>
              </li>
            </ul>
          </div>

          {/* Contact Card */}
          <div className={`group p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isGlass ? 'bg-white/70 border-white/50 backdrop-blur-lg hover:bg-white/90' : 'bg-[#1C1C1F]/80 border-white/10 backdrop-blur-lg hover:bg-[#2C2C2E]/90'}`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-6 ${isGlass ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-500'}`}>
              <MapPin className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black mb-4">{t('contactUs')}</h3>
            <div className="space-y-5 opacity-80 font-medium pb-4 border-b border-gray-500/10">
              <div className="flex items-start gap-4 group/item cursor-pointer">
                <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center transition-colors ${isGlass ? 'bg-blue-100 group-hover/item:bg-blue-200 text-blue-600' : 'bg-blue-500/20 group-hover/item:bg-blue-500/40 text-blue-400'}`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <p className="group-hover/item:text-blue-500 transition-colors text-xs sm:text-sm">100 Gandhi Gram Sabzi Market, Near Noor Masjid, Behind Thana Khajrana, Indore - 452016</p>
              </div>
              <div className="flex items-center gap-4 group/item cursor-pointer">
                <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center transition-colors ${isGlass ? 'bg-blue-100 group-hover/item:bg-blue-200 text-blue-600' : 'bg-blue-500/20 group-hover/item:bg-blue-500/40 text-blue-400'}`}>
                  <Phone className="w-4 h-4" />
                </div>
                <p className="group-hover/item:text-blue-500 transition-colors text-xs sm:text-sm">+91 9074322024, +91 7879957124</p>
              </div>
              <div className="flex items-center gap-4 group/item cursor-pointer">
                <div className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center transition-colors ${isGlass ? 'bg-blue-100 group-hover/item:bg-blue-200 text-blue-600' : 'bg-blue-500/20 group-hover/item:bg-blue-500/40 text-blue-400'}`}>
                  <Mail className="w-4 h-4" />
                </div>
                <p className="group-hover/item:text-blue-500 transition-colors text-xs sm:text-sm">info@saintxavierkhajrana.edu.in</p>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="mt-5">
              <p className="text-[10px] uppercase font-black tracking-wider opacity-60 mb-3 block">{t('socialLinks')}</p>
              <div className="flex flex-wrap gap-2">
                {socialLinks.filter(link => link.url.trim()).map(link => {
                  const Icon = getSocialIcon(link.id);
                  return (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="referrer noopener"
                      className={`p-2 py-1.5 rounded-lg border flex items-center gap-1.5 text-[10px] font-bold transition-all ${isGlass ? 'bg-white border-gray-200 hover:bg-gray-50' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                      style={{ color: link.color }}
                    >
                      <Icon className="w-3.5 h-3.5" /> {link.label}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Login Interfaces (Parent, Teacher, Student)
  if (initialSubTab === 'parent_login' || initialSubTab === 'teacher_login' || initialSubTab === 'student_login') {
    const roles = {
      parent_login: { title: 'Parent Portal', icon: Users, color: 'text-orange-400', bg: 'bg-orange-400/10' },
      teacher_login: { title: 'Teacher Portal', icon: BookOpen, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
      student_login: { title: 'Student Portal', icon: GraduationCap, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    };
    const role = roles[initialSubTab as keyof typeof roles];

    // Dashboards Logics
    if (initialSubTab === 'parent_login' && isParentLoggedIn) {
      const parentPortalLogoutRedirect = () => {
        localStorage.removeItem('sxc_parent_logged_in');
        setIsParentLoggedIn(false);
        window.dispatchEvent(new Event('storage'));
      };
      return <ParentDashboard theme={theme === 'glassNavy' ? 'glassNavy' : 'cyberMidnight'} onLogout={parentPortalLogoutRedirect} lang={lang} />;
    }

    if (initialSubTab === 'student_login' && isStudentLoggedIn) {
      const studentLogout = () => {
        localStorage.removeItem('sxc_student_logged_in');
        setIsStudentLoggedIn(false);
        window.dispatchEvent(new Event('storage'));
      };
      return <StudentDashboard theme={theme} onLogout={studentLogout} lang={lang} />;
    }

    if (initialSubTab === 'teacher_login' && isTeacherLoggedIn) {
      const teacherLogout = () => {
        localStorage.removeItem('sxc_teacher_logged_in');
        setIsTeacherLoggedIn(false);
        window.dispatchEvent(new Event('storage'));
      };
      return <TeacherDashboard theme={theme} onLogout={teacherLogout} lang={lang} />;
    }

    // Otherwise render secure login form
    const handleLoginFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError('');
      
      const roleStr = initialSubTab === 'parent_login' ? 'parent' : (initialSubTab === 'student_login' ? 'student' : 'teacher');
      
      // Fetch accounts
      const accountsStr = localStorage.getItem('sxc_user_accounts');
      let accounts = [];
      if (accountsStr) {
        try { accounts = JSON.parse(accountsStr); } catch (e) {}
      }

      // Default Admin-created accounts if none exist (for testing)
      if (accounts.length === 0) {
        accounts = [
          { id: 'usr-1', username: 'student1', password: 'password123', role: 'student', failedAttempts: 0, isLocked: false },
          { id: 'usr-2', username: 'parent1', password: 'password123', role: 'parent', failedAttempts: 0, isLocked: false },
          { id: 'usr-3', username: 'teacher1', password: 'password123', role: 'teacher', failedAttempts: 0, isLocked: false }
        ];
        localStorage.setItem('sxc_user_accounts', JSON.stringify(accounts));
      }

      const userIndex = accounts.findIndex((u: any) => u.username === loginEmail && u.role === roleStr);
      
      if (userIndex === -1) {
        setLoginError('Invalid User ID for this portal.');
        return;
      }

      const user = accounts[userIndex];

      if (user.isLocked) {
        setLoginError('Account Locked due to 5 incorrect attempts. Please contact Admin.');
        return;
      }

      if (user.password !== loginPassword) {
        user.failedAttempts = (user.failedAttempts || 0) + 1;
        if (user.failedAttempts >= 5) {
          user.isLocked = true;
          setLoginError('Account Locked due to 5 incorrect attempts. Please contact Admin.');
        } else {
          setLoginError(`Incorrect Password. ${5 - user.failedAttempts} attempts remaining.`);
        }
        accounts[userIndex] = user;
        localStorage.setItem('sxc_user_accounts', JSON.stringify(accounts));
        return;
      }

      // Success
      user.failedAttempts = 0;
      accounts[userIndex] = user;
      localStorage.setItem('sxc_user_accounts', JSON.stringify(accounts));

      if (initialSubTab === 'parent_login') {
        localStorage.setItem('sxc_parent_logged_in', 'true');
        setIsParentLoggedIn(true);
      } else if (initialSubTab === 'student_login') {
        localStorage.setItem('sxc_student_logged_in', 'true');
        setIsStudentLoggedIn(true);
      } else if (initialSubTab === 'teacher_login') {
        localStorage.setItem('sxc_teacher_logged_in', 'true');
        setIsTeacherLoggedIn(true);
      }
      window.dispatchEvent(new Event('storage'));
    };

    return (
      <div className={`flex flex-col items-center justify-center min-h-150 ${isGlass ? 'text-[#431407]' : 'text-white'}`}>
        <div className={`w-full max-w-md p-8 rounded-3xl border shadow-xl ${isGlass ? 'bg-white/90 backdrop-blur-xl border-white/40' : 'bg-[#1C1C1F] border-[#2C2C2E]'}`}>
          <div className="flex flex-col items-center text-center mb-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${role.bg}`}>
              <role.icon className={`w-8 h-8 ${role.color}`} />
            </div>
            <h2 className="text-2xl font-black mb-1">{role.title} Login</h2>
            <p className="text-sm opacity-60">{t('loginSubtitle')}</p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold text-center animate-shake">
              {loginError}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLoginFormSubmit}>
            <div>
              <label className="block text-xs font-bold mb-2 opacity-80 uppercase tracking-wider">{t('usernameOrId')}</label>
              <div className="relative">
                <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                <input 
                  type="text" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition font-sans text-sm ${isGlass ? 'bg-gray-50 border-gray-200 focus:border-[#F97316]' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-indigo-500 text-white'}`}
                  placeholder={t('usernamePlaceholder')}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 opacity-80 uppercase tracking-wider">{t('password')}</label>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition font-sans text-sm ${isGlass ? 'bg-gray-50 border-gray-200 focus:border-[#F97316]' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-indigo-500 text-white'}`}
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs font-bold">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded" /> {t('rememberMe')}
              </label>
              <span className={`hover:underline cursor-pointer ${role.color}`}>{t('forgotPassword')}</span>
            </div>
            <button className={`w-full py-3.5 rounded-xl font-black text-white transition hover:opacity-90 flex items-center justify-center gap-2 ${role.title === 'Parent Portal' ? 'bg-orange-400' : role.title === 'Teacher Portal' ? 'bg-indigo-500' : 'bg-amber-500'}`}>
              <Key className="w-4 h-4" /> {t('secureLogin')}
            </button>
          </form>


        </div>
      </div>
    );
  }

  // 3. Homework & Assignments
  if (initialSubTab === 'homework') {
    return (
      <div className={`p-6 sm:p-8 rounded-3xl min-h-150 border ${isGlass ? 'bg-white/80 backdrop-blur-xl border-white/40 text-[#431407]' : 'bg-[#1C1C1F] border-[#2C2C2E] text-white'}`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black flex items-center gap-2"><BookOpen className="text-rose-500" /> {t('digitalHomework')}</h2>
            <p className="opacity-60 text-sm mt-1">{t('recentAssignments')}</p>
          </div>
          <button className={`px-4 py-2 rounded-lg text-sm font-bold ${isGlass ? 'bg-[#431407] text-white shadow-sm' : 'bg-white text-black'}`}>{t('uploadAssignment')}</button>
        </div>

        <div className="space-y-4">
          {[
            { subject: 'Mathematics', title: 'Algebraic Expressions Practice', due: 'Tomorrow, 10:00 AM', status: 'Pending', color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { subject: 'Science', title: 'Physics: Motion Chapter Notes', due: 'Today, 11:59 PM', status: 'Submitted', color: 'text-rose-500', bg: 'bg-rose-500/10' },
            { subject: 'English', title: 'Essay: The Future of AI', due: 'Next Monday', status: 'Pending', color: 'text-amber-500', bg: 'bg-amber-500/10' },
          ].map((hw, i) => (
            <div key={i} className={`p-4 rounded-xl border flex items-center justify-between transition hover:scale-[1.01] ${isGlass ? 'bg-white border-gray-100 shadow-sm' : 'bg-[#0F0F12] border-[#2C2C2E]'}`}>
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${isGlass ? 'bg-gray-100 text-gray-500' : 'bg-[#242427] text-gray-400'}`}>
                  {hw.subject[0]}
                </div>
                <div>
                  <h4 className="font-bold text-sm">{hw.subject}</h4>
                  <p className="text-base font-black">{hw.title}</p>
                  <p className="text-xs opacity-60 flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> {t('due')} {hw.due}</p>
                </div>
              </div>
              <div className={`px-3 py-1.5 rounded-full text-xs font-bold ${hw.bg} ${hw.color}`}>
                {hw.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. Live Class
  if (initialSubTab === 'live_class') {
    return (
      <div className={`p-6 sm:p-8 rounded-3xl min-h-150 border flex flex-col ${isGlass ? 'bg-white/80 backdrop-blur-xl border-white/40 text-[#431407]' : 'bg-[#1C1C1F] border-[#2C2C2E] text-white'}`}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black flex items-center gap-2"><Video className="text-red-500" /> {t('liveVirtualClassrooms')}</h2>
          <span className="flex items-center gap-2 px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span> {t('liveNow')}
          </span>
        </div>
        
        <div className={`flex-1 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed ${isGlass ? 'bg-gray-50 border-gray-200' : 'bg-[#0F0F12] border-[#2C2C2E]'}`}>
          <Video className="w-16 h-16 opacity-20 mb-4" />
          <h3 className="text-xl font-bold mb-2">Class X - Science (Physics)</h3>
          <p className="opacity-60 mb-6 font-medium">Mr. Sharma is presenting • 42 students joined</p>
          <button className="px-8 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl shadow-lg transition hover:scale-105">
            {t('joinMeeting')}
          </button>
        </div>
      </div>
    );
  }

  // 5. Classroom Cameras
  if (initialSubTab === 'classroom_cameras') {
    return (
      <div className={`p-6 sm:p-8 rounded-3xl min-h-150 border ${isGlass ? 'bg-white/80 backdrop-blur-xl border-white/40 text-[#431407]' : 'bg-[#1C1C1F] border-[#2C2C2E] text-white'}`}>
        <h2 className="text-2xl font-black flex items-center gap-2 mb-6"><Camera className="text-purple-500" /> {t('aiClassroomSurveillance')}</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(cam => (
            <div key={cam} className={`relative rounded-xl overflow-hidden aspect-video border ${isGlass ? 'bg-black/5 border-gray-200' : 'bg-black border-[#2C2C2E]'}`}>
              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                <Camera className="w-10 h-10" />
              </div>
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 text-white text-xs font-mono">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                  REC
                </div>
                CAM-0{cam} (Class {cam+5}A)
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. Present / Absent Students
  if (initialSubTab === 'present_students' || initialSubTab === 'absent_students') {
    const isPresent = initialSubTab === 'present_students';
    return (
      <div className={`p-6 sm:p-8 rounded-3xl min-h-150 border ${isGlass ? 'bg-white/80 backdrop-blur-xl border-white/40 text-[#431407]' : 'bg-[#1C1C1F] border-[#2C2C2E] text-white'}`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className={`text-2xl font-black flex items-center gap-2 ${isPresent ? 'text-orange-400' : 'text-red-500'}`}>
              {isPresent ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />} 
              {isPresent ? t('todayPresentStudents') : t('todayAbsentStudents')}
            </h2>
            <p className="opacity-60 text-sm mt-1">{t('dateLabel')} {new Date().toLocaleDateString()}</p>
          </div>
          <div className={`text-3xl font-black ${isPresent ? 'text-orange-400' : 'text-red-500'}`}>
            {isPresent ? '1,492' : '48'}
          </div>
        </div>

        <div className={`rounded-xl border overflow-hidden ${isGlass ? 'bg-white border-gray-100' : 'bg-[#0F0F12] border-[#2C2C2E]'}`}>
          <table className="w-full text-left text-sm">
            <thead className={`text-xs uppercase font-bold ${isGlass ? 'bg-gray-50 text-gray-500 border-b border-gray-100' : 'bg-[#18181B] text-gray-400 border-b border-[#2C2C2E]'}`}>
              <tr>
                <th className="px-6 py-4">{t('studentIdCol')}</th>
                <th className="px-6 py-4">{t('nameCol')}</th>
                <th className="px-6 py-4">{t('classSectionCol')}</th>
                <th className="px-6 py-4">{t('statusCol')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-[#2C2C2E]">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className={`hover:bg-opacity-50 ${isGlass ? 'hover:bg-gray-50' : 'hover:bg-[#1C1C1F]'}`}>
                  <td className="px-6 py-4 font-mono">STU-202{item}</td>
                  <td className="px-6 py-4 font-bold">{isPresent ? 'Ayan Khan' : 'Rohan Sharma'}</td>
                  <td className="px-6 py-4">Class {item + 3} - A</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${isPresent ? 'bg-orange-400/10 text-orange-400' : 'bg-red-500/10 text-red-500'}`}>
                      {isPresent ? t('presentLabel') : t('absentLabel')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 7. Scholarship
  if (initialSubTab === 'scholarship') {
    return (
      <div className={`p-6 sm:p-8 rounded-3xl min-h-150 border ${isGlass ? 'bg-white/80 backdrop-blur-xl border-white/40 text-[#431407]' : 'bg-[#1C1C1F] border-[#2C2C2E] text-white'}`}>
        <div className={`p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 ${isGlass ? 'bg-linear-to-r from-amber-100 to-orange-100 shadow-sm' : 'bg-linear-to-r from-amber-500/20 to-orange-600/20'}`}>
          <div>
            <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-bold mb-3 inline-block">{t('openNow')}</span>
            <h2 className="text-3xl font-black mb-2">{t('meritScholarship')}</h2>
            <p className="opacity-80 max-w-lg">{t('scholarshipDesc')}</p>
          </div>
          <Award className="w-24 h-24 text-amber-500 opacity-50 font-black animate-float" />
        </div>

        <h3 className="text-lg font-bold mb-4">{t('applicationForm')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder={t('phStudentName')} className={`p-3 rounded-xl border ${isGlass ? 'bg-white border-gray-200' : 'bg-[#0F0F12] border-[#2C2C2E]'}`} />
          <input type="text" placeholder={t('phEnrollment')} className={`p-3 rounded-xl border ${isGlass ? 'bg-white border-gray-200' : 'bg-[#0F0F12] border-[#2C2C2E]'}`} />
          <input type="text" placeholder={t('phClassSection')} className={`p-3 rounded-xl border ${isGlass ? 'bg-white border-gray-200' : 'bg-[#0F0F12] border-[#2C2C2E]'}`} />
          <input type="text" placeholder={t('phPrevGrade')} className={`p-3 rounded-xl border ${isGlass ? 'bg-white border-gray-200' : 'bg-[#0F0F12] border-[#2C2C2E]'}`} />
          <div className="md:col-span-2">
            <textarea placeholder={t('phWhyScholarship')} rows={4} className={`w-full p-3 rounded-xl border ${isGlass ? 'bg-white border-gray-200' : 'bg-[#0F0F12] border-[#2C2C2E]'}`}></textarea>
          </div>
          <button className="md:col-span-2 p-3 bg-[#F97316] hover:bg-[#2C7A7B] text-white font-bold rounded-xl transition">{t('submitApplication')}</button>
        </div>
      </div>
    );
  }

  // 8. Digital Library
  if (initialSubTab === 'digital_library') {
    return <DigitalLibraryTab theme={theme} />;
  }

  // Fallback
  return (
    <div className={`p-6 rounded-2xl ${isGlass ? 'bg-white/70 backdrop-blur-xl text-[#431407]' : 'bg-[#0F0F12] text-white'}`}>
      <h2 className="text-xl font-bold mb-4">{t('moduleUnderConstruction')}</h2>
      <p>{t('moduleUnderConstructionDesc')} ({initialSubTab})</p>
    </div>
  );
}
