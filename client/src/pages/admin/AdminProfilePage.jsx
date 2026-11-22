import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Lock, 
  Key, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  LogOut,
  Info
} from 'lucide-react';

export default function AdminProfilePage() {
  const { adminUser, updateProfile, changePassword, logout } = useAuth();

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: adminUser?.name || 'RK Operations Manager',
    email: adminUser?.email || 'admin@rknutrition.com',
    role: adminUser?.role || 'Brand Administrator'
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Password Form State
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordStatus, setPasswordStatus] = useState(null); // { type: 'success' | 'error', message }

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const res = await updateProfile(profileForm);
    if (res.success) {
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus(null);

    if (passForm.newPassword !== passForm.confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New password and confirmation do not match.' });
      return;
    }

    const res = await changePassword(passForm.currentPassword, passForm.newPassword);
    if (res.success) {
      setPasswordStatus({ type: 'success', message: 'Password updated successfully.' });
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPasswordStatus({ type: 'error', message: res.error || 'Failed to update password.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#242424] gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F5F4F2] tracking-tight">
            Administrator Profile & Security
          </h1>
          <p className="text-xs text-[#8C8C8C] mt-1 font-body">
            Manage your administrator credentials, session information, and local security configurations.
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] hover:border-[#E11D2E]/60 text-xs font-heading font-semibold uppercase tracking-wider text-[#F5F4F2] transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 text-[#E11D2E]" />
          <span>Sign Out</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Card & Information */}
        <div className="lg:col-span-6 space-y-6">
          {/* Identity Card */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-[#242424]">
              <div className="w-14 h-14 bg-[#1C1C1C] border border-[#2E2E2E] text-[#E11D2E] font-heading font-black text-xl flex items-center justify-center relative">
                {adminUser?.avatarInitials || 'RK'}
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#E11D2E]" />
              </div>
              <div>
                <h2 className="font-heading font-bold text-lg uppercase text-[#F5F4F2]">
                  {adminUser?.name || 'Administrator'}
                </h2>
                <span className="text-xs font-mono text-[#8C8C8C] block">
                  {adminUser?.role || 'Brand Operations'}
                </span>
                <span className="text-[10px] font-mono text-[#4CAF50] bg-[#4CAF50]/10 px-2 py-0.5 border border-[#4CAF50]/20 inline-block mt-1">
                  SESSION ACTIVE
                </span>
              </div>
            </div>

            {/* Profile Update Form */}
            <form onSubmit={handleProfileSubmit} className="space-y-4 pt-2">
              {profileSaved && (
                <div className="p-3 bg-[#4CAF50]/10 border border-[#4CAF50]/30 text-xs text-[#4CAF50] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#E11D2E] focus:outline-none px-3.5 py-2 text-sm text-[#F5F4F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                  Administrator Email
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#E11D2E] focus:outline-none px-3.5 py-2 text-sm text-[#F5F4F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                  Administrative Role
                </label>
                <input
                  type="text"
                  value={profileForm.role}
                  onChange={(e) => setProfileForm({ ...profileForm, role: e.target.value })}
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#E11D2E] focus:outline-none px-3.5 py-2 text-sm text-[#F5F4F2]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#E11D2E] hover:bg-[#AC1721] text-[#F5F4F2] font-heading uppercase text-xs font-bold tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Info</span>
              </button>
            </form>
          </div>

          {/* Active Session Info */}
          <div className="bg-[#141414] border border-[#242424] p-5 space-y-3">
            <h3 className="font-heading text-xs uppercase font-bold text-[#F5F4F2] tracking-wider pb-2 border-b border-[#242424]">
              Active Session Metadata
            </h3>
            <div className="text-xs font-mono space-y-1.5 text-[#8C8C8C]">
              <div>Environment: <span className="text-[#F5F4F2]">Vite + React (Windows Node Runtime)</span></div>
              <div>Host Location: <span className="text-[#F5F4F2]">127.0.0.1:5173 (Localhost)</span></div>
              <div>Authentication Scope: <span className="text-[#E11D2E]">rk_admin_auth (LocalStorage)</span></div>
            </div>
          </div>
        </div>

        {/* Right Column: Password Change & Honest Security Disclosure */}
        <div className="lg:col-span-6 space-y-6">
          {/* Password Form */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#242424]">
              <Key className="w-4 h-4 text-[#E11D2E]" />
              <h2 className="font-heading text-sm uppercase font-bold text-[#F5F4F2] tracking-wider">
                Change Admin Password
              </h2>
            </div>

            {passwordStatus && (
              <div className={`p-3 text-xs flex items-center gap-2 ${
                passwordStatus.type === 'error' 
                  ? 'bg-[#E11D2E]/10 border border-[#E11D2E]/40 text-[#F5F4F2]' 
                  : 'bg-[#4CAF50]/10 border border-[#4CAF50]/30 text-[#4CAF50]'
              }`}>
                {passwordStatus.type === 'error' ? <AlertCircle className="w-4 h-4 text-[#E11D2E]" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{passwordStatus.message}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passForm.currentPassword}
                  onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#E11D2E] focus:outline-none px-3.5 py-2 text-sm text-[#F5F4F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                  New Password (min 8 chars)
                </label>
                <input
                  type="password"
                  value={passForm.newPassword}
                  onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#E11D2E] focus:outline-none px-3.5 py-2 text-sm text-[#F5F4F2]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passForm.confirmPassword}
                  onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-[#181818] border border-[#2E2E2E] focus:border-[#E11D2E] focus:outline-none px-3.5 py-2 text-sm text-[#F5F4F2]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#1C1C1C] hover:bg-[#252525] border border-[#2D2D2D] hover:border-[#E11D2E]/60 text-[#F5F4F2] font-heading uppercase text-xs font-bold tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-3.5 h-3.5 text-[#E11D2E]" />
                <span>Update Password</span>
              </button>
            </form>
          </div>

          {/* Honest Client-Side Security Disclosure */}
          <div className="bg-[#141414] border border-[#242424] p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#EAB308] uppercase">
              <Info className="w-4 h-4 shrink-0" />
              <span>Architectural Disclosure</span>
            </div>
            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              This console operates client-side with localStorage synchronization. No false server-side encryption or synthetic cryptographic signatures are claimed.
            </p>
            <p className="text-xs text-[#8C8C8C] leading-relaxed">
              For production enterprise hardening, this interface is architected to cleanly attach to an authenticated backend (OAuth 2.0 / JWT / HTTPS sessions with bcrypt password hashing).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
