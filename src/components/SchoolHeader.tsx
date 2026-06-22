import React from 'react';

interface SchoolHeaderProps {
  diseCode?: string;
  psNo?: string;
  subTitle?: string;
  customSession?: string;
}

export default function SchoolHeader({
  diseCode = '23264101892',
  psNo = '123197',
  subTitle = 'Official Document',
  customSession,
}: SchoolHeaderProps) {
  return (
    <div className="w-full text-center border-b-2 border-double border-[#431407] pb-2 font-serif text-[#431407]">
      <div className="flex justify-between items-start text-[8px] font-mono font-bold tracking-widest text-[#F97316]">
        <span>DISE CODE: {diseCode}</span>
        <span>PS NO: {psNo}</span>
      </div>
      <div className="mt-1 flex flex-col items-center">
        <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-none">
          Saint Xavier Convent School
        </h1>
        <p className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-slate-500 mt-0.5">
          (Affiliated to M.P. Board & CBSE Pattern)
        </p>
        <p className="text-[8px] sm:text-[9px] font-sans text-slate-600 mt-0.5 max-w-lg">
          100 Gandhi Gram Sabzi Market, Near Noor Masjid, Behind Thana Khajrana, Indore - 452016
          <br />
          Email: info@saintxavierkhajrana.edu.in | Ph: +91 9074322024, +91 7879957124
        </p>
      </div>
      <div className="mt-2 text-center">
        <span className="inline-block bg-[#431407] text-white px-3 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-widest rounded-sm shadow-sm">
          {subTitle}
        </span>
        {customSession && (
          <p className="text-[9px] font-bold mt-1 text-[#F97316] uppercase tracking-widest">
            Academic Session {customSession}
          </p>
        )}
      </div>
    </div>
  );
}
