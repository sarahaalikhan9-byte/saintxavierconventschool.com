import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { speakText } from '../utils/tts';
import { 
  Users, BookOpen, Clock, Calendar, CheckCircle, 
  HelpCircle, MessageSquare, LogOut, Video, PenTool, PieChart, Send, FileText, BarChart2, Plus, X
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import SchoolCalendar from './SchoolCalendar';

interface TeacherDashboardProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange' | 'royalBlue' | 'emerald';
  onLogout: () => void;
  lang?: any;
}

const mockProgressData = [
  { name: 'Ayan', math: 85, science: 92, english: 88 },
  { name: 'Kabir', math: 78, science: 85, english: 80 },
  { name: 'Divya', math: 95, science: 90, english: 92 },
  { name: 'Riya', math: 88, science: 75, english: 85 },
];

export default function TeacherDashboard({ theme = 'glassNavy', onLogout, lang = 'en' }: TeacherDashboardProps) {
  const { t, i18n } = useTranslation();
  const isGlass = theme === 'glassNavy';
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'homework' | 'projects' | 'quiz_results' | 'progress' | 'exams' | 'calendar'>('overview');

  const [quizRecords, setQuizRecords] = useState<any[]>([]);
  const [homeworkList, setHomeworkList] = useState<any[]>([]);
  const [isCreatingHomework, setIsCreatingHomework] = useState(false);
  const [newHwSubject, setNewHwSubject] = useState('');
  const [newHwDesc, setNewHwDesc] = useState('');
  const [newHwDue, setNewHwDue] = useState('');
  const [viewSubmissionsHwId, setViewSubmissionsHwId] = useState<string | null>(null);

  useEffect(() => {
    const handleStorage = () => {
      const records = JSON.parse(localStorage.getItem('sxc_quiz_records') || '[]');
      setQuizRecords(records);
      
      const hw = JSON.parse(localStorage.getItem('sxc_homeworks') || '[]');
      setHomeworkList(hw);
    };
    handleStorage();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleCreateHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHwSubject || !newHwDesc || !newHwDue) return;

    const newHw = {
      id: `hw-${Date.now()}`,
      subject: newHwSubject,
      desc: newHwDesc,
      due: newHwDue,
      createdAt: new Date().toISOString(),
      submissions: []
    };

    const updated = [newHw, ...homeworkList];
    setHomeworkList(updated);
    localStorage.setItem('sxc_homeworks', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    
    setNewHwSubject('');
    setNewHwDesc('');
    setNewHwDue('');
    setIsCreatingHomework(false);
  };

  const gradeSubmission = (hwId: string, studentName: string, grade: string) => {
    const updated = homeworkList.map(hw => {
      if (hw.id === hwId) {
        hw.submissions = hw.submissions.map((sub: any) => 
          sub.studentName === studentName ? { ...sub, grade } : sub
        );
      }
      return hw;
    });
    setHomeworkList(updated);
    localStorage.setItem('sxc_homeworks', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl min-h-[600px] border flex flex-col md:flex-row gap-6 ${isGlass ? 'bg-white/90 backdrop-blur-xl border-white/40 text-[#431407]' : 'bg-[#1C1C1F] border-[#2C2C2E] text-white'}`}>
      
      {/* Sidebar Navigation */}
      <div className={`w-full md:w-64 shrink-0 flex flex-col gap-2`}>
        <div className="mb-6 flex items-center justify-between">
          <div>
             <span className="px-2 py-1 bg-indigo-500/10 text-indigo-500 rounded text-[10px] font-black uppercase mb-2 inline-block">TEACHER PORTAL</span>
            <h2 className="text-xl font-black">Staff Workspace</h2>
            <p className="text-xs opacity-60">Mr. Rajesh Sharma</p>
          </div>
        </div>

        {[
          { id: 'overview', label: 'Overview', icon: BookOpen, color: 'text-indigo-500' },
          { id: 'calendar', label: 'Event Calendar', icon: Calendar, color: 'text-pink-500' },
          { id: 'progress', label: 'Student Progress', icon: BarChart2, color: 'text-rose-500' },
          { id: 'students', label: 'My Class Roster', icon: Users, color: 'text-blue-500' },
          { id: 'homework', label: 'Homework & Schedule', icon: Calendar, color: 'text-amber-500' },
          { id: 'exams', label: 'Test Papers', icon: FileText, color: 'text-purple-500' },
          { id: 'projects', label: 'Project Evaluations', icon: PenTool, color: 'text-purple-500' },
          { id: 'quiz_results', label: 'Student Q/A Results', icon: HelpCircle, color: 'text-rose-500' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === tab.id 
                ? `${isGlass ? 'bg-indigo-50 shadow-sm border-l-4 border-indigo-500 text-indigo-600' : 'bg-[#2C2C2E] border-l-4 border-indigo-500'}` 
                : 'opacity-70 hover:opacity-100 hover:bg-gray-500/10'
            }`}
          >
            <tab.icon className={`w-4 h-4 ${tab.color}`} />
            {tab.label}
          </button>
        ))}

        <div className="mt-auto pt-6">
          <button onClick={onLogout} className="w-full text-left px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 text-red-500 hover:bg-red-500/10 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-[480px]">
        
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-slideUp">
             <h3 className="text-2xl font-black mb-6">Today's Overview</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className={`p-5 rounded-2xl border ${isGlass ? 'bg-indigo-50/50 border-indigo-100' : 'bg-indigo-500/5 border-indigo-500/20'}`}>
                  <div className="text-indigo-500 mb-2"><Video className="w-6 h-6"/></div>
                  <h4 className="font-bold text-lg">2 Live Classes</h4>
                  <p className="text-xs opacity-60">Scheduled for today</p>
                </div>
                <div className={`p-5 rounded-2xl border ${isGlass ? 'bg-emerald-50/50 border-emerald-100' : 'bg-rose-500/5 border-rose-500/20'}`}>
                  <div className="text-rose-500 mb-2"><CheckCircle className="w-6 h-6"/></div>
                  <h4 className="font-bold text-lg">34/40 Present</h4>
                  <p className="text-xs opacity-60">Class VIII-A Attendance</p>
                </div>
                <div className={`p-5 rounded-2xl border ${isGlass ? 'bg-amber-50/50 border-amber-100' : 'bg-amber-500/5 border-amber-500/20'}`}>
                  <div className="text-amber-500 mb-2"><BookOpen className="w-6 h-6"/></div>
                  <h4 className="font-bold text-lg">15 Assignments</h4>
                  <p className="text-xs opacity-60">Pending review</p>
                </div>
             </div>

             <div className="mt-8">
               <h4 className="font-bold mb-4">Upcoming Schedule</h4>
               <div className={`p-4 rounded-xl border flex items-center justify-between ${isGlass?'bg-white':'bg-[#0F0F12]'}`}>
                 <div>
                   <h5 className="font-bold">Mathematics - Class VIII-A</h5>
                   <p className="text-xs opacity-60 flex items-center gap-1"><Clock className="w-3 h-3"/> 09:00 AM - 09:45 AM</p>
                 </div>
                 <button className="px-4 py-2 bg-indigo-500 text-white rounded-lg text-xs font-bold shadow">Start Live</button>
               </div>
             </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="animate-slideUp">
            <h3 className="text-2xl font-black mb-6">Class Roster</h3>
            <div className={`overflow-hidden rounded-xl border ${isGlass ? 'bg-white border-gray-200' : 'bg-[#0F0F12] border-[#2C2C2E]'}`}>
              <table className="w-full text-left text-sm">
                 <thead className={`text-xs uppercase font-bold opacity-60 border-b ${isGlass ? 'bg-gray-50 border-gray-200' : 'bg-[#1C1C1F] border-[#2C2C2E]'}`}>
                   <tr>
                     <th className="p-4">Roll No</th>
                     <th className="p-4">Student Name</th>
                     <th className="p-4 text-center">Attendance</th>
                     <th className="p-4 text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-500/10">
                   {['Ayan Khan', 'Kabir Gupta', 'Divya Sinha'].map((name, i) => (
                     <tr key={name}>
                       <td className="p-4 font-bold opacity-80">{i + 12}</td>
                       <td className="p-4 font-bold">{name}</td>
                       <td className="p-4 text-center"><span className="px-2 py-1 bg-rose-500/10 text-rose-500 rounded font-bold text-xs">Present</span></td>
                       <td className="p-4 text-right"><button className="text-indigo-500 font-bold text-xs hover:underline">View Profile</button></td>
                     </tr>
                   ))}
                 </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'homework' && (
          <div className="animate-slideUp">
            {viewSubmissionsHwId ? (
              <div>
                <button onClick={() => setViewSubmissionsHwId(null)} className="mb-4 text-sm font-bold text-amber-500 hover:underline flex items-center gap-1">&larr; Back to Assignments</button>
                <h3 className="text-2xl font-black mb-6">Review Submissions</h3>
                {(() => {
                  const hw = homeworkList.find(h => h.id === viewSubmissionsHwId);
                  if (!hw) return <p>Assignment not found.</p>;
                  return (
                    <div className="space-y-4">
                      <div className={`p-5 rounded-xl border ${isGlass ? 'bg-amber-50/50 border-amber-200' : 'bg-amber-500/10 border-amber-500/30'}`}>
                        <h4 className="font-bold text-lg text-amber-500">{hw.subject}</h4>
                        <p className="font-medium mt-1">{hw.desc}</p>
                        <p className="text-xs opacity-60 mt-2">Due: {hw.due}</p>
                      </div>
                      
                      {hw.submissions.length === 0 ? (
                        <p className="opacity-60 py-4 font-medium text-sm text-center border rounded-xl">No submissions yet.</p>
                      ) : (
                        hw.submissions.map((sub: any, i: number) => (
                          <div key={i} className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${isGlass ? 'bg-white' : 'bg-[#0F0F12]'}`}>
                            <div>
                              <h5 className="font-bold">{sub.studentName}</h5>
                              <p className="text-xs opacity-60 mt-1">Submitted at: {new Date(sub.submittedAt).toLocaleString()}</p>
                              {sub.note && <p className="text-sm mt-2 italic bg-gray-500/10 p-2 rounded">"{sub.note}"</p>}
                            </div>
                            <div className="flex items-center gap-3">
                              {sub.grade ? (
                                <span className="px-3 py-1 bg-green-500/10 text-green-500 font-bold rounded-lg border border-green-500/20 text-sm">Graded: {sub.grade}</span>
                              ) : (
                                <>
                                  <button onClick={() => gradeSubmission(hw.id, sub.studentName, 'A')} className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded font-bold text-xs">Grade A</button>
                                  <button onClick={() => gradeSubmission(hw.id, sub.studentName, 'B')} className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded font-bold text-xs">Grade B</button>
                                  <button onClick={() => gradeSubmission(hw.id, sub.studentName, 'C')} className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded font-bold text-xs">Grade C</button>
                                </>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  );
                })()}
              </div>
            ) : isCreatingHomework ? (
              <div className={`p-6 rounded-xl border ${isGlass ? 'bg-white' : 'bg-[#1C1C1F]'}`}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black">Assign New Homework</h3>
                  <button onClick={() => setIsCreatingHomework(false)} className="p-1 hover:bg-gray-500/10 rounded-lg"><X className="w-5 h-5"/></button>
                </div>
                <form onSubmit={handleCreateHomework} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-70 uppercase tracking-wider">Subject</label>
                    <input type="text" required value={newHwSubject} onChange={(e) => setNewHwSubject(e.target.value)} placeholder="e.g. Mathematics" className={`w-full p-3 rounded-xl border outline-none font-medium text-sm ${isGlass ? 'bg-gray-50 border-gray-200 focus:border-amber-500' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-amber-500'}`} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-70 uppercase tracking-wider">Description & Tasks</label>
                    <textarea required value={newHwDesc} onChange={(e) => setNewHwDesc(e.target.value)} placeholder="Describe the assignment..." className={`w-full p-3 rounded-xl border outline-none font-medium text-sm min-h-[100px] ${isGlass ? 'bg-gray-50 border-gray-200 focus:border-amber-500' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-amber-500'}`} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1 opacity-70 uppercase tracking-wider">Due Date</label>
                    <input type="text" required value={newHwDue} onChange={(e) => setNewHwDue(e.target.value)} placeholder="e.g. Tomorrow, 10:00 AM or 15 July" className={`w-full p-3 rounded-xl border outline-none font-medium text-sm ${isGlass ? 'bg-gray-50 border-gray-200 focus:border-amber-500' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-amber-500'}`} />
                  </div>
                  <button type="submit" className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-black transition flex items-center gap-2"><Plus className="w-4 h-4"/> Publish Assignment</button>
                </form>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black">Homework Assignments</h3>
                  <button onClick={() => setIsCreatingHomework(true)} className="px-4 py-2 bg-amber-500 hover:bg-amber-600 transition text-white rounded-lg text-xs font-bold shadow flex items-center gap-1"><Plus className="w-4 h-4"/> Assign New</button>
                </div>
                
                {homeworkList.length === 0 ? (
                  <div className={`py-12 text-center rounded-xl border border-dashed ${isGlass ? 'bg-gray-50 border-gray-200' : 'bg-[#0F0F12] border-gray-700'}`}>
                    <BookOpen className="w-8 h-8 text-amber-500 mx-auto mb-3 opacity-50" />
                    <p className="font-bold opacity-60 text-sm">No homework assigned yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {homeworkList.map((h, i) => (
                      <div key={h.id} className={`p-4 rounded-xl border flex flex-col sm:flex-row justify-between sm:items-center gap-4 ${isGlass ? 'bg-white' : 'bg-[#0F0F12]'}`}>
                        <div>
                          <h4 className="font-bold text-sm text-amber-500">{h.subject}</h4>
                          <p className="font-bold">{h.desc}</p>
                          <p className="text-xs opacity-60 mt-1">Due: {h.due}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-xs font-bold opacity-60">Submissions</p>
                            <p className="text-lg font-black">{h.submissions?.length || 0}</p>
                          </div>
                          <button onClick={() => setViewSubmissionsHwId(h.id)} className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 rounded-lg text-xs font-bold border border-amber-500/20 whitespace-nowrap transition">Review Submissions</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="animate-slideUp">
            <h3 className="text-2xl font-black mb-6 flex justify-between items-center">
              <span>Project Evaluations</span>
              <button className="px-4 py-2 bg-purple-500 text-white rounded-lg text-xs font-bold shadow">+ Create Project</button>
            </h3>
            <div className={`p-6 rounded-xl border ${isGlass ? 'bg-white' : 'bg-[#0F0F12]'}`}>
              <h4 className="text-lg font-black text-purple-500 mb-2">Science Fair Model</h4>
              <p className="text-sm opacity-80 mb-4">Build a working model demonstrating renewable energy sources. Team of 3.</p>
              <div className="flex justify-between text-xs font-bold mb-1"><span className="text-purple-500">Class Progress</span><span>45%</span></div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5 mb-4">
                <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 border border-gray-500/10 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs font-bold opacity-60">Team Alpha (Ayan, Kabir, Divya)</p>
                  <p className="text-sm font-bold mt-1 text-rose-500">Submitted - Grading Pending</p>
                  <button className="mt-3 text-xs text-blue-500 font-bold">Grade Now &rarr;</button>
                </div>
                <div className="p-4 border border-gray-500/10 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <p className="text-xs font-bold opacity-60">Team Beta</p>
                  <p className="text-sm font-bold mt-1 text-amber-500">In Progress</p>
                  <button className="mt-3 text-xs text-blue-500 font-bold">View Draft &rarr;</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'quiz_results' && (
          <div className="animate-slideUp">
            <h3 className="text-2xl font-black mb-2 text-amber-500">Student Q/A Results</h3>
            <p className="opacity-60 text-sm mb-6">Live results from Random Assessments taken by students.</p>

            {quizRecords.length === 0 ? (
               <div className={`py-12 text-center rounded-xl border border-dashed ${isGlass ? 'bg-gray-50 border-gray-200' : 'bg-[#0F0F12] border-gray-700'}`}>
                 <HelpCircle className="w-8 h-8 text-gray-400 mx-auto mb-3 opacity-50" />
                 <p className="font-bold opacity-60 text-sm">No recent assessments have been recorded.</p>
               </div>
            ) : (
               <div className="space-y-3">
                 {quizRecords.slice().reverse().map((record, i) => (
                   <div key={i} className={`p-4 rounded-xl border flex justify-between items-center ${isGlass ? 'bg-white' : 'bg-[#0F0F12]'}`}>
                     <div>
                       <h4 className="font-bold text-sm text-indigo-500">{record.studentName}</h4>
                       <p className="font-bold text-sm">{record.topic}</p>
                       <p className="text-xs opacity-50 font-mono mt-1">{new Date(record.date).toLocaleString()}</p>
                     </div>
                     <div className={`px-4 py-2 rounded-lg font-black text-lg ${record.score >= 80 ? 'bg-rose-500/10 text-rose-500' : record.score >= 60 ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
                       {record.score}%
                     </div>
                   </div>
                 ))}
               </div>
            )}
            
          </div>
        )}

        {activeTab === 'progress' && (
          <div className="animate-slideUp space-y-6">
            <h3 className="text-2xl font-black mb-6">Student Progress</h3>
            <div className={`p-6 rounded-xl border ${isGlass ? 'bg-white' : 'bg-[#0F0F12]'}`}>
              <h4 className="font-bold mb-6">Subject Performance Analysis</h4>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockProgressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: isGlass ? '#F3F4F6' : '#1C1C1F' }} contentStyle={{ backgroundColor: isGlass ? 'white' : '#1C1C1F', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend />
                    <Bar dataKey="math" name="Mathematics" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="science" name="Science" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="english" name="English" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className={`p-6 rounded-xl border ${isGlass ? 'bg-indigo-50 border-indigo-100' : 'bg-indigo-500/10 border-indigo-500/20'}`}>
                 <h4 className="font-bold text-lg text-indigo-500 mb-2">Top Performer</h4>
                 <p className="text-sm opacity-80 mb-1">Divya has consistently ranked highest in Mathematics this month.</p>
                 <button className="text-xs font-bold text-indigo-600 mt-2">View Detailed Report &rarr;</button>
               </div>
               <div className={`p-6 rounded-xl border ${isGlass ? 'bg-amber-50 border-amber-100' : 'bg-amber-500/10 border-amber-500/20'}`}>
                 <h4 className="font-bold text-lg text-amber-500 mb-2">Attention Required</h4>
                 <p className="text-sm opacity-80 mb-1">Kabir needs additional support in Mathematics.</p>
                 <button className="text-xs font-bold text-amber-600 mt-2">Schedule Mentoring &rarr;</button>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'exams' && (
          <div className="animate-slideUp">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black mb-1">Test Papers & Exams</h3>
              <button className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-xs font-bold shadow transition">+ Create Test Paper</button>
            </div>
            
            <div className="space-y-4">
              {[
                { title: 'Monthly Test - July', type: 'Monthly Test', date: 'July 15, 2026', subject: 'Science', status: 'Published' },
                { title: 'Quarterly Terminal Exam', type: 'Terminal Exam', date: 'Aug 20, 2026', subject: 'Mathematics', status: 'Draft' },
                { title: 'Half Yearly Examination', type: 'Half Yearly', date: 'Sept 10, 2026', subject: 'English', status: 'Scheduled' },
                { title: 'Final Annual Examination', type: 'Annual Exam', date: 'March 05, 2027', subject: 'Science', status: 'Upcoming' }
              ].map((exam, i) => (
                 <div key={i} className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isGlass ? 'bg-white hover:border-purple-200 hover:shadow-sm' : 'bg-[#0F0F12] border-gray-800'} transition-all`}>
                   <div>
                     <div className="flex items-center gap-2 mb-1">
                       <span className="px-2 py-0.5 bg-gray-500/10 rounded text-[10px] uppercase font-black tracking-wider opacity-80">{exam.type}</span>
                       <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-wider ${
                         exam.status === 'Published' ? 'bg-rose-500/10 text-rose-500' : 
                         exam.status === 'Draft' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                       }`}>{exam.status}</span>
                     </div>
                     <h4 className="font-bold text-lg text-purple-500">{exam.title}</h4>
                     <p className="text-sm opacity-60">Subject: {exam.subject} • Date: {exam.date}</p>
                   </div>
                   <div className="flex gap-2">
                     <button className="px-3 py-1.5 border border-gray-500/20 hover:bg-gray-500/10 rounded-lg text-xs font-bold transition">Edit</button>
                     <button className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${isGlass ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'}`}>View Format</button>
                   </div>
                 </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="-mx-6 md:-mx-8 -my-6 md:-my-8 animate-slideUp">
             <SchoolCalendar theme={theme} role="teacher" />
          </div>
        )}

      </div>
    </div>
  );
}
