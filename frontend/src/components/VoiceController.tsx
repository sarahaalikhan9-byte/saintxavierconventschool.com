import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Shield, Sparkles, Languages, Terminal, CornerDownLeft, Command } from 'lucide-react';
import { LangType } from '../utils/locale';
import { useTranslation } from 'react-i18next';
import { speakText } from '../utils/tts';
import type { ActiveTab } from '../types';

interface VoiceControllerProps {
  currentLanguage: LangType;
  setLanguage: (lang: LangType) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  theme: 'original' | 'glassNavy' | 'sunriseOrange' | 'royalBlue' | 'emerald';
  setTheme: (theme: 'original' | 'glassNavy' | 'sunriseOrange' | 'royalBlue' | 'emerald') => void;
  onCommandTriggered?: (command: string) => void;
}

export default function VoiceController({
  currentLanguage,
  setLanguage,
  activeTab,
  setActiveTab,
  theme,
  setTheme,
  onCommandTriggered
}: VoiceControllerProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastAction, setLastAction] = useState('');
  const [errorText, setErrorText] = useState('');
  const [textCommand, setTextCommand] = useState('');
  const [showConsole, setShowConsole] = useState(false);
  const { t } = useTranslation();

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Speech Recognition capability
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = currentLanguage === 'hi' ? 'hi-IN' : currentLanguage === 'ur' ? 'ur-PK' : 'en-IN';

      rec.onstart = () => {
        setIsListening(true);
        setErrorText('');
        setTranscript('Listening... Speak now');
      };

      rec.onresult = (event: any) => {
        const text = event.results[0][0].transcript || '';
        setTranscript(text);
        processVoiceCommand(text);
      };

      rec.onerror = (e: any) => {
        console.warn('Speech Recognition error:', e);
        if (e.error === 'not-allowed') {
          setErrorText('Microphone permission blocked. Please use type input.');
        } else {
          setErrorText(`Refused: ${e.error || 'Signal interrupted'}`);
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [currentLanguage]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (!recognitionRef.current) {
        setErrorText('Speech API is not fully loaded on this browser. Try manual typing!');
        return;
      }
      try {
        recognitionRef.current.start();
      } catch (e) {
        recognitionRef.current?.stop();
        setTimeout(() => recognitionRef.current?.start(), 300);
      }
    }
  };

  const processVoiceCommand = (rawText: string) => {
    const cmd = rawText.toLowerCase().trim();
    const has = (...words: string[]) => words.some(word => cmd.includes(word.toLowerCase()));
    let actionPerf = '';

    // Language commands: English, Hindi, Urdu speech/manual text.
    if (has('hindi', 'set hindi', 'हिंदी', 'हिन्दी', 'हिंदी करो', 'हिन्दी करो', 'भाषा हिंदी')) {
      setLanguage('hi');
      actionPerf = 'Language updated to: Hindi';
      speakText('भाषा हिंदी में बदल दी गई है', 'hi');
    } else if (has('urdu', 'set urdu', 'اردو', 'زبان اردو', 'اردو کرو')) {
      setLanguage('ur');
      actionPerf = 'Language updated to: Urdu';
      speakText('زبان اردو میں تبدیل کر دی گئی ہے', 'ur');
    } else if (has('english', 'set english', 'अंग्रेजी', 'अंग्रेज़ी', 'انگریزی')) {
      setLanguage('en');
      actionPerf = 'Language updated to: English';
      speakText('Language updated to English', 'en');
    }

    // Main navigation commands.
    else if (has('admin', 'admin desk', 'go to admin', 'एडमिन', 'प्रशासन', 'ایڈمن', 'انتظامیہ')) {
      setActiveTab('admin');
      actionPerf = 'Switched to Admin Desk';
    } else if (has('social', 'social handler', 'media', 'सोशल', 'मीडिया', 'سوشل', 'میڈیا')) {
      setActiveTab('social_media');
      actionPerf = 'Switched to Social Handler';
    } else if (has('portal', 'portals', 'student portal', 'home', 'school home', 'पोर्टल', 'होम', 'स्कूल', 'پورٹل', 'ہوم', 'اسکول')) {
      setActiveTab('portals');
      actionPerf = 'Switched to School Portals';
    }

    // Theme commands for all 5 themes.
    else if (has('dark', 'midnight', 'काला', 'डार्क', 'اندھیرا', 'ڈارک')) {
      setTheme('original');
      actionPerf = 'Theme switched to Midnight Dark';
    } else if (has('light', 'sunrise light', 'glass', 'लाइट', 'उजाला', 'روشنی', 'لائٹ')) {
      setTheme('glassNavy');
      actionPerf = 'Theme switched to Sunrise Light';
    } else if (has('blue', 'royal blue', 'नीला', 'بلیو', 'نیلا')) {
      setTheme('royalBlue');
      actionPerf = 'Theme switched to Royal Blue';
    } else if (has('green', 'emerald', 'हरा', 'سبز', 'گرین')) {
      setTheme('emerald');
      actionPerf = 'Theme switched to Emerald';
    } else if (has('rose', 'rose gold', 'pink', 'गुलाबी', 'रोज', 'گلابی', 'روز')) {
      setTheme('sunriseOrange');
      actionPerf = 'Theme switched to Rose Gold';
    }

    // Scholar Register filters.
    else if (has('nursery', 'class eight', 'class 8', 'eight', 'नर्सरी', 'आठवीं', 'آٹھویں', 'نرسری')) {
      localStorage.setItem('sxc_last_voice_filter', 'nursery_8');
      window.dispatchEvent(new CustomEvent('sxc_voice_filter_changed', { detail: 'nursery_8' }));
      actionPerf = 'Filtered Register: Nursery to 8th class';
    } else if (has('nine', 'ninth', 'twelve', 'class 9', 'class 12', 'नौवीं', 'बारहवीं', 'نویں', 'بارہویں')) {
      localStorage.setItem('sxc_last_voice_filter', '9_12');
      window.dispatchEvent(new CustomEvent('sxc_voice_filter_changed', { detail: '9_12' }));
      actionPerf = 'Filtered Register: 9th to 12th class';
    } else if (has('all', 'clear', 'reset filter', 'सभी', 'क्लियर', 'سب', 'صاف')) {
      localStorage.setItem('sxc_last_voice_filter', 'all');
      window.dispatchEvent(new CustomEvent('sxc_voice_filter_changed', { detail: 'all' }));
      actionPerf = 'Cleared register filters';
    }

    // Finance/action commands.
    else if (has('pay', 'fee', 'fees', 'dues', 'outstanding', 'फीस', 'बकाया', 'ادائیگی', 'فیس', 'بقایا')) {
      window.dispatchEvent(new Event('sxc_voice_pay_fees'));
      actionPerf = 'Initiated outstanding fees payment system';
    } else {
      actionPerf = `Unrecognized command: "${rawText}". Try: set Hindi, go to admin, royal blue, pay fees.`;
    }

    setLastAction(actionPerf);

    if (onCommandTriggered) {
      onCommandTriggered(rawText);
    }
  };
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textCommand.trim()) return;
    setTranscript(textCommand);
    processVoiceCommand(textCommand);
    setTextCommand('');
  };

  const isGlass = theme === 'glassNavy';
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger Button inside topbar/navbar */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isListening) {
            toggleListening();
          }
        }}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-extrabold tracking-wide transition-all uppercase max-h-[38px] ${
          isListening 
            ? 'bg-red-500 border-red-500 text-white animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.4)]' 
            : (isGlass 
                ? 'bg-[#1A252F] hover:bg-[#431407] border-white/20 text-[#F97316]' 
                : 'bg-[#1C1C1F] hover:bg-[#252528] border-[#242427] text-[#EA580C]')
        }`}
        title="Voice Command & AI Assistant"
      >
        <span className="relative flex h-2 w-2">
          {isListening ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          )}
        </span>
        <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-white' : 'text-rose-500'}`} />
        <span className="text-[10px] tracking-wider font-mono">
          {isListening ? 'Listening' : 'Voice AI'}
        </span>
      </button>

      {/* Floating Panel dropdown on active or when clicked */}
      {isOpen && (
        <>
          {/* Transparent Backdrop to close overlay when clicking outside */}
          <div className="fixed inset-0 z-40 no-print" onClick={() => setIsOpen(false)} />
          
          <div className={`absolute right-0 mt-2.5 w-80 p-4 rounded-2xl border shadow-2xl z-50 transform origin-top-right transition-all animate-fadeIn ${
            isGlass 
              ? 'bg-white/95 border-slate-200/90 text-[#431407] backdrop-blur-md shadow-slate-300/40' 
              : 'bg-[#121214]/95 border-[#242427]/90 text-zinc-200 backdrop-blur-md shadow-black/80'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-gray-500/10 mb-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#F97316] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#EA580C]" /> SXC Voice Assistant CLI
              </span>
              <button 
                type="button" 
                onClick={() => setIsOpen(false)}
                className="text-[10px] opacity-65 hover:opacity-100 font-bold px-2 py-0.5 rounded bg-gray-500/10 transition"
              >
                Close
              </button>
            </div>

            {/* Mic trigger and status indicator */}
            <div className="flex items-center gap-3 mb-3 bg-gray-500/5 p-2.5 rounded-xl border border-gray-500/5">
              <button
                onClick={toggleListening}
                type="button"
                className={`w-9 h-9 rounded-full relative shrink-0 flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-red-500 border-red-500 text-white animate-pulse shadow-md'
                    : (isGlass ? 'bg-slate-200 hover:bg-slate-350 text-slate-800' : 'bg-[#1C1C1F] hover:bg-[#252528] text-zinc-300')
                }`}
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-rose-500" />}
              </button>
              <div className="text-left leading-none">
                <p className="text-[9px] font-black tracking-widest text-rose-500 uppercase">
                  {isListening ? 'MIC IS OPEN (TALK NOW)' : 'MIC OFFLINE (CLICK)'}
                </p>
                <div className="mt-1">
                  {transcript ? (
                    <p className="text-xs font-mono font-bold text-rose-500 dark:text-emerald-450 line-clamp-2 italic">"{transcript}"</p>
                  ) : (
                    <p className="text-[10px] opacity-60 leading-tight">
                      Try speaking: "go to admin", "set hindi", "filter nursery", "pay outstanding fees"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action performed confirmation log */}
            {lastAction && (
              <div className="mb-3 px-3 py-1.5 bg-rose-500/10 text-emerald-600 dark:text-emerald-400 border border-rose-500/20 rounded-lg text-[10px] font-mono font-bold text-center">
                {lastAction}
              </div>
            )}

            {/* Error alerts */}
            {errorText && (
              <div className="mb-3 px-3 py-1.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-[10px] font-bold">
                {errorText}
              </div>
            )}

            {/* Manual text backup CLI input */}
            <form onSubmit={handleManualSubmit} className="flex gap-1.5 mb-3">
              <input
                type="text"
                placeholder="Type voice action..."
                value={textCommand}
                onChange={e => setTextCommand(e.target.value)}
                className={`flex-1 px-3 py-1.5 rounded-lg border text-xs font-semibold outline-none font-mono ${
                  isGlass ? 'bg-slate-100 border-slate-200 text-slate-800' : 'bg-[#0E0E10] border-[#2C2C2E] text-zinc-100'
                }`}
              />
              <button
                type="submit"
                className="px-2.5 py-1.5 text-[10px] font-black uppercase text-white rounded-lg bg-[#F97316] dark:bg-rose-600 hover:opacity-90 shrink-0"
              >
                RUN
              </button>
            </form>

            {/* Quick preset links */}
            <div className="flex flex-col gap-1 text-left border-t border-gray-500/10 pt-2">
              <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">Suggestions:</span>
              <div className="grid grid-cols-2 gap-1 mt-1">
                {[
                  { label: 'Set Urdu', cmd: 'set urdu' },
                  { label: 'Set Hindi', cmd: 'set hindi' },
                  { label: 'Set English', cmd: 'set english' },
                  { label: 'Go to Admin', cmd: 'go to admin' },
                  { label: 'Go to Portals', cmd: 'go to portals' },
                  { label: 'Social Handler', cmd: 'social handler' },
                  { label: 'Royal Blue', cmd: 'royal blue' },
                  { label: 'Emerald', cmd: 'emerald' },
                  { label: 'Rose Gold', cmd: 'rose gold' },
                  { label: 'Filter Nursery', cmd: 'filter nursery' },
                  { label: 'Filter 9th-12th', cmd: 'filter ninth' },
                  { label: 'Pay Dues', cmd: 'pay outstanding' }
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTranscript(p.cmd);
                      processVoiceCommand(p.cmd);
                    }}
                    className="px-2 py-1 rounded bg-gray-500/5 hover:bg-gray-500/12 border border-gray-500/10 text-[9px] font-bold font-mono text-left transition truncate"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
