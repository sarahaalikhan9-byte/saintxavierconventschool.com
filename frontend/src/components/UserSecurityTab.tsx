import React, { useState, useEffect } from 'react';
import { UserPlus, ShieldAlert, CheckCircle, Lock, Unlock } from 'lucide-react';

interface UserSecurityTabProps {
  theme: 'original' | 'glassNavy' | 'sunriseOrange' | 'royalBlue' | 'emerald';
}

export default function UserSecurityTab({ theme }: UserSecurityTabProps) {
  const isGlass = theme === 'glassNavy';
  const [accounts, setAccounts] = useState<any[]>([]);
  
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('student');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    const accStr = localStorage.getItem('sxc_user_accounts');
    if (accStr) {
      try {
        setAccounts(JSON.parse(accStr));
      } catch (e) {}
    }
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newPassword) {
      setMessage('Username and password are required.');
      return;
    }

    const currentAccounts = [...accounts];
    if (currentAccounts.find(a => a.username === newUsername && a.role === newRole)) {
      setMessage('Account already exists for this role.');
      return;
    }

    const newAcc = {
      id: `usr-${Date.now()}`,
      username: newUsername,
      password: newPassword,
      role: newRole,
      failedAttempts: 0,
      isLocked: false
    };

    currentAccounts.push(newAcc);
    localStorage.setItem('sxc_user_accounts', JSON.stringify(currentAccounts));
    setAccounts(currentAccounts);
    setNewUsername('');
    setNewPassword('');
    setMessage(`Account created successfully for ${newUsername} (${newRole}).`);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleUnlock = (id: string) => {
    const currentAccounts = [...accounts];
    const index = currentAccounts.findIndex(a => a.id === id);
    if (index !== -1) {
      currentAccounts[index].isLocked = false;
      currentAccounts[index].failedAttempts = 0;
      localStorage.setItem('sxc_user_accounts', JSON.stringify(currentAccounts));
      setAccounts(currentAccounts);
      setMessage(`Account unlocked successfully.`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = (id: string) => {
    if(window.confirm('Are you sure you want to delete this account?')) {
      const currentAccounts = accounts.filter(a => a.id !== id);
      localStorage.setItem('sxc_user_accounts', JSON.stringify(currentAccounts));
      setAccounts(currentAccounts);
    }
  };

  return (
    <div className={`p-6 rounded-3xl min-h-[500px] border ${isGlass ? 'bg-white/80 backdrop-blur-xl border-white/50 text-[#431407]' : 'bg-[#0A0A0C] border-[#1F1F22] text-white'}`}>
      <div className="flex items-center gap-3 mb-8">
        <div className={`p-3 rounded-2xl ${isGlass ? 'bg-indigo-500/10' : 'bg-indigo-500/20'}`}>
          <Lock className="w-6 h-6 text-indigo-500" />
        </div>
        <div>
          <h2 className="text-2xl font-black">User Security & Accounts</h2>
          <p className="text-sm opacity-60">Generate secure credentials and manage lockouts.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Account Form */}
        <div className={`col-span-1 p-6 rounded-2xl border ${isGlass ? 'bg-white border-gray-200' : 'bg-[#18181B] border-[#2C2C2E]'}`}>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-indigo-500" />
            Generate Credentials
          </h3>
          {message && <div className="mb-4 p-3 rounded-lg bg-green-500/10 text-green-500 text-xs font-bold">{message}</div>}
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1 opacity-70">Role</label>
              <select value={newRole} onChange={e => setNewRole(e.target.value)} className={`w-full p-2.5 rounded-xl border text-sm outline-none transition ${isGlass ? 'bg-gray-50 border-gray-200' : 'bg-[#0F0F12] border-[#242427]'}`}>
                <option value="student">Student</option>
                <option value="parent">Parent</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 opacity-70">Username / ID</label>
              <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} className={`w-full p-2.5 rounded-xl border text-sm outline-none transition ${isGlass ? 'bg-gray-50 border-gray-200' : 'bg-[#0F0F12] border-[#242427]'}`} placeholder="e.g. STU-2026-001" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1 opacity-70">Password</label>
              <input type="text" value={newPassword} onChange={e => setNewPassword(e.target.value)} className={`w-full p-2.5 rounded-xl border text-sm outline-none transition ${isGlass ? 'bg-gray-50 border-gray-200' : 'bg-[#0F0F12] border-[#242427]'}`} placeholder="e.g. randomPass123" />
            </div>
            <button type="submit" className="w-full py-3 rounded-xl font-black text-white bg-indigo-500 hover:bg-indigo-600 transition">
              Create Account
            </button>
          </form>
        </div>

        {/* Accounts List */}
        <div className="col-span-1 lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-xs uppercase tracking-wider opacity-60 border-b ${isGlass ? 'border-gray-200' : 'border-gray-800'}`}>
                  <th className="pb-3 px-2">Role</th>
                  <th className="pb-3 px-2">Username</th>
                  <th className="pb-3 px-2">Password</th>
                  <th className="pb-3 px-2">Status</th>
                  <th className="pb-3 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {accounts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center opacity-50">No accounts generated yet.</td>
                  </tr>
                )}
                {accounts.map(acc => (
                  <tr key={acc.id} className={`border-b ${isGlass ? 'border-gray-100' : 'border-[#1F1F22]'}`}>
                    <td className="py-4 px-2 capitalize">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${acc.role === 'student' ? 'bg-amber-500/10 text-amber-500' : acc.role === 'parent' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'}`}>
                        {acc.role}
                      </span>
                    </td>
                    <td className="py-4 px-2 font-mono text-xs">{acc.username}</td>
                    <td className="py-4 px-2 font-mono text-xs opacity-50">••••••</td>
                    <td className="py-4 px-2">
                      {acc.isLocked ? (
                        <div className="flex items-center gap-1 text-red-500 text-xs font-bold bg-red-500/10 px-2 py-1 rounded w-max">
                          <ShieldAlert className="w-3.5 h-3.5" /> Locked ({acc.failedAttempts} fails)
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold">
                          <CheckCircle className="w-3.5 h-3.5" /> Active
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-2 text-right">
                      <div className="flex justify-end gap-2">
                        {acc.isLocked && (
                          <button onClick={() => handleUnlock(acc.id)} className="px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold flex items-center gap-1 transition">
                            <Unlock className="w-3 h-3" /> Unlock
                          </button>
                        )}
                        <button onClick={() => handleDelete(acc.id)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition ${isGlass ? 'border-red-200 text-red-500 hover:bg-red-50' : 'border-red-500/20 text-red-400 hover:bg-red-500/10'}`}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
