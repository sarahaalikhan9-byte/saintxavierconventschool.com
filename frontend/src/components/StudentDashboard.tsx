import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { speakText } from '../utils/tts';
import { 
  BookOpen, Video, Award, PieChart, PenTool, LayoutDashboard, Send, 
  HelpCircle, LogOut, CheckCircle, Smartphone, Megaphone, X, Calendar as CalendarIcon, GraduationCap
} from 'lucide-react';
import SchoolCalendar from './SchoolCalendar';
import { SCHOOL_YOUTUBE_CHANNEL_URL } from '../settings';

interface StudentDashboardProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange' | 'royalBlue' | 'emerald';
  onLogout?: () => void;
  lang?: any;
}

interface StudentLiveClass {
  id: string;
  subject: string;
  teacher: string;
  topic: string;
  time: string;
  duration: string;
  status: 'live' | 'upcoming' | 'recorded';
  roomCode: string;
}

const STUDENT_LIVE_CLASSES: StudentLiveClass[] = [
  { id: 'slc-1', subject: 'Mathematics', teacher: 'Mr. Rajesh Sharma', topic: 'Linear Equations - Exercise Practice', time: '09:00 AM', duration: '45 mins', status: 'live', roomCode: 'SXC-VIII-MATH-01' },
  { id: 'slc-2', subject: 'Science', teacher: 'Mrs. Archana Dubey', topic: 'Combustion and Flame', time: '10:30 AM', duration: '40 mins', status: 'upcoming', roomCode: 'SXC-VIII-SCI-02' },
  { id: 'slc-3', subject: 'English', teacher: 'Miss Priya Sen', topic: 'Poem Explanation and Q/A', time: '12:00 PM', duration: '35 mins', status: 'recorded', roomCode: 'SXC-VIII-ENG-03' },
];

export default function StudentDashboard({ theme = 'glassNavy', onLogout, lang = 'en' }: StudentDashboardProps) {
  const { t, i18n } = useTranslation();
  const isGlass = theme === 'glassNavy';
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'homework' | 'project' | 'live' | 'progress' | 'quiz'>('dashboard');
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [dismissedAnns, setDismissedAnns] = useState<string[]>([]);
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [submitNote, setSubmitNote] = useState<{ [id: string]: string }>({});
  const [selectedLiveClass, setSelectedLiveClass] = useState<StudentLiveClass | null>(STUDENT_LIVE_CLASSES[0]);
  const [liveQuestion, setLiveQuestion] = useState('');
  const [liveChat, setLiveChat] = useState([
    { id: 'lc-msg-1', sender: 'Teacher', text: 'Good morning. Keep your notebook open and mark attendance from the join panel.', time: '09:00' },
    { id: 'lc-msg-2', sender: 'Ayan Khan', text: 'Present, audio and board are clear.', time: '09:02' },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem('sxc_announcements');
    if (saved) {
      try {
        setAnnouncements(JSON.parse(saved));
      } catch (e) {}
    }
    const dismissed = localStorage.getItem('sxc_dismissed_announcements');
    if (dismissed) {
      try {
        setDismissedAnns(JSON.parse(dismissed));
      } catch (e) {}
    }

    const handleStorage = () => {
      const hw = JSON.parse(localStorage.getItem('sxc_homeworks') || '[]');
      setHomeworkList(hw);
    };
    handleStorage();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleTakeQuiz = () => {
    // Random lesson Q/A
    const score = Math.floor(Math.random() * 50) + 50; // Random score 50-100
    setQuizScore(score);
    // Note: To show results in parent/teacher dashboard, we would save it to localStorage
    const records = JSON.parse(localStorage.getItem('sxc_quiz_records') || '[]');
    records.push({
      date: new Date().toISOString(),
      studentName: 'Ayan Khan',
      score: score,
      topic: 'Science Basics - Random Assessment'
    });
    localStorage.setItem('sxc_quiz_records', JSON.stringify(records));
  };

  const dismissAnnouncement = (id: string) => {
    const updated = [...dismissedAnns, id];
    setDismissedAnns(updated);
    localStorage.setItem('sxc_dismissed_announcements', JSON.stringify(updated));
  };

  const submitHomework = (hwId: string) => {
    const updated = homeworkList.map(hw => {
      if (hw.id === hwId) {
        hw.submissions.push({
          studentName: 'Ayan Khan',
          submittedAt: new Date().toISOString(),
          note: submitNote[hwId] || ''
        });
      }
      return hw;
    });
    setHomeworkList(updated);
    localStorage.setItem('sxc_homeworks', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    alert('Homework Submitted Successfully!');
  };

  const submitLiveQuestion = (event: React.FormEvent) => {
    event.preventDefault();
    if (!liveQuestion.trim()) return;
    setLiveChat(prev => [
      ...prev,
      {
        id: `lc-msg-${Date.now()}`,
        sender: 'Ayan Khan',
        text: liveQuestion.trim(),
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setLiveQuestion('');
  };

  const activeAnnouncements = announcements.filter(a => a.isUrgent && !dismissedAnns.includes(a.id));

  // Count pending homework
  const pendingHwCount = homeworkList.filter(h => !h.submissions?.some((s: any) => s.studentName === 'Ayan Khan')).length;

  return (
    <div className="flex flex-col gap-4">
      {activeAnnouncements.length > 0 && (
        <div className="flex flex-col gap-2">
          {activeAnnouncements.map(ann => (
            <div key={ann.id} className="bg-orange-500 text-white p-4 rounded-2xl shadow-lg flex items-start gap-4 animate-slideDown relative pr-10">
              <Megaphone className="w-6 h-6 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-lg leading-tight mb-1">{ann.title}</h4>
                <p className="text-sm font-medium">{ann.message}</p>
              </div>
              <button onClick={() => dismissAnnouncement(ann.id)} className="absolute top-4 right-4 p-1 hover:bg-orange-600 rounded-lg transition">
                <X className="w-5 h-5 opacity-80 hover:opacity-100" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className={`p-6 sm:p-8 rounded-3xl min-h-[600px] border flex flex-col md:flex-row gap-6 ${isGlass ? 'bg-white/90 backdrop-blur-xl border-white/40 text-[#431407]' : 'bg-[#1C1C1F] border-[#2C2C2E] text-white'}`}>
      
      {/* Sidebar Navigation */}
      <div className={`w-full md:w-64 shrink-0 flex flex-col gap-2`}>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black">Student Portal</h2>
            <p className="text-xs opacity-60">Welcome, Ayan Khan</p>
          </div>
        </div>

        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
          { id: 'calendar', label: 'Event Calendar', icon: CalendarIcon, color: 'text-pink-500' },
          { id: 'homework', label: 'Homework', icon: BookOpen, color: 'text-amber-500' },
          { id: 'project', label: 'Projects', icon: PenTool, color: 'text-purple-500' },
          { id: 'live', label: 'Live Classes', icon: Video, color: 'text-red-500' },
          { id: 'progress', label: 'Progress Chart', icon: PieChart, color: 'text-rose-500' },
          { id: 'quiz', label: 'Random Q/A', icon: HelpCircle, color: 'text-indigo-500' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === tab.id 
                ? `${isGlass ? 'bg-blue-50 shadow-sm border-l-4 border-blue-500 text-blue-600' : 'bg-[#2C2C2E] border-l-4 border-blue-500'}` 
                : 'opacity-70 hover:opacity-100 hover:bg-gray-500/10'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${tab.color}`} />
            {tab.label}
          </button>
        ))}

        <div className="mt-auto pt-6 space-y-2 border-t border-gray-500/20">
          <button onClick={() => window.location.reload()} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-colors ${isGlass ? 'hover:bg-gray-100 text-[#431407]' : 'hover:bg-[#2C2C2E] text-white'}`}>
            <GraduationCap className="w-4 h-4 text-[#F97316]" /> Main School Portal
          </button>
          <button onClick={onLogout} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 text-red-500 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-[480px]">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
             <h3 className="text-2xl font-black mb-4">Your Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className={`p-6 rounded-xl border transition hover:-translate-y-1 ${isGlass ? 'bg-white shadow-sm' : 'bg-[#0F0F12]'}`}>
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4"><BookOpen className="w-5 h-5"/></div>
                  <h4 className="text-2xl font-black">{pendingHwCount}</h4>
                  <p className="text-sm opacity-60">Pending Homework</p>
               </div>
               <div className={`p-6 rounded-xl border ${isGlass ? 'bg-white' : 'bg-[#0F0F12]'}`}>
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4"><PenTool className="w-5 h-5"/></div>
                  <h4 className="text-2xl font-black">2</h4>
                  <p className="text-sm opacity-60">Active Projects</p>
               </div>
               <div className={`p-6 rounded-xl border ${isGlass ? 'bg-white' : 'bg-[#0F0F12]'}`}>
                  <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-4"><Award className="w-5 h-5"/></div>
                  <h4 className="text-2xl font-black">85%</h4>
                  <p className="text-sm opacity-60">Overall Score</p>
               </div>
            </div>
            <div className={`p-6 rounded-xl border mt-6 ${isGlass ? 'bg-indigo-50/50 border-indigo-100' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
              <h4 className="font-bold mb-2 flex items-center gap-2"><HelpCircle className="text-indigo-500 w-5 h-5"/> Due for a Random Assessment</h4>
              <p className="text-sm opacity-80 mb-4">Test your knowledge with a quick 5-question random Q/A session based on recent classes.</p>
              <button onClick={() => setActiveTab('quiz')} className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-sm">Take Quiz Now</button>
            </div>
          </div>
        )}

        {activeTab === 'homework' && (
          <div className="animate-slideUp">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-2"><BookOpen className="text-amber-500 w-6 h-6"/> Digital Homework</h3>
            {homeworkList.length === 0 ? (
              <div className={`py-12 text-center rounded-xl border border-dashed ${isGlass ? 'bg-gray-50 border-gray-200' : 'bg-[#0F0F12] border-gray-700'}`}>
                <BookOpen className="w-8 h-8 text-amber-500 mx-auto mb-3 opacity-50" />
                <p className="font-bold opacity-60 text-sm">No homework assigned yet. You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {homeworkList.map((h, i) => {
                  const submission = h.submissions?.find((s: any) => s.studentName === 'Ayan Khan');
                  return (
                    <div key={h.id} className={`p-5 rounded-xl border flex flex-col sm:flex-row justify-between gap-4 ${isGlass ? 'bg-white shadow-sm' : 'bg-[#0F0F12]'}`}>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-amber-500">{h.subject}</h4>
                        <p className="font-bold text-lg">{h.desc}</p>
                        <p className="text-xs opacity-60 mt-1">Due: {h.due}</p>
                        
                        {!submission && (
                          <div className="mt-3 max-w-sm">
                            <input 
                              type="text" 
                              placeholder="Add a note to teacher (optional)" 
                              value={submitNote[h.id] || ''}
                              onChange={(e) => setSubmitNote({...submitNote, [h.id]: e.target.value})}
                              className={`w-full p-2 text-xs rounded border outline-none ${isGlass ? 'bg-gray-50 focus:border-amber-500 border-gray-200' : 'bg-[#1C1C1F] focus:border-amber-500 border-[#2C2C2E]'}`}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end justify-center">
                        {submission ? (
                          <div className="text-right">
                            <p className="px-3 py-1 bg-green-500/10 text-green-500 font-bold rounded-lg border border-green-500/20 text-xs mb-1">
                              Submitted <CheckCircle className="w-3 h-3 inline ml-1" />
                            </p>
                            {submission.grade && (
                              <p className="text-sm font-black text-amber-500">Grade: {submission.grade}</p>
                            )}
                          </div>
                        ) : (
                          <button onClick={() => submitHomework(h.id)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 transition text-white rounded-lg text-xs font-bold shadow-sm whitespace-nowrap">
                            Submit Task
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'project' && (
          <div>
            <h3 className="text-2xl font-black mb-6">Projects</h3>
            <div className="space-y-4">
              <div className={`p-6 rounded-xl border ${isGlass ? 'bg-white' : 'bg-[#0F0F12]'}`}>
                <h4 className="text-lg font-black text-purple-500 mb-2">Science Fair Model</h4>
                <p className="text-sm opacity-80 mb-4">Build a working model demonstrating renewable energy sources. Team of 3.</p>
                <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 mb-2">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <p className="text-xs opacity-60 text-right">45% Completed (Due in 2 weeks)</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'live' && (
          <div className="animate-slideUp space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-2xl font-black">Live Classes</h3>
                <p className="text-xs opacity-60 font-bold">Class VIII secure classroom for Ayan Khan</p>
              </div>
              <a href={SCHOOL_YOUTUBE_CHANNEL_URL} target="_blank" rel="noreferrer" className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-black shadow-sm inline-flex items-center gap-2">
                <Video className="w-4 h-4" /> Recorded Lessons
              </a>
            </div>

            {selectedLiveClass && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                <div className="xl:col-span-8 space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-gray-500/20 aspect-video bg-slate-950 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-indigo-950 to-black" />
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
                    <div className="relative z-10 h-full flex flex-col justify-between p-4 text-white">
                      <div className="flex justify-between items-start text-[10px] font-mono">
                        <span className="px-2 py-1 rounded bg-red-500 font-black animate-pulse">{selectedLiveClass.status === 'live' ? 'LIVE NOW' : selectedLiveClass.status.toUpperCase()}</span>
                        <span className="px-2 py-1 rounded bg-black/50">1080P HD - Room {selectedLiveClass.roomCode}</span>
                      </div>

                      <div className="text-center mx-auto max-w-md">
                        <button className="w-16 h-16 mx-auto mb-4 bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
                          <Video className="w-7 h-7 ml-1" />
                        </button>
                        <p className="text-xs font-black tracking-widest text-red-200 uppercase">{selectedLiveClass.subject}</p>
                        <h4 className="text-2xl font-black mt-1">{selectedLiveClass.topic}</h4>
                        <p className="text-xs opacity-75 mt-2">Teacher: {selectedLiveClass.teacher}</p>
                      </div>

                      <div className="bg-black/75 rounded-xl p-2 flex items-center gap-3">
                        <button className="p-2 bg-white/10 rounded-lg"><Video className="w-4 h-4 text-red-400" /></button>
                        <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: selectedLiveClass.status === 'live' ? '64%' : '100%' }} />
                        </div>
                        <span className="text-[10px] font-mono opacity-75">{selectedLiveClass.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row justify-between gap-3 ${isGlass ? 'bg-white border-slate-100' : 'bg-[#0F0F12] border-white/10'}`}>
                    <div>
                      <h4 className="font-black text-lg">{selectedLiveClass.subject} Attendance</h4>
                      <p className="text-xs opacity-60">Ayan Khan marked present - camera/mic kept student controlled.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <span className="px-3 py-2 rounded-xl bg-green-500/10 text-green-600 font-black">Present</span>
                      <span className="px-3 py-2 rounded-xl bg-blue-500/10 text-blue-600 font-black">Audio OK</span>
                      <span className="px-3 py-2 rounded-xl bg-purple-500/10 text-purple-600 font-black">Board OK</span>
                    </div>
                  </div>
                </div>

                <div className={`xl:col-span-4 rounded-2xl border overflow-hidden flex flex-col h-[420px] ${isGlass ? 'bg-white border-slate-100' : 'bg-[#0F0F12] border-white/10'}`}>
                  <div className="p-3 border-b border-gray-500/10">
                    <h4 className="text-xs font-black uppercase text-red-500">Class Chat</h4>
                    <p className="text-[10px] opacity-60">Teacher moderated Q/A</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {liveChat.map(item => (
                      <div key={item.id} className="p-3 rounded-xl bg-gray-500/10">
                        <div className="flex justify-between text-[10px] font-black mb-1">
                          <span className="text-indigo-500">{item.sender}</span>
                          <span className="opacity-50 font-mono">{item.time}</span>
                        </div>
                        <p className="text-xs font-medium opacity-85">{item.text}</p>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={submitLiveQuestion} className="p-2 border-t border-gray-500/10 flex gap-2">
                    <input value={liveQuestion} onChange={e => setLiveQuestion(e.target.value)} placeholder="Ask class question..." className={`flex-1 p-2 rounded-lg border text-xs outline-none ${isGlass ? 'bg-gray-50 border-gray-200 focus:border-red-500' : 'bg-[#1C1C1F] border-[#2C2C2E] focus:border-red-500'}`} />
                    <button type="submit" className="p-2 bg-red-500 text-white rounded-lg"><Send className="w-4 h-4" /></button>
                  </form>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {STUDENT_LIVE_CLASSES.map(lc => (
                <button key={lc.id} onClick={() => setSelectedLiveClass(lc)} className={`text-left p-4 rounded-2xl border transition ${selectedLiveClass?.id === lc.id ? 'border-red-500 bg-red-500/10' : isGlass ? 'bg-white border-slate-100 hover:border-red-200' : 'bg-[#0F0F12] border-white/10 hover:border-red-500/30'}`}>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${lc.status === 'live' ? 'bg-red-500 text-white' : lc.status === 'upcoming' ? 'bg-blue-500/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{lc.status}</span>
                    <span className="text-[10px] opacity-60 font-mono">{lc.time}</span>
                  </div>
                  <h4 className="font-black text-sm">{lc.subject}</h4>
                  <p className="text-xs opacity-70 mt-1">{lc.topic}</p>
                  <p className="text-[10px] opacity-50 mt-2 font-bold">{lc.teacher}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'progress' && (
          <div>
            <h3 className="text-2xl font-black mb-6">Progress Chart</h3>
            <div className={`p-6 rounded-xl border mb-6 flex flex-col sm:flex-row gap-6 items-center ${isGlass ? 'bg-white' : 'bg-[#0F0F12]'}`}>
               <div className="w-32 h-32 rounded-full border-8 border-rose-500 border-t-gray-100 flex items-center justify-center">
                 <span className="text-3xl font-black text-rose-500">85%</span>
               </div>
               <div className="flex-1 w-full space-y-4">
                 <div>
                   <div className="flex justify-between text-xs font-bold mb-1"><span className="text-amber-500">Science</span><span>92%</span></div>
                   <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5"><div className="bg-amber-500 h-1.5 rounded-full" style={{width: '92%'}}></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs font-bold mb-1"><span className="text-blue-500">Math</span><span>78%</span></div>
                   <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5"><div className="bg-blue-500 h-1.5 rounded-full" style={{width: '78%'}}></div></div>
                 </div>
                 <div>
                   <div className="flex justify-between text-xs font-bold mb-1"><span className="text-purple-500">English</span><span>88%</span></div>
                   <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5"><div className="bg-purple-500 h-1.5 rounded-full" style={{width: '88%'}}></div></div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'quiz' && (
          <div>
            <h3 className="text-2xl font-black mb-6 text-indigo-500">Random Q/A Assessment</h3>
            {quizScore === null ? (
               <div className={`p-8 text-center border rounded-2xl ${isGlass ? 'bg-white border-indigo-100' : 'bg-[#0F0F12] border-indigo-500/20'}`}>
                 <HelpCircle className="w-16 h-16 mx-auto mb-4 text-indigo-500 opacity-50" />
                 <h4 className="text-xl font-bold mb-2">Ready to test your knowledge?</h4>
                 <p className="opacity-60 text-sm mb-6 max-w-md mx-auto">This quiz will pull 5 random questions from your recently completed topics. Your score will be updated on your progress chart.</p>
                 <button onClick={handleTakeQuiz} className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-black transition">Start Assessment</button>
               </div>
            ) : (
               <div className={`p-8 text-center border rounded-2xl ${isGlass ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-500/10 border-rose-500/20'}`}>
                 <CheckCircle className="w-16 h-16 mx-auto mb-4 text-rose-500" />
                 <h4 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mb-2">Quiz Completed!</h4>
                 <p className="text-5xl font-black mb-4">{quizScore}%</p>
                 <p className="opacity-60 text-sm mb-6 max-w-md mx-auto">This score has been submitted to your progress chart and is visible to your parents and class teacher.</p>
                 <button onClick={() => setQuizScore(null)} className="px-6 py-2 border border-rose-500/50 text-emerald-600 dark:text-emerald-400 rounded-lg font-bold">Retake Later</button>
               </div>
            )}
            
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="-mx-6 md:-mx-8 -my-6 md:-my-8">
             <SchoolCalendar theme={theme} role="student" />
          </div>
        )}
      </div>

    </div>
    </div>
  );
}
