import React, { useState, useEffect, useRef } from 'react';
import type { ActiveTab } from './types';
import PortalsTab from './components/PortalsTab';
import AdminTab from './components/AdminTab';
import SocialMediaDashboardTab from './components/SocialMediaDashboardTab';
import WhatsAppBroadcastManager from './components/WhatsAppBroadcastManager';
import VoiceController from './components/VoiceController';
import { LangType } from './utils/locale';
import { useTranslation } from 'react-i18next';
import { speakText } from './utils/tts';
import {
  GraduationCap, BookOpen, Users, Video, Camera, Calendar,
  Clock, ShieldCheck, Award, Bell, MapPin, Phone, Mail,
  CheckCircle2, XCircle, AlertCircle, Sparkles, User, Lock, Key, Layers,
  Activity, Menu, X, HelpCircle, HardDrive, RefreshCcw, Landmark,
  ArrowRight, MessageCircle, Volume2, Wifi, Database, Zap, Globe
} from 'lucide-react';

const LANGUAGE_OPTIONS: { value: LangType; label: string }[] = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'ur', label: 'Urdu' },
];

type ThemeType = 'original' | 'glassNavy' | 'sunriseOrange' | 'royalBlue' | 'emerald';

const THEME_OPTIONS: { value: ThemeType; label: string }[] = [
  { value: 'glassNavy', label: 'Sunrise Light' },
  { value: 'original', label: 'Midnight Dark' },
  { value: 'royalBlue', label: 'Royal Blue' },
  { value: 'emerald', label: 'Emerald' },
  { value: 'sunriseOrange', label: 'Rose Gold' },
];

/* ─────────────────────────────────────────────────────────────
   Animated Background Orbs
───────────────────────────────────────────────────────────── */
function AmbientOrbs({ isGlass }: { isGlass: boolean }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none no-print" aria-hidden>
      {isGlass ? (
        <>
          <div
            className="absolute rounded-full"
            style={{
              top: '3rem', left: '12%',
              width: 400, height: 400,
              background: 'radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 70%)',
              filter: 'blur(60px)',
              animation: 'orbDrift1 18s ease-in-out infinite',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: '40%', right: '12%',
              width: 460, height: 460,
              background: 'radial-gradient(circle, rgba(67,20,7,0.12) 0%, transparent 70%)',
              filter: 'blur(70px)',
              animation: 'orbDrift2 22s ease-in-out infinite',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              bottom: '10%', left: '22%',
              width: 340, height: 340,
              background: 'radial-gradient(circle, rgba(229,62,62,0.07) 0%, transparent 70%)',
              filter: 'blur(55px)',
              animation: 'orbDrift3 15s ease-in-out infinite',
            }}
          />
        </>
      ) : (
        <>
          <div
            className="absolute rounded-full"
            style={{
              top: '5%', left: '8%',
              width: 500, height: 500,
              background: 'radial-gradient(circle, rgba(234,88,12,0.08) 0%, transparent 70%)',
              filter: 'blur(80px)',
              animation: 'orbDrift1 20s ease-in-out infinite',
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              top: '50%', right: '5%',
              width: 420, height: 420,
              background: 'radial-gradient(circle, rgba(67,20,7,0.15) 0%, transparent 70%)',
              filter: 'blur(90px)',
              animation: 'orbDrift2 25s ease-in-out infinite',
            }}
          />
        </>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Live Telemetry Dot
───────────────────────────────────────────────────────────── */
function LiveDot({ color = '#ef4444' }: { color?: string }) {
  return (
    <span className="relative inline-flex h-2 w-2">
      <span
        className="absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ background: color, animation: 'ping 1.2s cubic-bezier(0,0,0.2,1) infinite' }}
      />
      <span
        className="relative inline-flex h-2 w-2 rounded-full"
        style={{ background: color }}
      />
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Telemetry Item
───────────────────────────────────────────────────────────── */
function TelemetryItem({
  icon: Icon,
  label,
  value,
  valueColor = '#fff',
  iconColor = '#F97316',
}: {
  icon: React.ElementType;
  label?: string;
  value: string;
  valueColor?: string;
  iconColor?: string;
}) {
  return (
    <span className="flex items-center gap-1 select-none">
      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: iconColor }} />
      {label && <span className="hidden sm:inline text-[10px]">{label}</span>}
      <strong className="font-mono font-bold text-[10px]" style={{ color: valueColor }}>
        {value}
      </strong>
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   Quick Portal Pill Button
───────────────────────────────────────────────────────────── */
function PortalPill({
  active,
  onClick,
  emoji,
  label,
  activeColor,
  inactiveColor,
}: {
  active: boolean;
  onClick: () => void;
  emoji: string;
  label: string;
  activeColor: string;
  inactiveColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-black text-[11px] border cursor-pointer shrink-0"
      style={{
        background: active ? activeColor : `${activeColor}18`,
        color: active ? '#fff' : inactiveColor,
        borderColor: active ? activeColor : `${activeColor}35`,
        boxShadow: active ? `0 2px 12px ${activeColor}55` : 'none',
        transition: 'all 200ms cubic-bezier(0.34,1.56,0.64,1)',
        transform: active ? 'translateY(-1px)' : 'none',
      }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   Global Keyframe Injector
───────────────────────────────────────────────────────────── */
const GLOBAL_STYLES = `
@keyframes orbDrift1 {
  0%,100% { transform: translate(0,0) scale(1); }
  33%      { transform: translate(30px,-20px) scale(1.05); }
  66%      { transform: translate(-20px,15px) scale(0.97); }
}
@keyframes orbDrift2 {
  0%,100% { transform: translate(0,0) scale(1); }
  40%      { transform: translate(-25px,20px) scale(1.08); }
  80%      { transform: translate(20px,-15px) scale(0.95); }
}
@keyframes orbDrift3 {
  0%,100% { transform: translate(0,0) scale(1); }
  50%      { transform: translate(15px,-25px) scale(1.04); }
}
@keyframes ping {
  75%,100% { transform: scale(2); opacity: 0; }
}
@keyframes headerEntrance {
  from { opacity:0; transform: translateY(-16px); }
  to   { opacity:1; transform: translateY(0); }
}
@keyframes ribbonSlide {
  from { opacity:0; transform: translateY(-8px); }
  to   { opacity:1; transform: translateY(0); }
}
@keyframes contentFadeUp {
  from { opacity:0; transform: translateY(20px); }
  to   { opacity:1; transform: translateY(0); }
}
@keyframes pageReveal {
  0%   { opacity:0; transform: translateY(26px) scale(0.985); filter: blur(8px); }
  55%  { opacity:1; filter: blur(0); }
  100% { opacity:1; transform: translateY(0) scale(1); filter: blur(0); }
}
@keyframes softFloat {
  0%,100% { transform: translateY(0); }
  50%     { transform: translateY(-8px); }
}
@keyframes imageBreath {
  0%,100% { transform: scale(1); }
  50%     { transform: scale(1.035); }
}
@keyframes glowPulse {
  0%,100% { box-shadow: 0 0 0 rgba(249,115,22,0); }
  50%     { box-shadow: 0 18px 60px rgba(249,115,22,0.22); }
}
@keyframes cardCascade {
  from { opacity:0; transform: translateY(18px); }
  to   { opacity:1; transform: translateY(0); }
}
@keyframes drawerSlide {
  from { opacity:0; transform: translateY(-12px) scale(0.98); }
  to   { opacity:1; transform: translateY(0)   scale(1); }
}
@keyframes guidelineReveal {
  from { opacity:0; transform: translateX(-12px); }
  to   { opacity:1; transform: translateX(0); }
}
@keyframes tabBarSlide {
  from { opacity:0; transform: translateY(-6px); }
  to   { opacity:1; transform: translateY(0); }
}
@keyframes footerRise {
  from { opacity:0; transform: translateY(12px); }
  to   { opacity:1; transform: translateY(0); }
}
@keyframes logoSpin {
  0%   { transform: rotate(0deg)   scale(1);    }
  50%  { transform: rotate(12deg)  scale(1.12); }
  100% { transform: rotate(0deg)   scale(1);    }
}
@keyframes badgePop {
  0%   { transform: scale(0.7); opacity:0; }
  70%  { transform: scale(1.1); }
  100% { transform: scale(1);   opacity:1; }
}
@keyframes shimmerSlide {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
.page-reveal {
  animation: pageReveal 0.62s cubic-bezier(0.22,1,0.36,1) both;
}
.motion-card {
  animation: cardCascade 0.52s cubic-bezier(0.22,1,0.36,1) both;
  transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
}
.motion-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 45px rgba(15,23,42,0.14);
}
.motion-card:nth-child(2) { animation-delay: 70ms; }
.motion-card:nth-child(3) { animation-delay: 140ms; }
.motion-card:nth-child(4) { animation-delay: 210ms; }
.motion-card:nth-child(5) { animation-delay: 280ms; }
.motion-card:nth-child(6) { animation-delay: 350ms; }
.image-breath {
  animation: imageBreath 12s ease-in-out infinite;
  transform-origin: center;
}
.soft-float {
  animation: softFloat 5s ease-in-out infinite;
}
.glow-pulse {
  animation: glowPulse 3.8s ease-in-out infinite;
}
.interactive-lift {
  transition: transform 220ms ease, filter 220ms ease, box-shadow 220ms ease;
}
.interactive-lift:hover {
  transform: translateY(-3px) scale(1.01);
  filter: saturate(1.04);
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

/* ═══════════════════════════════════════════════════════════
   MAIN APP COMPONENT
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [activeTab, setActiveTab]           = useState<ActiveTab>('portals');
  const [portalSubTab, setPortalSubTab]     = useState<string>('home');
  const [isGuidelinesOpen, setIsGuidelinesOpen]         = useState(false);
  const [isWhatsAppManagerOpen, setIsWhatsAppManagerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen]         = useState(false);
  const [theme, setTheme] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('sxc_portal_theme') as ThemeType | null;
    return saved || 'glassNavy';
  });
  const [currentTimeString, setCurrentTimeString] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('sxc_admin_session') === 'active';
  });
  const [language, setLanguage] = useState<LangType>(() => {
    return (localStorage.getItem('sxc_portal_lang') as LangType) || 'en';
  });
  const [contentKey, setContentKey] = useState(0); // forces re-animation on tab switch

  const { t, i18n } = useTranslation();
  const isGlass = theme === 'glassNavy';

  /* ── Language handler ──────────────────────────────────── */
  const handleSetLanguage = (lang: LangType) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('sxc_portal_lang', lang);
    window.dispatchEvent(new Event('sxc_portal_lang_changed'));
  };

  /* ── Event listeners ───────────────────────────────────── */
  useEffect(() => {
    const checkAdminSession = () => {
      setIsAdminLoggedIn(localStorage.getItem('sxc_admin_session') === 'active');
    };
    const handleLangChangeTrigger = () => {
      const stored = localStorage.getItem('sxc_portal_lang') as LangType;
      if (stored && stored !== language) setLanguage(stored);
    };
    window.addEventListener('sxc_admin_login_changed',   checkAdminSession);
    window.addEventListener('sxc_portal_lang_changed',   handleLangChangeTrigger);
    return () => {
      window.removeEventListener('sxc_admin_login_changed',   checkAdminSession);
      window.removeEventListener('sxc_portal_lang_changed',   handleLangChangeTrigger);
    };
  }, [language]);

  /* ── Live clock ────────────────────────────────────────── */
  useEffect(() => {
    const updateTime = () => {
      setCurrentTimeString(
        new Date().toLocaleString('en-US', {
          weekday: 'short', month: 'short', day: 'numeric',
          year: 'numeric', hour: '2-digit', minute: '2-digit',
          second: '2-digit', hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  /* ── Tab switch ────────────────────────────────────────── */
  const handleTabSwitch = (tab: ActiveTab) => {
    setActiveTab(tab);
    setContentKey(k => k + 1);
    setIsMobileMenuOpen(false);
  };

  /* ── Theme change ──────────────────────────────────────── */
  const changeTheme = (newTheme: ThemeType) => {
    setTheme(newTheme);
    localStorage.setItem('sxc_portal_theme', newTheme);
  };

  function setPortalSubTabAndClose(subTab: string) {
    setPortalSubTab(subTab);
    setIsMobileMenuOpen(false);
  }

  /* ── Color tokens (derived from theme) ─────────────────── */
  const themeTokens: Record<ThemeType, typeof THEME_OPTIONS[number] & {
    bg: string; text: string; headerBg: string; headerBorder: string; accent: string;
    maroon: string; navBg: string; cardBg: string; cardBorder: string; mutedText: string;
  }> = {
    glassNavy: {
      value: 'glassNavy', label: 'Sunrise Light',
      bg: '#FFF7ED', text: '#431407', headerBg: 'rgba(255,255,255,0.88)', headerBorder: 'rgba(255,255,255,0.5)',
      accent: '#F97316', maroon: '#431407', navBg: 'rgba(255,255,255,0.82)', cardBg: 'rgba(255,255,255,0.7)', cardBorder: 'rgba(255,255,255,0.6)', mutedText: 'rgba(67,20,7,0.55)',
    },
    original: {
      value: 'original', label: 'Midnight Dark',
      bg: '#0A0A0B', text: '#D1D5DB', headerBg: 'rgba(18,18,20,0.90)', headerBorder: 'rgba(36,36,39,0.8)',
      accent: '#EA580C', maroon: '#431407', navBg: 'rgba(24,24,28,1)', cardBg: '#1C1C1F', cardBorder: '#242427', mutedText: '#6B7280',
    },
    royalBlue: {
      value: 'royalBlue', label: 'Royal Blue',
      bg: '#EFF6FF', text: '#0F2A5F', headerBg: 'rgba(239,246,255,0.92)', headerBorder: 'rgba(59,130,246,0.22)',
      accent: '#2563EB', maroon: '#0F2A5F', navBg: 'rgba(219,234,254,0.88)', cardBg: 'rgba(255,255,255,0.78)', cardBorder: 'rgba(59,130,246,0.24)', mutedText: 'rgba(15,42,95,0.58)',
    },
    emerald: {
      value: 'emerald', label: 'Emerald',
      bg: '#ECFDF5', text: '#064E3B', headerBg: 'rgba(236,253,245,0.92)', headerBorder: 'rgba(16,185,129,0.22)',
      accent: '#059669', maroon: '#064E3B', navBg: 'rgba(209,250,229,0.88)', cardBg: 'rgba(255,255,255,0.78)', cardBorder: 'rgba(16,185,129,0.24)', mutedText: 'rgba(6,78,59,0.58)',
    },
    sunriseOrange: {
      value: 'sunriseOrange', label: 'Rose Gold',
      bg: '#FFF1F2', text: '#7F1D1D', headerBg: 'rgba(255,241,242,0.92)', headerBorder: 'rgba(244,63,94,0.22)',
      accent: '#E11D48', maroon: '#7F1D1D', navBg: 'rgba(255,228,230,0.88)', cardBg: 'rgba(255,255,255,0.78)', cardBorder: 'rgba(244,63,94,0.24)', mutedText: 'rgba(127,29,29,0.58)',
    },
  };
  const T = themeTokens[theme];

  /* ─────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────── */
  return (
    <>
      {/* Inject global keyframes */}
      <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

      <div
        className="min-h-screen flex flex-col font-sans relative"
        style={{
          background: T.bg,
          color: T.text,
          transition: 'background 400ms ease, color 400ms ease',
        }}
      >
        {/* ── Ambient orbs ─────────────────────────────── */}
        <AmbientOrbs isGlass={isGlass} />

        {/* ══════════════════════════════════════════════
            TOP TELEMETRY RIBBON
        ══════════════════════════════════════════════ */}
        <div
          className="no-print border-b relative z-40"
          style={{
            background: '#111827',
            borderColor: 'rgba(255,255,255,0.06)',
            animation: 'ribbonSlide 0.5s ease both',
          }}
        >
          <div className="w-full px-4 sm:px-6 lg:px-8 py-2 flex flex-row justify-between items-center gap-2 flex-wrap">

            {/* Left: status indicators */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="flex items-center gap-1.5">
                <LiveDot color="#ef4444" />
                <span className="font-mono font-bold text-[10px] text-rose-400 tracking-widest">
                  SERVER LIVE
                </span>
              </span>

              <span className="hidden md:block h-3 w-px bg-white/10" />

              <TelemetryItem
                icon={Database}
                label="Indore Central DB:"
                value="CONNECTED"
                iconColor="#F97316"
                valueColor="#fff"
              />

              <span className="hidden md:block h-3 w-px bg-white/10" />

              <TelemetryItem
                icon={Zap}
                label="API Latency:"
                value="14ms"
                iconColor="#E53E3E"
                valueColor="#4ADE80"
              />

              <span className="hidden lg:block h-3 w-px bg-white/10" />

              <TelemetryItem
                icon={Wifi}
                label="SSL:"
                value="SECURED"
                iconColor="#60A5FA"
                valueColor="#60A5FA"
              />
            </div>

            {/* Right: clock + admin button */}
            <div className="flex items-center gap-3 font-mono flex-wrap">
              {currentTimeString && (
                <span
                  className="flex items-center gap-1.5 text-[10px] text-white font-black px-2 py-0.5 rounded border"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderColor: 'rgba(255,255,255,0.1)',
                  }}
                >
                  <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: '#F97316' }} />
                  {currentTimeString}
                </span>
              )}

              <span className="hidden sm:block h-3 w-px bg-white/10" />

              <button
                type="button"
                onClick={() => handleTabSwitch('admin')}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-[10px] tracking-widest border cursor-pointer"
                style={{
                  background: activeTab === 'admin'
                    ? '#FBBF24'
                    : isAdminLoggedIn
                      ? '#EA580C'
                      : 'rgba(251,191,36,0.1)',
                  color: activeTab === 'admin' ? '#000' : '#fff',
                  borderColor: activeTab === 'admin'
                    ? '#FBBF24'
                    : isAdminLoggedIn
                      ? 'rgba(234,88,12,0.5)'
                      : 'rgba(251,191,36,0.3)',
                  boxShadow: activeTab === 'admin' ? '0 0 16px rgba(251,191,36,0.4)' : 'none',
                  transition: 'all 200ms ease',
                }}
              >
                🔑 {activeTab === 'admin' ? 'SECURE TERMINAL' : (isAdminLoggedIn ? 'ADMIN CENTER' : 'ADMIN LOGIN')}
              </button>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            STICKY HEADER
        ══════════════════════════════════════════════ */}
        <div
          className="no-print sticky top-0 z-30 w-full pointer-events-none"
          style={{ animation: 'headerEntrance 0.5s cubic-bezier(0.4,0,0.2,1) 0.1s both' }}
        >
          <header
            className="pointer-events-auto flex items-center justify-between h-16 sm:h-20 px-4 sm:px-6 lg:px-8 border-b"
            style={{
              background: T.headerBg,
              borderColor: T.headerBorder,
              backdropFilter: 'blur(20px) saturate(1.6)',
              WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              transition: 'background 400ms ease, border-color 400ms ease',
            }}
          >
            {/* ── Logo + Brand ──────────────────────── */}
            <div
              className="flex items-center gap-3 shrink-0 cursor-pointer group"
              onClick={() => handleTabSwitch('portals')}
            >
              <div
                className="relative p-2 rounded-xl border"
                style={{
                  background: isGlass
                    ? 'linear-gradient(135deg, #fff, #FFF7ED)'
                    : 'linear-gradient(135deg, #1C1C1F, #000)',
                  borderColor: `${T.accent}30`,
                  boxShadow: `0 4px 16px ${T.accent}20`,
                  transition: 'transform 300ms cubic-bezier(0.34,1.56,0.64,1)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.animation = 'logoSpin 0.5s ease';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.animation = 'none';
                }}
              >
                <GraduationCap
                  className="w-6 h-6 sm:w-7 sm:h-7"
                  style={{ color: T.accent }}
                />
                {/* Ping dot */}
                <span
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{ background: T.accent, animation: 'ping 1.4s cubic-bezier(0,0,0.2,1) infinite' }}
                />
                <span
                  className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                  style={{ background: T.accent }}
                />
              </div>

              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  <h1
                    className="text-base sm:text-lg md:text-xl font-serif font-extrabold tracking-tight uppercase leading-none"
                    style={{ color: isGlass ? '#431407' : '#fff', transition: 'color 300ms ease' }}
                  >
                    Saint Xavier Convent School
                  </h1>

                  <span
                    className="text-[8px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase border hidden sm:inline-block"
                    style={{
                      background: T.accent,
                      borderColor: T.accent,
                      color: '#fff',
                      animation: 'badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.4s both',
                    }}
                  >
                    PORTAL
                  </span>

                  <button
                    onClick={e => { e.stopPropagation(); speakText('Saint Xavier Convent School Portal', language); }}
                    className="ml-1 p-1.5 rounded-full transition-all hover:scale-110"
                    style={{ color: T.accent }}
                    title="Listen to title"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p
                  className="text-[10px] font-semibold tracking-wide leading-none mt-1.5"
                  style={{ color: T.mutedText }}
                >
                  Indore, Madhya Pradesh
                </p>
              </div>
            </div>

            {/* ── Desktop Controls ──────────────────── */}
            <div className="hidden sm:flex items-center gap-2.5 pointer-events-auto">

              {/* Admin button */}
              <button
                onClick={() => handleTabSwitch('admin')}
                className="px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 relative"
                style={{
                  background: activeTab === 'admin'
                    ? `linear-gradient(135deg, #431407, #5C1B04)`
                    : T.cardBg,
                  color: activeTab === 'admin' ? '#fff' : T.mutedText,
                  border: `1px solid ${activeTab === 'admin' ? 'transparent' : T.cardBorder}`,
                  boxShadow: activeTab === 'admin' ? '0 4px 20px rgba(67,20,7,0.25)' : 'none',
                  transition: 'all 250ms cubic-bezier(0.34,1.56,0.64,1)',
                  transform: activeTab === 'admin' ? 'translateY(-1px)' : 'none',
                }}
              >
                <ShieldCheck
                  className="w-4 h-4"
                  style={{ color: activeTab === 'admin' ? '#fff' : T.accent }}
                />
                {t('adminDesk')}
              </button>

              <button
                onClick={() => handleTabSwitch('social_media')}
                className="px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 relative"
                style={{
                  background: activeTab === 'social_media'
                    ? 'linear-gradient(135deg, #DB2777, #7C3AED)'
                    : T.cardBg,
                  color: activeTab === 'social_media' ? '#fff' : T.mutedText,
                  border: `1px solid ${activeTab === 'social_media' ? 'transparent' : T.cardBorder}`,
                  boxShadow: activeTab === 'social_media' ? '0 4px 20px rgba(219,39,119,0.25)' : 'none',
                  transition: 'all 250ms cubic-bezier(0.34,1.56,0.64,1)',
                  transform: activeTab === 'social_media' ? 'translateY(-1px)' : 'none',
                }}
                title="Social Media Handler"
              >
                <MessageCircle
                  className="w-4 h-4"
                  style={{ color: activeTab === 'social_media' ? '#fff' : '#DB2777' }}
                />
                Social Handler
              </button>

              {/* Theme + Language pills */}
              <div
                className="flex items-center gap-1 p-1 rounded-xl border"
                style={{ background: T.cardBg, borderColor: T.cardBorder }}
              >
                <select
                  value={theme}
                  onChange={event => changeTheme(event.target.value as ThemeType)}
                  className="px-2 py-1.5 rounded-lg text-[10px] font-black outline-none cursor-pointer"
                  style={{
                    background: T.cardBg,
                    color: T.text,
                    border: `1px solid ${T.cardBorder}`,
                    boxShadow: `0 2px 10px ${T.accent}22`,
                  }}
                  title="Select theme"
                  aria-label="Select theme"
                >
                  {THEME_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <span className="w-px h-4 bg-gray-400/20 mx-0.5" />

                <select
                  value={language}
                  onChange={event => handleSetLanguage(event.target.value as LangType)}
                  className="px-2 py-1.5 rounded-lg text-[10px] font-black uppercase outline-none cursor-pointer"
                  style={{
                    background: T.accent,
                    color: '#fff',
                    border: 'none',
                    boxShadow: `0 2px 10px ${T.accent}55`,
                  }}
                  title="Select language"
                  aria-label="Select language"
                >
                  {LANGUAGE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Voice Controller */}
              <VoiceController
                currentLanguage={language}
                setLanguage={handleSetLanguage}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                theme={theme}
                setTheme={changeTheme}
              />

              {/* WhatsApp */}
              <button
                onClick={() => setIsWhatsAppManagerOpen(!isWhatsAppManagerOpen)}
                className="p-2 rounded-xl border transition-all hover:scale-110"
                style={{
                  background: isWhatsAppManagerOpen
                    ? '#22C55E'
                    : 'rgba(34,197,94,0.1)',
                  borderColor: 'rgba(34,197,94,0.35)',
                  color: isWhatsAppManagerOpen ? '#fff' : '#22C55E',
                  boxShadow: isWhatsAppManagerOpen ? '0 4px 16px rgba(34,197,94,0.4)' : 'none',
                  transition: 'all 250ms cubic-bezier(0.34,1.56,0.64,1)',
                }}
                title="WhatsApp Broadcast Manager"
              >
                <MessageCircle className="w-5 h-5" />
              </button>

              {/* Guidelines */}
              <button
                onClick={() => setIsGuidelinesOpen(!isGuidelinesOpen)}
                className="p-2 rounded-xl border transition-all"
                style={{
                  background: T.cardBg,
                  borderColor: T.cardBorder,
                  color: isGuidelinesOpen ? T.accent : T.mutedText,
                  transform: isGuidelinesOpen ? 'rotate(15deg)' : 'none',
                  transition: 'all 250ms cubic-bezier(0.34,1.56,0.64,1)',
                }}
                title="Operational Guidelines"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>

            {/* ── Mobile Controls ───────────────────── */}
            <div className="flex sm:hidden items-center gap-2 pointer-events-auto">
              <select
                value={theme}
                onChange={event => changeTheme(event.target.value as ThemeType)}
                className="px-3 py-2.5 rounded-xl border text-xs font-black outline-none min-h-11 max-w-36"
                style={{ background: T.cardBg, borderColor: T.cardBorder, color: T.text }}
                aria-label="Select theme"
              >
                {THEME_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl border flex items-center justify-center min-h-11 min-w-11"
                style={{ background: T.cardBg, borderColor: T.cardBorder, color: T.text }}
                aria-label="Toggle navigation"
              >
                <span
                  style={{
                    transition: 'transform 300ms ease',
                    transform: isMobileMenuOpen ? 'rotate(90deg)' : 'none',
                    display: 'block',
                  }}
                >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </span>
              </button>
            </div>
          </header>

          {/* ── Mobile Drawer ─────────────────────────── */}
          {isMobileMenuOpen && (
            <div
              className="sm:hidden mt-3 mx-3 rounded-2xl p-4 space-y-2 border pointer-events-auto"
              style={{
                background: isGlass ? 'rgba(255,255,255,0.97)' : 'rgba(18,18,20,0.97)',
                borderColor: T.cardBorder,
                backdropFilter: 'blur(24px)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                animation: 'drawerSlide 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
              }}
            >
              <p
                className="text-[10px] uppercase tracking-widest font-black mb-3 px-2"
                style={{ color: T.accent }}
              >
                Module Directory
              </p>

              <button
                onClick={() => handleTabSwitch('admin')}
                className="w-full px-4 py-3.5 rounded-xl text-sm font-black flex items-center justify-between min-h-12 border"
                style={{
                  background: activeTab === 'admin'
                    ? 'linear-gradient(135deg, #431407, #5C1B04)'
                    : T.cardBg,
                  color: activeTab === 'admin' ? '#fff' : T.text,
                  borderColor: activeTab === 'admin' ? 'transparent' : T.cardBorder,
                  boxShadow: activeTab === 'admin' ? '0 4px 20px rgba(67,20,7,0.3)' : 'none',
                }}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className="w-5 h-5"
                    style={{ color: activeTab === 'admin' ? '#fff' : T.accent }}
                  />
                  <span>Admin Command Center</span>
                </div>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div
                className="pt-3 mt-3 flex flex-wrap items-center justify-between gap-3 border-t"
                style={{ borderColor: T.cardBorder }}
              >
                <select
                  value={language}
                  onChange={event => handleSetLanguage(event.target.value as LangType)}
                  className="px-3 py-2 rounded-xl text-xs font-black outline-none min-h-10"
                  style={{
                    background: T.accent,
                    color: '#fff',
                    border: `1px solid ${T.accent}`,
                    boxShadow: `0 2px 10px ${T.accent}55`,
                  }}
                  aria-label="Select language"
                >
                  {LANGUAGE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <button
                    onClick={() => setIsWhatsAppManagerOpen(!isWhatsAppManagerOpen)}
                    className="py-2 px-3 rounded-xl flex items-center gap-2 text-xs font-bold border"
                    style={{
                      background: 'rgba(34,197,94,0.1)',
                      borderColor: 'rgba(34,197,94,0.3)',
                      color: '#22C55E',
                    }}
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </button>

                  <button
                    onClick={() => { setIsGuidelinesOpen(!isGuidelinesOpen); setIsMobileMenuOpen(false); }}
                    className="py-2 px-3 rounded-xl flex items-center gap-2 text-xs font-bold border"
                    style={{ background: T.cardBg, borderColor: T.cardBorder, color: T.text }}
                  >
                    <HelpCircle className="w-4 h-4" style={{ color: T.accent }} /> Help
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══════════════════════════════════════════════
            QUICK PORTAL TAB BAR
        ══════════════════════════════════════════════ */}
        {activeTab === 'portals' && (
          <div
            className="no-print border-b relative z-10"
            style={{
              background: T.navBg,
              borderColor: T.headerBorder,
              backdropFilter: 'blur(16px)',
              animation: 'tabBarSlide 0.4s ease 0.2s both',
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 overflow-x-auto flex gap-2 items-center flex-nowrap whitespace-nowrap scrollbar-hide">
              <span
                className="text-[10px] font-bold tracking-widest uppercase mr-1 shrink-0 flex items-center gap-1"
                style={{ color: T.mutedText }}
              >
                ⚡ Quick Portals:
              </span>

              <PortalPill active={portalSubTab === 'home'}            onClick={() => setPortalSubTab('home')}                   emoji="🏫" label={t('schoolHome')}        activeColor="#F97316" inactiveColor="#F97316" />
              <PortalPill active={portalSubTab === 'parent_login'}    onClick={() => setPortalSubTab('parent_login')}            emoji="👨‍👩‍👦" label={t('parentsLogin')}      activeColor="#FB923C" inactiveColor="#FB923C" />
              <PortalPill active={portalSubTab === 'teacher_login'}   onClick={() => setPortalSubTab('teacher_login')}           emoji="👩‍🏫" label={t('teacherLogin')}      activeColor="#6366F1" inactiveColor="#6366F1" />
              <PortalPill active={portalSubTab === 'student_login'}   onClick={() => setPortalSubTab('student_login')}           emoji="🎒" label={t('studentLogin')}       activeColor="#F59E0B" inactiveColor="#F59E0B" />

              <span className="h-4 w-px bg-gray-400/20 shrink-0" />

              <PortalPill active={portalSubTab === 'homework'}          onClick={() => setPortalSubTabAndClose('homework')}          emoji="📝" label={t('homework')}           activeColor="#F43F5E" inactiveColor="#F43F5E" />
              <PortalPill active={portalSubTab === 'digital_library'}   onClick={() => setPortalSubTabAndClose('digital_library')}   emoji="📚" label="Digital Library"         activeColor="#3B82F6" inactiveColor="#3B82F6" />
              <PortalPill active={portalSubTab === 'live_class'}        onClick={() => setPortalSubTabAndClose('live_class')}        emoji="🎥" label={t('liveClass')}          activeColor="#EF4444" inactiveColor="#EF4444" />
              <PortalPill active={portalSubTab === 'classroom_cameras'} onClick={() => setPortalSubTabAndClose('classroom_cameras')} emoji="👁️" label={t('classroomCameras')} activeColor="#A855F7" inactiveColor="#A855F7" />

              <span className="h-4 w-px bg-gray-400/20 shrink-0" />

              <PortalPill active={portalSubTab === 'present_students'} onClick={() => setPortalSubTabAndClose('present_students')} emoji="🟢" label={t('todayPresent')}    activeColor="#14B8A6" inactiveColor="#14B8A6" />
              <PortalPill active={portalSubTab === 'absent_students'}  onClick={() => setPortalSubTabAndClose('absent_students')}  emoji="🔴" label={t('absentStudent')}   activeColor="#DC2626" inactiveColor="#DC2626" />
              <PortalPill active={portalSubTab === 'scholarship'}      onClick={() => setPortalSubTabAndClose('scholarship')}      emoji="🪙" label="New Scholarship"       activeColor="#E53E3E" inactiveColor="#E53E3E" />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════
            MAIN CONTENT
        ══════════════════════════════════════════════ */}
        <main className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1 flex flex-col gap-6 relative z-10">

          {/* Guidelines Panel */}
          {isGuidelinesOpen && (
            <div
              className="no-print border-l-4 p-4 rounded-r-xl text-xs sm:text-sm"
              style={{
                background: isGlass ? 'rgba(255,255,255,0.75)' : '#1C1C1F',
                borderLeftColor: T.accent,
                border: `1px solid ${T.cardBorder}`,
                borderLeft: `4px solid ${T.accent}`,
                backdropFilter: 'blur(12px)',
                animation: 'guidelineReveal 0.35s ease both',
              }}
            >
              <h3
                className="font-bold mb-2 flex items-center gap-1.5"
                style={{ color: T.text }}
              >
                <HelpCircle className="w-4 h-4" style={{ color: T.accent }} />
                💡 Document Portal Operational Guide
              </h3>
              <ul className="list-disc list-inside space-y-1 leading-relaxed font-medium" style={{ color: T.mutedText }}>
                <li>Use the admin dashboard command center to toggle between generating a <strong>Student Marksheet</strong>, <strong>Transfer Certificate (T.C.)</strong>, and <strong>Admission Forms / Scholar Ledgers</strong>.</li>
                <li>Edit student particulars in the editor forms on the left — the high-fidelity render card updates in real-time.</li>
                <li>Upload passport photos in the Admissions module with drag-and-drop or browse options.</li>
                <li>To export as official PDF: click <strong>"Print / Save PDF"</strong>, select A4 Portrait, set Margins as None, and enable <strong>Background graphics</strong> in your browser print settings.</li>
              </ul>
            </div>
          )}

          {/* Breadcrumb bar */}
          <div
            className="no-print flex flex-col sm:flex-row justify-between items-center pb-3 border-b gap-2"
            style={{ borderColor: `${T.maroon}18` }}
          >
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-black uppercase tracking-widest"
                style={{ color: T.mutedText }}
              >
                SXC Portal
              </span>
              <span style={{ color: T.mutedText }}>/</span>
              <span
                className="text-[11px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded"
                style={{
                  background: isGlass ? 'rgba(67,20,7,0.08)' : 'rgba(255,255,255,0.08)',
                  color: T.text,
                }}
              >
                {activeTab === 'portals'
                  ? 'Academics & Portals'
                  : activeTab === 'social_media'
                    ? 'Social Media Handler'
                    : 'Admin Secure Workstation'}
              </span>
            </div>

            <div
              className="text-[10px] font-mono font-bold flex items-center gap-1.5"
              style={{ color: T.mutedText }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-rose-500"
                style={{ animation: 'ping 2s ease-in-out infinite' }}
              />
              ACTIVE SESSION SECURE · PORTAL READY
            </div>
          </div>

          {/* Tab Content — re-animates on switch */}
          <div
            key={contentKey}
            className="flex-1 page-reveal"
          >
            {activeTab === 'portals' && (
              <PortalsTab theme={theme} initialSubTab={portalSubTab} lang={language} onNavigateSubTab={setPortalSubTabAndClose} />
            )}
            {activeTab === 'admin' && (
              <AdminTab theme={theme} setActiveTab={setActiveTab} lang={language} />
            )}
            {activeTab === 'social_media' && (
              <SocialMediaDashboardTab />
            )}
          </div>

          {/* WhatsApp Manager */}
          <WhatsAppBroadcastManager
            isOpen={isWhatsAppManagerOpen}
            onClose={() => setIsWhatsAppManagerOpen(false)}
            theme={theme}
          />
        </main>

        {/* ══════════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════════ */}
        <footer
          className="no-print text-xs py-6 border-t mt-auto relative z-10"
          style={{
            background: isGlass ? 'rgba(67,20,7,0.06)' : '#0F0F12',
            borderColor: isGlass ? 'rgba(0,0,0,0.06)' : '#242427',
            color: T.mutedText,
            animation: 'footerRise 0.6s ease 0.3s both',
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" style={{ color: T.accent }} />
                <p className="font-semibold" style={{ color: T.text }}>
                  Saint Xavier Convent School
                </p>
              </div>
              <p>© {new Date().getFullYear()} · Official Internal Office Resource · Indore</p>
            </div>

            <div
              className="flex flex-col items-center md:items-end gap-1.5 font-mono text-[10px]"
              style={{ color: T.mutedText }}
            >
              <span className="flex items-center gap-1.5">
                RENDER MODE:{' '}
                <span className="font-bold" style={{ color: T.accent }}>
                  REACTIVE HARDWARE
                </span>
              </span>
              <span className="flex items-center gap-1.5">
                <LiveDot color="#22C55E" />
                SSL DATA: SYNCED
              </span>
              <span>THEME: {isGlass ? '☀️ SUNRISE LIGHT' : '🌙 MIDNIGHT DARK'}</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
