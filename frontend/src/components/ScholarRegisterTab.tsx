import React, { useState } from 'react';
import SchoolHeader from './SchoolHeader';
import { Users, Plus, Trash2, Printer, Sparkles, UserCircle, MapPin, Phone, Heart } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';

interface ScholarRegisterRecord {
  id: string;
  scholarNo: string;
  sssmiId: string;
  aadharNo: string;
  name: string;
  fatherName: string;
  motherName: string;
  dob: string;
  currentClass: string;
  bloodGroup: string;
  contactNo: string;
  address: string;
  enrollmentDate: string;
}

interface ScholarRegisterTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange' | 'royalBlue' | 'emerald';
}

export default function ScholarRegisterTab({ theme = 'glassNavy' }: ScholarRegisterTabProps) {
  const isGlass = theme === 'glassNavy';

  const [registerList, setRegisterList] = useState<ScholarRegisterRecord[]>(() => {
    const saved = localStorage.getItem('sxc_scholar_register');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'reg-1',
        scholarNo: '5281',
        sssmiId: '104928172',
        aadharNo: '4928-1029-4829',
        name: 'PRIYA PATEL',
        fatherName: 'MR. RAJESH PATEL',
        motherName: 'MRS. RADHIKA PATEL',
        dob: '2013-11-20',
        currentClass: 'CLASS VII-A',
        bloodGroup: 'O+',
        contactNo: '+91 9876543210',
        address: 'B-102, Silver Springs, Indore',
        enrollmentDate: '2019-04-04'
      },
      {
        id: 'reg-2',
        scholarNo: '4928',
        sssmiId: '109284102',
        aadharNo: '2981-2204-1928',
        name: 'ROHAN VERMA',
        fatherName: 'MR. MANOJ VERMA',
        motherName: 'MRS. REKHA VERMA',
        dob: '2012-07-15',
        currentClass: 'CLASS VIII-B',
        bloodGroup: 'B+',
        contactNo: '+91 9123456780',
        address: 'Sector 3, Pithampur, Indore',
        enrollmentDate: '2018-07-02'
      }
    ];
  });

  const [activeId, setActiveId] = useState<string>('reg-1');
  const activeProfile = registerList.find(s => s.id === activeId) || registerList[0];

  const updateProfileFields = (fields: Partial<ScholarRegisterRecord>) => {
    const updated = registerList.map(s => {
      if (s.id === activeId) {
        return { ...s, ...fields };
      }
      return s;
    });
    setRegisterList(updated);
    localStorage.setItem('sxc_scholar_register', JSON.stringify(updated));
  };

  const addScholarRecord = () => {
    const name = window.prompt("Enter new scholar's full name:", "NEW SCHOLAR");
    if (!name) return;
    const scholarNo = window.prompt("Enter Scholar No:", String(Math.floor(6000 + Math.random() * 3000))) || "";

    const newRecord: ScholarRegisterRecord = {
      id: `reg-${Date.now()}`,
      scholarNo: scholarNo,
      sssmiId: '',
      aadharNo: '',
      name: name.toUpperCase(),
      fatherName: '',
      motherName: '',
      dob: '',
      currentClass: 'CLASS I-A',
      bloodGroup: 'A+',
      contactNo: '',
      address: '',
      enrollmentDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedList = [...registerList, newRecord];
    setRegisterList(updatedList);
    localStorage.setItem('sxc_scholar_register', JSON.stringify(updatedList));
    setActiveId(newRecord.id);
  };

  const deleteScholarRecord = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (registerList.length <= 1) {
      alert("At least one record must remain in the register.");
      return;
    }
    const updated = registerList.filter(s => s.id !== id);
    setRegisterList(updated);
    localStorage.setItem('sxc_scholar_register', JSON.stringify(updated));
    if (id === activeId) {
      setActiveId(updated[0].id);
    }
  };

  const sidebarClass = isGlass
    ? 'no-print w-full xl:w-5/12 bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/50 h-fit max-h-[85vh] overflow-y-auto text-[#431407]'
    : 'no-print w-full xl:w-5/12 bg-[#0F0F12] p-6 rounded-2xl shadow-lg border border-[#242427] h-fit max-h-[85vh] overflow-y-auto text-white';

  const previewPanelClass = isGlass
    ? 'flex-1 overflow-x-auto bg-[#FFF7ED]/50 p-6 rounded-2xl border border-white/40 flex justify-center'
    : 'flex-1 overflow-x-auto bg-[#0F0F12]/50 p-6 rounded-2xl border border-[#242427] flex justify-center';

  const inputClass = isGlass
    ? 'w-full mt-1 p-2 bg-white/65 border border-[#431407]/15 text-[#431407] rounded-lg focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316] text-xs font-semibold'
    : 'w-full mt-1 p-2 bg-[#1C1C1F] border border-[#242427] text-white rounded-lg text-xs focus:border-[#EA580C] focus:outline-none';

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Editor Sidebar */}
      <div className={sidebarClass}>
        <div className="flex justify-between items-center mb-4 border-b pb-4 border-slate-500/10">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2"><Users className="w-5 h-5 text-indigo-500" /> Scholar Register</h2>
            <p className="text-xs opacity-70">Manage complete student demographic records</p>
          </div>
        </div>

        {/* Dynamic selector list */}
        <div className={isGlass ? 'mb-6 p-4 bg-[#FFF7ED]/65 rounded-xl border border-white shadow-sm flex flex-col relative overflow-hidden' : 'mb-6 p-4 bg-[#1C1C1F] rounded-xl border border-[#242427]'}>
          <div className="flex justify-between items-center mb-2.5">
            <p className={isGlass ? 'text-xs font-bold text-[#F97316] uppercase flex items-center gap-1' : 'text-xs font-bold text-[#EA580C] uppercase flex items-center gap-1'}>
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              Registered Scholars ({registerList.length})
            </p>
            <button
              type="button"
              onClick={addScholarRecord}
              className="px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 border border-indigo-500/20 rounded-md transition-all text-[10px] font-bold flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> Add Scholar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {registerList.map((s) => (
              <div key={s.id} className="relative group flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  className={`${
                    activeId === s.id 
                      ? (isGlass ? 'px-3 py-1.5 rounded-lg text-xs font-black shadow bg-[#431407] text-[#FFF7ED]' : 'px-3 py-1.5 rounded-lg text-xs font-extrabold shadow-sm bg-indigo-600 text-white shadow-indigo-500/20')
                      : (isGlass ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-white/45 border border-[#431407]/10 text-[#431407] hover:bg-white/80 transition-all' : 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0F0F12] border border-[#242427] text-gray-400 hover:bg-[#242427] hover:text-white transition-all')
                  } pr-6`}
                >
                  {s.name.split(' ')[0]} (#{s.scholarNo})
                </button>
                {registerList.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => deleteScholarRecord(s.id, e)}
                    className="absolute right-1.5 p-0.5 text-red-500 hover:text-red-700 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded transition-all"
                    title={`Delete record of ${s.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <p className={isGlass ? 'text-xs font-bold text-indigo-600 uppercase border-b border-[#431407]/15 pb-1' : 'text-xs font-bold text-indigo-400 uppercase border-b border-[#242427] pb-1'}>Academic Details</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs opacity-70 font-semibold block">Scholar Number</label>
              <input type="text" value={activeProfile.scholarNo} onChange={e => updateProfileFields({ scholarNo: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 font-semibold block">Current Class</label>
              <input type="text" value={activeProfile.currentClass} onChange={e => updateProfileFields({ currentClass: e.target.value.toUpperCase() })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 font-semibold block">SSSMI ID</label>
              <input type="text" value={activeProfile.sssmiId} onChange={e => updateProfileFields({ sssmiId: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 font-semibold block">Enrollment Date</label>
              <input type="date" value={activeProfile.enrollmentDate} onChange={e => updateProfileFields({ enrollmentDate: e.target.value })} className={inputClass} />
            </div>
          </div>

          <p className={isGlass ? 'text-xs font-bold text-indigo-600 uppercase border-b border-[#431407]/15 pb-1 mt-4' : 'text-xs font-bold text-indigo-400 uppercase border-b border-[#242427] pb-1 mt-4'}>Demographic Details</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs opacity-70 font-semibold block">Full Name</label>
              <input type="text" value={activeProfile.name} onChange={e => updateProfileFields({ name: e.target.value.toUpperCase() })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 font-semibold block">Father's Name</label>
              <input type="text" value={activeProfile.fatherName} onChange={e => updateProfileFields({ fatherName: e.target.value.toUpperCase() })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 font-semibold block">Mother's Name</label>
              <input type="text" value={activeProfile.motherName} onChange={e => updateProfileFields({ motherName: e.target.value.toUpperCase() })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 font-semibold block">Date of Birth</label>
              <input type="date" value={activeProfile.dob} onChange={e => updateProfileFields({ dob: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 font-semibold block">Blood Group</label>
              <input type="text" value={activeProfile.bloodGroup} onChange={e => updateProfileFields({ bloodGroup: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 font-semibold block">Aadhar Number</label>
              <input type="text" value={activeProfile.aadharNo} onChange={e => updateProfileFields({ aadharNo: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 font-semibold block">Contact Number</label>
              <input type="text" value={activeProfile.contactNo} onChange={e => updateProfileFields({ contactNo: e.target.value })} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="text-xs opacity-70 font-semibold block">Permanent Address</label>
              <input type="text" value={activeProfile.address} onChange={e => updateProfileFields({ address: e.target.value })} className={inputClass} />
            </div>
          </div>

          <button onClick={() => window.print()} className={`w-full mt-6 py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 font-extrabold ${isGlass ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
            <Printer className="w-4 h-4" /> Print / Save Scholar Record
          </button>
        </div>
      </div>

      {/* High Fidelity A4 Print preview */}
      <div className={previewPanelClass}>
        <div id="scholar-register-section" className="print-page w-[210mm] min-h-[297mm] bg-white p-[12mm] text-[#431407] border border-slate-400 shadow-2xl relative select-none text-[11px] flex flex-col">
          <SchoolHeader subTitle="SCHOLAR REGISTER EXTRACT" />

          <div className="flex-1 mt-8">
            <div className="flex justify-between items-start border-b-2 border-indigo-900 pb-2 mb-6">
              <h3 className="text-lg font-black uppercase text-indigo-900 flex items-center gap-2"><UserCircle className="w-6 h-6" /> Scholar Registry Details</h3>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Extract Date</span>
                <span className="font-mono font-bold">{new Date().toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Scholar Number</span>
                  <span className="font-mono text-base font-black text-indigo-900">{activeProfile.scholarNo || 'N/A'}</span>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Full Name of Scholar</span>
                  <span className="text-sm font-extrabold text-slate-900">{activeProfile.name || 'N/A'}</span>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Father's Name</span>
                  <span className="text-xs font-bold text-slate-800">{activeProfile.fatherName || 'N/A'}</span>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Mother's Name</span>
                  <span className="text-xs font-bold text-slate-800">{activeProfile.motherName || 'N/A'}</span>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Date of Birth</span>
                  <span className="text-xs font-bold text-slate-900">{activeProfile.dob ? new Date(activeProfile.dob).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'N/A'}</span>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5 flex items-center gap-1"><Heart className="w-3 h-3 text-red-500"/> Blood Group</span>
                  <span className="text-xs font-bold text-red-600">{activeProfile.bloodGroup || 'N/A'}</span>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Current Class</span>
                  <span className="text-sm font-black text-slate-900">{activeProfile.currentClass || 'N/A'}</span>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Date of First Enrollment</span>
                  <span className="text-xs font-mono font-bold text-slate-800">{activeProfile.enrollmentDate ? new Date(activeProfile.enrollmentDate).toLocaleDateString('en-IN') : 'N/A'}</span>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Samagra ID (SSSMI)</span>
                  <span className="text-xs font-mono font-bold text-slate-800">{activeProfile.sssmiId || 'N/A'}</span>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Aadhar Number</span>
                  <span className="text-xs font-mono font-bold text-slate-800">{activeProfile.aadharNo || 'N/A'}</span>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5 flex items-center gap-1"><Phone className="w-3 h-3 text-indigo-500"/> Contact Number</span>
                  <span className="text-xs font-mono font-bold text-slate-800">{activeProfile.contactNo || 'N/A'}</span>
                </div>
                <div className="border-b border-slate-200 pb-2">
                  <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5 flex items-center gap-1"><MapPin className="w-3 h-3 text-indigo-500"/> Permanent Address</span>
                  <span className="text-xs font-bold text-slate-800">{activeProfile.address || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-slate-600 mb-1">Official Register QR Verification</p>
                <p className="text-[8px] text-slate-400 max-w-[200px]">Scan this QR code to verify the authenticity of this student's records against the school's central database.</p>
              </div>
              <QRCodeGenerator 
                value={`SCHOLAR REGISTRY RECORD\nName: ${activeProfile.name}\nScholar No: ${activeProfile.scholarNo}\nDOB: ${activeProfile.dob}\nClass: ${activeProfile.currentClass}`}
                studentId={activeProfile.scholarNo}
                label="VERIFY"
                size={64}
              />
            </div>
          </div>

          <div className="flex justify-between items-end mt-16 pt-4 border-t border-indigo-900">
            <div className="text-center w-36">
              <div className="h-6 border-b border-[#431407] mx-auto w-24"></div>
              <p className="font-bold text-[9px] text-[#431407] uppercase tracking-wider mt-1">Class Teacher</p>
            </div>

            <div className="text-center w-36 border border-indigo-900 p-2 bg-[#FFF7ED]/50 rounded scale-95 flex flex-col justify-center items-center">
              <span className="text-[10px] font-black text-[#431407] uppercase tracking-widest block">SAINT XAVIER</span>
              <span className="text-[7px] text-indigo-900 block mt-0.5 font-sans">CONVENT SCHOOL</span>
              <span className="text-[6px] text-slate-500 block uppercase font-mono tracking-tighter mt-1">OFFICIAL SEAL</span>
            </div>

            <div className="text-center w-36">
              <div className="h-6 border-b border-[#431407] mx-auto w-24"></div>
              <p className="font-bold text-[9px] text-[#431407] uppercase tracking-wider mt-1">Principal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
