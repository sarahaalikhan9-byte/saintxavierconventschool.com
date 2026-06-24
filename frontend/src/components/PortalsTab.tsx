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
import AIClassroomTab from './AIClassroomTab';
import ParticleBackground from './ParticleBackground';
import CoursessTab from './CoursessTab';
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
  theme?: 'original' | 'glassNavy' | 'sunriseOrange' | 'royalBlue' | 'emerald';
  initialSubTab?: string;
  lang?: any;
  onNavigateSubTab?: (subTab: string) => void;
}

interface ScholarshipApplication {
  id: string;
  studentName: string;
  enrollment: string;
  classSection: string;
  previousGrade: string;
  reason: string;
  parentPhone: string;
  category: string;
  submittedAt: string;
  status: 'Under Review' | 'Shortlisted' | 'Approved';
}

const SCHOLARSHIP_STORAGE_KEY = 'sxc_scholarship_applications';
const ENQUIRY_STORAGE_KEY = 'sxc_hub_enquiries';
const BUDDY4STUDY_SCHOLARSHIPS_URL = 'https://www.buddy4study.com/scholarships';
const BUDDY4STUDY_REGISTER_URL = 'https://www.buddy4study.com/register';

const buddy4StudyScholarships = [
  {
    title: 'Buddy4Study Scholarship Support Programme 2026-27',
    eligibility: 'Class 10/12 pass-outs, Class 11-12, UG and eligible learners',
    benefit: 'Up to INR 1,00,000 per annum',
    deadline: 'Check live deadline',
    url: 'https://www.buddy4study.com/page/buddy4study-scholarship-support-programme',
  },
  {
    title: 'Buddy4Study India Foundation Scholarship',
    eligibility: 'Meritorious students from economically disadvantaged backgrounds',
    benefit: 'Up to INR 80,000',
    deadline: 'Check live deadline',
    url: 'https://www.buddy4study.com/page/buddy4study-india-foundation-scholarship',
  },
  {
    title: 'Bharti Airtel Scholarship 2026-27',
    eligibility: 'Eligible undergraduate engineering students',
    benefit: 'Up to 100% annual fee coverage',
    deadline: '31 Jul 2026',
    url: 'https://www.buddy4study.com/page/Bharti-Airtel-Scholarship',
  },
  {
    title: 'IET India Scholarship Award 2026',
    eligibility: 'Undergraduate engineering students from 1st to 4th year',
    benefit: 'Scholarship award support',
    deadline: '05 Jul 2026',
    url: 'https://www.buddy4study.com/page/iet-india-scholarship-awards',
  },
];

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

const SCHOOL_HOME_IMAGES = {
  hero: '/school-home/students-sunset.png',
  building: '/school-home/building-day.png',
  office: '/school-home/front-office-sunset.png',
  students: '/school-home/students-front.png',
  shaiban: '/school-home/shaiban-hassan.jpg',
  khijra: '/school-home/khijra-fatima.png',
  nayra: '/school-home/nayra.png',
  bushra: '/school-home/bushra-fatima.jpeg',
  sohail: '/school-home/sohail.png',
  zoya: '/school-home/zoya.png',
  background: '/school-home/sxc-background.png',
  cardBg: '/school-home/card-bg.png',
  homePageBg: '/school-home/home-page-bg.png',
};

const OUR_STAR_ACHIEVERS = [
  { name: 'Khijra Fatima', score: '81%', className: 'Class VIII', image: SCHOOL_HOME_IMAGES.khijra },
  { name: 'Nayra', score: '80%', className: 'Class V', image: SCHOOL_HOME_IMAGES.nayra },
  { name: 'Zoya', score: '79%', className: 'Class VIII', image: SCHOOL_HOME_IMAGES.zoya },
];

export default function PortalsTab({ theme = 'glassNavy', initialSubTab = 'home', lang = 'en', onNavigateSubTab }: PortalsTabProps) {
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

  const [hubEnquiryForm, setHubEnquiryForm] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    targetClass: '',
    message: '',
  });

  const updateHubEnquiryField = (field: keyof typeof hubEnquiryForm, value: string) => {
    setHubEnquiryForm(prev => ({ ...prev, [field]: value }));
  };

  const submitHubEnquiry = (event: React.FormEvent) => {
    event.preventDefault();
    if (Object.values(hubEnquiryForm).some(value => !value.trim())) {
      alert('Please complete the enquiry form.');
      return;
    }
    const saved = localStorage.getItem(ENQUIRY_STORAGE_KEY);
    let enquiries: HubEnquiry[] = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) enquiries = parsed;
      } catch (e) {}
    }
    const newEnquiry: HubEnquiry = {
      id: `SXC-ENQ-${Date.now()}`,
      studentName: hubEnquiryForm.studentName.trim().toUpperCase(),
      parentName: hubEnquiryForm.parentName.trim(),
      phone: hubEnquiryForm.phone.trim(),
      targetClass: hubEnquiryForm.targetClass.trim(),
      message: hubEnquiryForm.message.trim(),
      submittedAt: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      status: 'New',
    };
    localStorage.setItem(ENQUIRY_STORAGE_KEY, JSON.stringify([newEnquiry, ...enquiries]));
    window.dispatchEvent(new Event('sxc_hub_enquiries_changed'));
    setHubEnquiryForm({ studentName: '', parentName: '', phone: '', targetClass: '', message: '' });
    alert('Enquiry submitted. Admin panel me direct show hogi.');
  };

  const [scholarshipForm, setScholarshipForm] = useState({
    studentName: '',
    enrollment: '',
    classSection: '',
    previousGrade: '',
    reason: '',
    parentPhone: '',
    category: 'Merit',
  });
  const [scholarshipApplications, setScholarshipApplications] = useState<ScholarshipApplication[]>(() => {
    const saved = localStorage.getItem(SCHOLARSHIP_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [
      {
        id: 'SXC-SCH-2026-1001',
        studentName: 'AYAN KHAN',
        enrollment: 'ENR-2026-SXC-1042',
        classSection: 'Class VIII - A',
        previousGrade: 'A+ / 92%',
        reason: 'Strong academic record and active participation in digital learning projects.',
        parentPhone: '+91 90000 00000',
        category: 'Merit',
        submittedAt: '23 Jun 2026',
        status: 'Shortlisted',
      },
    ];
  });

  const updateScholarshipField = (field: keyof typeof scholarshipForm, value: string) => {
    setScholarshipForm(prev => ({ ...prev, [field]: value }));
  };

  const submitScholarshipApplication = (event: React.FormEvent) => {
    event.preventDefault();
    const requiredFields = [
      scholarshipForm.studentName,
      scholarshipForm.enrollment,
      scholarshipForm.classSection,
      scholarshipForm.previousGrade,
      scholarshipForm.reason,
      scholarshipForm.parentPhone,
    ];
    if (requiredFields.some(value => !value.trim())) {
      alert('Please complete all scholarship fields before submitting.');
      return;
    }

    const newApplication: ScholarshipApplication = {
      ...scholarshipForm,
      id: `SXC-SCH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: scholarshipForm.studentName.trim().toUpperCase(),
      enrollment: scholarshipForm.enrollment.trim().toUpperCase(),
      classSection: scholarshipForm.classSection.trim(),
      previousGrade: scholarshipForm.previousGrade.trim(),
      reason: scholarshipForm.reason.trim(),
      parentPhone: scholarshipForm.parentPhone.trim(),
      submittedAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Under Review',
    };

    const updated = [newApplication, ...scholarshipApplications];
    setScholarshipApplications(updated);
    localStorage.setItem(SCHOLARSHIP_STORAGE_KEY, JSON.stringify(updated));
    setScholarshipForm({
      studentName: '',
      enrollment: '',
      classSection: '',
      previousGrade: '',
      reason: '',
      parentPhone: '',
      category: 'Merit',
    });
    alert(`Scholarship application submitted. Application ID: ${newApplication.id}`);
  };

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
      <div className={`relative rounded-3xl overflow-hidden ${isGlass ? 'text-[#431407]' : 'text-white'}`}>
        <img src={SCHOOL_HOME_IMAGES.homePageBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl scale-110 pointer-events-none" />
        <div className={`absolute inset-0 pointer-events-none ${isGlass ? 'bg-[#FFF7ED]/70' : 'bg-black/55'}`} />
        <div className="relative z-10">
        {/* Hero Section */}
        <div className={`relative px-5 sm:px-8 py-16 sm:py-20 min-h-[720px] flex items-center overflow-hidden ${isGlass ? 'bg-[#431407]' : 'bg-[#06070a]'}`}>
          <ParticleBackground isGlass={isGlass} />
          {/* Animated Background Orbs */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className={`absolute -top-20 -left-20 w-96 h-96 rounded-full blur-[100px] opacity-40 animate-pulse-glow ${isGlass ? 'bg-[#F97316]' : 'bg-[#10B981]'}`}></div>
            <div className="absolute bottom-[-10%] right-[-5%] w-120 h-120 rounded-full blur-[120px] opacity-30 animate-pulse-glow bg-[#3B82F6]" style={{ animationDelay: '1.5s' }}></div>
          </div>

          <img src={SCHOOL_HOME_IMAGES.hero} alt="Saint Xavier Convent School students" className="absolute inset-0 w-full h-full object-cover object-center image-breath" />
          <div className={`absolute inset-0 ${isGlass ? 'bg-linear-to-r from-[#431407]/92 via-[#431407]/62 to-[#431407]/10' : 'bg-linear-to-r from-black/90 via-black/60 to-black/20'}`}></div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black/50 to-transparent"></div>

          {/* Floating Icons */}
          <div className="absolute inset-0 pointer-events-none">
            <GraduationCap className={`absolute top-1/4 left-1/4 w-12 h-12 opacity-30 animate-float ${isGlass ? 'text-[#F97316]' : 'text-[#EA580C]'}`} />
            <BookOpen className={`absolute bottom-1/4 right-1/4 w-10 h-10 opacity-30 animate-float-delayed ${isGlass ? 'text-blue-500' : 'text-blue-400'}`} />
            <Sparkles className={`absolute top-1/3 right-1/3 w-8 h-8 opacity-40 animate-pulse-glow ${isGlass ? 'text-amber-500' : 'text-amber-400'}`} />
          </div>

          <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 text-left">
            <div className={`w-20 h-20 mb-7 rounded-3xl flex items-center justify-center shadow-2xl animate-float ${isGlass ? 'bg-white shadow-[#F97316]/20' : 'bg-[#1C1C1F] shadow-[#EA580C]/20 border border-white/10'}`}>
              <GraduationCap className={`w-14 h-14 ${isGlass ? 'text-[#F97316]' : 'text-[#EA580C]'}`} />
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black mb-6 tracking-tight animate-slideUp text-white">
              <span className="block text-white drop-shadow-2xl">Saint Xavier</span>
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-orange-200 via-white to-amber-300 animate-shimmer" style={{ backgroundSize: '200% auto' }}>
                Convent School
              </span>
            </h1>

            <p className="text-base md:text-xl font-semibold max-w-2xl text-orange-50/90 mb-8 animate-slideUp leading-relaxed" style={{ animationDelay: '0.1s' }}>
              {t('heroTagline')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
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
                className="px-7 py-4 rounded-full text-base font-black flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl bg-linear-to-r from-[#F97316] to-orange-400 text-white shadow-orange-400/30"
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
                className="px-7 py-4 rounded-full text-base font-black flex items-center justify-center gap-3 transition-all duration-300 hover:-translate-y-1 border border-white/40 bg-white/15 hover:bg-white/25 text-white backdrop-blur-md shadow-sm"
              >
                <Video className="w-5 h-5" /> {t('campusTour')}
              </button>
            </div>
            </div>

            <div className="lg:col-span-6 hidden lg:block">
              <div className="relative min-h-[520px]">
                <img src={SCHOOL_HOME_IMAGES.office} alt="School office front" className="absolute right-0 top-0 w-[74%] rounded-3xl shadow-2xl border border-white/25 object-cover aspect-[4/5] soft-float" />
                <img src={SCHOOL_HOME_IMAGES.building} alt="School building" className="absolute left-0 bottom-8 w-[50%] rounded-2xl shadow-2xl border-4 border-white object-cover aspect-[4/5] soft-float" style={{ animationDelay: '1s' }} />
                <div className="absolute right-8 bottom-0 rounded-3xl bg-white/92 text-[#431407] shadow-2xl border border-white p-5 w-72 glow-pulse">
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-2">Admissions Open</p>
                  <h3 className="text-2xl font-black leading-tight">Nursery to Class X</h3>
                  <p className="text-xs opacity-70 mt-2 font-semibold">Smart classrooms, values, activities, and guided learning in one campus.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 sm:px-8 -mt-8 relative z-20">
          {[
            { label: t('statPassRate'), value: '100%', icon: Award, color: 'text-amber-500' },
            { label: t('statStudents'), value: '2,500+', icon: Users, color: 'text-blue-500' },
            { label: t('statCourses'), value: '50+', icon: BookOpen, color: 'text-purple-500', subTab: 'courses' },
            { label: t('statEst'), value: '2018', icon: CheckCircle2, color: 'text-rose-500' },
          ].map((stat, i) => (
            <button
              key={i}
              type="button"
              onClick={() => stat.subTab && onNavigateSubTab?.(stat.subTab)}
              className={`relative overflow-hidden p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-transform hover:-translate-y-2 ${stat.subTab ? 'cursor-pointer' : 'cursor-default'} ${isGlass ? 'bg-white/90 shadow-lg border border-white/50 backdrop-blur-xl' : 'bg-[#1C1C1F] border border-white/10 shadow-2xl'}`}
            >
              <img src={SCHOOL_HOME_IMAGES.background} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />
              <div className="absolute inset-0 bg-white/70 dark:bg-black/40" />
              <div className="relative z-10 flex flex-col items-center">
              <stat.icon className={`w-8 h-8 mb-3 ${stat.color} animate-pulse-glow`} />
              <div className="text-3xl font-black mb-1">{stat.value}</div>
              <div className="text-sm font-bold opacity-60 uppercase tracking-wider">{stat.label}</div>
              {stat.subTab && <div className="mt-2 text-[10px] font-black text-purple-500 uppercase">Click to open</div>}
              </div>
            </button>
          ))}
        </div>

        {/* Real Campus Photo Showcase */}
        <div className="px-6 sm:px-8 mt-14 animate-slideUp">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className={`lg:col-span-7 overflow-hidden rounded-3xl border shadow-2xl ${isGlass ? 'bg-white border-white/60' : 'bg-[#1C1C1F] border-white/10'}`}>
              <div className="relative aspect-[16/10]">
                <img src={SCHOOL_HOME_IMAGES.students} alt="Students at Saint Xavier Convent School" className="w-full h-full object-cover image-breath" />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"></div>
                <div className="absolute left-5 right-5 bottom-5 text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-200 mb-2">Our Campus Family</p>
                  <h2 className="text-3xl font-black">A confident start, every morning.</h2>
                </div>
              </div>
            </div>
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
              {[
                { image: SCHOOL_HOME_IMAGES.building, title: 'Modern School Building', desc: 'Clean, focused spaces for learning and activities.' },
                { image: SCHOOL_HOME_IMAGES.office, title: 'School Office', desc: 'Admissions, parent helpdesk, and daily coordination.' },
              ].map(item => (
                <div key={item.title} className={`overflow-hidden rounded-3xl border flex ${isGlass ? 'bg-white/80 border-white/50' : 'bg-[#1C1C1F] border-white/10'}`}>
                  <img src={item.image} alt={item.title} className="w-32 sm:w-40 lg:w-44 object-cover" />
                  <div className="p-5 flex flex-col justify-center">
                    <h3 className="font-black text-lg">{item.title}</h3>
                    <p className="text-sm opacity-65 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
              <div key={item.id} className={`overflow-hidden rounded-3xl border motion-card interactive-lift transition-all hover:-translate-y-1 hover:shadow-2xl ${isGlass ? 'bg-white/80 border-white/50' : 'bg-[#1C1C1F] border-white/10'}`}>
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

        {/* Enquiry Form */}
        <div className="px-6 sm:px-8 mt-12 animate-slideUp">
          <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8 rounded-3xl border ${isGlass ? 'bg-white/75 border-white/50 shadow-xl' : 'bg-[#1C1C1F] border-white/10 shadow-2xl'}`}>
            <div className="lg:col-span-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase tracking-widest mb-4">
                <MessageSquare className="w-3.5 h-3.5" /> Direct Admin Desk
              </span>
              <h2 className="text-3xl font-black mb-3">Admission Enquiry</h2>
              <p className="text-sm opacity-70 leading-relaxed">
                Parents can send a quick enquiry from the school hub. Every submission appears instantly inside the Admin Panel enquiry inbox.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-6 text-center">
                <div className={`p-4 rounded-2xl ${isGlass ? 'bg-orange-50' : 'bg-orange-500/10'}`}>
                  <Phone className="w-5 h-5 mx-auto mb-2 text-orange-500" />
                  <p className="text-xs font-black">Call Back</p>
                </div>
                <div className={`p-4 rounded-2xl ${isGlass ? 'bg-blue-50' : 'bg-blue-500/10'}`}>
                  <ShieldCheck className="w-5 h-5 mx-auto mb-2 text-blue-500" />
                  <p className="text-xs font-black">Admin Tracked</p>
                </div>
              </div>
            </div>

            <form onSubmit={submitHubEnquiry} className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={hubEnquiryForm.studentName} onChange={e => updateHubEnquiryField('studentName', e.target.value)} type="text" placeholder="Student name" className={`p-3 rounded-xl border text-sm outline-none ${isGlass ? 'bg-white border-gray-200 focus:border-orange-400' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-orange-500'}`} />
              <input value={hubEnquiryForm.parentName} onChange={e => updateHubEnquiryField('parentName', e.target.value)} type="text" placeholder="Parent name" className={`p-3 rounded-xl border text-sm outline-none ${isGlass ? 'bg-white border-gray-200 focus:border-orange-400' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-orange-500'}`} />
              <input value={hubEnquiryForm.phone} onChange={e => updateHubEnquiryField('phone', e.target.value)} type="tel" placeholder="Mobile number" className={`p-3 rounded-xl border text-sm outline-none ${isGlass ? 'bg-white border-gray-200 focus:border-orange-400' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-orange-500'}`} />
              <select value={hubEnquiryForm.targetClass} onChange={e => updateHubEnquiryField('targetClass', e.target.value)} className={`p-3 rounded-xl border text-sm outline-none ${isGlass ? 'bg-white border-gray-200 focus:border-orange-400' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-orange-500'}`}>
                <option value="">Select class</option>
                {['Nursery', 'LKG', 'UKG', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII'].map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <textarea value={hubEnquiryForm.message} onChange={e => updateHubEnquiryField('message', e.target.value)} rows={4} placeholder="Question, admission requirement, or visit request..." className={`sm:col-span-2 p-3 rounded-xl border text-sm outline-none resize-none ${isGlass ? 'bg-white border-gray-200 focus:border-orange-400' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-orange-500'}`} />
              <button type="submit" className="sm:col-span-2 p-3 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-black transition flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Send Enquiry to Admin
              </button>
            </form>
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
                  <img src={SCHOOL_HOME_IMAGES.shaiban} alt="Shaiban Hassan - Star of the Week" className="w-full h-full object-cover rounded-full border-4 border-white dark:border-[#1C1C1F]" />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white uppercase tracking-widest text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                    {t('starOfWeek')}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Shaiban Hassan</h3>
                <p className="text-sm opacity-70 font-medium">Star of the Week • Bright Learner</p>
              </div>

              {/* Our Hero */}
              <div className="flex flex-col items-center justify-center text-center group md:-mt-8">
                <div className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full p-2 mb-6 transition-transform duration-500 group-hover:scale-105 ${isGlass ? 'bg-linear-to-tr from-amber-300 to-yellow-500' : 'bg-linear-to-tr from-amber-400 to-yellow-600'} shadow-2xl`}>
                  <img src={SCHOOL_HOME_IMAGES.sohail} alt="Sohail - Our Hero" className="w-full h-full object-cover rounded-full border-4 border-white dark:border-[#1C1C1F]" />
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-amber-500 text-white uppercase tracking-widest text-xs font-black px-6 py-2 rounded-full shadow-lg whitespace-nowrap">
                    {t('ourHero')}
                  </div>
                  <Award className="absolute -top-3 -right-3 w-12 h-12 text-amber-500 drop-shadow-md" />
                </div>
                <h3 className="text-2xl font-black mb-1 text-amber-600 dark:text-amber-500">Sohail</h3>
                <p className="text-sm opacity-80 font-bold mb-2">Class VIII � 91%</p>
                <p className="text-xs opacity-60 font-medium max-w-xs mx-auto">Outstanding academic performance and focused classroom excellence.</p>
              </div>

              {/* Star of the Month */}
              <div className="flex flex-col items-center justify-center text-center group">
                <div className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full p-2 mb-6 transition-transform duration-500 group-hover:scale-105 ${isGlass ? 'bg-linear-to-tr from-teal-400 to-emerald-400' : 'bg-linear-to-tr from-orange-400 to-rose-500'} shadow-lg`}>
                  <img src={SCHOOL_HOME_IMAGES.bushra} alt="Bushra Fatima - Star of the Month" className="w-full h-full object-cover rounded-full border-4 border-white dark:border-[#1C1C1F]" />
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-rose-500 text-white uppercase tracking-widest text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                    {t('starOfMonth')}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-1">Bushra Fatima</h3>
                <p className="text-sm opacity-70 font-medium">Class V � 80%</p>
              </div>
            </div>

            <div className="mt-12 pt-10 border-t border-white/30">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-amber-500 mb-2">Academic Excellence</p>
                  <h3 className="text-2xl md:text-3xl font-black">Our Stars</h3>
                </div>
                <p className="text-sm opacity-65 font-semibold">Celebrating outstanding board performance and classroom dedication.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {OUR_STAR_ACHIEVERS.map(star => (
                  <div key={star.name} className={`motion-card interactive-lift overflow-hidden rounded-3xl border ${isGlass ? 'bg-white/85 border-white/60 shadow-lg' : 'bg-[#0F0F12] border-white/10 shadow-2xl'}`}>
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img src={star.image} alt={`${star.name} - Our Star`} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-transparent to-transparent"></div>
                      <div className="absolute left-3 top-3 px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-black shadow-lg">
                        {star.score}
                      </div>
                    </div>
                    <div className="p-4 text-center">
                      <h4 className="font-black text-base leading-tight">{star.name}</h4>
                      <p className="text-xs opacity-65 font-bold mt-1">{star.className}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8 mt-4">
          {/* News Card */}
          <div className={`group relative overflow-hidden p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isGlass ? 'bg-white/70 border-white/50 backdrop-blur-lg hover:bg-white/90' : 'bg-[#1C1C1F]/80 border-white/10 backdrop-blur-lg hover:bg-[#2C2C2E]/90'}`}>
            <img src={SCHOOL_HOME_IMAGES.cardBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div className={`absolute inset-0 ${isGlass ? 'bg-white/78' : 'bg-black/68'}`} />
            <div className="relative z-10">
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
          </div>

          {/* Achievements Card */}
          <div className={`group relative overflow-hidden p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isGlass ? 'bg-white/70 border-white/50 backdrop-blur-lg hover:bg-white/90' : 'bg-[#1C1C1F]/80 border-white/10 backdrop-blur-lg hover:bg-[#2C2C2E]/90'}`}>
            <img src={SCHOOL_HOME_IMAGES.cardBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div className={`absolute inset-0 ${isGlass ? 'bg-white/78' : 'bg-black/68'}`} />
            <div className="relative z-10">
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
          </div>

          {/* Contact Card */}
          <div className={`group relative overflow-hidden p-8 rounded-3xl border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${isGlass ? 'bg-white/70 border-white/50 backdrop-blur-lg hover:bg-white/90' : 'bg-[#1C1C1F]/80 border-white/10 backdrop-blur-lg hover:bg-[#2C2C2E]/90'}`}>
            <img src={SCHOOL_HOME_IMAGES.cardBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
            <div className={`absolute inset-0 ${isGlass ? 'bg-white/78' : 'bg-black/68'}`} />
            <div className="relative z-10">
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

  if (initialSubTab === 'live_class' || initialSubTab === 'classroom_cameras') {
    return <AIClassroomTab theme={theme} mode="portal" />;
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
    const lastUpdated = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <div className={`p-5 sm:p-6 rounded-3xl min-h-150 border ${isGlass ? 'bg-white/90 backdrop-blur-xl border-white/40 text-[#431407]' : 'bg-[#1C1C1F] border-[#2C2C2E] text-white'}`}>
        <div className={`p-6 rounded-2xl mb-6 flex flex-col xl:flex-row xl:items-center justify-between gap-5 ${isGlass ? 'bg-linear-to-r from-amber-100 to-orange-100 shadow-sm' : 'bg-linear-to-r from-amber-500/20 to-orange-600/20'}`}>
          <div className="max-w-3xl">
            <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-black mb-3 inline-flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" /> Buddy4Study Connected
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mb-2">Scholarship Update Center</h2>
            <p className="opacity-80 text-sm leading-relaxed">
              Latest scholarship opportunities are linked with Buddy4Study official pages. Students can shortlist here, then apply on Buddy4Study for verified eligibility, documents, and live deadlines.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row xl:flex-col gap-2 shrink-0">
            <a href={BUDDY4STUDY_SCHOLARSHIPS_URL} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#F97316] text-white text-xs font-black shadow-lg">
              <ArrowRight className="w-4 h-4" /> Update From Buddy4Study
            </a>
            <a href={BUDDY4STUDY_REGISTER_URL} target="_blank" rel="noreferrer" className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-black border ${isGlass ? 'bg-white/70 border-white text-[#431407]' : 'bg-black/20 border-white/10 text-white'}`}>
              <UserCheck className="w-4 h-4" /> Student Register
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-7 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black">Buddy4Study Opportunities</h3>
                <p className="text-xs opacity-60">Last checked: {lastUpdated}</p>
              </div>
              <a href={BUDDY4STUDY_SCHOLARSHIPS_URL} target="_blank" rel="noreferrer" className={`px-3 py-2 rounded-xl text-[11px] font-black border ${isGlass ? 'bg-white border-amber-100 text-amber-700' : 'bg-[#0F0F12] border-amber-500/20 text-amber-300'}`}>
                View All
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {buddy4StudyScholarships.map(item => (
                <div key={item.title} className={`p-4 rounded-2xl border ${isGlass ? 'bg-white border-amber-100' : 'bg-[#0F0F12] border-[#2C2C2E]'}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Award className="w-9 h-9 text-amber-500 shrink-0" />
                    <span className="px-2 py-1 rounded-full bg-green-500/10 text-green-600 text-[9px] font-black uppercase">Buddy4Study</span>
                  </div>
                  <h4 className="font-black text-sm leading-snug min-h-[42px]">{item.title}</h4>
                  <p className="text-xs opacity-70 mt-2 leading-relaxed">{item.eligibility}</p>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-[10px] font-black">
                    <div className={`p-2 rounded-xl ${isGlass ? 'bg-amber-50' : 'bg-amber-500/10'}`}>
                      <span className="block opacity-55 uppercase">Benefit</span>
                      <span>{item.benefit}</span>
                    </div>
                    <div className={`p-2 rounded-xl ${isGlass ? 'bg-red-50' : 'bg-red-500/10'}`}>
                      <span className="block opacity-55 uppercase">Deadline</span>
                      <span>{item.deadline}</span>
                    </div>
                  </div>
                  <a href={item.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex w-full items-center justify-center gap-2 p-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white text-xs font-black transition">
                    Apply on Buddy4Study <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>

            <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${isGlass ? 'bg-blue-50 border-blue-100 text-blue-900' : 'bg-blue-500/10 border-blue-500/20 text-blue-100'}`}>
              <strong>Note:</strong> Buddy4Study listings, deadlines, eligibility, and forms can change. The orange apply buttons open the official Buddy4Study pages so the school portal stays aligned with the latest public information.
            </div>
          </div>

          <div className="xl:col-span-5 space-y-4">
            <form onSubmit={submitScholarshipApplication} className={`p-4 rounded-2xl border ${isGlass ? 'bg-white border-gray-100' : 'bg-[#0F0F12] border-[#2C2C2E]'}`}>
              <h3 className="text-lg font-black mb-1">{t('applicationForm')}</h3>
              <p className="text-xs opacity-60 mb-4">School-side shortlist record. Final application happens on Buddy4Study.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input value={scholarshipForm.studentName} onChange={event => updateScholarshipField('studentName', event.target.value)} type="text" placeholder={t('phStudentName')} className={`p-3 rounded-xl border text-sm outline-none ${isGlass ? 'bg-white border-gray-200 focus:border-amber-400' : 'bg-[#171724] border-[#2C2C2E] focus:border-amber-500'}`} />
                <input value={scholarshipForm.enrollment} onChange={event => updateScholarshipField('enrollment', event.target.value)} type="text" placeholder={t('phEnrollment')} className={`p-3 rounded-xl border text-sm outline-none ${isGlass ? 'bg-white border-gray-200 focus:border-amber-400' : 'bg-[#171724] border-[#2C2C2E] focus:border-amber-500'}`} />
                <input value={scholarshipForm.classSection} onChange={event => updateScholarshipField('classSection', event.target.value)} type="text" placeholder={t('phClassSection')} className={`p-3 rounded-xl border text-sm outline-none ${isGlass ? 'bg-white border-gray-200 focus:border-amber-400' : 'bg-[#171724] border-[#2C2C2E] focus:border-amber-500'}`} />
                <input value={scholarshipForm.previousGrade} onChange={event => updateScholarshipField('previousGrade', event.target.value)} type="text" placeholder={t('phPrevGrade')} className={`p-3 rounded-xl border text-sm outline-none ${isGlass ? 'bg-white border-gray-200 focus:border-amber-400' : 'bg-[#171724] border-[#2C2C2E] focus:border-amber-500'}`} />
                <input value={scholarshipForm.parentPhone} onChange={event => updateScholarshipField('parentPhone', event.target.value)} type="text" placeholder="Parent mobile number" className={`p-3 rounded-xl border text-sm outline-none ${isGlass ? 'bg-white border-gray-200 focus:border-amber-400' : 'bg-[#171724] border-[#2C2C2E] focus:border-amber-500'}`} />
                <select value={scholarshipForm.category} onChange={event => updateScholarshipField('category', event.target.value)} className={`p-3 rounded-xl border text-sm outline-none ${isGlass ? 'bg-white border-gray-200 focus:border-amber-400' : 'bg-[#171724] border-[#2C2C2E] focus:border-amber-500'}`}>
                  <option>Merit</option>
                  <option>Need Based</option>
                  <option>Girl Student</option>
                  <option>Sports / Talent</option>
                  <option>Minority / Category</option>
                </select>
                <div className="md:col-span-2">
                  <textarea value={scholarshipForm.reason} onChange={event => updateScholarshipField('reason', event.target.value)} placeholder={t('phWhyScholarship')} rows={4} className={`w-full p-3 rounded-xl border text-sm outline-none resize-none ${isGlass ? 'bg-white border-gray-200 focus:border-amber-400' : 'bg-[#171724] border-[#2C2C2E] focus:border-amber-500'}`}></textarea>
                </div>
                <button type="submit" className="md:col-span-2 p-3 bg-[#F97316] hover:bg-[#EA580C] text-white font-black rounded-xl transition">{t('submitApplication')}</button>
              </div>
            </form>

            <div className={`p-4 rounded-2xl border ${isGlass ? 'bg-white border-gray-100' : 'bg-[#0F0F12] border-[#2C2C2E]'}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-black">School Applications</h3>
                <span className="text-xs font-black text-amber-600">{scholarshipApplications.length} total</span>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {scholarshipApplications.map(item => (
                  <div key={item.id} className={`p-3 rounded-xl border ${isGlass ? 'bg-amber-50/70 border-amber-100' : 'bg-amber-500/10 border-amber-500/20'}`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-black text-sm">{item.studentName}</p>
                        <p className="text-[10px] opacity-60 font-mono">{item.id}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[9px] font-black uppercase">{item.status}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-semibold opacity-75">
                      <span>{item.classSection}</span>
                      <span>{item.previousGrade}</span>
                      <span>{item.category}</span>
                      <span>{item.submittedAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 8. Digital Library
  if (initialSubTab === 'digital_library') {
    return <DigitalLibraryTab theme={theme} />;
  }

  if (initialSubTab === 'courses') {
    return <CoursessTab theme={theme} />;
  }

  // Fallback
  return (
    <div className={`p-6 rounded-2xl ${isGlass ? 'bg-white/70 backdrop-blur-xl text-[#431407]' : 'bg-[#0F0F12] text-white'}`}>
      <h2 className="text-xl font-bold mb-4">{t('moduleUnderConstruction')}</h2>
      <p>{t('moduleUnderConstructionDesc')} ({initialSubTab})</p>
    </div>
  );
}
