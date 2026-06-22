import React, { useState } from 'react';
import type { MarksheetRecord, SubjectResult } from '../types';
import { SAMPLE_MARKSHEETS, calculateMarksTotal } from '../data';
import SchoolHeader from './SchoolHeader';
import { Plus, Trash2, Printer, RotateCcw, Sparkles, BookOpen } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';

interface MarksheetTabProps {
  onSave?: (record: any) => void;
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
}

export default function MarksheetTab({ onSave, theme = 'glassNavy' }: MarksheetTabProps) {
  // Load full list from localStorage, default to sample list
  const [recordsList, setRecordsList] = useState<MarksheetRecord[]>(() => {
    const saved = localStorage.getItem('sxc_all_marksheets');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SAMPLE_MARKSHEETS;
  });

  // Load active index or default record
  const [record, setRecord] = useState<MarksheetRecord>(() => {
    const savedActive = localStorage.getItem('sxc_current_marksheet');
    if (savedActive) {
      try {
        const parsed = JSON.parse(savedActive);
        // Ensure this active record is actually present in the dynamic recordsList
        const initialList = (() => {
          const s = localStorage.getItem('sxc_all_marksheets');
          if (s) { try { return JSON.parse(s); } catch (e) {} }
          return SAMPLE_MARKSHEETS;
        })();
        const found = initialList.find((r: MarksheetRecord) => r.id === parsed.id);
        if (found) return found;
      } catch (e) {}
    }
    const initialList = (() => {
      const s = localStorage.getItem('sxc_all_marksheets');
      if (s) { try { return JSON.parse(s); } catch (e) {} }
      return SAMPLE_MARKSHEETS;
    })();
    return initialList[0];
  });

  const [subjectInput, setSubjectInput] = useState({
    name: '',
    monthlyTestObt: 0,
    terminalObt: 0,
    halfObt: 0,
    projectObt: 0,
  });

  // Helper to save both local record and list
  const saveRecordAndList = (updatedRecord: MarksheetRecord, currentList?: MarksheetRecord[]) => {
    setRecord(updatedRecord);
    localStorage.setItem('sxc_current_marksheet', JSON.stringify(updatedRecord));
    
    const listToUpdate = currentList || recordsList;
    const updatedList = listToUpdate.map(r => r.id === updatedRecord.id ? updatedRecord : r);
    const listContainsRecord = listToUpdate.some(r => r.id === updatedRecord.id);
    const finalUpdatedList = listContainsRecord ? updatedList : [...listToUpdate, updatedRecord];

    setRecordsList(finalUpdatedList);
    localStorage.setItem('sxc_all_marksheets', JSON.stringify(finalUpdatedList));
    if (onSave) onSave(updatedRecord);
  };

  // Update helper
  const updateField = (field: keyof MarksheetRecord, value: any) => {
    const updated = { ...record, [field]: value };
    saveRecordAndList(updated);
  };

  // Update subject details
  const updateSubject = (index: number, field: keyof SubjectResult, value: any) => {
    const updatedSubjects = [...record.subjects];
    updatedSubjects[index] = { ...updatedSubjects[index], [field]: value };
    const updated = { ...record, subjects: updatedSubjects };
    saveRecordAndList(updated);
  };

  const addSubject = () => {
    if (!subjectInput.name) return;
    const updated = {
      ...record,
      subjects: [
        ...record.subjects,
        {
          name: subjectInput.name,
          monthlyTestObt: subjectInput.monthlyTestObt || 0,
          terminalObt: subjectInput.terminalObt || 0,
          halfObt: subjectInput.halfObt || 0,
          projectObt: subjectInput.projectObt || 0,
          maxTheory: 140,
          obtTheory: (subjectInput.monthlyTestObt || 0) + (subjectInput.terminalObt || 0) + (subjectInput.halfObt || 0) + (subjectInput.projectObt || 0)
        }
      ]
    };
    saveRecordAndList(updated);
    setSubjectInput({ name: '', monthlyTestObt: 0, terminalObt: 0, halfObt: 0, projectObt: 0 });
  };

  const removeSubject = (index: number) => {
    const updatedSubjects = record.subjects.filter((_, i) => i !== index);
    const updated = { ...record, subjects: updatedSubjects };
    saveRecordAndList(updated);
  };

  // Preset loading / switching
  const loadPreset = (preset: MarksheetRecord) => {
    setRecord(preset);
    localStorage.setItem('sxc_current_marksheet', JSON.stringify(preset));
    if (onSave) onSave(preset);
  };

  const addRecord = () => {
    const newRecord: MarksheetRecord = {
      id: `mk-${Date.now()}`,
      rollNo: String(recordsList.length + 1),
      scholarsNo: `A-${Math.floor(4000 + Math.random() * 2500)}`,
      name: 'NEW STUDENT RECORD',
      fatherName: 'FATHER NAME',
      motherName: 'MOTHER NAME',
      className: 'CLASS VIII',
      section: 'A',
      dob: '2013-08-15',
      session: '2025-26',
      attendance: '185/210',
      height: '142 cm',
      weight: '36 kg',
      disciplineGrade: 'A',
      remarks: 'Add teacher remarks here.',
      subjects: [
        { name: 'Hindi', maxTheory: 140, obtTheory: 110, monthlyTestObt: 15, terminalObt: 40, halfObt: 40, projectObt: 15 },
        { name: 'English', maxTheory: 140, obtTheory: 110, monthlyTestObt: 15, terminalObt: 40, halfObt: 40, projectObt: 15 },
        { name: 'Mathematics', maxTheory: 140, obtTheory: 110, monthlyTestObt: 15, terminalObt: 40, halfObt: 40, projectObt: 15 }
      ]
    };
    const updatedList = [...recordsList, newRecord];
    setRecordsList(updatedList);
    setRecord(newRecord);
    localStorage.setItem('sxc_all_marksheets', JSON.stringify(updatedList));
    localStorage.setItem('sxc_current_marksheet', JSON.stringify(newRecord));
    if (onSave) onSave(newRecord);
  };

  const deleteRecord = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (recordsList.length <= 1) {
      alert("At least one marksheet record must remain in the register.");
      return;
    }
    const updatedList = recordsList.filter(r => r.id !== id);
    setRecordsList(updatedList);
    const nextActive = updatedList[0];
    setRecord(nextActive);
    localStorage.setItem('sxc_all_marksheets', JSON.stringify(updatedList));
    localStorage.setItem('sxc_current_marksheet', JSON.stringify(nextActive));
    if (onSave) onSave(nextActive);
  };

  const resetAllToDefault = () => {
    localStorage.removeItem('sxc_all_marksheets');
    localStorage.removeItem('sxc_current_marksheet');
    setRecordsList(SAMPLE_MARKSHEETS);
    setRecord(SAMPLE_MARKSHEETS[0]);
    if (onSave) onSave(SAMPLE_MARKSHEETS[0]);
  };


  const applySubjectLayout = (schemeName: string) => {
    let selectedSubjects: SubjectResult[] = [];
    if (schemeName === 'Pre-Primary') {
      selectedSubjects = [
        { name: 'ENGLISH', maxTheory: 140, obtTheory: 110, monthlyTestObt: 15, terminalObt: 40, halfObt: 40, projectObt: 15 },
        { name: 'HINDI', maxTheory: 140, obtTheory: 105, monthlyTestObt: 14, terminalObt: 38, halfObt: 39, projectObt: 14 },
        { name: 'MATHS', maxTheory: 140, obtTheory: 120, monthlyTestObt: 18, terminalObt: 42, halfObt: 42, projectObt: 18 },
        { name: 'URDU', maxTheory: 140, obtTheory: 112, monthlyTestObt: 16, terminalObt: 40, halfObt: 40, projectObt: 16 },
        { name: 'ARABIC', maxTheory: 140, obtTheory: 115, monthlyTestObt: 17, terminalObt: 41, halfObt: 41, projectObt: 16 },
        { name: 'MORAL SCIENCE', maxTheory: 140, obtTheory: 108, monthlyTestObt: 15, terminalObt: 38, halfObt: 39, projectObt: 16 },
        { name: 'ART & CRAFT', maxTheory: 140, obtTheory: 114, monthlyTestObt: 16, terminalObt: 40, halfObt: 41, projectObt: 17 },
      ];
    } else if (schemeName === 'Primary') {
      selectedSubjects = [
        { name: 'ENGLISH', maxTheory: 140, obtTheory: 108, monthlyTestObt: 15, terminalObt: 38, halfObt: 39, projectObt: 16 },
        { name: 'HINDI', maxTheory: 140, obtTheory: 102, monthlyTestObt: 14, terminalObt: 36, halfObt: 37, projectObt: 15 },
        { name: 'MATHS', maxTheory: 140, obtTheory: 125, monthlyTestObt: 18, terminalObt: 43, halfObt: 45, projectObt: 19 },
        { name: 'URDU', maxTheory: 140, obtTheory: 109, monthlyTestObt: 15, terminalObt: 39, halfObt: 40, projectObt: 15 },
        { name: 'ARABIC', maxTheory: 140, obtTheory: 114, monthlyTestObt: 16, terminalObt: 41, halfObt: 41, projectObt: 16 },
        { name: 'E.V.S.', maxTheory: 140, obtTheory: 121, monthlyTestObt: 17, terminalObt: 43, halfObt: 44, projectObt: 17 },
        { name: 'COMPUTER BASIC', maxTheory: 140, obtTheory: 110, monthlyTestObt: 16, terminalObt: 39, halfObt: 39, projectObt: 16 },
      ];
    } else if (schemeName === 'Middle') {
      selectedSubjects = [
        { name: 'ENGLISH', maxTheory: 140, obtTheory: 108, monthlyTestObt: 15, terminalObt: 38, halfObt: 39, projectObt: 16 },
        { name: 'HINDI', maxTheory: 140, obtTheory: 107, monthlyTestObt: 15, terminalObt: 37, halfObt: 39, projectObt: 16 },
        { name: 'URDU/SANSKRIT', maxTheory: 140, obtTheory: 114, monthlyTestObt: 16, terminalObt: 41, halfObt: 41, projectObt: 16 },
        { name: 'MATHS', maxTheory: 140, obtTheory: 130, monthlyTestObt: 19, terminalObt: 46, halfObt: 46, projectObt: 19 },
        { name: 'SCIENCE', maxTheory: 140, obtTheory: 119, monthlyTestObt: 17, terminalObt: 42, halfObt: 43, projectObt: 17 },
        { name: 'SOCIAL SCIENCE', maxTheory: 140, obtTheory: 109, monthlyTestObt: 15, terminalObt: 39, halfObt: 40, projectObt: 15 },
        { name: 'AI TOOLS', maxTheory: 140, obtTheory: 128, monthlyTestObt: 18, terminalObt: 45, halfObt: 46, projectObt: 19 },
        { name: 'DIGITAL MARKETING', maxTheory: 140, obtTheory: 122, monthlyTestObt: 17, terminalObt: 43, halfObt: 44, projectObt: 18 },
      ];
    }
    const updated = { ...record, subjects: selectedSubjects };
    setRecord(updated);
    localStorage.setItem('sxc_current_marksheet', JSON.stringify(updated));
    if (onSave) onSave(updated);
  };

  const totals = calculateMarksTotal(record.subjects);

  const isGlass = theme === 'glassNavy';
  const sidebarClass = isGlass
    ? 'no-print w-full xl:w-5/12 bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/50 h-fit max-h-[85vh] overflow-y-auto text-[#431407]'
    : 'no-print w-full xl:w-5/12 bg-[#0F0F12] p-6 rounded-2xl shadow-lg border border-[#242427] h-fit max-h-[85vh] overflow-y-auto';

  const previewPanelClass = isGlass
    ? 'flex-1 overflow-x-auto bg-[#FFF7ED]/50 p-6 rounded-2xl border border-white/40 flex justify-center'
    : 'flex-1 overflow-x-auto bg-[#0F0F12]/50 p-6 rounded-2xl border border-[#242427] flex justify-center';

  const h2Class = isGlass ? 'text-xl font-black text-[#431407]' : 'text-xl font-bold text-white';
  const subTextClass = isGlass ? 'text-xs text-slate-600' : 'text-xs text-gray-400';
  const labelClass = isGlass ? 'text-xs text-[#431407]/80 font-bold tracking-wide uppercase' : 'text-xs text-gray-400 font-semibold';
  const labelSubClass = isGlass ? 'text-[10px] text-[#431407]/75 font-semibold uppercase' : 'text-[10px] text-gray-400 font-bold uppercase';

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

  const itemInputColClass = isGlass
    ? 'w-12 p-1 text-center bg-[#FFF7ED]/95 border border-[#431407]/10 text-[#431407] text-xs font-bold rounded focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316]'
    : 'w-12 p-1 text-center bg-[#0F0F12] text-white border border-[#242427] text-xs font-bold rounded focus:border-[#EA580C] focus:outline-none';

  const blockBoxClass = isGlass
    ? 'mb-6 p-4 bg-[#FFF7ED]/65 rounded-xl border border-white shadow-sm flex flex-col relative overflow-hidden'
    : 'mb-6 p-4 bg-[#1C1C1F] rounded-xl border border-[#242427]';

  const presetTitleClass = isGlass
    ? 'text-xs font-bold text-[#F97316] uppercase mb-2.5 flex items-center gap-1'
    : 'text-xs font-bold text-[#EA580C] uppercase mb-2.5 flex items-center gap-1';

  const presetBtnClass = (isSelected: boolean) => {
    if (isSelected) {
      return isGlass
        ? 'px-3 py-1.5 rounded-lg text-xs font-black shadow bg-[#431407] text-[#FFF7ED]'
        : 'px-3 py-1.5 rounded-lg text-xs font-extrabold shadow-sm bg-[#EA580C] text-black shadow-[#EA580C]/20';
    } else {
      return isGlass
        ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-white/45 border border-[#431407]/10 text-[#431407] hover:bg-white/80 transition-all'
        : 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0F0F12] border border-[#242427] text-gray-400 hover:bg-[#242427] hover:text-white transition-all';
    }
  };

  const btnResetClass = isGlass
    ? 'p-2 border border-[#431407]/15 bg-white/50 rounded-lg hover:bg-white/80 text-[#431407] transition flex items-center gap-1 text-xs font-semibold'
    : 'p-2 border border-[#242427] bg-[#1C1C1F] rounded-lg hover:bg-[#242427] text-gray-300 transition flex items-center gap-1 text-xs font-semibold';

  const blockBoxDashedClass = isGlass
    ? 'bg-white/45 p-3 rounded-lg border border-dashed border-[#431407]/20 flex gap-2 items-end'
    : 'bg-[#1C1C1F] p-3 rounded-lg border border-dashed border-[#242427] flex gap-2 items-end';

  const btnAddClass = isGlass
    ? 'px-3 py-1.5 bg-[#F97316] hover:bg-[#2c9c96] text-white rounded text-xs font-bold flex items-center gap-1 transition shadow'
    : 'px-3 py-1.5 bg-[#EA580C] hover:bg-[#2bc48b] text-black rounded text-xs font-bold flex items-center gap-1 transition';

  const btnPrintClass = isGlass
    ? 'w-full mt-4 bg-[#F97316] hover:bg-[#2c9c96] text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2'
    : 'w-full mt-4 bg-[#EA580C] hover:bg-[#2bc48b] text-black font-extrabold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2';

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Configuration Form Column */}
      <div className={sidebarClass}>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className={h2Class}>Marksheet Editor</h2>
            <p className={subTextClass}>Live preview details sync automatically</p>
          </div>
          <button
            onClick={resetAllToDefault}
            title="Reset register to original defaults"
            className={btnResetClass}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset All
          </button>
        </div>

        {/* Load Preset quickselect */}
        <div className={blockBoxClass}>
          <div className="flex justify-between items-center mb-2.5">
            <p className={presetTitleClass}>
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              Active Student Register
            </p>
            <button
              type="button"
              onClick={addRecord}
              className="px-2 py-1 bg-[#F97316]/10 hover:bg-[#F97316]/20 text-[#F97316] dark:text-[#EA580C] dark:bg-[#EA580C]/10 dark:hover:bg-[#EA580C]/20 border border-[#F97316]/20 rounded-md transition-all text-[10px] font-bold flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> Add Student
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recordsList.map((s) => (
              <div key={s.id} className="relative group flex items-center">
                <button
                  type="button"
                  onClick={() => loadPreset(s)}
                  className={`${presetBtnClass(record.id === s.id)} pr-6 relative`}
                >
                  {s.name.split(' ')[0]} ({s.className})
                </button>
                {recordsList.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => deleteRecord(s.id, e)}
                    className="absolute right-1.5 p-0.5 text-red-500 hover:text-red-700 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded transition-all"
                    title={`Delete marksheet of ${s.name}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Core Profile Inputs */}
        <div className="space-y-4">
          <p className={firstSectionHeaderClass}>Academic & Roll Info</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Roll Number</label>
              <input
                type="text"
                value={record.rollNo}
                onChange={(e) => updateField('rollNo', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Scholars Number</label>
              <input
                type="text"
                value={record.scholarsNo}
                onChange={(e) => updateField('scholarsNo', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Session</label>
              <input
                type="text"
                value={record.session}
                onChange={(e) => updateField('session', e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Class & Section</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. CLASS VIII"
                  value={record.className}
                  onChange={(e) => updateField('className', e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Sec"
                  value={record.section}
                  onChange={(e) => updateField('section', e.target.value)}
                  className={`${inputClass} !w-16 text-center`}
                />
              </div>
            </div>
          </div>

          <p className={sectionHeaderClass}>Student Bio Details</p>
          <div className="space-y-3">
            <div>
              <label className={labelClass}>Student full Name</label>
              <input
                type="text"
                value={record.name}
                onChange={(e) => updateField('name', e.target.value.toUpperCase())}
                className={`${inputClass} font-bold uppercase`}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Father's Name</label>
                <input
                  type="text"
                  value={record.fatherName}
                  onChange={(e) => updateField('fatherName', e.target.value.toUpperCase())}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Mother's Name</label>
                <input
                  type="text"
                  value={record.motherName}
                  onChange={(e) => updateField('motherName', e.target.value.toUpperCase())}
                  className={inputClass}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>DOB</label>
                <input
                  type="date"
                  value={record.dob}
                  onChange={(e) => updateField('dob', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Attendance</label>
                <input
                  type="text"
                  placeholder="200/220"
                  value={record.attendance}
                  onChange={(e) => updateField('attendance', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Discipline Grade</label>
                <select
                  value={record.disciplineGrade}
                  onChange={(e) => updateField('disciplineGrade', e.target.value)}
                  className={selectClass}
                >
                  <option value="A">Grade A</option>
                  <option value="B">Grade B</option>
                  <option value="C">Grade C</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Height</label>
                <input
                  type="text"
                  placeholder="e.g. 142 cm"
                  value={record.height || ''}
                  onChange={(e) => updateField('height', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Weight</label>
                <input
                  type="text"
                  placeholder="e.g. 36 kg"
                  value={record.weight || ''}
                  onChange={(e) => updateField('weight', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Subjects Score Entries */}
          <p className={sectionHeaderClass}>Report Card Subjects Marks</p>

          {/* Standard Class Schemes Quick Loader */}
          <div className="p-3 bg-[#F97316]/5 dark:bg-[#EA580C]/5 border border-[#F97316]/10 dark:border-[#EA580C]/10 rounded-xl space-y-2 mb-2 no-print">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#431407]/80 dark:text-gray-300">
              <BookOpen className="w-3.5 h-3.5 text-[#F97316] shrink-0" />
              <span>Load Standard Class Subjects:</span>
            </div>
            <div className="flex flex-wrap gap-1.5 select-none">
              <button
                type="button"
                onClick={() => applySubjectLayout('Pre-Primary')}
                className="px-2.5 py-1 text-[10px] font-bold bg-[#F97316]/10 hover:bg-[#F97316]/20 text-[#F97316] dark:text-[#EA580C] dark:bg-[#EA580C]/10 dark:hover:bg-[#EA580C]/20 border border-[#F97316]/20 rounded-full transition-all"
              >
                Pre-Primary
              </button>
              <button
                type="button"
                onClick={() => applySubjectLayout('Primary')}
                className="px-2.5 py-1 text-[10px] font-bold bg-[#F97316]/10 hover:bg-[#F97316]/20 text-[#F97316] dark:text-[#EA580C] dark:bg-[#EA580C]/10 dark:hover:bg-[#EA580C]/20 border border-[#F97316]/20 rounded-full transition-all"
              >
                Primary
              </button>
              <button
                type="button"
                onClick={() => applySubjectLayout('Middle')}
                className="px-2.5 py-1 text-[10px] font-bold bg-[#F97316]/10 hover:bg-[#F97316]/20 text-[#F97316] dark:text-[#EA580C] dark:bg-[#EA580C]/10 dark:hover:bg-[#EA580C]/20 border border-[#F97316]/20 rounded-full transition-all"
              >
                Middle
              </button>
            </div>
            <p className="text-[8px] text-gray-400 italic">This will load the matching standard subject categories for your report card.</p>
          </div>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {record.subjects.map((sub, idx) => {
              const mt = sub.monthlyTestObt ?? 0;
              const term = sub.terminalObt ?? 0;
              const hy = sub.halfObt ?? 0;
              const proj = sub.projectObt ?? 0;
              const subTotal = mt + term + hy + proj;

              return (
                <div key={idx} className="p-3 bg-white/45 border border-white/50 dark:bg-black/20 dark:border-[#242427] rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={sub.name}
                      onChange={(e) => updateSubject(idx, 'name', e.target.value)}
                      className="font-bold text-xs bg-transparent border-b border-dashed border-slate-300 dark:border-zinc-700 text-[#431407] dark:text-white focus:outline-none"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] bg-[#F97316]/10 text-[#F97316] px-2 py-0.5 rounded-full font-bold font-mono">
                        Got: {subTotal} / 140
                      </span>
                      <button
                        type="button"
                        onClick={() => removeSubject(idx)}
                        className="p-1 text-red-500 hover:text-red-700 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-1.5 text-[9px] font-semibold text-gray-500">
                    <div>
                      <span className="block truncate">Monthly (20)</span>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={sub.monthlyTestObt ?? 0}
                        onChange={(e) => updateSubject(idx, 'monthlyTestObt', Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
                        className={itemInputColClass}
                      />
                    </div>
                    <div>
                      <span className="block truncate">Term (50)</span>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={sub.terminalObt ?? 0}
                        onChange={(e) => updateSubject(idx, 'terminalObt', Math.min(50, Math.max(0, parseInt(e.target.value) || 0)))}
                        className={itemInputColClass}
                      />
                    </div>
                    <div>
                      <span className="block truncate">Half Yr (50)</span>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={sub.halfObt ?? 0}
                        onChange={(e) => updateSubject(idx, 'halfObt', Math.min(50, Math.max(0, parseInt(e.target.value) || 0)))}
                        className={itemInputColClass}
                      />
                    </div>
                    <div>
                      <span className="block truncate">Project (20)</span>
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={sub.projectObt ?? 0}
                        onChange={(e) => updateSubject(idx, 'projectObt', Math.min(20, Math.max(0, parseInt(e.target.value) || 0)))}
                        className={itemInputColClass}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Custom Subject */}
          <div className={blockBoxDashedClass}>
            <div className="flex-1">
              <label className={labelSubClass}>Subject Name</label>
              <input
                type="text"
                placeholder="e.g. Sanskrit"
                value={subjectInput.name}
                onChange={(e) => setSubjectInput({ ...subjectInput, name: e.target.value })}
                className={isGlass ? inputClass : 'w-full mt-1 p-1.5 bg-[#0F0F12] text-white border border-[#242427] rounded text-xs focus:border-[#EA580C] focus:outline-none'}
              />
            </div>
            <button
              type="button"
              onClick={addSubject}
              className={btnAddClass}
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div>
            <label className={labelClass}>Teacher Remarks</label>
            <textarea
              value={record.remarks}
              onChange={(e) => updateField('remarks', e.target.value)}
              rows={2}
              className={inputClass}
            ></textarea>
          </div>

          <button
            onClick={() => window.print()}
            className={btnPrintClass}
          >
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* A4 High Fidelity live Preview Column */}
      <div className={previewPanelClass}>
        {/* Printable page starts here */}
        <div id="marksheet-section" className="print-page w-[210mm] min-h-[297mm] bg-white p-[12mm] text-[#431407] border border-slate-400 shadow-2xl relative select-none text-[11px] flex flex-col justify-between">
          <div>
            {/* Real School Header */}
            <SchoolHeader
              diseCode="23264101892"
              psNo="123197"
              subTitle="Official Student Report Card & Marksheet"
              customSession={record.session}
            />

            {/* Student Metadata Table Box */}
            <div className="border border-[#431407] mt-2 p-3 bg-[#FFF7ED]/50 rounded flex flex-row justify-between items-center gap-4">
              <div className="grid grid-cols-2 gap-y-2 gap-x-6 text-[10px] sm:text-xs flex-1">
                <div>
                  <span className="font-bold text-[#431407] uppercase">1. Scholar Number:</span>{' '}
                  <span className="font-mono bg-slate-100 px-1 border-b border-[#F97316] tracking-wider font-extrabold">{record.scholarsNo || '________'}</span>
                </div>
                <div>
                  <span className="font-bold text-[#431407] uppercase">2. Roll Number:</span>{' '}
                  <span className="font-mono bg-slate-100 px-2 border-b border-[#F97316] tracking-wider font-extrabold">{record.rollNo || '________'}</span>
                </div>
                <div>
                  <span className="font-bold text-[#431407] uppercase">3. Full Name:</span>{' '}
                  <span className="font-sans border-b border-[#F97316] font-extrabold">{record.name || '________'}</span>
                </div>
                <div>
                  <span className="font-bold text-[#431407] uppercase">4. Class & Sec:</span>{' '}
                  <span className="font-sans border-b border-[#F97316] font-extrabold">{record.className} - {record.section}</span>
                </div>
                <div>
                  <span className="font-bold text-[#431407] uppercase">5. Father's Name:</span>{' '}
                  <span className="font-sans border-b border-[#F97316] font-bold">{record.fatherName || '________'}</span>
                </div>
                <div>
                  <span className="font-bold text-[#431407] uppercase">6. Mother's Name:</span>{' '}
                  <span className="font-sans border-b border-[#F97316] font-bold">{record.motherName || '________'}</span>
                </div>
                <div>
                  <span className="font-bold text-[#431407] uppercase">7. Date of Birth:</span>{' '}
                  <span className="font-sans border-b border-[#F97316] font-bold">
                    {record.dob ? new Date(record.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase() : '________'}
                  </span>
                </div>
                <div>
                  <span className="font-bold text-[#431407] uppercase">8. School Attendance:</span>{' '}
                  <span className="font-mono bg-slate-50 border border-[#F97316] px-2 font-bold text-[#431407]">{record.attendance || '________'}</span>
                </div>
              </div>
              <div className="shrink-0 flex items-center justify-center">
                <QRCodeGenerator
                  value={`SAINT XAVIER OFFICIAL MARKSHEET VERIFICATION\nScholar No: ${record.scholarsNo || 'N/A'}\nRoll No: ${record.rollNo || 'N/A'}\nStudent Name: ${record.name || 'N/A'}\nClass: ${record.className} - ${record.section}\nSession: ${record.session}\nTotal Percentage: ${totals.percentage.toFixed(1)}% (${totals.grade})\nVerification ID: SXC-MS-${record.scholarsNo || 'REG'}-${record.session?.replace('/', '-')}`}
                  studentId={record.scholarsNo || 'N/A'}
                  label="Scholar No"
                  size={54}
                />
              </div>
            </div>

            {/* Academic Evaluation Title */}
            <div className="mt-5 mb-2 font-bold text-[10px] tracking-wider uppercase text-[#431407] flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-[#F97316]" /> Part I: Academic Performance & Evaluation
            </div>

            {/* Subject Marks Evaluation Table */}
            <table className="w-full border-collapse border border-[#431407] font-sans text-[10px]">
              <thead>
                <tr className="bg-[#431407] text-white font-bold uppercase text-[8px] sm:text-[9px] tracking-tight">
                  <th className="border border-[#431407] py-2 px-1 text-center w-8 font-mono">S.No</th>
                  <th className="border border-[#431407] py-2 px-2 text-left">Subject Evaluated</th>
                  <th className="border border-[#431407] py-2 px-1 text-center w-20">Monthly Test<span className="block text-[7px] font-normal text-slate-300">(Max 20)</span></th>
                  <th className="border border-[#431407] py-2 px-1 text-center w-20">Terminal Exam<span className="block text-[7px] font-normal text-slate-300">(Max 50)</span></th>
                  <th className="border border-[#431407] py-2 px-1 text-center w-20">Half Yearly<span className="block text-[7px] font-normal text-slate-300">(Max 50)</span></th>
                  <th className="border border-[#431407] py-2 px-1 text-center w-20">Project Marks<span className="block text-[7px] font-normal text-slate-300">(Max 20)</span></th>
                  <th className="border border-[#431407] py-2 px-1 text-center w-24 bg-[#1A252F]">Grand Total<span className="block text-[7px] font-normal text-slate-300">(Max 140)</span></th>
                  <th className="border border-[#431407] py-2 px-1 text-center w-14">Grade</th>
                </tr>
              </thead>
              <tbody>
                {record.subjects.map((sub, idx) => {
                  const mt = sub.monthlyTestObt ?? 0;
                  const term = sub.terminalObt ?? 0;
                  const hy = sub.halfObt ?? 0;
                  const proj = sub.projectObt ?? 0;
                  const obtTotal = mt + term + hy + proj;
                  const maxTotal = 140;

                  const percent = (obtTotal / maxTotal) * 100;
                  let grade = 'E';
                  if (percent >= 90) grade = 'A+';
                  else if (percent >= 80) grade = 'A';
                  else if (percent >= 70) grade = 'B';
                  else if (percent >= 60) grade = 'C';
                  else if (percent >= 50) grade = 'D';
                  else if (percent >= 33) grade = 'E';
                  else grade = 'E (Fail)';

                  return (
                    <tr key={idx} className="hover:bg-slate-50 transition font-medium">
                      <td className="border border-[#431407] py-1.5 px-1 text-center font-mono text-[9px] bg-slate-50/50">{idx + 1}</td>
                      <td className="border border-[#431407] py-1.5 px-2 font-semibold text-[#431407]">{sub.name}</td>
                      <td className="border border-[#431407] py-1.5 px-1 text-center font-mono text-[#431407]">{mt}</td>
                      <td className="border border-[#431407] py-1.5 px-1 text-center font-mono text-[#431407]">{term}</td>
                      <td className="border border-[#431407] py-1.5 px-1 text-center font-mono text-[#431407]">{hy}</td>
                      <td className="border border-[#431407] py-1.5 px-1 text-center font-mono text-[#431407]">{proj}</td>
                      <td className="border border-[#431407] py-1.5 px-1 text-center font-mono font-bold bg-[#FFF7ED]/40 text-[#431407]">{obtTotal}</td>
                      <td className="border border-[#431407] py-1.5 px-1 text-center font-bold text-[#431407] bg-slate-50/35">{grade}</td>
                    </tr>
                  );
                })}

                {/* Weighted Grand Totals overall bottom block */}
                <tr className="bg-[#FFF7ED]/60 font-extrabold text-[10px] text-[#431407]">
                  <td className="border border-[#431407] py-2 px-2 text-center" colSpan={2}>GRAND TOTALS</td>
                  <td className="border border-[#431407] py-2 px-1 text-center font-mono text-slate-700">
                    {record.subjects.reduce((sum, s) => sum + (s.monthlyTestObt ?? 0), 0)}
                    <span className="block text-[7px] font-normal text-slate-400">/ {record.subjects.length * 20}</span>
                  </td>
                  <td className="border border-[#431407] py-2 px-1 text-center font-mono text-slate-700">
                    {record.subjects.reduce((sum, s) => sum + (s.terminalObt ?? 0), 0)}
                    <span className="block text-[7px] font-normal text-slate-400">/ {record.subjects.length * 50}</span>
                  </td>
                  <td className="border border-[#431407] py-2 px-1 text-center font-mono text-slate-700">
                    {record.subjects.reduce((sum, s) => sum + (s.halfObt ?? 0), 0)}
                    <span className="block text-[7px] font-normal text-slate-400">/ {record.subjects.length * 50}</span>
                  </td>
                  <td className="border border-[#431407] py-2 px-1 text-center font-mono text-slate-700">
                    {record.subjects.reduce((sum, s) => sum + (s.projectObt ?? 0), 0)}
                    <span className="block text-[7px] font-normal text-slate-400">/ {record.subjects.length * 20}</span>
                  </td>
                  <td className="border border-[#431407] py-2 px-1 text-center font-mono text-[#431407] bg-[#FFF7ED]/40 text-[11px] font-black">
                    {totals.obt}
                    <span className="block text-[7px] font-normal text-slate-400">/ {totals.max}</span>
                  </td>
                  <td className="border border-[#431407] py-2 px-1 text-center text-[9px] bg-[#FFF7ED]/20 font-serif">
                    {totals.percentage.toFixed(1)}% ({totals.grade})
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Health and Discipline block */}
            <div className="grid grid-cols-3 gap-3 mt-4 text-[9px] sm:text-xs">
              <div className="border border-[#431407] p-2 rounded bg-slate-50/50">
                <span className="font-bold text-[#431407] block border-b pb-0.5 mb-1 text-[9px] uppercase">A. Co-Scholastic Grade</span>
                <span className="font-bold">General Discipline:</span>{' '}
                <span className="font-bold text-[#F97316] ml-1 font-mono text-[11px]">Grade {record.disciplineGrade}</span>
              </div>
              <div className="border border-[#431407] p-2 rounded bg-slate-50/50">
                <span className="font-bold text-[#431407] block border-b pb-0.5 mb-1 text-[9px] uppercase">B. Height Record</span>
                <span className="font-semibold">{record.height || 'N/A'}</span>
              </div>
              <div className="border border-[#431407] p-2 rounded bg-slate-50/50">
                <span className="font-bold text-[#431407] block border-b pb-0.5 mb-1 text-[9px] uppercase">C. Weight Record</span>
                <span className="font-semibold">{record.weight || 'N/A'}</span>
              </div>
            </div>

            {/* General Remarks Box */}
            <div className="border border-[#431407] mt-4 p-3 bg-[#FFF7ED]/20 rounded">
              <div className="text-[9px] font-bold uppercase text-[#431407] mb-1 border-b border-[#F97316] pb-0.5">
                Class Teacher's Evaluative Opinion & Remarks
              </div>
              <p className="text-xs italic font-medium text-[#431407] leading-relaxed">
                "{record.remarks || 'Rahul has demonstrated strong analytical skill and should maintain consistent focus in other languages.'}"
              </p>
            </div>
          </div>

          {/* Footer of sheet - Authority Stamps */}
          <div>
            {/* Stamp guidelines box */}
            <div className="border border-slate-200 mt-6 p-2 rounded text-[8px] sm:text-[9px] text-slate-500 leading-tight">
              <span className="font-bold uppercase text-[#E53E3E]">Grading System:</span> O (Outstanding): 90-100% | A (Excellent): 80-89% | B (Very Good): 70-79% | C (Good): 60-69% | D (Satisfactory): 50-59% | E (Pass): 33-49% | F (Fail): Below 33%.
            </div>

            <div className="flex justify-between items-end mt-12 pt-4 border-t border-[#F97316]">
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
                <p className="font-bold text-[9px] text-[#431407] uppercase tracking-wider mt-1">School Principal</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
