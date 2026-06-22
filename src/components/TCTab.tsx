import React, { useState } from 'react';
import { TransferCertificateRecord } from '../types';
import { SAMPLE_TCS } from '../data';
import SchoolHeader from './SchoolHeader';
import { Printer, RotateCcw, Sparkles, Plus, Trash2 } from 'lucide-react';

interface TCTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
}

export default function TCTab({ theme = 'glassNavy' }: TCTabProps) {
  const isGlass = theme === 'glassNavy';

  // Load dynamically from localStorage
  const [tcList, setTcList] = useState<TransferCertificateRecord[]>(() => {
    const saved = localStorage.getItem('sxc_all_tcs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SAMPLE_TCS;
  });

  const [record, setRecord] = useState<TransferCertificateRecord>(() => {
    const saved = localStorage.getItem('sxc_current_tc');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const list = (() => {
          const s = localStorage.getItem('sxc_all_tcs');
          if (s) { try { return JSON.parse(s); } catch (e) {} }
          return SAMPLE_TCS;
        })();
        const found = list.find((t: TransferCertificateRecord) => t.id === parsed.id);
        if (found) return found;
      } catch (e) {}
    }
    const list = (() => {
      const s = localStorage.getItem('sxc_all_tcs');
      if (s) { try { return JSON.parse(s); } catch (e) {} }
      return SAMPLE_TCS;
    })();
    return list[0];
  });

  const saveRecordAndList = (updatedRep: TransferCertificateRecord, currentList?: TransferCertificateRecord[]) => {
    setRecord(updatedRep);
    localStorage.setItem('sxc_current_tc', JSON.stringify(updatedRep));
    
    const listToUpdate = currentList || tcList;
    const updatedList = listToUpdate.map(r => r.id === updatedRep.id ? updatedRep : r);
    const listContainsRecord = listToUpdate.some(r => r.id === updatedRep.id);
    const finalList = listContainsRecord ? updatedList : [...listToUpdate, updatedRep];

    setTcList(finalList);
    localStorage.setItem('sxc_all_tcs', JSON.stringify(finalList));
  };

  const updateField = (field: keyof TransferCertificateRecord, value: any) => {
    const updated = { ...record, [field]: value };
    saveRecordAndList(updated);
  };

  const loadPreset = (preset: TransferCertificateRecord) => {
    setRecord(preset);
    localStorage.setItem('sxc_current_tc', JSON.stringify(preset));
  };

  const addRecord = () => {
    const newRecord: TransferCertificateRecord = {
      id: `tc-${Date.now()}`,
      tcNo: `STX/2026/${Math.floor(100 + Math.random() * 900)}`,
      bookNo: String(Math.floor(10 + Math.random() * 90)),
      scholarNo: `A-${Math.floor(4000 + Math.random() * 2500)}`,
      name: 'NEW STUDENT RECORD',
      motherName: 'MOTHER NAME',
      fatherName: 'FATHER NAME',
      nationality: 'INDIAN',
      category: 'GENERAL',
      dob: '2012-07-20',
      dobWords: 'TWENTIETH JULY TWO THOUSAND TWELVE',
      firstAdmissionDateClass: '2021-06-15 (CLASS V)',
      classInWhichLeaving: 'CLASS VIII',
      schoolBoardAnnualExam: 'PASSED',
      whetherFailed: 'NO',
      subjectsStudied: 'ENGLISH, HINDI, MATHEMATICS, SCIENCE, SOCIAL STUDIES',
      qualifiedForPromotion: 'YES (CLASS IX)',
      duePaidMonth: 'MARCH 2026',
      anyFeeConcession: 'NO',
      totalWorkingDays: 220,
      totalDaysPresent: 189,
      nccBoyScout: 'N/A',
      gamesExtraActivities: 'CHESS, FOOTBALL',
      generalConduct: 'GOOD',
      tcApplicationDate: '2026-03-22',
      tcIssueDate: '2026-03-26',
      reasonForLeaving: 'FAMILY RELOCATION',
      anyOtherRemarks: 'STUDENT HAS BEEN VERY WELL BEHAVED AND HARD WORKING.'
    };
    const updated = [...tcList, newRecord];
    setTcList(updated);
    setRecord(newRecord);
    localStorage.setItem('sxc_all_tcs', JSON.stringify(updated));
    localStorage.setItem('sxc_current_tc', JSON.stringify(newRecord));
  };

  const deleteRecord = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (tcList.length <= 1) {
      alert("At least one TC record must remain in the register.");
      return;
    }
    const updated = tcList.filter(t => t.id !== id);
    setTcList(updated);
    const nextActive = updated[0];
    setRecord(nextActive);
    localStorage.setItem('sxc_all_tcs', JSON.stringify(updated));
    localStorage.setItem('sxc_current_tc', JSON.stringify(nextActive));
  };

  const resetAllToDefault = () => {
    localStorage.removeItem('sxc_all_tcs');
    localStorage.removeItem('sxc_current_tc');
    setTcList(SAMPLE_TCS);
    setRecord(SAMPLE_TCS[0]);
  };

  // Styles computed based on theme
  const sidebarClass = isGlass
    ? 'no-print w-full xl:w-5/12 bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/50 h-fit max-h-[85vh] overflow-y-auto text-[#431407]'
    : 'no-print w-full xl:w-5/12 bg-[#0F0F12] p-6 rounded-2xl shadow-lg border border-[#242427] h-fit max-h-[85vh] overflow-y-auto';

  const previewPanelClass = isGlass
    ? 'flex-1 overflow-x-auto bg-[#FFF7ED]/50 p-6 rounded-2xl border border-white/40 flex justify-center'
    : 'flex-1 overflow-x-auto bg-[#0F0F12]/50 p-6 rounded-2xl border border-[#242427] flex justify-center';

  const h2Class = isGlass ? 'text-xl font-black text-[#431407]' : 'text-xl font-bold text-white';
  const subTextClass = isGlass ? 'text-xs text-slate-600' : 'text-xs text-gray-400';
  const labelClass = isGlass ? 'text-xs text-[#431407]/80 font-bold tracking-wide uppercase' : 'text-xs text-gray-400 font-semibold';
  const sectionHeaderClass = isGlass
    ? 'text-xs font-bold text-[#F97316] uppercase border-b border-[#431407]/15 pb-1 mt-6'
    : 'text-xs font-bold text-[#EA580C] uppercase border-b border-[#242427] pb-1 mt-6';

  const firstSectionHeaderClass = isGlass
    ? 'text-xs font-bold text-[#F97316] uppercase border-b border-[#431407]/15 pb-1'
    : 'text-xs font-bold text-[#EA580C] uppercase border-b border-[#242427] pb-1';

  const inputClass = isGlass
    ? 'w-full mt-1 p-2 bg-white/65 border border-[#431407]/15 text-[#431407] rounded-lg focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316] placeholder:text-slate-400 text-xs transition-all font-medium shadow-sm'
    : 'w-full mt-1 p-2 bg-[#1C1C1F] border border-[#242427] text-white rounded-lg focus:border-[#EA580C] focus:outline-none focus:ring-1 focus:ring-[#EA580C] text-xs transition-all';

  const selectClass = isGlass
    ? 'w-full mt-1 p-2 bg-white/65 border border-[#431407]/15 text-[#431407] rounded-lg focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316] text-xs font-semibold'
    : 'w-full mt-1 p-2 bg-[#1C1C1F] border border-[#242427] text-white rounded-lg text-xs focus:border-[#EA580C] focus:outline-none';

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className={sidebarClass}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className={h2Class}>TC Manager</h2>
            <p className={subTextClass}>Generate official school leaving certificates</p>
          </div>
          <button
            onClick={resetAllToDefault}
            title="Reset register to original defaults"
            className={isGlass ? 'p-2 border border-[#431407]/15 bg-white/50 rounded-lg hover:bg-white/80 text-[#431407] transition flex items-center gap-1 text-xs font-semibold' : 'p-2 border border-[#242427] bg-[#1C1C1F] rounded-lg hover:bg-[#242427] text-gray-300 transition flex items-center gap-1 text-xs font-semibold'}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset All
          </button>
        </div>

        {/* Quick select presets for Transfer Certificates */}
        <div className={isGlass ? 'mb-6 p-4 bg-[#FFF7ED]/65 rounded-xl border border-white shadow-sm flex flex-col relative overflow-hidden' : 'mb-6 p-4 bg-[#1C1C1F] rounded-xl border border-[#242427]'}>
          <div className="flex justify-between items-center mb-2.5">
            <p className={isGlass ? 'text-xs font-bold text-[#F97316] uppercase flex items-center gap-1' : 'text-xs font-bold text-[#EA580C] uppercase flex items-center gap-1'}>
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              Active Leaving Certificates
            </p>
            <button
              type="button"
              onClick={addRecord}
              className="px-2 py-1 bg-[#F97316]/10 hover:bg-[#F97316]/20 text-[#F97316] dark:text-[#EA580C] dark:bg-[#EA580C]/10 dark:hover:bg-[#EA580C]/20 border border-[#F97316]/20 rounded-md transition-all text-[10px] font-bold flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> Add Certificate
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tcList.map((s) => (
              <div key={s.id} className="relative group flex items-center">
                <button
                  type="button"
                  onClick={() => loadPreset(s)}
                  className={`${
                    record.id === s.id 
                      ? (isGlass ? 'px-3 py-1.5 rounded-lg text-xs font-black shadow bg-[#431407] text-[#FFF7ED]' : 'px-3 py-1.5 rounded-lg text-xs font-extrabold shadow-sm bg-[#EA580C] text-black shadow-[#EA580C]/20')
                      : (isGlass ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-white/45 border border-[#431407]/10 text-[#431407] hover:bg-white/80 transition-all' : 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0F0F12] border border-[#242427] text-gray-400 hover:bg-[#242427] hover:text-white transition-all')
                  } pr-6`}
                >
                  {s.name.split(' ')[0]} ({s.classInWhichLeaving ? s.classInWhichLeaving.split(' ')[0] : 'N/A'})
                </button>
                {tcList.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => deleteRecord(s.id, e)}
                    className="absolute right-1.5 p-0.5 text-red-500 hover:text-red-700 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded transition-all"
                    title={`Delete certificate of ${s.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* TC Fields Layout */}
        <div className="space-y-4">
          <p className={firstSectionHeaderClass}>Header & Registry Info</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>TC Number</label>
              <input type="text" value={record.tcNo} onChange={(e) => updateField('tcNo', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Book Number</label>
              <input type="text" value={record.bookNo} onChange={(e) => updateField('bookNo', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Scholar Number</label>
              <input type="text" value={record.scholarNo} onChange={(e) => updateField('scholarNo', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>SSSMI ID</label>
              <input type="text" value={record.sssmiId || ''} onChange={(e) => updateField('sssmiId', e.target.value)} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Student Aadhar</label>
              <input type="text" value={record.studentAadhar || ''} onChange={(e) => updateField('studentAadhar', e.target.value)} className={inputClass} />
            </div>
          </div>

          <p className={sectionHeaderClass}>Student Identity</p>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Pupil's Full Name</label>
              <input type="text" value={record.name} onChange={(e) => updateField('name', e.target.value.toUpperCase())} className={`${inputClass} font-bold uppercase`} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Mother's Name</label>
                <input type="text" value={record.motherName} onChange={(e) => updateField('motherName', e.target.value.toUpperCase())} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Father's Name</label>
                <input type="text" value={record.fatherName} onChange={(e) => updateField('fatherName', e.target.value.toUpperCase())} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Nationality</label>
                <input type="text" value={record.nationality} onChange={(e) => updateField('nationality', e.target.value.toUpperCase())} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Category / Caste</label>
                <input type="text" value={record.category} onChange={(e) => updateField('category', e.target.value.toUpperCase())} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Date of Birth (DOB)</label>
                <input type="date" value={record.dob} onChange={(e) => updateField('dob', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>DOB in Words</label>
                <input type="text" value={record.dobWords} onChange={(e) => updateField('dobWords', e.target.value.toUpperCase())} className={inputClass} />
              </div>
            </div>
          </div>

          <p className={sectionHeaderClass}>Academic Details</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>First Admission Date & Class</label>
                <input type="text" value={record.firstAdmissionDateClass} onChange={(e) => updateField('firstAdmissionDateClass', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Class leaving</label>
                <input type="text" value={record.classInWhichLeaving} onChange={(e) => updateField('classInWhichLeaving', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Annual Exam Status</label>
                <input type="text" value={record.schoolBoardAnnualExam} onChange={(e) => updateField('schoolBoardAnnualExam', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Failed (Yes/No)</label>
                <input type="text" value={record.whetherFailed} onChange={(e) => updateField('whetherFailed', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Subjects Studied (comma-separated)</label>
              <input type="text" value={record.subjectsStudied} onChange={(e) => updateField('subjectsStudied', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Promotion Status</label>
              <input type="text" value={record.qualifiedForPromotion} onChange={(e) => updateField('qualifiedForPromotion', e.target.value)} className={inputClass} />
            </div>
          </div>

          <p className={sectionHeaderClass}>Financials & Attendance</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Dues paid month</label>
              <input type="text" value={record.duePaidMonth} onChange={(e) => updateField('duePaidMonth', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Fee concession</label>
              <input type="text" value={record.anyFeeConcession} onChange={(e) => updateField('anyFeeConcession', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Total Working Days</label>
              <input type="number" value={record.totalWorkingDays} onChange={(e) => updateField('totalWorkingDays', parseInt(e.target.value) || 0)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Total Days Present</label>
              <input type="number" value={record.totalDaysPresent} onChange={(e) => updateField('totalDaysPresent', parseInt(e.target.value) || 0)} className={inputClass} />
            </div>
          </div>

          <p className={sectionHeaderClass}>Co-curricular & Conduct</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>NCC / Boy Scout</label>
                <input type="text" value={record.nccBoyScout || ''} onChange={(e) => updateField('nccBoyScout', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Games / Extra Activites</label>
                <input type="text" value={record.gamesExtraActivities || ''} onChange={(e) => updateField('gamesExtraActivities', e.target.value)} className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>General Conduct</label>
              <input type="text" value={record.generalConduct} onChange={(e) => updateField('generalConduct', e.target.value)} className={inputClass} />
            </div>
          </div>

          <p className={sectionHeaderClass}>TC Metadata & Dates</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Application Date</label>
              <input type="date" value={record.tcApplicationDate} onChange={(e) => updateField('tcApplicationDate', e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Issue Date</label>
              <input type="date" value={record.tcIssueDate} onChange={(e) => updateField('tcIssueDate', e.target.value)} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Reason for leaving</label>
              <input type="text" value={record.reasonForLeaving} onChange={(e) => updateField('reasonForLeaving', e.target.value)} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Remarks</label>
              <input type="text" value={record.anyOtherRemarks || ''} onChange={(e) => updateField('anyOtherRemarks', e.target.value)} className={inputClass} />
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className={isGlass ? 'w-full mt-4 bg-[#F97316] hover:bg-[#2c9c96] text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2' : 'w-full mt-4 bg-[#EA580C] hover:bg-[#2bc48b] text-black font-extrabold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2'}
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      <div className={previewPanelClass}>
        {/* Printable page starts here */}
        <div id="tc-section" className="print-page w-[210mm] min-h-[297mm] bg-white p-[12mm] text-[#431407] border border-slate-400 shadow-2xl relative select-none text-[11px] flex flex-col justify-between">
          <div>
            <SchoolHeader subTitle="TRANSFER CERTIFICATE" />
            
            <div className="mt-8 border border-[#431407] p-4 bg-[#FFF7ED]/40 rounded">
              <div className="flex justify-between font-mono font-bold mb-4 text-xs">
                <span>TC REGISTRY NO: <span className="bg-slate-100 px-2 py-0.5 border-b border-[#431407]">{record.tcNo}</span></span>
                <span>BOOK NO / SCHOLAR NO: <span className="bg-slate-100 px-2 py-0.5 border-b border-[#431407]">{record.bookNo} / {record.scholarNo}</span></span>
              </div>

              <div className="grid grid-cols-1 gap-y-2 text-xs leading-relaxed">
                <p className="border-b border-[#431407]/15 pb-1 flex justify-between">
                  <span>SSSMID STATE ID: <span className="font-mono font-bold bg-slate-100 px-1">{record.sssmiId || 'N/A'}</span></span>
                  <span>STUDENT AADHAR NO: <span className="font-mono font-bold bg-slate-100 px-1">{record.studentAadhar || 'N/A'}</span></span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">1. Name of the Pupil:</span>
                  <span className="font-extrabold text-[#431407]">{record.name}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">2. Mother's Name:</span>
                  <span>{record.motherName}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">3. Father's / Guardian's Name:</span>
                  <span>{record.fatherName}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">4. Nationality:</span>
                  <span>{record.nationality}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">5. Caste / Category:</span>
                  <span className="font-bold">{record.category}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">6. Date of First Admission in School with Class:</span>
                  <span>{record.firstAdmissionDateClass}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">7. Date of Birth (in Christian Era):</span>
                  <span>{record.dob ? new Date(record.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1 pl-4">
                  <span className="font-bold w-44 inline-block text-slate-500 italic">In Words:</span>
                  <span className="italic text-[#431407] font-bold text-[10px]">{record.dobWords || 'NOT SPECIFIED'}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">8. Class in which student last studied:</span>
                  <span className="font-extrabold">{record.classInWhichLeaving}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">9. Annual School Assessment / Exam Status:</span>
                  <span>{record.schoolBoardAnnualExam}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">10. Whether failed once or twice:</span>
                  <span>{record.whetherFailed}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">11. Main Subjects Studied:</span>
                  <span className="text-[10px] font-medium">{record.subjectsStudied}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">12. Qualified for Promotion to Next Class:</span>
                  <span className="font-extrabold">{record.qualifiedForPromotion}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">13. Student Due Paid Month & Fee Concession:</span>
                  <span>{record.duePaidMonth} (Concession: {record.anyFeeConcession})</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">14. Total Working Days in Session:</span>
                  <span className="font-mono">{record.totalWorkingDays} days</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">15. Total Days Present:</span>
                  <span className="font-mono">{record.totalDaysPresent} days</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">16. NCC Cadet / Boy Scout:</span>
                  <span>{record.nccBoyScout || 'N/A'}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">17. Extra-Curricular / Games:</span>
                  <span>{record.gamesExtraActivities || 'N/A'}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">18. General Conduct of Student:</span>
                  <span className="font-bold text-emerald-600">{record.generalConduct}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">19. Date of Application for Certificate:</span>
                  <span>{record.tcApplicationDate}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">20. Date of Issue of Certificate:</span>
                  <span className="font-bold">{record.tcIssueDate}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">21. Reason for leaving the School:</span>
                  <span className="italic font-bold">{record.reasonForLeaving}</span>
                </p>
                <p className="border-b border-[#431407]/15 pb-1">
                  <span className="font-bold w-48 inline-block">22. Any other remarks:</span>
                  <span>{record.anyOtherRemarks || 'N/A'}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-between items-end border-t border-[#F97316] pt-6">
            <div className="text-center w-36">
              <div className="h-6 border-b border-[#431407] mx-auto w-24"></div>
              <p className="font-bold text-[9px] text-[#431407] uppercase tracking-wider mt-1">Class Teacher</p>
            </div>

            <div className="text-center w-36 border border-[#F97316] p-2 bg-[#FFF7ED]/50 rounded scale-95 flex flex-col justify-center items-center">
              <span className="text-[10px] font-black text-[#431407] uppercase tracking-widest block">SAINT XAVIER</span>
              <span className="text-[7px] text-[#F97316] block mt-0.5 font-sans">CONVENT SCHOOL</span>
              <span className="text-[6px] text-slate-500 block uppercase font-mono tracking-tighter mt-1">OFFICIAL SEAL</span>
            </div>

            <div className="text-center w-36">
              <div className="h-6 border-b border-[#431407] mx-auto w-24"></div>
              <p className="font-bold text-[9px] text-[#431407] uppercase tracking-wider mt-1">School Manager</p>
            </div>

            <div className="text-center w-36">
              <div className="h-6 border-b border-[#431407] mx-auto w-24"></div>
              <p className="font-bold text-[9px] text-[#431407] uppercase tracking-wider mt-1">School Principal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
