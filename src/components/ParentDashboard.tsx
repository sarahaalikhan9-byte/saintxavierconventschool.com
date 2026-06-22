import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { speakText } from '../utils/tts';
import { 
  Award, Bell, BookOpen, Calendar, CheckCircle2, ChevronRight, Clock, 
  FileText, GraduationCap, Lock, LogOut, MessageSquare, Phone, Play, 
  Send, ShieldCheck, Smartphone, Sparkles, User, UserCheck, Video, 
  Volume2, Check, AlertCircle, Eye, Printer, Upload, CheckSquare, Plus, ExternalLink,
  CreditCard, Wallet, HelpCircle, Receipt, ArrowRight, ShieldAlert
} from 'lucide-react';
import { MarksheetRecord, ScholarProfile, FeeTransaction } from '../types';
import { SAMPLE_MARKSHEETS } from '../data';

interface ParentDashboardProps {
  theme?: 'glassNavy' | 'tealClassic' | 'cyberMidnight';
  onLogout?: () => void;
  lang?: any;
}

// Live Classes list mapping to respective grades/standard
interface LiveClassItem {
  id: string;
  className: string;
  subject: string;
  teacher: string;
  topic: string;
  startTime: string;
  duration: string;
  streamUrl: string;
}

const LIVE_CLASSES_REGISTRY: LiveClassItem[] = [
  // Class VIII
  { id: 'lc-8-1', className: 'CLASS VIII', subject: 'Mathematics', teacher: 'Mr. Rajesh Sharma', topic: 'Linear Equations in One Variable (Ex. 2.4)', startTime: '09:00 AM', duration: '45 mins', streamUrl: 'https://images.unsplash.com/photo-1610116306796-6fea9f4fae38' },
  { id: 'lc-8-2', className: 'CLASS VIII', subject: 'Science', teacher: 'Mrs. Archana Dubey', topic: 'Combustion and Flame - Fire Control Mechanics', startTime: '10:30 AM', duration: '40 mins', streamUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3' },
  { id: 'lc-8-3', className: 'CLASS VIII', subject: 'English Literature', teacher: 'Miss Priya Sen', topic: 'The Ant and the Cricket: Stanza Analysis', startTime: '12:00 PM', duration: '35 mins', streamUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c' },
  
  // Class V
  { id: 'lc-5-1', className: 'CLASS V', subject: 'Mathematics', teacher: 'Mrs. Shweta Joshi', topic: 'Introduction to Decimals & Fractional Ratios', startTime: '09:30 AM', duration: '40 mins', streamUrl: '' },
  { id: 'lc-5-2', className: 'CLASS V', subject: 'E.V.S.', teacher: 'Mr. Anil Gupta', topic: 'Our Natural Resources & Forest Ecosystems', startTime: '11:15 AM', duration: '45 mins', streamUrl: '' },
  
  // Pre-Primary
  { id: 'lc-pp-1', className: 'PRE-PRIMARY', subject: 'Maths & Numbers', teacher: 'Mrs. Farah Khan', topic: 'Counting 1 to 50 with interactive slides', startTime: '08:45 AM', duration: '30 mins', streamUrl: '' },
  { id: 'lc-pp-2', className: 'PRE-PRIMARY', subject: 'Art & Craft', teacher: 'Miss Soniya Sahu', topic: 'Origami Bird with Colored Sheets', startTime: '10:00 AM', duration: '40 mins', streamUrl: '' },

  // Class IV (Primary)
  { id: 'lc-4-1', className: 'PRIMARY (CLASS IV)', subject: 'ENGLISH', teacher: 'Mrs. Sajida Alam', topic: 'Nouns & Pronouns Usage Game', startTime: '09:00 AM', duration: '40 mins', streamUrl: '' },
  { id: 'lc-4-2', className: 'PRIMARY (CLASS IV)', subject: 'MATHS', teacher: 'Mr. Jameel Alam', topic: 'Multiplication Tables and Drill exercises', startTime: '11:30 AM', duration: '40 mins', streamUrl: '' },

  // Class VII / Middle
  { id: 'lc-7-1', className: 'MIDDLE (CLASS VII)', subject: 'Mathematics', teacher: 'Mrs. Suchitra Roy', topic: 'Integers & Absolute Value Theories', startTime: '10:00 AM', duration: '45 mins', streamUrl: '' },
  { id: 'lc-7-2', className: 'MIDDLE (CLASS VII)', subject: 'Science', teacher: 'Miss Shalini Sen', topic: 'Nutrition in Plants & Photosynthesis Labs', startTime: '11:45 AM', duration: '45 mins', streamUrl: '' },
  { id: 'lc-7-3', className: 'MIDDLE (CLASS VII)', subject: 'Social Science', teacher: 'Mr. S. K. Nair', topic: 'The Delhi Sultans: Monuments & Fort Chronicles', startTime: '01:00 PM', duration: '40 mins', streamUrl: '' },

  // Class VI
  { id: 'lc-6-1', className: 'CLASS VI', subject: 'Science', teacher: 'Mrs. Anjali Vyas', topic: 'Components of Food - Carbohydrates and Testing', startTime: '09:15 AM', duration: '45 mins', streamUrl: '' }
];

export default function ParentDashboard({ theme = 'glassNavy', onLogout, lang = 'en' }: ParentDashboardProps) {
  const { t, i18n } = useTranslation();
  const isGlass = theme === 'glassNavy';

  // State: Student list (sync from localStorage or default SAMPLE_MARKSHEETS)
  const [students, setStudents] = useState<MarksheetRecord[]>([]);
  const [activeChildId, setActiveChildId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'progress' | 'live' | 'homework' | 'chat' | 'notices' | 'fees'>('progress');
  const [showReportCardModal, setShowReportCardModal] = useState(false);

  // Load students & active child
  useEffect(() => {
    const saved = localStorage.getItem('sxc_all_marksheets');
    let loadedStudents: MarksheetRecord[] = [];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedStudents = parsed;
        }
      } catch (e) {
        console.error('Error parsing loaded marksheets', e);
      }
    }

    if (loadedStudents.length === 0) {
      loadedStudents = SAMPLE_MARKSHEETS;
    }

    setStudents(loadedStudents);
    
    // Check saved active child
    const savedChildId = localStorage.getItem('sxc_parent_active_child_id');
    if (savedChildId && loadedStudents.some(s => s.id === savedChildId)) {
      setActiveChildId(savedChildId);
    } else {
      setActiveChildId(loadedStudents[0].id);
    }
  }, []);

  const activeChild = students.find(s => s.id === activeChildId) || students[0];

  useEffect(() => {
    if (activeChildId) {
      localStorage.setItem('sxc_parent_active_child_id', activeChildId);
    }
  }, [activeChildId]);

  // Handle local attendance summary string to numbers
  const parseAttendance = (attStr: string = '190/210') => {
    const parts = attStr.split('/');
    const attended = parseInt(parts[0]) || 180;
    const total = parseInt(parts[1]) || 200;
    const percent = total > 0 ? Math.round((attended / total) * 100) : 90;
    return { attended, total, percent };
  };

  const attData = parseAttendance(activeChild?.attendance);

  const [quizRecords, setQuizRecords] = useState<any[]>([]);
  useEffect(() => {
    const handleStorage = () => {
      const records = JSON.parse(localStorage.getItem('sxc_quiz_records') || '[]');
      setQuizRecords(records.filter((r: any) => 
        r.studentName.toLowerCase().includes(activeChild?.name?.split(' ')[0].toLowerCase() || '')
      ));
    };
    handleStorage();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [activeChild?.name]);

  // -------------------------------------------------------------
  // DUAL-PORTAL FEE SYSTEM: SCHOLAR LEDGER SYNC & PAYMENTS
  // -------------------------------------------------------------
  const [scholarsList, setScholarsList] = useState<ScholarProfile[]>([]);
  const [showPaymentPortal, setShowPaymentPortal] = useState(false);
  const [selectedTxnToPay, setSelectedTxnToPay] = useState<FeeTransaction | null>(null);
  const [paymentStep, setPaymentStep] = useState<'method' | 'processing' | 'otp' | 'success'>('method');
  const [payMethod, setPayMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiAddress, setUpiAddress] = useState('parent@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 9812 3445 7801');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvv, setCardCvv] = useState('365');
  const [paymentOtp, setPaymentOtp] = useState('');

  // Synchronize Parent's Student Roster directly to the Admin's Official Scholar Ledger database
  useEffect(() => {
    const savedScholars = localStorage.getItem('sxc_all_scholars');
    let loadedScholars: ScholarProfile[] = [];
    if (savedScholars) {
      try {
        loadedScholars = JSON.parse(savedScholars);
      } catch (e) {}
    }

    // Default static accounts matching Admin's ScholarTab in active scope
    if (loadedScholars.length === 0) {
      loadedScholars = [
        {
          id: 'sc-1',
          scholarNo: '5281',
          studentName: 'PRIYA PATEL',
          currentClass: 'CLASS VII-A',
          annualFee: 42000,
          transactions: [
            { id: 'TXN-9021', date: '2025-04-10', category: 'Tuition Fee Installment I', amount: 15000, paymentMode: 'UPI / GooglePay', status: 'PAID' },
            { id: 'TXN-9381', date: '2025-08-15', category: 'Tuition Fee Installment II', amount: 15000, paymentMode: 'Bank Transfer (NEFT)', status: 'PAID' },
            { id: 'TXN-9821', date: '2025-11-20', category: 'Annual Computer & Lab Fee', amount: 5000, paymentMode: 'Credit Card', status: 'PAID' },
            { id: 'TXN-9982', date: '2026-01-10', category: 'CBSE Examination Fee Class VII', amount: 3500, paymentMode: 'Cash Deposit', status: 'PAID' },
            { id: 'TXN-pending', date: '2026-03-01', category: 'Transportation & Bus Fee Q4', amount: 3500, paymentMode: 'Pending', status: 'DUE' }
          ]
        },
        {
          id: 'sc-2',
          scholarNo: '4928',
          studentName: 'RAHUL SHARMA',
          currentClass: 'CLASS VI-B',
          annualFee: 38000,
          transactions: [
            { id: 'TXN-1011', date: '2025-05-02', category: 'Registration & Admission Ledger', amount: 12000, paymentMode: 'Net-Banking', status: 'PAID' },
            { id: 'TXN-1012', date: '2025-09-10', category: 'Tuition Fee Q1-Q2 Bundle', amount: 18000, paymentMode: 'Cash Deposit', status: 'PAID' }
          ]
        }
      ];
    }

    if (students.length > 0) {
      let updated = [...loadedScholars];
      let mutated = false;

      students.forEach(std => {
        // Find match in scholar database
        const scIndex = updated.findIndex(sc => {
          const scNum = sc.scholarNo.replace(/\D/g, '');
          const stdNum = std.scholarsNo.replace(/\D/g, '');
          const scName = sc.studentName.toUpperCase();
          const stdName = std.name.toUpperCase();
          
          return (scNum && stdNum && scNum === stdNum) || 
                 scName.includes(stdName) || 
                 stdName.includes(scName);
        });

        if (scIndex === -1) {
          // If student has no schema entry on Scholar Ledgers, auto-construct so Admin & Parent sync fully
          const mockAnnual = std.className.includes('VIII') ? 45000 : std.className.includes('V') ? 35000 : 38000;
          const newScholar: ScholarProfile = {
            id: `sc-dy-${std.id}`,
            scholarNo: std.scholarsNo,
            studentName: std.name.toUpperCase(),
            currentClass: `${std.className || 'CLASS VIII'}-${std.section || 'A'}`,
            annualFee: mockAnnual,
            transactions: [
              { id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`, date: '2025-06-12', category: 'Registration & Admission Fee', amount: 10000, paymentMode: 'UPI / GooglePay', status: 'PAID' },
              { id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`, date: '2025-10-05', category: 'Quarterly Tuition Fees (Q1 & Q2)', amount: 15000, paymentMode: 'Bank Transfer (IMPS)', status: 'PAID' },
              { id: `TXN-due-${std.id}`, date: '2026-07-15', category: 'Outstanding Tuition Fee Balance (Term 2)', amount: 12500, paymentMode: 'Pending', status: 'DUE' }
            ]
          };
          updated.push(newScholar);
          mutated = true;
        } else {
          // Sync standard labels if class was promoted
          const sc = updated[scIndex];
          const calculatedClass = `${std.className || 'CLASS VIII'}-${std.section || 'A'}`;
          if (sc.currentClass !== calculatedClass || sc.scholarNo !== std.scholarsNo) {
            updated[scIndex] = {
              ...sc,
              scholarNo: std.scholarsNo,
              currentClass: calculatedClass
            };
            mutated = true;
          }
        }
      });

      setScholarsList(updated);
      if (mutated || !savedScholars) {
        localStorage.setItem('sxc_all_scholars', JSON.stringify(updated));
      }
    } else {
      setScholarsList(loadedScholars);
    }
  }, [students]);

  // Read current active child's scholar account record dynamically
  const activeScholar: ScholarProfile | undefined = activeChild ? scholarsList.find(sc => {
    const scNum = sc.scholarNo.replace(/\D/g, '');
    const stdNum = activeChild.scholarsNo.replace(/\D/g, '');
    const scName = sc.studentName.toUpperCase();
    const stdName = activeChild.name.toUpperCase();
    
    return (scNum && stdNum && scNum === stdNum) || 
           scName.includes(stdName) || 
           stdName.includes(scName);
  }) : undefined;

  // Active ledger parameters
  const pendingTransactions = activeScholar?.transactions.filter(t => t.status === 'DUE') || [];
  const outstandingDueAmount = pendingTransactions.reduce((sum, t) => sum + t.amount, 0);
  const duesDeadlineDate = pendingTransactions.length > 0 ? pendingTransactions[0].date : '2026-07-31';

  // Voice activation for secure fee payment
  useEffect(() => {
    const handleVoicePay = () => {
      if (outstandingDueAmount > 0 && pendingTransactions.length > 0) {
        handleInitiatePayment(pendingTransactions[0]);
      }
    };
    window.addEventListener('sxc_voice_pay_fees', handleVoicePay);
    return () => {
      window.removeEventListener('sxc_voice_pay_fees', handleVoicePay);
    };
  }, [outstandingDueAmount, pendingTransactions]);

  // Secure payment workflows
  const handleInitiatePayment = (txn: FeeTransaction) => {
    setSelectedTxnToPay(txn);
    setPaymentStep('method');
    setShowPaymentPortal(true);
  };

  const handleSimulatePaymentCompletion = () => {
    if (!selectedTxnToPay || !activeScholar) return;
    setPaymentStep('processing');
    
    // Simulate payment gateway routing delay (elegant screen loading state)
    setTimeout(() => {
      setPaymentStep('otp');
    }, 1200);
  };

  const handleVerifyOtpAndFinalize = () => {
    if (!selectedTxnToPay || !activeScholar) return;

    // Mutate the transaction status to PAID in local state list
    const updatedScholars = scholarsList.map(sc => {
      if (sc.id === activeScholar.id) {
        return {
          ...sc,
          transactions: sc.transactions.map(t => {
            if (t.id === selectedTxnToPay.id) {
              return { 
                ...t, 
                status: 'PAID' as const, 
                paymentMode: payMethod === 'upi' ? `UPI (${upiAddress})` : payMethod === 'card' ? `CARD (Ending ${cardNumber.slice(-4)})` : 'Netbanking Sync'
              };
            }
            return t;
          })
        };
      }
      return sc;
    });

    setScholarsList(updatedScholars);
    localStorage.setItem('sxc_all_scholars', JSON.stringify(updatedScholars));

    // Dispatch event to both tabs, instant synchrony 
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('sxc_scholar_payment'));

    setPaymentStep('success');

    // Automatically inject receipt notes directly to the helpdesk messaging list
    const newHelpdeskSystemMessage = {
      id: `m-paid-${Date.now()}`,
      sender: 'teacher',
      text: `💳 SECURE RECEIPT VERIFY: Received digital online payment authorization of ₹${selectedTxnToPay.amount.toLocaleString('en-IN')} for "${selectedTxnToPay.category}" on scholar register #${activeScholar.scholarNo}! Digital receipt log status has been set to PAID across ERP servers.`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
    
    const existingChats = localStorage.getItem(`sxc_parent_chat_${activeChildId}`);
    let chatsArr = [];
    if (existingChats) {
      try { chatsArr = JSON.parse(existingChats); } catch(e){}
    }
    const updatedChats = [...chatsArr, newHelpdeskSystemMessage];
    localStorage.setItem(`sxc_parent_chat_${activeChildId}`, JSON.stringify(updatedChats));
    setChatMessages(updatedChats);
  };

  // Homework Database States
  const [homeworks, setHomeworks] = useState(() => {
    const saved = localStorage.getItem('sxc_parent_homeworks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: 'hw-1', subject: 'Mathematics', title: 'Chapter 5 Theory Examples', details: 'Complete exercise 5.2 (Questions 1 to 10) in your homework notebook.', due: 'Tomorrow, 10:00 AM', status: 'Pending', requiredForGrading: 'High Priority', attachment: null },
      { id: 'hw-2', subject: 'Science / Physics', title: 'Thermal Energy Diagram', details: 'Draw the heat radiation graph with labels as explained in lecture video.', due: 'In 2 days', status: 'Submitted', requiredForGrading: 'Standard', attachment: 'scientific_chart_v1.pdf' },
      { id: 'hw-3', subject: 'English Grammar', title: 'Creative Writing Task', details: 'Write a 250-word story starting with "The unexpected storm..." using complex adjectives.', due: 'Next Monday', status: 'Pending', requiredForGrading: 'Medium Priority', attachment: null }
    ];
  });

  useEffect(() => {
    localStorage.setItem('sxc_parent_homeworks', JSON.stringify(homeworks));
  }, [homeworks]);

  // Live Chat Messenger States (specific to each child for real parent-teacher messaging)
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Reload chat histories based on student ID to provide individual message support
  useEffect(() => {
    if (!activeChildId) return;
    const saved = localStorage.getItem(`sxc_parent_chat_${activeChildId}`);
    if (saved) {
      try {
        setChatMessages(JSON.parse(saved));
        return;
      } catch (e) {}
    }
    setChatMessages([
      { id: 'm1', sender: 'teacher', text: `Welcome to Saint Xavier Convent virtual parents helpdesk! This is Mrs. Archana Dubey, senior class co-ordinator for ${activeChild?.name}'s grade (${activeChild?.className}-${activeChild?.section || 'A'}). Here you can directly request academic status, receive home assignment reports, or declare sickness leaves. How can I assist you?`, timestamp: '09:00 AM' }
    ]);
  }, [activeChildId]);

  // Homework status toggle
  const toggleHomeworkStatus = (hwId: string) => {
    setHomeworks(prev => prev.map(hw => {
      if (hw.id === hwId) {
        return { ...hw, status: hw.status === 'Pending' ? 'Submitted' : 'Pending' };
      }
      return hw;
    }));
  };

  // Fake drag and drop/upload attachment mechanism
  const [dragActive, setDragActive] = useState(false);
  const [selectedHwIdForUpload, setSelectedHwIdForUpload] = useState<string | null>(null);

  const handleHomeworkUpload = (hwId: string, fileName: string) => {
    setHomeworks(prev => prev.map(hw => {
      if (hw.id === hwId) {
        return { ...hw, attachment: fileName, status: 'Submitted' };
      }
      return hw;
    }));
    
    // Print notification alert in chat
    const alertMsg = {
      id: `chat-alert-${Date.now()}`,
      sender: 'teacher',
      text: `✓ File "${fileName}" has been successfully submitted to the cloud homework locker for ${activeChild?.name}'s assignment. Subject teacher has been notified.`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };
    const newChat = [...chatMessages, alertMsg];
    setChatMessages(newChat);
    localStorage.setItem(`sxc_parent_chat_${activeChildId}`, JSON.stringify(newChat));
  };

  // Chat messaging system - context aware smart replies
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: `parent-msg-${Date.now()}`,
      sender: 'parent',
      text: inputText,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };

    const updatedChat = [...chatMessages, userMsg];
    setChatMessages(updatedChat);
    localStorage.setItem(`sxc_parent_chat_${activeChildId}`, JSON.stringify(updatedChat));
    setInputText('');

    setIsTyping(true);

    setTimeout(() => {
      let replyText = `Thanks for writing. We have registered your message for ${activeChild?.name}. I will discuss this in the school committee session and write back.`;
      const query = inputText.toLowerCase();

      if (query.includes('homework') || query.includes('hw') || query.includes('assignment') || query.includes('kam') || query.includes('home work')) {
        replyText = `Regarding home assignments: Today's pending assignments for ${activeChild?.name} are listed in your Homework Desk. You can upload scanned homework files directly to qualify for Term marksheets.`;
      } else if (query.includes('fee') || query.includes('payment') || query.includes('fees') || query.includes('dues') || query.includes('paisa')) {
        replyText = `Please refer to the Scholar Ledgers under the physical ERP workstation. Balance schedules, fee installments paid, and pending digital receipts are automatically synced there. Let us know if you spot a discrepancy.`;
      } else if (query.includes('exam') || query.includes('result') || query.includes('marks') || query.includes('progress') || query.includes('fail') || query.includes('pass')) {
        replyText = `${activeChild?.name} shows sound concentration in daily lectures, holding an overall attendance score of ${attData.percent}%. You can review their detailed subjects breakdown under the Progress tab or print their Report Card right now!`;
      } else if (query.includes('leave') || query.includes('absent') || query.includes('sick') || query.includes('fever') || query.includes(' छुट्टी')) {
        replyText = `Noted. I have updated ${activeChild?.name}'s leave journal and notified their coordinator. Their attendance roster stays active. Wishing them a robust, speedy recovery.`;
      } else if (query.includes('live') || query.includes('class') || query.includes('zoom') || query.includes('video') || query.includes('link')) {
        replyText = `Live interactive classes are restricted strictly to ${activeChild?.name}'s registered grade: "${activeChild?.className}". You can check the current live schedule in the Student Live Class tab of your portal!`;
      }

      const botMsg = {
        id: `teacher-reply-${Date.now()}`,
        sender: 'teacher',
        text: replyText,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      };

      const finalChat = [...updatedChat, botMsg];
      setChatMessages(finalChat);
      localStorage.setItem(`sxc_parent_chat_${activeChildId}`, JSON.stringify(finalChat));
      setIsTyping(false);
    }, 1500);
  };

  // Filter Live Classes only for the active child's class!
  const getRestrictedLiveClasses = () => {
    if (!activeChild) return [];
    const normalizedChild = activeChild.className.toUpperCase().trim();
    return LIVE_CLASSES_REGISTRY.filter(lc => {
      // Direct substring or match checking to restrict appropriately
      return lc.className.toUpperCase().includes(normalizedChild) || normalizedChild.includes(lc.className.toUpperCase());
    });
  };

  const restrictedLiveClasses = getRestrictedLiveClasses();

  // Active Streaming Simulation States
  const [selectedLiveClassToJoin, setSelectedLiveClassToJoin] = useState<LiveClassItem | null>(null);
  const [liveStreamMsgInput, setLiveStreamMsgInput] = useState('');
  const [liveStreamChat, setLiveStreamChat] = useState<any[]>([
    { id: 1, sender: 'Teacher (Live)', text: 'Welcome pupils! Keep your science text notebooks ready.', time: '09:05 AM' },
    { id: 2, sender: 'Sara Alam', text: 'Good morning maam! Excited for linear energy models.', time: '09:06 AM' },
    { id: 3, sender: 'Zain Shaikh', text: 'Present! Will this lab session notes be shared in notifications?', time: '09:08 AM' }
  ]);

  const handleJoinClassClick = (lc: LiveClassItem) => {
    setSelectedLiveClassToJoin(lc);
    // Restart live chat for new class context
    setLiveStreamChat([
      { id: 1, sender: `${lc.teacher} (Live)`, text: `Hello everyone! Welcome to today's active session on "${lc.topic}". Make sure to take down reference notes.`, time: lc.startTime },
      { id: 2, sender: 'Student Board', text: 'Class feed initialized. Stream resolution stabilized.', time: 'System Log' }
    ]);
  };

  const submitLiveStreamChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveStreamMsgInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: 'You (Parent)',
      text: liveStreamMsgInput,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
    };

    const updated = [...liveStreamChat, newMsg];
    setLiveStreamChat(updated);
    setLiveStreamMsgInput('');

    // Teacher responses back dynamically
    setTimeout(() => {
      if (!selectedLiveClassToJoin) return;
      const responseMsg = {
        id: Date.now() + 1,
        sender: `${selectedLiveClassToJoin.teacher} (Live)`,
        text: `Wonderful input from ${activeChild?.name}'s parent in chat queue! Yes, active study guidelines are posted in the syllabus database.`,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      };
      setLiveStreamChat(prev => [...prev, responseMsg]);
    }, 1800);
  };

  const [notices, setNotices] = useState([
    { id: 'n1', date: 'June 15, 2026', tag: 'Academic', title: 'First Terminal Board Examinations Schedule', desc: 'Saint Xavier Convent schedule for the upcoming First Terminal exams across classes I-X has been updated. Please check the school board for detailed worksheets.' },
    { id: 'n2', date: 'June 10, 2026', tag: 'Activities', title: 'Annual Inter-House Sports & Yoga Camp', desc: 'Sports registrations are officially open at the physical education desk. All student entries should be signed off by a parent.' },
    { id: 'n3', date: 'June 05, 2026', tag: 'Administration', title: 'Monsoon Uniform Guidelines & Bus Timings', desc: 'Given heavy rainfall alerts around Scheme 78, buses will run 15 minutes early. Parents are advised to make suitable pick-up arrangements.' }
  ]);

  // Helper calculating marks
  const totalMax = activeChild?.subjects?.reduce((sum, s) => sum + (s.maxTheory || 100), 0) || 0;
  const totalObt = activeChild?.subjects?.reduce((sum, s) => sum + (s.obtTheory || 0), 0) || 0;
  const averagePercentage = totalMax > 0 ? Math.round((totalObt / totalMax) * 100) : 85;

  return (
    <div className={`p-4 md:p-8 rounded-3xl min-h-[600px] border flex flex-col transition-all ${
      isGlass 
        ? 'bg-white/95 backdrop-blur-xl border-white/50 text-[#431407]' 
        : 'bg-[#151518] border-[#2C2C2E] text-white'
    }`} id="parent-secured-workspace">
      
      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-gray-500/10 gap-4 mb-6">
        <div>
          <span className="px-3 py-1 bg-orange-400/15 text-teal-600 dark:text-teal-400 rounded-full text-[10px] font-black tracking-widest uppercase mb-2 inline-block">
            👪 PARENT PORTAL CONSOLE
          </span>
          <h2 className="text-3xl font-black tracking-tight select-none">
            Welcome, Parent Dashboard
          </h2>
          <p className="opacity-60 text-xs font-semibold mt-1">
            Real-time synchronization for student progress records, restricted live stream rooms, and chat messaging.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReportCardModal(true)}
            className="px-4 py-2.5 bg-orange-400 text-white rounded-xl transition hover:bg-teal-600 flex items-center gap-2 text-xs font-bold shadow-lg"
          >
            <Printer className="w-4 h-4" /> Print Report Card
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/10 rounded-xl transition flex items-center gap-1.5 text-xs font-bold"
              id="btn-parent-signout"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          )}
        </div>
      </div>

      {/* 2. Active Child Selector & High-Contrast Status overview */}
      {activeChild && (
        <div className={`mb-6 p-5 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-5 tracking-wide ${
          isGlass 
            ? 'bg-[#F8FAFC] border-slate-200/60 shadow-sm' 
            : 'bg-[#0E0E10] border-[#252528]'
        }`}>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-orange-400/10 text-orange-400 flex items-center justify-center shrink-0 border border-orange-400/20 shadow-inner">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono tracking-wider opacity-50 uppercase">Student Profile</span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              </div>
              <h3 className="text-lg font-black tracking-tight text-teal-600 dark:text-teal-400 uppercase">
                {activeChild.name}
              </h3>
              <p className="text-xs opacity-60 font-semibold mt-0.5">
                Class Name: <span className="font-bold underline">{activeChild.className}</span> • Section: <span className="font-bold">{activeChild.section || 'A'}</span> • Scholar No: <span className="font-bold font-mono">{activeChild.scholarsNo}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto md:justify-end">
            <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase block w-full md:w-auto md:mb-0">
              Select child:
            </span>
            {students.map((st) => (
              <button
                key={st.id}
                onClick={() => setActiveChildId(st.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeChildId === st.id
                    ? 'bg-orange-400 text-white font-extrabold shadow-md transform -translate-y-0.5'
                    : isGlass
                      ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      : 'bg-[#1A1A1E] border border-white/5 text-gray-300 hover:bg-[#25252A]'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                {st.name.split(' ')[0]} ({st.className.replace('CLASS ', '')})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. Navigation Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Workspace navigation rail tabs */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-none whitespace-nowrap">
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl text-left border transition-all ${
              activeTab === 'progress'
                ? 'bg-orange-400/10 border-orange-400/40 text-teal-600 dark:text-teal-400 font-extrabold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Award className="w-4 h-4 text-orange-400" />
            📊 Student Progress
          </button>
          
          <button
            onClick={() => setActiveTab('live')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl text-left border transition-all relative ${
              activeTab === 'live'
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400 font-extrabold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-duration-1000"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
            </span>
            🔴 Student Live Class
          </button>

          <button
            onClick={() => setActiveTab('homework')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl text-left border transition-all ${
              activeTab === 'homework'
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 font-extrabold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-500" />
            📝 Homework Board
          </button>

          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl text-left border transition-all ${
              activeTab === 'chat'
                ? 'bg-rose-500/10 border-rose-500/40 text-emerald-600 dark:text-emerald-400 font-extrabold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-rose-500" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
            </div>
            💬 WhatsApp Helpdesk
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl text-left border transition-all ${
              activeTab === 'notices'
                ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-600 dark:text-indigo-400 font-extrabold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <Bell className="w-4 h-4 text-indigo-500" />
            📢 School Announcements
          </button>

          <button
            onClick={() => setActiveTab('fees')}
            className={`flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-wider rounded-xl text-left border transition-all ${
              activeTab === 'fees'
                ? 'bg-rose-500/10 border-rose-500/40 text-rose-600 dark:text-rose-400 font-extrabold'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            id="parent-nav-fees"
          >
            <Wallet className="w-4 h-4 text-rose-500" />
            ₹ Fee Ledgers & payments
          </button>
        </div>

        {/* Dynamic content deck (9 columns) */}
        <div className="lg:col-span-9">
          
          {/* TAB 1: SPECIFIC STUDENT PROGRESS TRACKING */}
          {activeTab === 'progress' && activeChild && (
            <div className="space-y-6">
              
              {/* Scorecard Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-2xl border flex items-center gap-4 ${isGlass ? 'bg-indigo-50/40 border-slate-200' : 'bg-indigo-500/5 border-white/5'}`}>
                  <div className="w-14 h-14 rounded-full bg-indigo-500/15 flex items-center justify-center shrink-0">
                    <Award className="w-7 h-7 text-indigo-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-mono tracking-widest block uppercase">Academic Score</span>
                    <span className="text-xl font-black text-indigo-600 dark:text-indigo-400">{averagePercentage}%</span>
                    <p className="text-[10px] opacity-60 font-medium">Rank standing: Above average</p>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border flex items-center gap-4 ${isGlass ? 'bg-emerald-50/40 border-slate-200' : 'bg-rose-500/5 border-white/5'}`}>
                  <div className="w-14 h-14 rounded-full bg-rose-500/15 flex items-center justify-center shrink-0 font-bold text-lg font-mono text-emerald-600 dark:text-emerald-400">
                    {attData.percent}%
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-mono tracking-widest block uppercase">Total Attendance</span>
                    <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{activeChild.attendance}</span>
                    <p className="text-[10px] opacity-60 font-medium font-mono">School open days: {attData.total}</p>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border flex items-center gap-4 ${isGlass ? 'bg-amber-50/40 border-slate-200' : 'bg-amber-500/5 border-white/5'}`}>
                  <div className="w-14 h-14 rounded-full bg-amber-500/15 flex items-center justify-center shrink-0 font-sans text-xl font-black text-amber-500">
                    {activeChild.disciplineGrade}
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-mono tracking-widest block uppercase">Discipline Standing</span>
                    <span className="text-sm font-black text-amber-600 dark:text-amber-400 uppercase">Excellent Conduct</span>
                    <p className="text-[10px] opacity-70 italic mt-0.5 font-medium leading-tight">Remarks verified</p>
                  </div>
                </div>
              </div>

              {/* Random Q/A Assessment Results */}
              {quizRecords.length > 0 && (
                <div className={`p-6 rounded-2xl border ${isGlass ? 'bg-indigo-50/50 border-indigo-100 shadow-sm' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                  <h3 className="font-black text-sm uppercase text-indigo-600 dark:text-indigo-400 mb-4 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5"/> Random Assessment Q/A Results
                  </h3>
                  <div className="space-y-3">
                    {quizRecords.slice().reverse().slice(0, 3).map((record, i) => (
                      <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-white/50 dark:bg-black/20 border border-gray-500/10">
                        <div>
                           <p className="font-bold text-sm">{record.topic}</p>
                           <p className="text-[10px] opacity-60 font-mono mt-1">{new Date(record.date).toLocaleString()}</p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg font-black shrink-0 text-center ${record.score >= 80 ? 'bg-rose-500/10 text-emerald-600 dark:text-emerald-400' : record.score >= 60 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-red-500/10 text-red-600 dark:text-red-400'}`}>
                           Score: {record.score}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Fee Payment Status Card */}
              <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
                isGlass 
                  ? 'bg-rose-50/50 border-rose-100/80 shadow-sm' 
                  : 'bg-[#1C1215] border-[#311F24]'
              }`}>
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center ${outstandingDueAmount > 0 ? 'bg-red-500/15 text-red-500' : 'bg-rose-500/15 text-rose-500'}`}>
                    {outstandingDueAmount > 0 ? <CreditCard className="w-6 h-6 animate-pulse" /> : <CheckCircle2 className="w-6 h-6" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-mono tracking-widest text-gray-400 block uppercase font-black">₹ {t('feeBalance')}</span>
                      {outstandingDueAmount > 0 ? (
                        <span className="px-2 py-0.5 bg-red-500/15 text-red-500 font-extrabold text-[9px] rounded uppercase font-mono tracking-wider animate-pulse">
                          {lang === 'hi' ? 'भुगतान अतिदेय' : lang === 'ur' ? 'ادائیگی اووردیو' : 'Payment Overdue'}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-500/15 text-rose-500 font-extrabold text-[9px] rounded uppercase font-mono tracking-wider">
                          {lang === 'hi' ? 'सफलतापूर्वक चुकता' : lang === 'ur' ? 'مکمل ادا شدہ' : 'Fully Cleared'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black tracking-tight">
                        ₹ {outstandingDueAmount.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs opacity-60 font-mono">
                        {lang === 'hi' ? 'बकाया देय राशि' : lang === 'ur' ? 'بقایا واجب الادا فیس رقم' : 'outstanding due balance'}
                      </span>
                    </div>
                    {outstandingDueAmount > 0 && pendingTransactions.length > 0 ? (
                      <p className="text-xs opacity-75 font-semibold leading-relaxed">
                        Upcoming Installment: <span className="font-extrabold underline text-red-500">{pendingTransactions[0].category}</span> due by <span className="font-extrabold font-mono text-red-500">{duesDeadlineDate}</span>
                      </p>
                    ) : (
                      <p className="text-xs opacity-75 font-medium leading-relaxed">
                        All fee dues are settled. Next cycle begins in the next scholastic term. Thank you!
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 w-full md:w-auto flex flex-col sm:flex-row md:flex-col gap-2">
                  {outstandingDueAmount > 0 ? (
                    <button
                      onClick={() => handleInitiatePayment(pendingTransactions[0])}
                      className="px-5 py-3 bg-red-600 hover:bg-red-700 hover:scale-[1.02] text-white rounded-xl text-xs font-black tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-red-500/10 shrink-0"
                    >
                      <CreditCard className="w-4 h-4" /> {lang === 'hi' ? 'बकाया शुल्क का भुगतान करें' : lang === 'ur' ? 'بقایا فیس ادا کریں' : 'Pay Outstanding Dues'}
                    </button>
                  ) : (
                    <div className="px-5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold text-xs flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Paid Ledger Synced
                    </div>
                  )}
                  {activeScholar && (
                    <button
                      onClick={() => setActiveTab('fees')}
                      className={`px-4 py-2 border rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 ${
                        isGlass 
                          ? 'border-gray-200 text-gray-700 hover:bg-slate-50' 
                          : 'border-white/5 text-gray-300 hover:bg-[#1C1C1F]'
                      }`}
                    >
                      <Receipt className="w-3.5 h-3.5" /> View Ledger Account
                    </button>
                  )}
                </div>
              </div>

              {/* Subject Breakdown Progress Bars */}
              <div className={`p-6 rounded-2xl border ${isGlass ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0E0E10] border-white/5'}`}>
                <div className="flex justify-between items-center mb-4 border-b pb-3 border-dashed border-gray-500/10">
                  <h3 className="text-sm font-black uppercase text-teal-600 dark:text-teal-400 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-orange-400" /> Continuous Assessment (Subject Performance)
                  </h3>
                  <span className="text-xs font-mono font-bold bg-orange-400/10 text-teal-600 dark:text-teal-400 px-2.5 py-0.5 rounded-full">
                    {activeChild.session}
                  </span>
                </div>

                {activeChild.subjects && activeChild.subjects.length > 0 ? (
                  <div className="space-y-4">
                    {activeChild.subjects.map((sub, idx) => {
                      const max = sub.maxTheory || 100;
                      const obt = sub.obtTheory || 0;
                      const ratio = max > 0 ? Math.round((obt / max) * 100) : 80;
                      const barFillColor = ratio >= 85 ? 'bg-rose-500' : ratio >= 65 ? 'bg-orange-400' : 'bg-amber-500';

                      return (
                        <div key={idx} className="group">
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span className="tracking-tight text-slate-800 dark:text-slate-200 uppercase">{sub.name}</span>
                            <span className="font-mono text-gray-450 opacity-90">
                              {obt} / {max} <span className="opacity-60 text-[10px]">({ratio}%)</span>
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-500/10 rounded-full overflow-hidden">
                            <div className={`h-2.5 rounded-full transition-all duration-500 ${barFillColor}`} style={{ width: `${ratio}%` }}></div>
                          </div>
                          
                          {/* Subject split marks */}
                          <div className="flex gap-4 mt-1 opacity-60 text-[9px] font-mono">
                            {sub.monthlyTestObt !== undefined && <span>Monthly: {sub.monthlyTestObt}/20</span>}
                            {sub.halfObt !== undefined && <span>Half-Yr: {sub.halfObt}/50</span>}
                            {sub.terminalObt !== undefined && <span>Terminal: {sub.terminalObt}/50</span>}
                            {sub.projectObt !== undefined && <span>Project: {sub.projectObt}/20</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm opacity-55">No scholastic data generated. Contact school administrator.</p>
                  </div>
                )}
              </div>

              {/* General Health Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-5 rounded-2xl border ${isGlass ? 'bg-[#F8FAFC]' : 'bg-[#0E0E10] border-white/5'}`}>
                  <h4 className="text-xs font-black uppercase text-teal-600 dark:text-teal-400 mb-2">🧑 Child Biological Stats</h4>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <p className="text-gray-400">Height Parameter</p>
                      <p className="font-bold text-sm mt-0.5">{activeChild.height || '145 cm'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Weight Parameter</p>
                      <p className="font-bold text-sm mt-0.5">{activeChild.weight || '38 kg'}</p>
                    </div>
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border ${isGlass ? 'bg-[#F8FAFC]' : 'bg-[#0E0E10] border-white/5'} flex items-start gap-3`}>
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black uppercase text-amber-500 tracking-wider">Teacher Guidance & Feedback</h4>
                    <p className="text-xs opacity-80 italic mt-1 leading-relaxed">
                      "{activeChild.remarks || 'Excellent concentration and diligent academic performance.'}"
                    </p>
                    <span className="text-[9px] text-gray-500 font-bold block mt-2">— Mrs. Archana Dubey, SXC Coordinator</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: RESTRICTED LIVE CLASSROOM LIST */}
          {activeTab === 'live' && activeChild && (
            <div className="space-y-6">
              
              {/* Notice Banner */}
              <div className="flex items-center justify-between bg-rose-500/15 border border-rose-500/20 p-4 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-rose-500 text-white rounded text-[9px] font-black tracking-wider animate-pulse">
                    SECURED LOCK
                  </span>
                  <div>
                    <p className="text-xs font-bold text-rose-500 tracking-wide">Authorized Class Roster Validation Active</p>
                    <p className="text-[10px] opacity-75">Only displaying interactive live classes structured for: <span className="font-bold underline">{activeChild.className}</span></p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-rose-500 font-extrabold uppercase shrink-0">ROSTER LEVEL 1</span>
              </div>

              {selectedLiveClassToJoin ? (
                /* Joined Live Stream Simulator Room */
                <div className="space-y-4 animate-slideUp">
                  
                  {/* Top back actions */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setSelectedLiveClassToJoin(null)}
                      className="px-3 py-1.5 bg-gray-500/10 hover:bg-gray-500/20 rounded-lg text-xs font-black transition"
                    >
                      ← Back to Live Catalog
                    </button>
                    <span className="text-xs font-black text-rose-500 animate-pulse flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span> Live Streaming Interactive Room ({activeChild.className})
                    </span>
                  </div>

                  {/* High quality live video mock layout */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    
                    {/* Streaming monitor */}
                    <div className="xl:col-span-8 space-y-3">
                      <div className="relative rounded-2xl overflow-hidden aspect-video bg-black flex flex-col justify-between p-4 border border-white/5 shadow-2xl">
                        
                        {/* Stream signal headers */}
                        <div className="relative z-10 flex items-center justify-between text-white text-[10px] font-mono">
                          <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1 rounded">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                            <span>CONNECTED LIVE FEED</span>
                          </div>
                          <span className="opacity-70 bg-black/60 px-2 py-1 rounded">1080P HD • Broadcaster Verified</span>
                        </div>

                        {/* Interactive animation layout inside whiteboard */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none bg-gradient-to-tr from-indigo-950/90 via-slate-900/40 to-black">
                          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center animate-bounce mb-3 border border-white/20">
                            <Video className="w-8 h-8 text-white animate-pulse" />
                          </div>
                          <span className="text-xs font-black text-rose-300 tracking-widest uppercase bg-black/60 px-3 py-1.5 rounded-lg border border-rose-500/20">
                            {selectedLiveClassToJoin.subject} CLASS
                          </span>
                          <p className="text-[10px] font-medium text-slate-300 mt-2 text-center max-w-sm font-sans">
                            Topic: "{selectedLiveClassToJoin.topic}"
                          </p>
                          <p className="text-[9px] text-[#2ac] font-mono mt-1">Instructor: {selectedLiveClassToJoin.teacher}</p>
                        </div>

                        {/* Stream audio/playback controllers */}
                        <div className="relative z-10 flex items-center justify-between bg-black/85 p-2 rounded-xl text-white border border-white/5">
                          <button className="p-1 hover:bg-white/10 rounded">
                            <Play className="w-4 h-4 text-rose-500 fill-rose-500" />
                          </button>
                          
                          <div className="flex-1 mx-3 h-1 bg-white/20 rounded-full relative">
                            <div className="w-3/4 h-full bg-rose-500 rounded-full"></div>
                          </div>

                          <div className="flex items-center gap-3">
                            <Volume2 className="w-4 h-4 opacity-75" />
                            <span className="text-[9px] font-mono tracking-tighter opacity-70">SENSITIVE VOICE FILTERED</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-black uppercase text-teal-600 dark:text-teal-400">Class Lecture: {selectedLiveClassToJoin.subject}</h4>
                        <div className="flex items-center gap-2 mt-1 text-xs opacity-75">
                          <span>Conducting: <span className="font-bold underline">{selectedLiveClassToJoin.teacher}</span></span>
                          <span>•</span>
                          <span>Duration: {selectedLiveClassToJoin.duration}</span>
                        </div>
                      </div>
                    </div>

                    {/* Chat desk panel */}
                    <div className="xl:col-span-4 flex flex-col h-[340px] rounded-2xl border border-slate-500/10 bg-slate-500/5 overflow-hidden">
                      <div className="px-4 py-2.5 bg-rose-500/10 border-b border-gray-500/10 flex items-center gap-2 shrink-0">
                        <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                        <h4 className="text-xs font-black uppercase tracking-wider text-rose-500">Live Lecture Chat Index</h4>
                      </div>

                      {/* Chat messages */}
                      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 text-[11px]">
                        {liveStreamChat.map(item => (
                          <div key={item.id} className="p-2 bg-white/80 dark:bg-[#1A1A1E] rounded-xl border border-gray-500/5 shadow-sm">
                            <div className="flex justify-between items-center mb-0.5 font-bold">
                              <span className="text-teal-600 dark:text-teal-400">{item.sender}</span>
                              <span className="text-[9px] text-gray-400 font-mono">{item.time}</span>
                            </div>
                            <p className="opacity-85 font-medium">{item.text}</p>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={submitLiveStreamChat} className="p-2 border-t border-gray-500/10 bg-white dark:bg-[#101012] shrink-0 flex gap-1.5">
                        <input
                          type="text"
                          value={liveStreamMsgInput}
                          onChange={e => setLiveStreamMsgInput(e.target.value)}
                          placeholder="Verify or ask question to live lecture..."
                          className="flex-1 p-2 bg-slate-100 dark:bg-[#1C1C20] border border-gray-500/10 focus:outline-none focus:border-rose-500 rounded-lg text-[11px]"
                        />
                        <button type="submit" className="p-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition shrink-0">
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>
                    </div>

                  </div>

                </div>
              ) : (
                /* Class Catalog list */
                <div className="space-y-4">
                  {restrictedLiveClasses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {restrictedLiveClasses.map((lc) => (
                        <div
                          key={lc.id}
                          className={`p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg flex flex-col justify-between ${
                            isGlass 
                              ? 'bg-white hover:border-orange-400/40 border-slate-200' 
                              : 'bg-[#121215] border-white/5 hover:border-orange-400/20'
                          }`}
                        >
                          <div>
                            <div className="flex justify-between items-start mb-3">
                              <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-500 rounded text-[9px] font-black uppercase font-mono">
                                Class Roster Math
                              </span>
                              <span className="text-[10px] font-mono text-gray-400">{lc.startTime} ({lc.duration})</span>
                            </div>
                            
                            <h4 className="text-base font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">{lc.subject}</h4>
                            <p className="text-xs opacity-80 mt-1 font-semibold text-teal-600 dark:text-teal-400">Instructor: {lc.teacher}</p>
                            <p className="text-xs opacity-60 mt-1 italic font-medium">Topic: "{lc.topic}"</p>
                          </div>

                          <div className="mt-5 pt-3 border-t border-gray-500/10 flex justify-between items-center">
                            <span className="text-[10px] text-rose-500 font-extrabold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse"></span> Broadcaster Ready
                            </span>
                            
                            <button
                              onClick={() => handleJoinClassClick(lc)}
                              className="px-4 py-2 bg-orange-400 hover:bg-teal-600 text-white rounded-xl text-xs font-black tracking-wide transition flex items-center gap-1 shadow-sm"
                            >
                              <Play className="w-3.5 h-3.5" /> Join Interactive Class
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 rounded-2xl border border-dashed border-gray-500/20 bg-gray-500/5">
                      <Video className="w-12 h-12 mx-auto text-gray-400 animate-pulse mb-3" />
                      <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No interactive live lectures scheduled today</p>
                      <p className="text-xs text-gray-500 mt-1">Live classes are strictly restricted to the registered child's academic grade roster: <span className="underline font-bold">{activeChild.className}</span></p>
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

          {/* TAB 3: DEDICATED MESSAGE INTERFACE FOR HOMEWORK NOTIFICATIONS */}
          {activeTab === 'homework' && activeChild && (
            <div className="space-y-6">
              
              {/* Submission instruction bar */}
              <div className={`p-4 rounded-xl border flex items-start gap-3 ${isGlass ? 'bg-amber-50/50 border-amber-200' : 'bg-amber-500/5 border-amber-500/20'}`}>
                <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase text-amber-600 dark:text-amber-400">Homework Policy: Term Grading Verification</h4>
                  <p className="text-[11px] opacity-80 mt-0.5 leading-relaxed">
                    Student home assignments are strictly tracked. Complete lists or upload scanned PDF/image assignments below. Correct submissions will alter overall terminal progress scores instantly.
                  </p>
                </div>
              </div>

              {/* Homework cards */}
              <div className="space-y-4">
                {homeworks.map((hw) => (
                  <div
                    key={hw.id}
                    className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                      hw.status === 'Submitted' 
                        ? (isGlass ? 'bg-emerald-50/20 border-emerald-100' : 'bg-rose-500/5 border-rose-500/10')
                        : (isGlass ? 'bg-white border-slate-200' : 'bg-[#121215] border-white/5')
                    }`}
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Interactive checkbox */}
                      <button
                        onClick={() => toggleHomeworkStatus(hw.id)}
                        className={`w-5.5 h-5.5 rounded-lg border flex items-center justify-center transition shrink-0 mt-0.5 ${
                          hw.status === 'Submitted'
                            ? 'bg-rose-500 border-rose-500 text-white shadow-sm'
                            : 'border-slate-300 hover:border-orange-400'
                        }`}
                      >
                        {hw.status === 'Submitted' && <Check className="w-4 h-4 text-white" />}
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-orange-400/10 text-teal-600 dark:text-teal-400 rounded text-[9px] font-black uppercase font-mono">
                            {hw.subject}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            hw.requiredForGrading === 'High Priority' 
                              ? 'bg-red-500/10 text-red-500' 
                              : 'bg-gray-500/15 text-gray-500'
                          }`}>
                            {hw.requiredForGrading}
                          </span>
                        </div>

                        <h4 className="text-base font-black text-slate-800 dark:text-slate-100 mt-1 select-none">
                          {hw.title}
                        </h4>
                        <p className="text-xs opacity-80 mt-1 font-medium leading-relaxed">
                          {hw.details}
                        </p>

                        <div className="flex flex-wrap gap-4 items-center mt-3 text-[10px] font-mono text-gray-400">
                          <span className="flex items-center gap-1">⏰ Due time schedule: <span className="font-bold underline">{hw.due}</span></span>
                          {hw.attachment && (
                            <span className="flex items-center gap-1 bg-rose-500/10 text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded border border-rose-500/10">
                              📎 Loaded attachment: {hw.attachment}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-none border-dashed border-gray-500/10">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-wider uppercase ${
                        hw.status === 'Submitted'
                          ? 'bg-rose-500/15 text-rose-500'
                          : 'bg-amber-500/15 text-amber-500 animate-pulse'
                      }`}>
                        {hw.status === 'Submitted' ? '✓ SUBMITTED CONVENT' : '🕒 PENDING APPROVAL'}
                      </span>

                      {/* Attachment uploader toggle */}
                      {hw.status !== 'Submitted' ? (
                        <div>
                          <input
                            type="file"
                            id={`hw-upload-input-${hw.id}`}
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleHomeworkUpload(hw.id, file.name);
                              }
                            }}
                          />
                          <button
                            onClick={() => document.getElementById(`hw-upload-input-${hw.id}`)?.click()}
                            className="px-3 py-1.5 bg-orange-400 hover:bg-teal-600 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                          >
                            <Upload className="w-3.5 h-3.5" /> Scanned File
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setHomeworks(prev => prev.map(h => h.id === hw.id ? { ...h, status: 'Pending', attachment: null } : h));
                          }}
                          className="text-[10px] text-red-500 hover:underline font-bold"
                        >
                          Discard submission
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: WHATSAPP MESSENGER HELPDESK */}
          {activeTab === 'chat' && activeChild && (
            <div className="space-y-4">
              
              {/* WhatsApp Interface container */}
              <div className="rounded-3xl border border-slate-500/10 overflow-hidden shadow-2xl flex flex-col h-[525px]">
                
                {/* Header structure */}
                <div className="bg-emerald-600 dark:bg-[#075e54] p-4 text-white flex items-center justify-between shrink-0 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-white/25 flex items-center justify-center font-bold text-lg border border-white/20">
                        AD
                      </div>
                      <span className="w-3 h-3 bg-emerald-400 border-2 border-[#075e54] rounded-full absolute bottom-0 right-0"></span>
                    </div>
                    <div>
                      <h4 className="font-sans font-extrabold text-sm flex items-center gap-1 uppercase tracking-wide">
                        Mrs. Archana Dubey <span className="text-[9px] bg-emerald-700 text-emerald-100 font-bold px-1.5 py-0.5 rounded ml-1">Class Teacher</span>
                      </h4>
                      <p className="text-[10px] text-emerald-100 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                        Active parents helpdesk corridor
                      </p>
                    </div>
                  </div>

                  <div className="text-[10px] bg-emerald-700 px-3 py-1 rounded-full font-mono text-emerald-100">
                    SECURED DESK
                  </div>
                </div>

                {/* Message Body lists */}
                <div className="flex-1 bg-gradient-to-b from-[#efeae2]/15 to-[#efeae2]/25 dark:from-[#0b141a] dark:to-[#0b141a] p-4 overflow-y-auto space-y-4 font-sans">
                  
                  <div className="mx-auto w-fit px-3 py-1 bg-orange-400/10 border border-orange-400/20 text-teal-600 dark:text-teal-400 rounded-full text-[9px] font-black uppercase tracking-wider mb-2 text-center">
                    🔒 Chat logs are protected under school telemetry audits
                  </div>

                  {chatMessages.map((msg, idx) => {
                    const isTeacher = msg.sender === 'teacher';
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isTeacher ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`p-3 max-w-[85%] sm:max-w-md rounded-[18px] shadow-sm relative ${
                          isTeacher
                            ? 'bg-white text-slate-800 rounded-tl-none border border-slate-200/50'
                            : 'bg-[#e2f1e1] dark:bg-[#005c4b] text-slate-800 dark:text-white rounded-tr-none border border-rose-500/10'
                        }`}>
                          <span className="text-[9px] font-extrabold uppercase block mb-1 opacity-60 tracking-wider">
                            {isTeacher ? 'Class Administrator' : 'You (Parent)'}
                          </span>
                          <p className="text-xs leading-relaxed font-semibold">{msg.text}</p>
                          <span className="text-[8px] text-gray-400 font-mono block mt-1.5 text-right">
                            {msg.timestamp}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Simulator */}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="p-3 bg-white text-slate-800 rounded-[18px] rounded-tl-none border border-slate-200/50 max-w-xs shadow-sm flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-[#05c4b] text-rose-500 animate-pulse">Co-ordinator is replying</span>
                        <span className="flex gap-0.5">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Chat form trigger */}
                <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-500/10 bg-white dark:bg-[#101012] shrink-0 flex gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Ask standard exams, homework questions or leave notification..."
                    className="flex-1 p-3 bg-slate-50 dark:bg-[#18181A] border border-gray-500/10 focus:outline-none focus:border-rose-500 rounded-2xl text-xs"
                  />
                  <button type="submit" className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl transition flex items-center gap-1.5">
                    <Send className="w-4 h-4" /> Send
                  </button>
                </form>

              </div>

              {/* Quick helper queries */}
              <div className="flex flex-wrap gap-2 items-center text-xs">
                <span className="text-[10px] text-gray-400 font-bold uppercase">Quick Topics:</span>
                <button
                  onClick={() => setInputText(`Hello Mrs. Archana, please provide the homework details for today.`)}
                  className="px-2.5 py-1 bg-gray-500/10 border border-gray-500/15 rounded-lg font-bold hover:bg-gray-500/20 text-xs text-teal-600 dark:text-teal-400"
                >
                  📝 Homework updates?
                </button>
                <button
                  onClick={() => setInputText(`Hi, I would like to verify the pending school fees schedule for my child.`)}
                  className="px-2.5 py-1 bg-gray-500/10 border border-gray-500/15 rounded-lg font-bold hover:bg-gray-500/20 text-xs text-teal-600 dark:text-teal-400"
                >
                  ₹ Ledger statement?
                </button>
                <button
                  onClick={() => setInputText(`Hello, ${activeChild.name} is unwell with a seasonal fever, please approve sickness leave leave.`)}
                  className="px-2.5 py-1 bg-gray-500/10 border border-gray-500/15 rounded-lg font-bold hover:bg-gray-500/20 text-xs text-teal-600 dark:text-teal-400"
                >
                  🤒 Sickness leave?
                </button>
              </div>

            </div>
          )}

          {/* TAB 5: SCHOOL ANNOUNCEMENTS */}
          {activeTab === 'notices' && (
            <div className="space-y-4">
              <div className={`p-6 rounded-2xl border ${isGlass ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0E0E10] border-white/5'}`}>
                <h3 className="text-sm font-black uppercase text-teal-600 dark:text-teal-400 border-b pb-3 border-dashed border-gray-500/10 mb-4">
                  SXC Official Convent Bulletins
                </h3>

                <div className="space-y-5 divide-y divide-gray-500/10">
                  {notices.map((n, idx) => (
                    <div key={n.id} className={`pt-4 ${idx === 0 ? 'pt-0' : ''}`}>
                      <div className="flex justify-between items-center text-[10px] font-bold">
                        <span className="text-gray-400 font-mono">{n.date}</span>
                        <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-600 rounded uppercase font-black">{n.tag}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-800 dark:text-slate-100 mt-1">{n.title}</h4>
                      <p className="text-xs opacity-80 mt-1 leading-relaxed font-semibold">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: COMPREHENSIVE SCHOOL FEES LEDGER */}
          {activeTab === 'fees' && activeScholar && (
            <div className="space-y-6">
              <div className={`p-6 rounded-2xl border ${isGlass ? 'bg-white border-slate-100 shadow-sm' : 'bg-[#0E0E10] border-white/5'}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 border-b pb-4 border-dashed border-gray-500/10">
                  <div>
                    <h3 className="text-base font-black uppercase text-rose-600 dark:text-rose-400 flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-rose-500" /> Scholar Account Ledgers
                    </h3>
                    <p className="text-xs opacity-60 font-semibold mt-0.5">
                      Verify term installment records, past receipts, or pay outstanding school dues.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1 rounded-full uppercase tracking-wider">
                    Ledger ID: SXC-LED-{activeScholar.scholarNo}
                  </span>
                </div>

                {/* Ledger metrics bento highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className={`p-4 rounded-xl border ${isGlass ? 'bg-slate-50 border-slate-200' : 'bg-white/5 border-white/5'}`}>
                    <span className="text-[10px] text-gray-400 font-mono tracking-widest block uppercase font-bold">Annual Tuition Base</span>
                    <span className="text-lg font-black font-mono">₹ {activeScholar.annualFee.toLocaleString('en-IN')}</span>
                  </div>

                  <div className={`p-4 rounded-xl border ${isGlass ? 'bg-emerald-50/30 border-emerald-100/50' : 'bg-rose-500/5 border-rose-500/10'}`}>
                    <span className="text-[10px] text-emerald-600 font-mono tracking-widest block uppercase font-black font-black">Fees Deposited (Paid)</span>
                    <span className="text-lg font-black font-mono text-emerald-600 dark:text-emerald-400">
                      ₹ {(activeScholar.transactions.filter(t => t.status === 'PAID').reduce((sum, t) => sum + t.amount, 0)).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className={`p-4 rounded-xl border ${isGlass ? 'bg-rose-50/30 border-rose-100/50' : 'bg-rose-500/5 border-rose-500/10'}`}>
                    <span className="text-[10px] text-rose-600 font-mono tracking-widest block uppercase font-black">Fees Pending (Due)</span>
                    <span className="text-lg font-black font-mono text-rose-600 dark:text-rose-400">
                      ₹ {outstandingDueAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Main transactions ledger statement log table */}
                <div className="overflow-x-auto rounded-xl border border-gray-500/10 mb-6">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className={`${isGlass ? 'bg-[#F8FAFC] text-slate-800' : 'bg-[#1A1A1E] text-gray-300'} font-black border-b border-gray-500/10`}>
                        <th className="py-3 px-4">Transaction / Installment Item</th>
                        <th className="py-3 px-4">Scheduled Date</th>
                        <th className="py-3 px-4">Payment Channel</th>
                        <th className="py-3 px-4 text-right">Amount</th>
                        <th className="py-3 px-4 text-center">Receipt Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-500/10">
                      {activeScholar.transactions.map((txn, index) => (
                        <tr key={txn.id || index} className="hover:bg-gray-500/5 font-semibold">
                          <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-100">
                            {txn.category}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-gray-500">
                            {txn.date}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-gray-500 text-[11px]">
                            {txn.status === 'PAID' ? (
                              <span className="flex items-center gap-1.5 font-sans font-bold text-slate-755 text-slate-700 dark:text-slate-300">
                                <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                                {txn.paymentMode}
                              </span>
                            ) : (
                              <span className="opacity-40 select-none font-mono font-bold">— Pending —</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold font-mono">
                            ₹ {txn.amount.toLocaleString('en-IN')}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            {txn.status === 'PAID' ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase">
                                <CheckCircle2 className="w-3 h-3 text-rose-500" /> Settled
                              </span>
                            ) : (
                              <button
                                onClick={() => handleInitiatePayment(txn)}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 hover:scale-[1.02] text-white rounded-lg text-[10px] font-black tracking-wider uppercase transition inline-flex items-center gap-1"
                              >
                                <CreditCard className="w-3 h-3 animate-pulse" /> Pay dues
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Accounting Guidelines footer */}
                <div className={`p-4 rounded-xl border text-[11px] leading-relaxed flex items-start gap-4 ${isGlass ? 'bg-amber-50/40 border-amber-200/50 text-amber-900' : 'bg-amber-500/5 border-amber-500/10 text-amber-400'}`}>
                  <AlertCircle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                  <div>
                    <h5 className="font-extrabold uppercase tracking-wide mb-1">Saint Xavier Convent Billing Guidelines</h5>
                    <p className="opacity-85 font-medium leading-relaxed">
                      All online payments processed here are simulated on high-entropy sandbox environments which immediately update scholar records. Digital receipts generated inside the Parent Console sync flawlessly across Admin ledgers. Under section 12(A) sibling scholarship policy, a 15% discount code can be verified at physical registers. If you encounter any balance discrepancies, please reach the coordinator desk via the helpdesk portal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* 4. PDF / Printable Report Card Dialog Modal */}
      {showReportCardModal && activeChild && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white text-slate-800 max-w-4xl w-full p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl relative my-8">
            
            {/* Close modal */}
            <button
              onClick={() => setShowReportCardModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-full font-black text-xs transition"
              title="Close Report Card Screen"
            >
              ✕ Close
            </button>

            {/* Print action trigger */}
            <div className="flex justify-between items-center border-b pb-3 border-gray-200">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse"></span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Report Card PDF Live Generator</span>
              </div>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" /> Print now
              </button>
            </div>

            {/* Report card mockup container (standard 210mm layout) */}
            <div className="border-4 border-[#431407] p-6 text-[11px] font-sans text-slate-800 space-y-6 select-none bg-white">
              
              {/* Header Title */}
              <div className="text-center relative border-b-2 border-double border-gray-400 pb-4">
                <h1 className="text-2xl font-black tracking-tight text-[#431407] uppercase">SAINT XAVIER CONVENT</h1>
                <p className="text-[10px] font-bold text-gray-500 tracking-wider mt-0.5">ESTD: 1995 • SCHEME NO. 78, SECTOR A, IN-DEPTH SYLLABUS SCHOLASTICS</p>
                <p className="text-[11px] font-black text-[#5a42] bg-[#0c141a]/5 px-4 py-1 rounded inline-block mt-2">
                  OFFICIAL PROGRESS STATEMENT OF TRANSCRIPT
                </p>
              </div>

              {/* Roster profiles */}
              <div className="grid grid-cols-2 gap-y-2 border-b pb-4 text-xs font-bold">
                <p><span className="text-gray-400 uppercase">Pupil Name:</span> <span className="text-[#431407] uppercase font-black">{activeChild.name}</span></p>
                <p><span className="text-gray-400 uppercase">Roll Number:</span> <span className="font-mono">{activeChild.rollNo}</span></p>
                <p><span className="text-gray-400 uppercase">Father Name:</span> <span className="uppercase">{activeChild.fatherName}</span></p>
                <p><span className="text-gray-400 uppercase">Mother Name:</span> <span className="uppercase">{activeChild.motherName}</span></p>
                <p><span className="text-gray-400 uppercase">Class Grade:</span> <span className="uppercase font-black text-rose-500">{activeChild.className} - {activeChild.section || 'A'}</span></p>
                <p><span className="text-gray-400 uppercase">Current Session:</span> <span className="font-mono">{activeChild.session}</span></p>
                <p><span className="text-gray-400 uppercase">Total Attendance:</span> <span className="font-mono">{activeChild.attendance} roster days</span></p>
                <p><span className="text-gray-400 uppercase">Physical Health Status:</span> <span>H: {activeChild.height || '145cm'} | W: {activeChild.weight || '38kg'}</span></p>
              </div>

              {/* Table of marks */}
              <table className="w-full text-left border-collapse text-[10px]">
                <thead>
                  <tr className="bg-[#431407] text-white font-extrabold uppercase text-center border">
                    <th className="p-2 text-left w-1/3">Subject</th>
                    <th className="p-2">Monthly Test (20)</th>
                    <th className="p-2">Half Yearly (50)</th>
                    <th className="p-2">First Term (50)</th>
                    <th className="p-2">Project Tasks (20)</th>
                    <th className="p-2 text-rose-300">Total Marks (140)</th>
                  </tr>
                </thead>
                <tbody className="divide-y border">
                  {activeChild.subjects?.map((sub, i) => (
                    <tr key={i} className="font-bold text-center border-x">
                      <td className="p-2 text-left uppercase text-[#431407] font-black">{sub.name}</td>
                      <td className="p-2 font-mono">{sub.monthlyTestObt ?? 18}</td>
                      <td className="p-2 font-mono">{sub.halfObt ?? 42}</td>
                      <td className="p-2 font-mono">{sub.terminalObt ?? 43}</td>
                      <td className="p-2 font-mono">{sub.projectObt ?? 18}</td>
                      <td className="p-2 font-mono text-[#431407] bg-gray-50 font-black">{sub.obtTheory ?? 120}</td>
                    </tr>
                  ))}
                  {/* Totals row */}
                  <tr className="bg-[#f8fafc] font-black text-center border-t border-b-2">
                    <td className="p-2 text-left text-[#431407]">SUMMARY TRANSCRIPT TOTALS</td>
                    <td colSpan={4} className="p-2 text-right text-gray-500 uppercase tracking-widest text-[9px]">TOTAL AGGREGATED MARKS:</td>
                    <td className="p-2 font-mono text-xl text-[#431407] underline underline-offset-4">{totalObt} / {totalMax}</td>
                  </tr>
                </tbody>
              </table>

              {/* Footer Remarks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 font-bold text-xs leading-relaxed">
                <div>
                  <p className="text-gray-400 uppercase text-[9px] mb-1">Coordinators Direct Evaluation remarks:</p>
                  <p className="italic bg-gray-50 p-3 rounded border border-gray-200">
                    "{activeChild.remarks || 'Excellent concentration and diligent academic performance in standard curriculum.'}"
                  </p>
                </div>
                <div className="flex flex-col justify-end text-right space-y-6">
                  <div>
                    <span className="text-gray-400 text-[10px] uppercase">Final Academic Performance standing</span>
                    <p className="text-lg font-black text-[#431407]">{averagePercentage >= 90 ? 'A+ Outstanding' : averagePercentage >= 80 ? 'A Very Good' : 'B Good Performance'}</p>
                  </div>
                  <div className="flex justify-end gap-12 font-mono text-[9px] uppercase font-black text-gray-400 select-none pb-4 pt-4">
                    <span className="border-t border-gray-400 pt-1 text-center min-w-[100px]">Class Coordinator</span>
                    <span className="border-t border-gray-400 pt-1 text-center min-w-[100px]">Principal desk</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 5. Secure Payment Gateway Portal Modal Simulator */}
      {showPaymentPortal && selectedTxnToPay && activeScholar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md overflow-y-auto">
          <div className="bg-white text-slate-800 max-w-md w-full p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl relative border border-slate-100 font-sans my-8">
            
            {/* Header portion */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight text-[#431407] uppercase">SXC SECURE VAULT</h3>
                  <p className="text-[9px] text-gray-400 font-black tracking-widest font-mono">SSL 256-BIT ENCRYPTION</p>
                </div>
              </div>
              
              {paymentStep !== 'processing' && (
                <button
                  onClick={() => setShowPaymentPortal(false)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-black rounded-lg transition"
                >
                  ✕ Cancel
                </button>
              )}
            </div>

            {paymentStep === 'method' && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-left">
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Authorized invoice item</span>
                  <h4 className="text-sm font-black text-slate-900 uppercase">{selectedTxnToPay.category}</h4>
                  <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-slate-250">
                    <span className="text-[11px] text-gray-500 font-bold">Payee: <span className="font-extrabold underline uppercase">{activeScholar.studentName}</span></span>
                    <span className="text-xl font-mono font-black text-rose-600">₹ {selectedTxnToPay.amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* Method selector tabs */}
                <div className="space-y-2">
                  <span className="text-[10px] text-gray-500 font-mono tracking-widest block uppercase font-bold text-center">Select Payment Instrument</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPayMethod('upi')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                        payMethod === 'upi'
                          ? 'border-red-500 bg-red-500/5 text-red-650 font-extrabold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      <Smartphone className="w-5 h-5 text-red-500" />
                      <span className="text-[9px] font-black uppercase">UPI APP</span>
                    </button>

                    <button
                      onClick={() => setPayMethod('card')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                        payMethod === 'card'
                          ? 'border-red-500 bg-red-500/5 text-red-650 font-extrabold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-red-500" />
                      <span className="text-[9px] font-black uppercase">CARD PASS</span>
                    </button>

                    <button
                      onClick={() => setPayMethod('netbanking')}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition ${
                        payMethod === 'netbanking'
                          ? 'border-red-500 bg-red-500/5 text-red-650 font-extrabold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                      }`}
                    >
                      <Wallet className="w-5 h-5 text-red-500" />
                      <span className="text-[9px] font-black uppercase">NETBANK</span>
                    </button>
                  </div>
                </div>

                {/* Form fields based on selected instrument */}
                {payMethod === 'upi' && (
                  <div className="space-y-1 text-left">
                    <label className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">Virtual Private Address (UPI ID)</label>
                    <input
                      type="text"
                      value={upiAddress}
                      onChange={e => setUpiAddress(e.target.value)}
                      placeholder="e.g. parent@okaxis"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono focus:outline-none focus:border-red-500"
                    />
                    <p className="text-[9px] opacity-75 text-gray-500 font-bold">A payment authorization push will be dispatched here.</p>
                  </div>
                )}

                {payMethod === 'card' && (
                  <div className="space-y-3 text-left">
                    <div className="space-y-1">
                      <label className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">16-Digit Card number</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={e => setCardNumber(e.target.value)}
                        placeholder="4532 9812 3445 7801"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">Expiry date (MM/YY)</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          placeholder="11/29"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono focus:outline-none focus:border-red-500 text-center"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">CVV Code</label>
                        <input
                          type="password"
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value)}
                          placeholder="***"
                          maxLength={3}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono focus:outline-none focus:border-red-500 text-center"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {payMethod === 'netbanking' && (
                  <div className="space-y-2 text-left">
                    <label className="text-[9px] text-gray-400 block font-bold uppercase tracking-wider">Preferred Bank server</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-red-500">
                      <option>State Bank of India (SBI)</option>
                      <option>ICICI Bank Secured Server</option>
                      <option>HDFC Infinite Bank Gateway</option>
                      <option>Axis Secure Portal Bank</option>
                      <option>Punjab National Bank (PNB)</option>
                    </select>
                  </div>
                )}

                {/* Submit action */}
                <button
                  onClick={handleSimulatePaymentCompletion}
                  className="w-full py-4 bg-red-650 bg-red-600 hover:bg-red-700 transition font-black tracking-wider text-xs uppercase text-white rounded-2xl shadow-lg flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> AUTHORIZE PAYMENT (₹ {selectedTxnToPay.amount.toLocaleString('en-IN')})
                </button>

                <div className="flex items-center justify-center gap-1.5 text-rose-700 text-[10px] font-bold uppercase opacity-85 pt-1 text-center">
                  <ShieldCheck className="w-4 h-4 text-rose-500 shrink-0" /> SSL SECURE SANDBOX HANDSHAKE EMULATED
                </div>
              </div>
            )}

            {paymentStep === 'processing' && (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 border-4 border-rose-100 border-t-red-600 rounded-full animate-spin mx-auto"></div>
                <div>
                  <h4 className="font-extrabold text-sm tracking-tight text-slate-800">CONNECTING TO ESCROW GATEWAY</h4>
                  <p className="text-gray-400 font-bold text-[10px] mt-1 leading-relaxed">
                    Contacting secure bank servers... Validating handshake signatures... Please do not close, refresh or switch active frames.
                  </p>
                </div>
              </div>
            )}

            {paymentStep === 'otp' && (
              <div className="space-y-5">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-500/10 text-red-500 flex items-center justify-center rounded-full mx-auto mb-2">
                    <Smartphone className="w-6 h-6 animate-bounce" />
                  </div>
                  <h4 className="font-black text-sm text-slate-900 uppercase">Input Bank security PIN</h4>
                  <p className="text-xs text-gray-500 mt-1 font-bold">
                    A dynamic 4-character secure verification PIN has been dispatched to parent's registered credentials (+91 ******9801).
                  </p>
                </div>

                <div className="space-y-3">
                  <input
                    type="password"
                    value={paymentOtp}
                    onChange={e => setPaymentOtp(e.target.value)}
                    placeholder="Enter security PIN / OTP"
                    maxLength={6}
                    className="w-full text-center tracking-widest px-4 py-4 bg-slate-50 border-2 border-red-500/20 focus:border-red-500 focus:outline-none rounded-2xl font-black text-xl font-mono text-slate-800"
                  />

                  {/* Mock Pad triggers */}
                  <div className="grid grid-cols-3 gap-1.5 text-xs font-bold text-slate-600">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPaymentOtp(prev => (prev.length < 6 ? prev + num : prev))}
                        className="py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-150 transition active:scale-[0.97]"
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setPaymentOtp('')}
                      className="py-2.5 bg-slate-50 hover:bg-red-50 rounded-xl border border-slate-150 text-red-500 font-black uppercase text-[10px]"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentOtp(prev => (prev.length < 6 ? prev + '0' : prev))}
                      className="py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-150"
                    >
                      0
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentOtp('1234')}
                      className="py-2.5 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-150 text-red-600 font-bold uppercase text-[9px]"
                      title="Insert secure quick PIN"
                    >
                      Auto-PIN
                    </button>
                  </div>

                  <button
                    onClick={handleVerifyOtpAndFinalize}
                    disabled={!paymentOtp}
                    className="w-full py-4 bg-red-650 bg-red-600 hover:bg-red-700 disabled:opacity-50 transition font-black tracking-wider text-xs uppercase text-white rounded-2xl shadow-lg flex items-center justify-center gap-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" /> CONFIRM SECURE TRANSACTION
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="space-y-6 text-center select-none pt-2">
                <div className="w-14 h-14 bg-rose-500/10 text-rose-500 flex items-center justify-center rounded-full mx-auto">
                  <CheckCircle2 className="w-8 h-8 animate-pulse text-rose-500" />
                </div>
                
                <div>
                  <h4 className="font-black text-base text-slate-800 uppercase">TRANSACTION AUTHORIZED BY GATEWAY</h4>
                  <p className="text-emerald-600 dark:text-rose-500 font-extrabold text-xs mt-0.5 uppercase tracking-wide">OFFICIAL RECEIPT CREATED</p>
                  <p className="text-xs text-gray-450 mt-1 font-bold leading-relaxed">
                    Outstanding balance has been marked as settled. Your ledger book references have synchronized successfully with central server database rosters.
                  </p>
                </div>

                {/* Official virtual receipt layout */}
                <div className="p-4 border-2 border-dashed border-emerald-350 bg-emerald-50/20 rounded-2xl text-left space-y-1.5 font-sans relative overflow-hidden">
                  <span className="absolute -top-3 -right-3 text-[42px] font-black opacity-[0.05] tracking-widest text-[#431407] uppercase">PAID</span>
                  
                  <div className="flex justify-between text-[10px] font-bold text-gray-400">
                    <span>Receipt No: TXN-{selectedTxnToPay.id.toUpperCase()}-{activeScholar.scholarNo}</span>
                    <span>SUCCESS</span>
                  </div>
                  
                  <h5 className="font-extrabold text-xs text-[#431407] border-b pb-1.5 mb-1.5 border-emerald-100 uppercase">
                    SAINT XAVIER CONVENT ACCOUNTS BOARD
                  </h5>
                  
                  <div className="text-[11px] font-semibold space-y-1 text-slate-800">
                    <p><span className="text-gray-400 font-mono uppercase">Pupil:</span> <span className="uppercase font-black text-[#431407]">{activeScholar.studentName}</span></p>
                    <p><span className="text-gray-400 font-mono uppercase">Scholar No:</span> <span>#{activeScholar.scholarNo}</span></p>
                    <p><span className="text-gray-400 font-mono uppercase">Standard:</span> <span>{activeScholar.currentClass}</span></p>
                    <p><span className="text-gray-400 font-mono uppercase">Particulars:</span> <span>{selectedTxnToPay.category}</span></p>
                    <p><span className="text-gray-450 font-mono uppercase">Paid Via:</span> <span>UPI / Debit Authorizer</span></p>
                    <div className="pt-2 border-t border-dashed border-emerald-200 mt-2 flex justify-between items-baseline font-bold">
                      <span className="font-black uppercase text-[10px] text-emerald-600">Total amount received:</span>
                      <span className="font-mono font-black text-sm text-[#431407]">₹ {selectedTxnToPay.amount.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    onClick={() => {
                      alert(`SAVING DIGITAL COPY: Downloading Receipt #TXN-${selectedTxnToPay.id.toUpperCase()}-${activeScholar.scholarNo}.pdf for physical prints! Balance verified of ₹0.`);
                    }}
                    className="p-3 bg-slate-900 text-white hover:bg-slate-800 font-black rounded-xl text-[10px] uppercase"
                  >
                    📥 SAVE RECEIPT
                  </button>
                  <button
                    onClick={() => {
                      setShowPaymentPortal(false);
                    }}
                    className="p-3 bg-emerald-600 text-white hover:bg-emerald-700 font-black rounded-xl text-[10px] transition uppercase"
                  >
                    ✕ Close Portal
                  </button>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}

    </div>
  );
}
