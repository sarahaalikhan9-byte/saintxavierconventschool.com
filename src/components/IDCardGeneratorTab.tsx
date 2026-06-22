import React, { useState, useEffect } from 'react';
import SchoolHeader from './SchoolHeader';
import { BadgeCheck, Printer, FileDown, Search, ArrowRight, UserCircle } from 'lucide-react';
import QRCodeGenerator from './QRCodeGenerator';
import { ScholarProfile } from '../types';

interface IDCardGeneratorTabProps {
  theme?: 'original' | 'glassNavy' | 'sunriseOrange';
}

export default function IDCardGeneratorTab({ theme = 'glassNavy' }: IDCardGeneratorTabProps) {
  const isGlass = theme === 'glassNavy';

  // State to hold the latest scholar data
  const [scholarsList, setScholarsList] = useState<ScholarProfile[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load student records from the database
    const saved = localStorage.getItem('sxc_all_scholars');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setScholarsList(parsed);
          setActiveId(parsed[0].id);
        }
      } catch (e) {}
    } else {
      // Setup some default if none
      const defaults = [
        {
          id: 'sc-1',
          scholarNo: '5281',
          studentName: 'PRIYA PATEL',
          currentClass: 'CLASS VII-A',
          annualFee: 42000,
          transactions: []
        },
        {
          id: 'sc-2',
          scholarNo: '4928',
          studentName: 'RAHUL SHARMA',
          currentClass: 'CLASS VI-B',
          annualFee: 38000,
          transactions: []
        }
      ];
      setScholarsList(defaults);
      setActiveId(defaults[0].id);
    }
  }, []);

  const activeProfile = scholarsList.find(s => s.id === activeId) || scholarsList[0];

  const filteredScholars = scholarsList.filter(s => 
    s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.scholarNo.includes(searchTerm) ||
    (s.currentClass ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sidebarClass = isGlass
    ? 'no-print w-full xl:w-5/12 bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/50 h-fit max-h-[85vh] overflow-y-auto text-[#431407]'
    : 'no-print w-full xl:w-5/12 bg-[#0F0F12] p-6 rounded-2xl shadow-lg border border-[#242427] h-fit max-h-[85vh] overflow-y-auto';

  const previewPanelClass = isGlass
    ? 'flex-1 overflow-x-auto bg-[#FFF7ED]/50 p-6 rounded-2xl border border-white/40 flex justify-center'
    : 'flex-1 overflow-x-auto bg-[#0F0F12]/50 p-6 rounded-2xl border border-[#242427] flex justify-center text-white';

  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Editor sidebar */}
      <div className={sidebarClass}>
        <div className="flex justify-between items-center mb-6 border-b pb-4 border-slate-500/10">
          <div>
            <h2 className={`text-xl font-black ${isGlass ? 'text-[#431407]' : 'text-white'}`}>ID Card Generator</h2>
            <p className="text-xs text-gray-500">Render official student identity cards with secure QR codes</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 opacity-40" />
            <input 
              type="text" 
              placeholder="Search by student name, ID, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-9 pr-3 py-2.5 rounded-xl border outline-none font-medium transition text-sm ${isGlass ? 'bg-white border-gray-200 focus:border-blue-500' : 'bg-[#1C1C1F] border-[#2C2C2E] focus:border-blue-500 text-white'}`}
            />
          </div>
        </div>

        {/* Student List */}
        <div className="mb-6 space-y-2">
          <p className="text-[10px] font-black uppercase opacity-50 tracking-wider">Select Student Record</p>
          <div className={`space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar`}>
            {filteredScholars.map(scholar => (
              <button
                key={scholar.id}
                onClick={() => setActiveId(scholar.id)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  activeId === scholar.id
                    ? (isGlass ? 'bg-blue-500 border-blue-500 text-white shadow-md' : 'bg-blue-600 border-blue-600 text-white shadow-md')
                    : (isGlass ? 'bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm' : 'bg-[#1C1C1F] border-[#242427] hover:border-blue-500/50')
                }`}
              >
                <div>
                  <h4 className="font-bold text-sm">{scholar.studentName}</h4>
                  <p className={`text-xs ${activeId === scholar.id ? 'opacity-80' : 'opacity-60'}`}>ID: #{scholar.scholarNo} • {scholar.currentClass ?? 'CLASS N/A'}</p>
                </div>
                <ArrowRight className={`w-4 h-4 ${activeId === scholar.id ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            ))}
            {filteredScholars.length === 0 && (
              <div className="p-4 text-center text-sm opacity-50 border border-dashed rounded-xl border-gray-500/30">
                No matching student records found.
              </div>
            )}
          </div>
        </div>

        <button onClick={() => window.print()} className={`w-full mt-auto font-black py-3.5 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 ${isGlass ? 'bg-[#431407] hover:bg-[#1A252F] text-white' : 'bg-rose-500 hover:bg-emerald-600 text-white'}`}>
          <Printer className="w-5 h-5" /> Batch Print Identifiers Layer
        </button>
      </div>

      {/* ID Card Preview */}
      <div className={previewPanelClass}>
        {activeProfile ? (
          <div className="flex flex-col items-center gap-6">
            <h3 className="no-print text-sm font-black uppercase opacity-50 tracking-widest bg-gray-500/10 px-4 py-1.5 rounded-full">Actual Print Size Preview</h3>
            
            <div id="id-card-section" className="print-page w-[54mm] h-[86mm] bg-white text-[#1a1a1a] shadow-2xl relative select-none flex flex-col justify-between border-2 border-gray-200 overflow-hidden" style={{ boxSizing: 'border-box' }}>
              
              {/* Header section with brand colors */}
              <div className="bg-[#431407] text-[#FFF7ED] text-center pt-3 pb-2 px-2 shrink-0">
                <h1 className="text-[11px] font-black tracking-widest uppercase leading-tight">Saint Xavier</h1>
                <h2 className="text-[7px] font-medium tracking-widest uppercase opacity-90 leading-tight">Convent School</h2>
                <div className="text-[5px] mt-1 opacity-75 leading-tight max-w-[80%] mx-auto">45 Avenue West, M.P. 452010</div>
              </div>

              {/* Photo Area placeholder */}
              <div className="flex flex-col items-center mt-2">
                <div className="w-[20mm] h-[25mm] border-2 border-[#431407]/20 bg-gray-100 flex items-center justify-center rounded-sm shadow-sm overflow-hidden">
                  <UserCircle className="w-[14mm] h-[14mm] text-[#431407]/20" />
                </div>
                <div className="mt-2 text-center w-full px-2">
                  <h2 className="text-[11px] font-black leading-tight truncate text-[#431407]">{activeProfile.studentName}</h2>
                </div>
              </div>

              {/* Details table */}
              <div className="px-3 pt-1 flex-1 flex flex-col justify-center">
                <div className="space-y-1 text-[8px]">
                  <div className="grid grid-cols-[16mm_1fr] border-b border-[#431407]/10 pb-0.5">
                    <span className="font-bold text-[#431407]/70 uppercase text-[6px] tracking-wider leading-relaxed">Scholar ID:</span>
                    <span className="font-extrabold text-[#431407] font-mono">{activeProfile.scholarNo}</span>
                  </div>
                  <div className="grid grid-cols-[16mm_1fr] border-b border-[#431407]/10 pb-0.5">
                    <span className="font-bold text-[#431407]/70 uppercase text-[6px] tracking-wider leading-relaxed">Class & Sec:</span>
                    <span className="font-bold text-[#431407]">{activeProfile.currentClass ?? 'CLASS N/A'}</span>
                  </div>
                  <div className="grid grid-cols-[16mm_1fr] border-b border-[#431407]/10 pb-0.5">
                    <span className="font-bold text-[#431407]/70 uppercase text-[6px] tracking-wider leading-relaxed">Date of Birth:</span>
                    <span className="font-bold text-[#431407]">14-Aug-2015</span>
                  </div>
                  <div className="grid grid-cols-[16mm_1fr] pb-0.5">
                    <span className="font-bold text-[#431407]/70 uppercase text-[6px] tracking-wider leading-relaxed">Blood Group:</span>
                    <span className="font-bold text-red-600">O+</span>
                  </div>
                </div>
              </div>

              {/* QR and Footer area */}
              <div className="px-3 pb-3 pt-1 flex items-end justify-between border-t-2 border-[#F97316]/20 bg-gray-50/50">
                <div className="relative">
                  <div className="p-0.5 bg-white border border-[#431407]/20 shadow-sm rounded-sm">
                    <QRCodeGenerator 
                      value={`SXC-ID: ${activeProfile.scholarNo} | Name: ${activeProfile.studentName} | Class: ${activeProfile.currentClass ?? 'CLASS N/A'} | Status: VERIFIED`} 
                      size={28}
                      studentId={activeProfile.scholarNo}
                      label=""
                    />
                  </div>
                </div>
                <div className="text-center w-[16mm]">
                  <div className="h-[4mm]">
                    {/* Simulated signature squiggle */}
                    <svg viewBox="0 0 100 30" className="w-full h-full opacity-60">
                      <path d="M10,15 Q30,5 50,20 T90,10" fill="none" stroke="#431407" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="border-t border-[#431407]/40 mt-1"></div>
                  <div className="text-[5px] font-black uppercase text-[#431407] tracking-widest mt-0.5 scale-90">Principal</div>
                </div>
              </div>
              
              {/* Colored bottom strip */}
              <div className="h-[3mm] bg-[#F97316] shrink-0"></div>

            </div>
            
            {/* Download Individual Button */}
            <button className="no-print flex items-center justify-center gap-2 text-sm font-bold text-[#431407] bg-white border border-[#431407]/20 px-6 py-2.5 rounded-full hover:bg-[#431407] hover:text-white transition-all shadow-sm">
              <FileDown className="w-4 h-4" /> Download Digital Card
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <p className="opacity-50">No scholar records available to generate ID.</p>
          </div>
        )}
      </div>
    </div>
  );
}
