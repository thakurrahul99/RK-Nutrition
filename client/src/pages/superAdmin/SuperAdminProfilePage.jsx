import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { ShieldCheck, User, Lock, Key, AlertCircle, Save } from 'lucide-react';

export default function SuperAdminProfilePage() {
  const { adminUser, updateProfile, changePassword } = useAuth();
  const { showToast } = useContent();

  const [profileForm, setProfileForm] = useState({
    name: adminUser?.name || 'Developer Lead',
    email: adminUser?.email || 'developer@rknutrition.com'
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    const res = await updateProfile(profileForm);
    if (res.success) {
      showToast('Developer profile updated.', 'success');
    } else {
      showToast(res.error || 'Failed to update profile.', 'error');
    }
    setIsUpdatingProfile(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }

    setIsUpdatingPassword(true);
    const res = await changePassword(passwordForm.currentPassword, passwordForm.newPassword);

    if (res.success) {
      showToast('Super Admin root password updated successfully.', 'success');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      setPasswordError(res.error || 'Failed to update password.');
    }
    setIsUpdatingPassword(false);
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="pb-4 border-b border-[#1E293B]">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#38BDF8]">
          <ShieldCheck className="w-4 h-4" />
          <span>Root Authorization</span>
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl uppercase font-black text-[#F1F5F9] tracking-tight mt-1">
          Super Admin Profile & Access Keys
        </h1>
        <p className="text-xs text-[#94A3B8] mt-1 font-body">
          Manage developer credentials, session security tokens, and root system access privileges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-[#F1F5F9] pb-3 border-b border-[#1E293B]">
            <User className="w-4 h-4 text-[#38BDF8]" />
            <span>Developer Account Details</span>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Developer Email</label>
              <input
                type="email"
                required
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Role Privileges</label>
              <div className="p-2.5 bg-[#0F172A] border border-[#1E293B] text-xs text-[#38BDF8] font-bold">
                SUPER_ADMIN (Root System Privilege)
              </div>
            </div>

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="px-4 py-2 bg-[#38BDF8] hover:bg-[#0EA5E9] text-xs uppercase font-bold text-[#0A0E17] flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isUpdatingProfile ? 'Saving...' : 'Update Details'}</span>
            </button>
          </form>
        </div>

        {/* Password Card */}
        <div className="p-6 bg-[#0A0E17] border border-[#1E293B] space-y-4">
          <div className="flex items-center gap-2 text-xs uppercase font-bold text-[#F1F5F9] pb-3 border-b border-[#1E293B]">
            <Lock className="w-4 h-4 text-[#38BDF8]" />
            <span>Change Root Developer Password</span>
          </div>

          {passwordError && (
            <div className="p-3 bg-[#F43F5E]/10 border border-[#F43F5E]/40 text-xs text-[#F1F5F9] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-[#F43F5E] shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Current Password</label>
              <input
                type="password"
                required
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="••••••••••••"
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">New Root Password</label>
              <input
                type="password"
                required
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Min 8 characters"
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-[#94A3B8] mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm password"
                className="w-full bg-[#0F172A] border border-[#1E293B] focus:border-[#38BDF8] px-3 py-2 text-xs text-[#F1F5F9] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] border border-[#38BDF8]/40 text-xs uppercase font-bold text-[#F1F5F9] flex items-center gap-1.5 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{isUpdatingPassword ? 'Updating...' : 'Update Password'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
