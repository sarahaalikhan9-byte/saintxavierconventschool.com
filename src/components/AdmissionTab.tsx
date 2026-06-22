import React, { useState, useRef } from 'react';
import SchoolHeader from './SchoolHeader';
import QRCodeGenerator from './QRCodeGenerator';
import {
  Camera, User, Phone, Mail, Upload, Plus, Trash2, Sparkles,
  RotateCcw, Printer, FileText, Search, ChevronRight, CheckCircle2,
  BookOpen, Home, Shield, Bus, Hash
} from 'lucide-react';
import { AdmissionFormRecord } from '../types';
import { SAMPLE_ADMISSIONS } from '../data';

interface AdmissionTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: 'header',   label: 'Header Info',         icon: Hash },
  { id: 'photo',    label: 'Photo',                icon: Camera },
  { id: 'student',  label: 'Student Info',         icon: User },
  { id: 'academic', label: 'Academic',             icon: BookOpen },
  { id: 'guardian', label: 'Guardian Info',        icon: Shield },
  { id: 'address',  label: 'Address & IDs',        icon: Home },
  { id: 'misc',     label: 'Transport & Contact',  icon: Bus },
] as const;

type SectionId = typeof SECTIONS[number]['id'];

export default function AdmissionTab({ theme = 'glassNavy' }: AdmissionTabProps) {
  const isGlass = theme === 'glassNavy';

  // ── State ──────────────────────────────────────────────────────────────────
  const [admissionsList, setAdmissionsList] = useState<AdmissionFormRecord[]>(() => {
    const saved = localStorage.getItem('sxc_all_admissions');
    if (saved) { try { return JSON.parse(saved); } catch (_) {} }
    return SAMPLE_ADMISSIONS;
  });

  const [record, setRecord] = useState<AdmissionFormRecord>(() => {
    const saved = localStorage.getItem('sxc_current_admission');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const found = (JSON.parse(localStorage.getItem('sxc_all_admissions') || '[]') as AdmissionFormRecord[]).find((a: AdmissionFormRecord) => a.id === parsed.id);
        if (found) return found;
      } catch (_) {}
    }
    return SAMPLE_ADMISSIONS[0];
  });

  const [activeSection, setActiveSection] = useState<SectionId>('header');
  const [dragActive, setDragActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Data helpers ───────────────────────────────────────────────────────────
  const updateField = (field: keyof AdmissionFormRecord, value: any) => {
    const updated = { ...record, [field]: value };
    setRecord(updated);
    localStorage.setItem('sxc_current_admission', JSON.stringify(updated));
    const updatedList = admissionsList.map(a => a.id === updated.id ? updated : a);
    setAdmissionsList(updatedList);
    localStorage.setItem('sxc_all_admissions', JSON.stringify(updatedList));
  };

  const loadRecord = (preset: AdmissionFormRecord) => {
    setRecord(preset);
    localStorage.setItem('sxc_current_admission', JSON.stringify(preset));
  };

  const startNewAdmission = () => {
    const newRecord: AdmissionFormRecord = {
      id: `adm-${Date.now()}`,
      docketNo: `SXC-REG-2026-NEW-${Math.floor(100 + Math.random() * 899)}`,
      diseCode: '23260519102',
      psNo: `PS-${Math.floor(1000 + Math.random() * 9000)}`,
      admissionNo: `ADM-2026/${Math.floor(100 + Math.random() * 900)}`,
      enrollmentDate: new Date().toISOString().split('T')[0],
      session: '2026-27',
      name: 'NEW STUDENT RECORD',
      gender: 'MALE', bloodGroup: 'B+',
      dob: '2020-01-01', dobWords: 'FIRST OF JANUARY TWO THOUSAND TWENTY',
      birthPlace: 'INDORE', nationality: 'INDIAN', religion: 'HINDU',
      category: 'GENERAL', motherTongue: 'HINDI',
      classTarget: 'Pre-Primary (PP-I)', prevSchool: 'N/A',
      fatherName: 'FATHER NAME', fatherOcc: 'SERVICE',
      motherName: 'MOTHER NAME', motherOcc: 'HOUSEWIFE',
      guardianName: 'FATHER NAME',
      phone: '+91 90000 00000', email: 'parent@domain.com',
      address: 'STREET ADDRESS, AREA', city: 'INDORE', pinCode: '452001',
      sssmiId: '', aadharNo: '', aparId: '',
      transportRequired: 'NO', photoUrl: null,
    };
    const updatedList = [...admissionsList, newRecord];
    setAdmissionsList(updatedList);
    setRecord(newRecord);
    localStorage.setItem('sxc_all_admissions', JSON.stringify(updatedList));
    localStorage.setItem('sxc_current_admission', JSON.stringify(newRecord));
    setActiveSection('header');
  };

  const deleteAdmission = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (admissionsList.length <= 1) { alert('At least one record must remain.'); return; }
    const updated = admissionsList.filter(a => a.id !== id);
    setAdmissionsList(updated);
    setRecord(updated[0]);
    localStorage.setItem('sxc_all_admissions', JSON.stringify(updated));
    localStorage.setItem('sxc_current_admission', JSON.stringify(updated[0]));
  };

  const resetAll = () => {
    localStorage.removeItem('sxc_all_admissions');
    localStorage.removeItem('sxc_current_admission');
    setAdmissionsList(SAMPLE_ADMISSIONS);
    setRecord(SAMPLE_ADMISSIONS[0]);
  };

  // ── Photo handlers ─────────────────────────────────────────────────────────
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation(); setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) { const r = new FileReader(); r.onload = ev => updateField('photoUrl', ev.target?.result as string); r.readAsDataURL(file); }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const r = new FileReader(); r.onload = ev => updateField('photoUrl', ev.target?.result as string); r.readAsDataURL(file); }
  };

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filteredList = admissionsList.filter(a =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.admissionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.classTarget.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── Style tokens ───────────────────────────────────────────────────────────
  const panel = isGlass
    ? 'bg-white border-slate-200 text-slate-800'
    : 'bg-[#111113] border-[#1f1f22] text-white';
  const inputCls = isGlass
    ? 'w-full mt-1 p-2 text-xs bg-slate-50 border border-slate-200 text-slate-800 rounded-lg focus:border-orange-400 focus:ring-1 focus:ring-orange-300 outline-none transition font-medium'
    : 'w-full mt-1 p-2 text-xs bg-[#0f0f12] border border-[#2c2c2e] text-white rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500/30 outline-none transition';
  const selectCls = isGlass
    ? 'w-full mt-1 p-2 text-xs bg-slate-50 border border-slate-200 text-slate-800 rounded-lg focus:border-orange-400 outline-none'
    : 'w-full mt-1 p-2 text-xs bg-[#0f0f12] border border-[#2c2c2e] text-white rounded-lg focus:border-orange-500 outline-none';
  const labelCls = isGlass
    ? 'block text-[10px] font-bold text-slate-500 uppercase tracking-wider'
    : 'block text-[10px] font-bold text-slate-500 uppercase tracking-wider';
  const secHead = isGlass
    ? 'text-[10px] font-black text-orange-500 uppercase tracking-widest border-b border-slate-100 pb-1.5 mb-3'
    : 'text-[10px] font-black text-orange-400 uppercase tracking-widest border-b border-[#1f1f22] pb-1.5 mb-3';

  // ── Section form content ───────────────────────────────────────────────────
  const renderFormSection = () => {
    switch (activeSection) {
      case 'header': return (
        <div className="space-y-4">
          <p className={secHead}>Header Info</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Docket Number', 'docketNo'],
              ['DISE Code', 'diseCode'],
              ['PS Number', 'psNo'],
              ['Admission Number', 'admissionNo'],
            ].map(([lbl, fld]) => (
              <div key={fld}>
                <label className={labelCls}>{lbl}</label>
                <input type="text" value={(record as any)[fld]} onChange={e => updateField(fld as keyof AdmissionFormRecord, e.target.value)} className={inputCls} />
              </div>
            ))}
            <div>
              <label className={labelCls}>Application Date</label>
              <input type="date" value={record.enrollmentDate} onChange={e => updateField('enrollmentDate', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Session</label>
              <input type="text" value={record.session} onChange={e => updateField('session', e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>
      );
      case 'photo': return (
        <div className="space-y-4">
          <p className={secHead}>Student Photograph</p>
          <div
            onDragEnter={handleDrag} onDragOver={handleDrag}
            onDragLeave={handleDrag} onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] ${
              dragActive ? 'border-orange-400 bg-orange-400/10' :
              isGlass ? 'border-slate-200 hover:border-slate-300 bg-slate-50' : 'border-[#2c2c2e] hover:border-[#3f3f46] bg-[#0f0f12]'
            }`}
          >
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            {record.photoUrl ? (
              <div className="relative group">
                <img src={record.photoUrl} alt="Student" className="w-20 h-24 object-cover rounded-xl border-2 border-orange-200 shadow-md" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center text-white text-xs font-bold transition-all">Change</div>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center mb-3">
                  <Upload className="w-5 h-5 text-orange-500" />
                </div>
                <p className={`text-sm font-bold ${isGlass ? 'text-slate-600' : 'text-slate-400'}`}>Drag & drop or <span className="text-orange-500">browse</span></p>
                <p className={`text-xs mt-1 ${isGlass ? 'text-slate-400' : 'text-slate-500'}`}>JPEG / PNG passport photo</p>
              </>
            )}
          </div>
          {record.photoUrl && (
            <button onClick={() => updateField('photoUrl', null)} className="w-full text-xs font-bold text-red-500 py-2 rounded-xl border border-red-500/20 hover:bg-red-500/10 transition">
              Remove Photo
            </button>
          )}
        </div>
      );
      case 'student': return (
        <div className="space-y-3">
          <p className={secHead}>Student Information</p>
          <div>
            <label className={labelCls}>Student Full Name</label>
            <input type="text" value={record.name} onChange={e => updateField('name', e.target.value.toUpperCase())} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Gender</label>
              <select value={record.gender} onChange={e => updateField('gender', e.target.value)} className={selectCls}>
                <option>MALE</option><option>FEMALE</option><option>OTHER</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Blood Group</label>
              <input type="text" value={record.bloodGroup} onChange={e => updateField('bloodGroup', e.target.value.toUpperCase())} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Date of Birth</label>
              <input type="date" value={record.dob} onChange={e => updateField('dob', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>DOB in Words</label>
              <input type="text" value={record.dobWords} onChange={e => updateField('dobWords', e.target.value.toUpperCase())} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Birth Place', 'birthPlace'],
              ['Nationality', 'nationality'],
              ['Religion', 'religion'],
              ['Category', 'category'],
            ].map(([lbl, fld]) => (
              <div key={fld}>
                <label className={labelCls}>{lbl}</label>
                <input type="text" value={(record as any)[fld]} onChange={e => updateField(fld as keyof AdmissionFormRecord, e.target.value.toUpperCase())} className={inputCls} />
              </div>
            ))}
          </div>
          <div>
            <label className={labelCls}>Mother Tongue</label>
            <input type="text" value={record.motherTongue} onChange={e => updateField('motherTongue', e.target.value.toUpperCase())} className={inputCls} />
          </div>
        </div>
      );
      case 'academic': return (
        <div className="space-y-3">
          <p className={secHead}>Academic Details</p>
          <div>
            <label className={labelCls}>Class Applying For</label>
            <input type="text" value={record.classTarget} onChange={e => updateField('classTarget', e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Previous School / Institution</label>
            <input type="text" value={record.prevSchool} onChange={e => updateField('prevSchool', e.target.value)} className={inputCls} />
          </div>
        </div>
      );
      case 'guardian': return (
        <div className="space-y-3">
          <p className={secHead}>Guardian Information</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              ["Father's Name", 'fatherName'],
              ['Father Occupation', 'fatherOcc'],
              ["Mother's Name", 'motherName'],
              ['Mother Occupation', 'motherOcc'],
            ].map(([lbl, fld]) => (
              <div key={fld}>
                <label className={labelCls}>{lbl}</label>
                <input type="text" value={(record as any)[fld]} onChange={e => updateField(fld as keyof AdmissionFormRecord, e.target.value.toUpperCase())} className={inputCls} />
              </div>
            ))}
          </div>
          <div>
            <label className={labelCls}>Guardian Name (Legal)</label>
            <input type="text" value={record.guardianName} onChange={e => updateField('guardianName', e.target.value.toUpperCase())} className={inputCls} />
          </div>
        </div>
      );
      case 'address': return (
        <div className="space-y-3">
          <p className={secHead}>Address & Government IDs</p>
          <div>
            <label className={labelCls}>Street Address</label>
            <input type="text" value={record.address} onChange={e => updateField('address', e.target.value)} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>City</label>
              <input type="text" value={record.city} onChange={e => updateField('city', e.target.value.toUpperCase())} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Pin Code</label>
              <input type="text" value={record.pinCode} onChange={e => updateField('pinCode', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              ['SSSMI ID', 'sssmiId'],
              ['Aadhaar No', 'aadharNo'],
              ['APAR ID', 'aparId'],
            ].map(([lbl, fld]) => (
              <div key={fld}>
                <label className={labelCls}>{lbl}</label>
                <input type="text" value={(record as any)[fld] || ''} onChange={e => updateField(fld as keyof AdmissionFormRecord, e.target.value)} className={inputCls} />
              </div>
            ))}
          </div>
        </div>
      );
      case 'misc': return (
        <div className="space-y-3">
          <p className={secHead}>Contact & Transport</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Mobile Number</label>
              <input type="text" value={record.phone} onChange={e => updateField('phone', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Email Address</label>
              <input type="email" value={record.email} onChange={e => updateField('email', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>School Transport Required</label>
            <select value={record.transportRequired} onChange={e => updateField('transportRequired', e.target.value as 'YES' | 'NO')} className={selectCls}>
              <option value="YES">YES</option>
              <option value="NO">NO</option>
            </select>
          </div>
        </div>
      );
      default: return null;
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className={`flex h-full min-h-[600px] overflow-hidden rounded-2xl border ${isGlass ? 'bg-slate-50 border-slate-200' : 'bg-[#09090b] border-[#1f1f22]'}`}>

      {/* ── PANEL 1 — Registered Admissions List ────────────────────────── */}
      <div className={`no-print w-60 flex-shrink-0 flex flex-col border-r ${isGlass ? 'bg-white border-slate-200' : 'bg-[#111113] border-[#1f1f22]'}`}>
        {/* Header */}
        <div className={`px-4 py-3 border-b flex-shrink-0 ${isGlass ? 'border-slate-100' : 'border-[#1f1f22]'}`}>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span className={`text-xs font-black ${isGlass ? 'text-slate-700' : 'text-white'}`}>Admissions</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${isGlass ? 'bg-orange-50 text-orange-500' : 'bg-orange-500/15 text-orange-400'}`}>{admissionsList.length}</span>
            </div>
            <button
              onClick={startNewAdmission}
              className="w-6 h-6 rounded-lg bg-orange-500 hover:bg-orange-400 text-white flex items-center justify-center transition"
              title="New Admission"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
          {/* Search */}
          <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${isGlass ? 'bg-slate-50 border-slate-200' : 'bg-[#0f0f12] border-[#2c2c2e]'}`}>
            <Search className="w-3 h-3 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`flex-1 text-[11px] outline-none bg-transparent ${isGlass ? 'text-slate-700 placeholder:text-slate-400' : 'text-white placeholder:text-slate-600'}`}
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
          {filteredList.length === 0 && (
            <p className="text-center text-xs text-slate-500 mt-8">No results found</p>
          )}
          {filteredList.map(a => {
            const isActive = record.id === a.id;
            return (
              <div key={a.id} className="relative group">
                <button
                  onClick={() => loadRecord(a)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all ${
                    isActive
                      ? isGlass ? 'bg-orange-50 border border-orange-200' : 'bg-orange-500/10 border border-orange-500/20'
                      : isGlass ? 'hover:bg-slate-50 border border-transparent' : 'hover:bg-[#1c1c1f] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 pr-5">
                    {isActive
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                      : <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 ${isGlass ? 'border-slate-300' : 'border-[#3f3f46]'}`}></div>
                    }
                    <div className="min-w-0">
                      <p className={`text-[11px] font-bold truncate leading-tight ${isActive ? (isGlass ? 'text-orange-700' : 'text-orange-400') : (isGlass ? 'text-slate-700' : 'text-slate-300')}`}>
                        {a.name.split(' ')[0]} {a.name.split(' ')[1] || ''}
                      </p>
                      <p className={`text-[10px] truncate ${isGlass ? 'text-slate-400' : 'text-slate-500'}`}>{a.classTarget.split('(')[0].trim()}</p>
                    </div>
                  </div>
                </button>
                {admissionsList.length > 1 && (
                  <button
                    onClick={e => deleteAdmission(a.id, e)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 w-5 h-5 rounded-md bg-red-500/10 text-red-500 flex items-center justify-center transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className={`flex-shrink-0 px-3 py-2.5 border-t ${isGlass ? 'border-slate-100' : 'border-[#1f1f22]'}`}>
          <button
            onClick={resetAll}
            className={`w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold transition ${isGlass ? 'text-slate-500 hover:bg-slate-50' : 'text-slate-600 hover:bg-[#1c1c1f]'}`}
          >
            <RotateCcw className="w-3 h-3" /> Reset to defaults
          </button>
        </div>
      </div>

      {/* ── PANEL 2 — Form Editor ────────────────────────────────────────── */}
      <div className={`no-print w-72 flex-shrink-0 flex flex-col border-r ${isGlass ? 'bg-white border-slate-200' : 'bg-[#111113] border-[#1f1f22]'}`}>
        {/* Section Tabs */}
        <div className={`flex-shrink-0 border-b ${isGlass ? 'border-slate-100 bg-slate-50' : 'border-[#1f1f22] bg-[#0f0f12]'}`}>
          <div className="px-3 py-2">
            <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${isGlass ? 'text-slate-400' : 'text-slate-600'}`}>Edit Sections</p>
            <div className="space-y-0.5">
              {SECTIONS.map(sec => {
                const isAct = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSection(sec.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-all ${
                      isAct
                        ? isGlass ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                        : isGlass ? 'text-slate-500 hover:bg-slate-100' : 'text-slate-500 hover:bg-[#1c1c1f]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <sec.icon className={`w-3 h-3 flex-shrink-0 ${isAct ? 'text-orange-500' : ''}`} />
                      <span className="text-[11px] font-semibold">{sec.label}</span>
                    </div>
                    {isAct && <ChevronRight className="w-3 h-3 text-orange-500" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {renderFormSection()}
        </div>

        {/* Print Button */}
        <div className={`flex-shrink-0 p-3 border-t ${isGlass ? 'border-slate-100' : 'border-[#1f1f22]'}`}>
          <button
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 text-white text-xs font-black rounded-xl shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Printer className="w-3.5 h-3.5" /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* ── PANEL 3 — Live Print Preview ─────────────────────────────────── */}
      <div className={`flex-1 overflow-auto flex items-start justify-center p-6 ${isGlass ? 'bg-slate-100' : 'bg-[#09090b]'}`}>
        <div
          id="admission-section"
          className="print-page w-[210mm] min-h-[297mm] bg-white p-[12mm] text-[#431407] border border-slate-300 shadow-2xl select-none text-[11px] flex flex-col justify-between"
          style={{ fontFamily: 'serif' }}
        >
          <div>
            <SchoolHeader subTitle="PUPIL ENROLLMENT & PROVISIONAL ADMISSION RECEIPT" />

            <div className="mt-4 border border-[#431407] p-4 bg-[#FFF7ED]/30 rounded">
              <div className="flex justify-between font-mono font-bold mb-3 text-xs">
                <span>DOCKET NO: <span className="bg-slate-100 px-2 border-b border-[#431407]">{record.docketNo}</span></span>
                <span>ADMISSION NO: <span className="bg-slate-100 px-2 border-b border-[#431407]">{record.admissionNo}</span></span>
              </div>
              <div className="flex justify-between font-mono font-bold mb-4 text-xs">
                <span>DISE CODE: <span className="bg-slate-100 px-2 border-b border-[#431407]">{record.diseCode}</span></span>
                <span>PS NUMBER: <span className="bg-slate-100 px-2 border-b border-[#431407]">{record.psNo}</span></span>
              </div>

              <div className="flex flex-row gap-6 justify-between items-start">
                <div className="flex-1 grid grid-cols-1 gap-y-2 text-xs">
                  {[
                    ['1. Full Name of Pupil', <span className="font-black text-slate-900">{record.name}</span>],
                    ['2. Gender / Blood Group', `${record.gender} / ${record.bloodGroup}`],
                    ['3. Date of Birth', `${record.dob} (${record.dobWords})`],
                    ['4. Birth Place / Nationality', `${record.birthPlace} / ${record.nationality}`],
                    ['5. Religion / Category / Tongue', `${record.religion} / ${record.category} / ${record.motherTongue}`],
                    ['6. Target Class Applied', <span className="font-black text-indigo-900">{record.classTarget}</span>],
                    ['7. Previous Institution', <span className="italic">{record.prevSchool}</span>],
                    ['8. Father\'s Name & Occ', `${record.fatherName} (${record.fatherOcc})`],
                    ['9. Mother\'s Name & Occ', `${record.motherName} (${record.motherOcc})`],
                    ['10. Contact Mobile & Email', <span className="font-mono">{record.phone} / {record.email}</span>],
                    ['11. SSSMI / Aadhaar / APAR', <span className="font-mono">{record.sssmiId || 'N/A'} / {record.aadharNo || 'N/A'} / {record.aparId || 'N/A'}</span>],
                    ['12. Transport Required?', <span className="font-bold">{record.transportRequired}</span>],
                    ['13. Residential Address', `${record.address}, ${record.city} - ${record.pinCode}`],
                  ].map(([label, value], i) => (
                    <p key={i} className="border-b border-[#431407]/10 pb-0.5">
                      <span className="font-bold w-44 inline-block">{label as string}:</span>{' '}
                      {typeof value === 'string' ? <span>{value}</span> : value as React.ReactNode}
                    </p>
                  ))}
                </div>

                <div className="w-32 flex flex-col items-center gap-4 py-2 bg-slate-50 border border-slate-200 rounded-xl p-2 shrink-0">
                  <div className="w-24 h-28 border-2 border-dashed border-gray-300 bg-white rounded flex items-center justify-center overflow-hidden relative">
                    {record.photoUrl
                      ? <img src={record.photoUrl} alt="Student" className="w-full h-full object-cover" />
                      : <div className="text-center p-2 text-slate-400">
                          <Camera className="w-6 h-6 mx-auto mb-1 opacity-40" />
                          <span className="text-[6px] font-sans font-bold block">PASSPORT</span>
                        </div>
                    }
                  </div>
                  <QRCodeGenerator
                    value={`SAINT XAVIER CONVENT ADMISSION\nDocket: ${record.docketNo}\nPupil: ${record.name}\nClass: ${record.classTarget}`}
                    studentId={record.name ? record.name.slice(0, 3).toUpperCase() : 'SXC'}
                    label="REG ID CODE"
                    size={48}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[9px] font-black uppercase text-[#431407] mb-2 border-b border-[#F97316] pb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-[#F97316]" /> Declaration and Directives
              </div>
              <p className="text-[9.5px] leading-relaxed">
                I hereby declare that the particulars furnished above are correct to the best of my knowledge. I promise to abide by the rules and regulations of the school. Any discrepancy in birth certificate or transfer document will terminate the registry.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-end mt-12 pt-4 border-t border-[#F97316]">
            <div className="text-center w-36">
              <div className="h-6 border-b border-[#431407] mx-auto w-24"></div>
              <p className="font-bold text-[9px] text-[#431407] uppercase tracking-wider mt-1">Guardian's Signature</p>
            </div>
            <div className="text-center w-36 border border-[#F97316] p-2 bg-[#FFF7ED]/50 rounded flex flex-col items-center">
              <span className="text-[10px] font-black text-[#431407] uppercase tracking-widest">SAINT XAVIER CONVENT SCHOOL</span>
              <span className="text-[7px] text-[#F97316] block mt-0.5">CONVENT SCHOOL</span>
              <span className="text-[6px] text-slate-500 block uppercase font-mono mt-1">REGISTRATION SEAL</span>
            </div>
            <div className="text-center w-36">
              <div className="h-6 border-b border-[#431407] mx-auto w-24"></div>
              <p className="font-bold text-[9px] text-[#431407] uppercase tracking-wider mt-1">Registrar Desk Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
