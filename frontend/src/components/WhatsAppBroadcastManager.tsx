import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Users, Copy, Plus, Trash2, CheckCircle2, Lock, LogOut } from 'lucide-react';

interface WhatsAppBroadcastManagerProps {
  isOpen: boolean;
  onClose: () => void;
  theme: 'original' | 'glassNavy' | 'sunriseOrange' | 'royalBlue' | 'emerald';
}

interface BroadcastList {
  id: string;
  name: string;
  numbers: string[];
  createdAt: string;
  status?: 'pending' | 'sending' | 'completed';
}

const WHATSAPP_ADMIN_ID = 'WhatsApp@saintxavierconventschool.com';
const WHATSAPP_ADMIN_PASSWORD = 'Saint@1990';
const WHATSAPP_SESSION_KEY = 'sxc_whatsapp_manager_session';

export default function WhatsAppBroadcastManager({ isOpen, onClose, theme }: WhatsAppBroadcastManagerProps) {
  const isGlass = theme === 'glassNavy';
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem(WHATSAPP_SESSION_KEY) === 'active';
  });
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Backend Integration State
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isPairing, setIsPairing] = useState(false);
  const [pairingCode, setPairingCode] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [broadcastLists, setBroadcastLists] = useState<BroadcastList[]>(() => {
    const saved = localStorage.getItem('sxc_whatsapp_broadcasts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Check backend status periodically
  useEffect(() => {
    if (!isOpen) return;
    
    const checkStatus = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/whatsapp/status');
        const data = await res.json();
        setIsBackendConnected(data.isConnected || data.isRegistered);
        setIsPairing(data.isPairing);
        setPairingCode(data.pairingCode);
      } catch (err) {
        setIsBackendConnected(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 3000);
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem('sxc_whatsapp_broadcasts', JSON.stringify(broadcastLists));
  }, [broadcastLists]);

  if (!isOpen) return null;

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();
    if (loginId.trim().toLowerCase() === WHATSAPP_ADMIN_ID.toLowerCase() && loginPassword === WHATSAPP_ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(WHATSAPP_SESSION_KEY, 'active');
      setLoginId('');
      setLoginPassword('');
      setLoginError('');
      return;
    }
    setLoginError('Invalid WhatsApp manager ID or password.');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(WHATSAPP_SESSION_KEY);
    setLoginPassword('');
    setPairingCode(null);
  };

  const handleAddNumbers = () => {
    if (!inputText.trim()) return;

    // Extract numbers, removing anything that isn't a digit, comma, or newline.
    const rawNumbers = inputText.split(/[\n, ]+/).map(n => n.replace(/\D/g, '')).filter(n => n.length >= 10);
    
    if (rawNumbers.length === 0) {
      alert("No valid 10+ digit phone numbers found.");
      return;
    }

    // Chunk into 256 max
    const newLists: BroadcastList[] = [];
    const CHUNK_SIZE = 256;
    
    let currentCount = broadcastLists.length + 1;

    for (let i = 0; i < rawNumbers.length; i += CHUNK_SIZE) {
      const chunk = rawNumbers.slice(i, i + CHUNK_SIZE);
      newLists.push({
        id: `wa-list-${Date.now()}-${i}`,
        name: `Broadcast List ${currentCount++}`,
        numbers: chunk,
        createdAt: new Date().toLocaleDateString('en-IN')
      });
    }

    setBroadcastLists([...broadcastLists, ...newLists]);
    setInputText('');
  };

  const handleConnectWhatsApp = async () => {
    try {
      setIsPairing(true);
      const res = await fetch('http://localhost:3001/api/whatsapp/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: '917869232331' })
      });
      const data = await res.json();
      if (data.pairingCode) {
        setPairingCode(data.pairingCode);
      }
    } catch (err) {
      alert("Make sure the backend server is running on port 3001.");
      setIsPairing(false);
    }
  };

  const handleSendBroadcast = async (listId: string, numbers: string[]) => {
    if (!messageText.trim()) {
      alert("Please enter a message to broadcast.");
      return;
    }
    if (!isBackendConnected) {
      alert("WhatsApp is not connected. Please connect first.");
      return;
    }

    try {
      // Mark as sending locally
      setBroadcastLists(lists => lists.map(l => l.id === listId ? { ...l, status: 'sending' } : l));

      await fetch('http://localhost:3001/api/whatsapp/send-broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numbers, message: messageText })
      });

      alert("Broadcast started successfully!");
      setBroadcastLists(lists => lists.map(l => l.id === listId ? { ...l, status: 'completed' } : l));
    } catch (err) {
      alert("Failed to send broadcast.");
      setBroadcastLists(lists => lists.map(l => l.id === listId ? { ...l, status: 'pending' } : l));
    }
  };

  const handleCopy = (id: string, numbers: string[]) => {
    navigator.clipboard.writeText(numbers.join(', '));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this broadcast list?")) {
      setBroadcastLists(broadcastLists.filter(list => list.id !== id));
    }
  };

  return (
    <div className={`fixed top-16 sm:top-20 right-4 sm:right-8 w-[90%] sm:w-96 max-w-sm z-50 rounded-2xl shadow-2xl border transition-all animate-fade-in ${isGlass ? 'bg-white/90 backdrop-blur-xl border-white/50 text-[#431407]' : 'bg-[#18181C] border-[#2C2C2E] text-white'}`}>
      
      {/* Header */}
      <div className={`flex justify-between items-center p-4 border-b ${isGlass ? 'border-[#431407]/10' : 'border-[#2C2C2E]'}`}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-green-500 rounded-lg shadow shadow-green-500/20">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight">WhatsApp Broadcasts</h3>
            <p className={`text-[10px] font-semibold ${isGlass ? 'text-green-600' : 'text-green-400'}`}>
              Primary: +91 7869232331
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isAuthenticated && (
            <button onClick={handleLogout} className={`p-1 rounded-md transition ${isGlass ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-[#2C2C2E] text-slate-400'}`} title="Logout WhatsApp Manager">
              <LogOut className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className={`p-1 rounded-md transition ${isGlass ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-[#2C2C2E] text-slate-400'}`}>
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col max-h-[70vh]">
        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="space-y-3">
            <div className={`p-3 rounded-xl border flex items-start gap-3 ${isGlass ? 'bg-green-50 border-green-200' : 'bg-green-500/10 border-green-500/30'}`}>
              <Lock className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-black">Protected WhatsApp Manager</p>
                <p className={`text-[11px] mt-1 ${isGlass ? 'text-[#431407]/65' : 'text-slate-400'}`}>
                  Login required before managing broadcast lists or sending messages.
                </p>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wider ${isGlass ? 'text-[#431407]/70' : 'text-slate-400'}`}>
                WhatsApp Manager ID
              </label>
              <input
                value={loginId}
                onChange={(event) => setLoginId(event.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs outline-none transition ${isGlass ? 'bg-white border-[#431407]/20 focus:border-green-500 text-[#431407]' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-green-500 text-white'}`}
                placeholder="Enter manager ID"
                autoComplete="username"
              />
            </div>

            <div>
              <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wider ${isGlass ? 'text-[#431407]/70' : 'text-slate-400'}`}>
                Password
              </label>
              <input
                value={loginPassword}
                onChange={(event) => setLoginPassword(event.target.value)}
                type="password"
                className={`w-full p-2.5 rounded-xl border text-xs outline-none transition ${isGlass ? 'bg-white border-[#431407]/20 focus:border-green-500 text-[#431407]' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-green-500 text-white'}`}
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>

            {loginError && (
              <p className="text-xs font-bold text-red-500">{loginError}</p>
            )}

            <button className="w-full bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" /> Unlock WhatsApp Broadcasts
            </button>
          </form>
        ) : (
          <>
        
        {/* Input Section */}
        <div className="mb-4">
          <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wider ${isGlass ? 'text-[#431407]/70' : 'text-slate-400'}`}>
            Bulk Import Numbers
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste hundreds of numbers here. Separated by commas, spaces, or new lines..."
            className={`w-full p-2.5 rounded-xl border text-xs min-h-[80px] outline-none transition resize-none ${isGlass ? 'bg-white border-[#431407]/20 focus:border-green-500 text-[#431407]' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-green-500 text-white'}`}
          />
          <button
            onClick={handleAddNumbers}
            className="w-full mt-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Generate 256-Limit Lists
          </button>
        </div>

        {/* Lists Display */}
        <div className={`flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar`}>
          {broadcastLists.length === 0 ? (
            <div className={`text-center py-6 text-xs font-semibold ${isGlass ? 'text-[#431407]/50' : 'text-slate-500'}`}>
              No broadcast lists active.<br/>Paste numbers above to begin.
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mb-2">
                <label className={`block text-xs font-bold mb-1.5 uppercase tracking-wider ${isGlass ? 'text-[#431407]/70' : 'text-slate-400'}`}>
                  Broadcast Message
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Enter the message you want to send..."
                  className={`w-full p-2.5 rounded-xl border text-xs min-h-[60px] outline-none transition resize-none ${isGlass ? 'bg-white border-[#431407]/20 focus:border-green-500 text-[#431407]' : 'bg-[#0F0F12] border-[#2C2C2E] focus:border-green-500 text-white'}`}
                />
              </div>

              {!isBackendConnected ? (
                <div className={`p-4 rounded-xl border text-center ${isGlass ? 'bg-yellow-50 border-yellow-200' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                  {pairingCode ? (
                    <div>
                      <p className="text-xs font-bold mb-2">Enter this code in WhatsApp:</p>
                      <div className="text-2xl font-black tracking-widest text-green-600 mb-2">{pairingCode}</div>
                      <p className="text-[10px] opacity-70">Open WhatsApp &gt; Linked Devices &gt; Link Device &gt; Use Phone Number Instead</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold mb-3">WhatsApp is not connected to the automation server.</p>
                      <button onClick={handleConnectWhatsApp} disabled={isPairing} className="w-full bg-green-500 text-white text-xs font-bold py-2 rounded-xl">
                        {isPairing ? 'Generating Code...' : 'Connect +91 7869232331'}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-2 rounded-xl bg-green-500/10 border border-green-500/30 text-center mb-2">
                  <span className="text-xs font-bold text-green-500 flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Server Connected to WhatsApp
                  </span>
                </div>
              )}

              {broadcastLists.map((list) => (
                <div key={list.id} className={`p-3 rounded-xl border ${isGlass ? 'bg-[#FFF7ED]/50 border-[#431407]/10 shadow-sm' : 'bg-[#242427] border-[#2C2C2E]'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-sm flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-green-500" />
                        {list.name} {list.status === 'completed' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                      </h4>
                      <p className={`text-[10px] font-medium ${isGlass ? 'text-slate-500' : 'text-slate-400'}`}>
                        {list.numbers.length} / 256 members • {list.createdAt}
                      </p>
                    </div>
                    <button onClick={() => handleDelete(list.id)} className="p-1 text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded transition">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(list.id, list.numbers)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition border ${
                        copiedId === list.id 
                          ? 'bg-slate-200 border-slate-300 text-slate-800' 
                          : (isGlass ? 'bg-white hover:bg-slate-50 border-[#431407]/15 text-[#431407]' : 'bg-[#1C1C1F] hover:bg-[#2C2C2E] border-[#2C2C2E] text-white')
                      }`}
                    >
                      {copiedId === list.id ? 'Copied!' : 'Copy Numbers'}
                    </button>
                    
                    <button
                      onClick={() => handleSendBroadcast(list.id, list.numbers)}
                      disabled={list.status === 'sending' || !isBackendConnected}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition border ${
                        list.status === 'sending' ? 'bg-amber-500 text-white border-amber-500 opacity-70' : 
                        !isBackendConnected ? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed' :
                        'bg-green-500 hover:bg-green-600 text-white border-green-500 shadow-sm'
                      }`}
                    >
                      {list.status === 'sending' ? 'Sending...' : 'Auto Broadcast'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

          </>
        )}
      </div>
    </div>
  );
}
