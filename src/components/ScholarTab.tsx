import React, { useState } from 'react';
import SchoolHeader from './SchoolHeader';
import { BookOpen, Calendar, CircleCheck, Printer, Plus, Trash2, ArrowRight, Sparkles, RotateCcw } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';
import { ScholarProfile, FeeTransaction, ScholarRow } from '../types';
import { SAMPLE_SCHOLARS } from '../data';
import { useTranslation } from 'react-i18next';

interface ScholarTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
  lang?: any;
}


export default function ScholarTab({ theme = 'glassNavy', lang = 'en' }: ScholarTabProps) {
  const isGlass = theme === 'glassNavy';
  const { t } = useTranslation();

  const [scholarsList, setScholarsList] = useState<ScholarProfile[]>(() => {
    const saved = localStorage.getItem('sxc_all_scholars');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return SAMPLE_SCHOLARS;
  });

  const [activeId, setActiveId] = useState<string>('sc-1');

  const activeProfile = scholarsList.find(s => s.id === activeId) || scholarsList[0] || SAMPLE_SCHOLARS[0];

  const updateProfileFields = (fields: Partial<ScholarProfile>) => {
    const updated = scholarsList.map(s => s.id === activeId ? { ...s, ...fields } : s);
    setScholarsList(updated);
    localStorage.setItem('sxc_all_scholars', JSON.stringify(updated));
  };

  const updateRowField = (index: number, field: keyof ScholarRow, value: string) => {
    const newRows = [...activeProfile.rows];
    newRows[index] = { ...newRows[index], [field]: value };
    updateProfileFields({ rows: newRows });
  };

  const addScholarAccount = () => {
    const name = window.prompt("Enter new scholar's full name:", "NEW SCHOLAR");
    if (!name) return;

    // Helper to generate empty rows for Scholar Ledger grid table
    const makeDefaultRows = (): ScholarRow[] => {
      const classes = ['Nursery', 'LKG', 'UKG', 'Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII'];
      return classes.map(c => ({
        className: c.toUpperCase(),
        admDate: '',
        withdrawalDate: '',
        totalDays: '220',
        presentDays: '',
        totalStudents: '40',
        rank: '',
        conduct: 'EXCELLENT',
        principalSign: 'SEAL'
      }));
    };

    const newAccount: ScholarProfile = {
      id: `sc-${Date.now()}`,
      scholarNo: String(Math.floor(6000 + Math.random() * 3000)),
      enrollmentNo: `ENR-2026-SXC-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: name.toUpperCase(),
      dob: '2015-01-01',
      religionCaste: 'GENERAL',
      prevSchool: 'N/A',
      fatherName: 'FATHER NAME',
      motherName: 'MOTHER NAME',
      guardianName: 'FATHER NAME',
      relation: 'FATHER',
      occupation: 'SERVICE',
      address: 'STREET ADDRESS, INDORE',
      mobile: '+91 90000 00000',
      admissionDate: new Date().toISOString().split('T')[0],
      removalDate: '',
      withdrawalCause: '',
      rollNo5th: '',
      rollNo8th: '',
      rollNo10th: '',
      rollNo12th: '',
      aadharNo: '',
      ssmId: '',
      familyId: '',
      bankName: '',
      bankAccount: '',
      ifscCode: '',
      rows: makeDefaultRows(),
      annualFee: 40000,
      transactions: [
        { id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`, date: new Date().toISOString().split('T')[0], category: 'Initial Registration Ledger', amount: 5000, paymentMode: 'UPI', status: 'PAID' }
      ]
    };

    const updated = [...scholarsList, newAccount];
    setScholarsList(updated);
    localStorage.setItem('sxc_all_scholars', JSON.stringify(updated));
    setActiveId(newAccount.id);
  };

  const deleteScholarAccount = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (scholarsList.length <= 1) {
      alert("At least one scholar profile must remain.");
      return;
    }
    const updated = scholarsList.filter(s => s.id !== id);
    setScholarsList(updated);
    localStorage.setItem('sxc_all_scholars', JSON.stringify(updated));
    setActiveId(updated[0].id);
  };

  const resetAllToDefault = () => {
    localStorage.removeItem('sxc_all_scholars');
    setScholarsList(SAMPLE_SCHOLARS);
    setActiveId(SAMPLE_SCHOLARS[0].id);
  };

  const [newCat, setNewCat] = useState('');
  const [newAmt, setNewAmt] = useState('');
  const [newMode, setNewMode] = useState('UPI');

  const addTransaction = () => {
    if (!newCat || !newAmt) return;
    const isPaid = newMode !== 'Pending';
    const numAmt = parseFloat(newAmt) || 0;
    const newTxn: FeeTransaction = {
      id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      category: newCat,
      amount: numAmt,
      paymentMode: newMode,
      status: isPaid ? 'PAID' : 'DUE'
    };

    const txs = activeProfile.transactions || [];
    updateProfileFields({ transactions: [...txs, newTxn] });
    setNewCat('');
    setNewAmt('');
  };

  const removeTransaction = (txnId: string) => {
    const txs = activeProfile.transactions || [];
    updateProfileFields({ transactions: txs.filter(t => t.id !== txnId) });
  };

  const totalPaid = (activeProfile.transactions || []).filter(t => t.status === 'PAID').reduce((sum, t) => sum + t.amount, 0);
  const totalDue = (activeProfile.transactions || []).filter(t => t.status === 'DUE').reduce((sum, t) => sum + t.amount, 0);
  const ledgerTotal = totalPaid + totalDue;

  const sidebarClass = isGlass
    ? 'no-print w-full xl:w-5/12 bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/50 h-fit max-h-[85vh] overflow-y-auto text-[#431407]'
    : 'no-print w-full xl:w-5/12 bg-[#0F0F12] p-6 rounded-2xl shadow-lg border border-[#242427] h-fit max-h-[85vh] overflow-y-auto';

  const previewPanelClass = isGlass
    ? 'flex-1 overflow-x-auto bg-[#FFF7ED]/50 p-6 rounded-2xl border border-white/40 flex justify-center'
    : 'flex-1 overflow-x-auto bg-[#0F0F12]/50 p-6 rounded-2xl border border-[#242427] flex justify-center';

  const inputClass = isGlass
    ? 'w-full mt-1 p-2 bg-white/65 border border-[#431407]/15 text-[#431407] rounded-lg focus:border-[#F97316] focus:outline-none focus:ring-1 focus:ring-[#F97316] text-xs font-semibold'
    : 'w-full mt-1 p-2 bg-[#1C1C1F] border border-[#242427] text-white rounded-lg text-xs focus:border-[#EA580C] focus:outline-none';

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      <div className={sidebarClass}>
        <div className="flex justify-between items-center mb-4 border-b pb-4 border-slate-500/10">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-500" /> Scholar Ledger</h2>
            <p className="text-xs opacity-70">Manage permanent scholar registers & statement ledgers</p>
          </div>
          <button
            onClick={resetAllToDefault}
            title="Reset to defaults"
            className={isGlass ? 'p-2 border border-[#431407]/15 bg-white/50 rounded-lg hover:bg-white/80 text-[#431407] transition flex items-center gap-1 text-xs font-semibold' : 'p-2 border border-[#242427] bg-[#1C1C1F] rounded-lg hover:bg-[#242427] text-gray-300 transition flex items-center gap-1 text-xs font-semibold'}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        {/* Scholar selector */}
        <div className={isGlass ? 'mb-6 p-4 bg-[#FFF7ED]/65 rounded-xl border border-white shadow-sm flex flex-col relative overflow-hidden' : 'mb-6 p-4 bg-[#1C1C1F] rounded-xl border border-[#242427]'}>
          <div className="flex justify-between items-center mb-2.5">
            <p className={isGlass ? 'text-xs font-bold text-[#F97316] uppercase flex items-center gap-1' : 'text-xs font-bold text-[#EA580C] uppercase flex items-center gap-1'}>
              <Sparkles className="w-3.5 h-3.5 shrink-0" />
              Active Accounts ({scholarsList.length})
            </p>
            <button
              type="button"
              onClick={addScholarAccount}
              className="px-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 border border-indigo-500/20 rounded-md transition-all text-[10px] font-bold flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> Register Scholar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {scholarsList.map((s) => (
              <div key={s.id} className="relative group flex items-center">
                <button
                  type="button"
                  onClick={() => setActiveId(s.id)}
                  className={`${
                    activeId === s.id 
                      ? (isGlass ? 'px-3 py-1.5 rounded-lg text-xs font-black shadow bg-[#431407] text-[#FFF7ED]' : 'px-3 py-1.5 rounded-lg text-xs font-extrabold shadow-sm bg-[#EA580C] text-black shadow-[#EA580C]/20')
                      : (isGlass ? 'px-3 py-1.5 rounded-lg text-xs font-bold bg-white/45 border border-[#431407]/10 text-[#431407] hover:bg-white/80 transition-all' : 'px-3 py-1.5 rounded-lg text-xs font-medium bg-[#0F0F12] border border-[#242427] text-gray-400 hover:bg-[#242427] hover:text-white transition-all')
                  } pr-6`}
                >
                  {s.studentName.split(' ')[0]} (#{s.scholarNo})
                </button>
                {scholarsList.length > 1 && (
                  <button
                    type="button"
                    onClick={(e) => deleteScholarAccount(s.id, e)}
                    className="absolute right-1.5 p-0.5 text-red-500 hover:text-red-700 bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 rounded transition-all"
                    title={`Delete account of ${s.studentName}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Core Editor */}
        <div className="space-y-4">
          <p className={isGlass ? 'text-xs font-bold text-[#F97316] uppercase border-b border-[#431407]/15 pb-1' : 'text-xs font-bold text-[#EA580C] uppercase border-b border-[#242427] pb-1'}>Student Identity</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs opacity-70 block">Scholar No</label>
              <input type="text" value={activeProfile.scholarNo} onChange={e => updateProfileFields({ scholarNo: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 block">Enrollment No</label>
              <input type="text" value={activeProfile.enrollmentNo} onChange={e => updateProfileFields({ enrollmentNo: e.target.value })} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="text-xs opacity-70 block">Student Name</label>
              <input type="text" value={activeProfile.studentName} onChange={e => updateProfileFields({ studentName: e.target.value.toUpperCase() })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 block">Date of Birth</label>
              <input type="date" value={activeProfile.dob} onChange={e => updateProfileFields({ dob: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 block">Religion & Caste</label>
              <input type="text" value={activeProfile.religionCaste} onChange={e => updateProfileFields({ religionCaste: e.target.value.toUpperCase() })} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="text-xs opacity-70 block">Previous School</label>
              <input type="text" value={activeProfile.prevSchool} onChange={e => updateProfileFields({ prevSchool: e.target.value })} className={inputClass} />
            </div>
          </div>

          <p className={isGlass ? 'text-xs font-bold text-[#F97316] uppercase border-b border-[#431407]/15 pb-1' : 'text-xs font-bold text-[#EA580C] uppercase border-b border-[#242427] pb-1'}>Guardian Details & Contact</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs opacity-70 block">Father's Name</label>
              <input type="text" value={activeProfile.fatherName} onChange={e => updateProfileFields({ fatherName: e.target.value.toUpperCase() })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 block">Mother's Name</label>
              <input type="text" value={activeProfile.motherName} onChange={e => updateProfileFields({ motherName: e.target.value.toUpperCase() })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 block">Guardian Name</label>
              <input type="text" value={activeProfile.guardianName} onChange={e => updateProfileFields({ guardianName: e.target.value.toUpperCase() })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 block">Relation / Occ</label>
              <input type="text" value={activeProfile.relation} onChange={e => updateProfileFields({ relation: e.target.value.toUpperCase() })} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="text-xs opacity-70 block">Mobile Number</label>
              <input type="text" value={activeProfile.mobile} onChange={e => updateProfileFields({ mobile: e.target.value })} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="text-xs opacity-70 block">Address</label>
              <input type="text" value={activeProfile.address} onChange={e => updateProfileFields({ address: e.target.value })} className={inputClass} />
            </div>
          </div>

          <p className={isGlass ? 'text-xs font-bold text-[#F97316] uppercase border-b border-[#431407]/15 pb-1' : 'text-xs font-bold text-[#EA580C] uppercase border-b border-[#242427] pb-1'}>Dates & Metadata</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs opacity-70 block">Admission Date</label>
              <input type="date" value={activeProfile.admissionDate} onChange={e => updateProfileFields({ admissionDate: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 block">Removal Date</label>
              <input type="date" value={activeProfile.removalDate || ''} onChange={e => updateProfileFields({ removalDate: e.target.value })} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="text-xs opacity-70 block">Cause of Withdrawal</label>
              <input type="text" value={activeProfile.withdrawalCause || ''} onChange={e => updateProfileFields({ withdrawalCause: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 block">Roll No (5th / 8th)</label>
              <input type="text" placeholder="5th / 8th" value={`${activeProfile.rollNo5th || ''} / ${activeProfile.rollNo8th || ''}`} onChange={e => {
                const parts = e.target.value.split('/');
                updateProfileFields({ rollNo5th: (parts[0] || '').trim(), rollNo8th: (parts[1] || '').trim() });
              }} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 block">Roll No (10th / 12th)</label>
              <input type="text" placeholder="10th / 12th" value={`${activeProfile.rollNo10th || ''} / ${activeProfile.rollNo12th || ''}`} onChange={e => {
                const parts = e.target.value.split('/');
                updateProfileFields({ rollNo10th: (parts[0] || '').trim(), rollNo12th: (parts[1] || '').trim() });
              }} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 block">Aadhar No</label>
              <input type="text" value={activeProfile.aadharNo} onChange={e => updateProfileFields({ aadharNo: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs opacity-70 block">Samagra Family / SSM ID</label>
              <input type="text" placeholder="Fam ID / SSM ID" value={`${activeProfile.familyId || ''} / ${activeProfile.ssmId || ''}`} onChange={e => {
                const parts = e.target.value.split('/');
                updateProfileFields({ familyId: (parts[0] || '').trim(), ssmId: (parts[1] || '').trim() });
              }} className={inputClass} />
            </div>
            <div className="col-span-2">
              <label className="text-xs opacity-70 block">Bank details (Name, A/C, IFSC)</label>
              <input type="text" placeholder="Bank Name, Account, IFSC" value={`${activeProfile.bankName || ''}, ${activeProfile.bankAccount || ''}, ${activeProfile.ifscCode || ''}`} onChange={e => {
                const parts = e.target.value.split(',');
                updateProfileFields({
                  bankName: (parts[0] || '').trim(),
                  bankAccount: (parts[1] || '').trim(),
                  ifscCode: (parts[2] || '').trim()
                });
              }} className={inputClass} />
            </div>
          </div>

          <p className={isGlass ? 'text-xs font-bold text-[#F97316] uppercase border-b border-[#431407]/15 pb-1 mt-6' : 'text-xs font-bold text-[#EA580C] uppercase border-b border-[#242427] pb-1 mt-6'}>Academic History Row Editor</p>
          <div className="overflow-x-auto max-h-48 border rounded-lg p-2 bg-slate-500/5">
            <table className="w-full text-left text-[10px]">
              <thead>
                <tr className="border-b">
                  <th className="p-1">Class</th>
                  <th className="p-1">Adm Date</th>
                  <th className="p-1">Withdraw Date</th>
                  <th className="p-1">Present/Total Days</th>
                  <th className="p-1">Students</th>
                  <th className="p-1">Rank</th>
                </tr>
              </thead>
              <tbody>
                {(activeProfile.rows || []).map((row, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="p-1 font-bold">{row.className}</td>
                    <td className="p-1"><input type="text" value={row.admDate} onChange={e => updateRowField(idx, 'admDate', e.target.value)} className="w-16 bg-white dark:bg-zinc-800 text-[10px] p-0.5 border" /></td>
                    <td className="p-1"><input type="text" value={row.withdrawalDate} onChange={e => updateRowField(idx, 'withdrawalDate', e.target.value)} className="w-16 bg-white dark:bg-zinc-800 text-[10px] p-0.5 border" /></td>
                    <td className="p-1">
                      <input type="text" value={row.presentDays} onChange={e => updateRowField(idx, 'presentDays', e.target.value)} className="w-8 bg-white dark:bg-zinc-800 text-[10px] p-0.5 border inline" />
                      /
                      <input type="text" value={row.totalDays} onChange={e => updateRowField(idx, 'totalDays', e.target.value)} className="w-8 bg-white dark:bg-zinc-800 text-[10px] p-0.5 border inline" />
                    </td>
                    <td className="p-1"><input type="text" value={row.totalStudents} onChange={e => updateRowField(idx, 'totalStudents', e.target.value)} className="w-8 bg-white dark:bg-zinc-800 text-[10px] p-0.5 border" /></td>
                    <td className="p-1"><input type="text" value={row.rank} onChange={e => updateRowField(idx, 'rank', e.target.value)} className="w-8 bg-white dark:bg-zinc-800 text-[10px] p-0.5 border" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className={isGlass ? 'text-xs font-bold text-[#F97316] uppercase border-b border-[#431407]/15 pb-1 mt-6' : 'text-xs font-bold text-[#EA580C] uppercase border-b border-[#242427] pb-1 mt-6'}>Fee Management & Entries</p>
          <div className={isGlass ? 'bg-white/45 p-3 rounded-lg border border-dashed border-[#431407]/20 flex flex-col gap-3' : 'bg-[#1C1C1F] p-3 rounded-lg border border-dashed border-[#242427] flex flex-col gap-3'}>
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <label className="text-[10px] text-gray-400 block font-bold uppercase">Fee Description</label>
                <input type="text" placeholder="e.g. Bus Fee Q4" value={newCat} onChange={e => setNewCat(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block font-bold uppercase">Amount (RS)</label>
                <input type="number" placeholder="RS 3500" value={newAmt} onChange={e => setNewAmt(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block font-bold uppercase">Status / Mode</label>
                <select value={newMode} onChange={e => setNewMode(e.target.value)} className={inputClass}>
                  <option value="UPI">UPI / NetBank</option>
                  <option value="Cash">Cash Deposit</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Pending">DUE (No payment)</option>
                </select>
              </div>
            </div>
            <button type="button" onClick={addTransaction} className={isGlass ? 'w-full py-2 bg-[#F97316] hover:bg-[#2c9c96] text-white rounded-lg text-xs font-bold' : 'w-full py-2 bg-[#EA580C] hover:bg-[#2bc48b] text-black rounded-lg text-xs font-bold'}>
              + Insert Entry
            </button>
          </div>

          <button onClick={() => window.print()} className={isGlass ? 'w-full mt-4 bg-[#F97316] hover:bg-[#2c9c96] text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2' : 'w-full mt-4 bg-[#EA580C] hover:bg-[#2bc48b] text-black font-extrabold py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2'}>
            <Printer className="w-4 h-4" /> Print / Save Ledger Book
          </button>
        </div>
      </div>

      <div className={previewPanelClass}>
        <div id="scholar-section" className="print-page w-[297mm] min-h-[210mm] bg-white p-[12mm] text-[#431407] border border-slate-400 shadow-2xl relative select-none text-[10px] flex flex-col justify-between overflow-x-auto">
          <div>
            <SchoolHeader subTitle="OFFICIAL SCHOLAR REGISTER & GENERAL LEDGER" />

            <div className="grid grid-cols-3 gap-6 mt-4 border border-[#431407] p-3 rounded bg-[#FFF7ED]/30">
              <div className="space-y-1">
                <p><strong>Scholar No:</strong> <span className="font-mono bg-slate-100 px-1 border-b border-[#F97316] font-bold">{activeProfile.scholarNo}</span></p>
                <p><strong>Enrollment No:</strong> <span className="font-mono">{activeProfile.enrollmentNo}</span></p>
                <p><strong>Student Name:</strong> <span className="font-extrabold text-slate-900 text-xs">{activeProfile.studentName}</span></p>
                <p><strong>Date of Birth:</strong> <span>{activeProfile.dob}</span></p>
                <p><strong>Religion & Caste:</strong> <span>{activeProfile.religionCaste}</span></p>
                <p><strong>Previous School:</strong> <span className="italic">{activeProfile.prevSchool}</span></p>
              </div>
              <div className="space-y-1">
                <p><strong>Father Name:</strong> <span>{activeProfile.fatherName}</span></p>
                <p><strong>Mother Name:</strong> <span>{activeProfile.motherName}</span></p>
                <p><strong>Guardian:</strong> <span>{activeProfile.guardianName} ({activeProfile.relation})</span></p>
                <p><strong>Occupation:</strong> <span>{activeProfile.occupation}</span></p>
                <p><strong>Mobile / Contact:</strong> <span className="font-mono">{activeProfile.mobile}</span></p>
                <p><strong>Permanent Address:</strong> <span>{activeProfile.address}</span></p>
              </div>
              <div className="space-y-1 relative">
                <p><strong>Admission Date:</strong> <span className="font-mono">{activeProfile.admissionDate}</span></p>
                <p><strong>Removal Date:</strong> <span className="font-mono">{activeProfile.removalDate || 'N/A'}</span></p>
                <p><strong>Cause of Withdrawal:</strong> <span>{activeProfile.withdrawalCause || 'N/A'}</span></p>
                <p><strong>Roll (5th/8th/10th/12th):</strong> <span className="font-mono">{activeProfile.rollNo5th || '-'}/{activeProfile.rollNo8th || '-'}/{activeProfile.rollNo10th || '-'}/{activeProfile.rollNo12th || '-'}</span></p>
                <p><strong>Aadhar / SSMID:</strong> <span className="font-mono">{activeProfile.aadharNo || 'N/A'} / {activeProfile.ssmId || 'N/A'} (Fam: {activeProfile.familyId || 'N/A'})</span></p>
                <p className="text-[8px] leading-tight"><strong>Bank A/C:</strong> {activeProfile.bankName} - {activeProfile.bankAccount} (IFSC: {activeProfile.ifscCode})</p>
                <div className="absolute right-0 top-0">
                  <QRCodeGenerator
                    value={`SAINT XAVIER SCHOLAR LEDGER REGISTER\nScholar No: ${activeProfile.scholarNo}\nPupil Name: ${activeProfile.studentName}\nTotal Paid Fees: ₹${totalPaid}\nTotal Dues: ₹${totalDue}`}
                    studentId={activeProfile.scholarNo}
                    label="SCHOLAR ID"
                    size={48}
                  />
                </div>
              </div>
            </div>

            {/* Balances Board Cards */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-2 border border-slate-200 bg-slate-50/50 rounded flex flex-col">
                <span className="text-[7px] text-gray-500 font-bold uppercase tracking-wider block">Statement Ledger Total</span>
                <span className="text-sm font-black font-mono text-slate-800">₹ {ledgerTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-2 border border-[#F97316]/30 bg-emerald-50/20 rounded flex flex-col">
                <span className="text-[7px] text-emerald-600 font-bold uppercase tracking-wider block">Tuition Fees Collected</span>
                <span className="text-sm font-black font-mono text-emerald-600">₹ {totalPaid.toLocaleString('en-IN')}</span>
              </div>
              <div className="p-2 border border-red-500/20 bg-red-50/20 rounded flex flex-col">
                <span className="text-[7px] text-red-500 font-bold uppercase tracking-wider block">Pending Balance Due</span>
                <span className="text-sm font-black font-mono text-red-500">₹ {totalDue.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Academic History rows table */}
            <div className="mt-4">
              <p className="font-bold text-[9px] uppercase tracking-wider text-[#431407] mb-1.5 flex items-center gap-1">
                <CircleCheck className="w-3.5 h-3.5 text-indigo-500" /> Part I: Scholar Academic Promotion Register Ledger
              </p>
              <table className="w-full border-collapse border border-[#431407] text-[8px] sm:text-[9.5px]">
                <thead>
                  <tr className="bg-[#431407] text-white font-bold uppercase">
                    <th className="border border-[#431407] p-1 text-center">Class</th>
                    <th className="border border-[#431407] p-1 text-center">Admission Date</th>
                    <th className="border border-[#431407] p-1 text-center">Withdrawal Date</th>
                    <th className="border border-[#431407] p-1 text-center">Working Days</th>
                    <th className="border border-[#431407] p-1 text-center">Present Days</th>
                    <th className="border border-[#431407] p-1 text-center">Total Pupils</th>
                    <th className="border border-[#431407] p-1 text-center">Rank</th>
                    <th className="border border-[#431407] p-1 text-center">General Conduct</th>
                    <th className="border border-[#431407] p-1 text-center">Principal Seal</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeProfile.rows || []).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition font-medium">
                      <td className="border border-[#431407] p-1 text-center font-bold">{row.className}</td>
                      <td className="border border-[#431407] p-1 text-center font-mono">{row.admDate || '-'}</td>
                      <td className="border border-[#431407] p-1 text-center font-mono">{row.withdrawalDate || '-'}</td>
                      <td className="border border-[#431407] p-1 text-center font-mono">{row.totalDays}</td>
                      <td className="border border-[#431407] p-1 text-center font-mono">{row.presentDays || '-'}</td>
                      <td className="border border-[#431407] p-1 text-center font-mono">{row.totalStudents}</td>
                      <td className="border border-[#431407] p-1 text-center font-bold text-slate-800">{row.rank || '-'}</td>
                      <td className="border border-[#431407] p-1 text-center text-[8px]">{row.conduct}</td>
                      <td className="border border-[#431407] p-1 text-center text-[8px] text-slate-400">{row.admDate ? 'SEALED' : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Fee transactions table */}
            <div className="mt-4">
              <p className="font-bold text-[9px] uppercase tracking-wider text-[#431407] mb-1.5 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-[#F97316]" /> Part II: Account Statement & Transactions Log
              </p>
              <table className="w-full border-collapse border border-[#431407] text-[8px] sm:text-[9px]">
                <thead>
                  <tr className="bg-[#431407] text-white font-bold uppercase text-[8px] tracking-tight">
                    <th className="border border-[#431407] py-1.5 px-1 text-center w-24">TXN Refer ID</th>
                    <th className="border border-[#431407] py-1.5 px-2 text-center w-24">Payment Date</th>
                    <th className="border border-[#431407] py-1.5 px-2 text-left">Fee Description / Installment Name</th>
                    <th className="border border-[#431407] py-1.5 px-2 text-center w-36">Mode of Clearance</th>
                    <th className="border border-[#431407] py-1.5 px-2 text-right w-28">Amount</th>
                    <th className="border border-[#431407] py-1.5 px-2 text-center w-20">Status</th>
                    <th className="border border-[#431407] py-1 px-1 text-center w-10 no-print">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeProfile.transactions || []).map((txn) => (
                    <tr key={txn.id} className="hover:bg-slate-50 transition font-medium">
                      <td className="border border-[#431407] py-1 px-1 text-center font-mono font-bold text-[8px] text-[#F97316]">{txn.id}</td>
                      <td className="border border-[#431407] py-1 px-2 text-center font-mono">{txn.date}</td>
                      <td className="border border-[#431407] py-1 px-2 font-semibold text-slate-800">{txn.category}</td>
                      <td className="border border-[#431407] py-1 px-2 text-center text-slate-500 font-bold">{txn.paymentMode}</td>
                      <td className="border border-[#431407] py-1 px-2 text-right font-mono font-bold text-slate-800">₹ {txn.amount.toLocaleString('en-IN')}</td>
                      <td className="border border-[#431407] py-1 px-2 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[7px] font-bold ${txn.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="border border-[#431407] py-1 text-center no-print bg-slate-50/50">
                        <button type="button" onClick={() => removeTransaction(txn.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-[#FFF7ED]/50 font-black text-xs text-[#431407]">
                    <td className="border border-[#431407] py-1 px-2 text-center font-bold" colSpan={4}>COLLECTED STATEMENT TOTAL</td>
                    <td className="border border-[#431407] py-1 px-2 text-right font-mono font-bold" colSpan={1}>₹ {totalPaid.toLocaleString('en-IN')}</td>
                    <td className="border border-[#431407] py-1 px-2 text-center text-[9px] text-emerald-600 bg-emerald-50/20 font-bold" colSpan={ledgerTotal - totalPaid > 0 ? 2 : 3}>
                      {ledgerTotal - totalPaid > 0 ? 'PARTIAL' : 'FULLY CLEARED'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-between items-end mt-8 pt-4 border-t border-[#F97316]">
            <div className="text-center w-36">
              <div className="h-6 border-b border-[#431407] mx-auto w-24"></div>
              <p className="font-bold text-[9px] text-[#431407] uppercase tracking-wider mt-1">Accounts Clerk</p>
            </div>

            <div className="text-center w-36 border border-[#F97316] p-2 bg-[#FFF7ED]/50 rounded scale-95 flex flex-col justify-center items-center">
              <span className="text-[10px] font-black text-[#431407] uppercase tracking-widest block">SAINT XAVIER</span>
              <span className="text-[7px] text-[#F97316] block mt-0.5 font-sans">CONVENT SCHOOL</span>
              <span className="text-[6px] text-slate-500 block uppercase font-mono tracking-tighter mt-1">ACCOUNTS STAMP</span>
            </div>

            <div className="text-center w-36">
              <div className="h-6 border-b border-[#431407] mx-auto w-24"></div>
              <p className="font-bold text-[9px] text-[#431407] uppercase tracking-wider mt-1">Principal Signature</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
