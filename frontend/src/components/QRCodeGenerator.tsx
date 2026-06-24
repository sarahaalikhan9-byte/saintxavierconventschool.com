import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeGeneratorProps {
  value: string;
  studentId: string;
  label: string;
  size?: number;
  details?: any;
}

export default function QRCodeGenerator({ value, studentId, label, size = 64 }: QRCodeGeneratorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-1 border border-dashed border-gray-300 rounded bg-white">
      <QRCodeSVG value={value} size={size} level="M" includeMargin={false} />
      <span className="text-[6px] font-mono mt-1 text-gray-500 uppercase tracking-widest">{label}</span>
      <span className="text-[7px] font-mono font-bold text-black">{studentId}</span>
    </div>
  );
}
