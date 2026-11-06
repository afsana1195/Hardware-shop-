import React, { useState } from 'react';
import { X, User, Phone, Mail, CheckCircle2, Building, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLogin: (user: UserProfile) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
}) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'contractor' | 'builder' | 'homeowner' | 'engineer'>('contractor');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: UserProfile = {
      name: name.trim() || 'Contractor Partner',
      phone: phone.trim(),
      email: `${phone.trim()}@contractor.jyotihardware.com`,
      role,
      companyName: companyName.trim() || undefined,
      gstNumber: gstNumber.trim() || undefined,
    };
    onLogin(newUser);
    onClose();
  };

  const handleDemoLogin = (demoRole: 'contractor' | 'builder') => {
    const demoUser: UserProfile = {
      name: demoRole === 'contractor' ? 'Venkatesh Rao' : 'Pragathi Builders',
      phone: '9845012345',
      email: 'venkatesh.rao@pragathibuild.com',
      role: demoRole,
      companyName: 'Pragathi Constructions Pvt Ltd',
      gstNumber: '29ABCDE1234F1Z5',
    };
    onLogin(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="bg-[#0c432d] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-amber-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                {currentUser ? 'Your Account' : 'Contractor & Customer Login'}
              </h3>
              <p className="text-emerald-100 text-xs">Jyoti Hardware &amp; Construction</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentUser ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="text-sm font-bold text-stone-900">{currentUser.name}</div>
                  <div className="text-xs text-stone-500">
                    {currentUser.role.toUpperCase()} {currentUser.companyName && `• ${currentUser.companyName}`}
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-600 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div className="flex justify-between">
                  <span className="text-stone-400">Phone:</span>
                  <span className="font-semibold text-stone-800">{currentUser.phone}</span>
                </div>
                {currentUser.companyName && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">Company:</span>
                    <span className="font-semibold text-stone-800">{currentUser.companyName}</span>
                  </div>
                )}
                {currentUser.gstNumber && (
                  <div className="flex justify-between">
                    <span className="text-stone-400">GSTIN:</span>
                    <span className="font-mono font-semibold text-stone-800">{currentUser.gstNumber}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={onLogout}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Sign Out
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-[#0c432d] hover:bg-[#083020] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : !otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                Log in to view past site deliveries, wholesale rates, and fast checkout.
              </p>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Phone Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9845012345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-12 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:bg-white focus:outline-none focus:border-[#0c432d]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Your Name / Business Name</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Patel / Patel Builders"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium text-stone-900 focus:bg-white focus:outline-none focus:border-[#0c432d]"
                />
              </div>

              <button
                type="submit"
                disabled={phone.length < 10}
                className="w-full py-3 bg-[#0c432d] hover:bg-[#083020] disabled:bg-stone-300 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
              >
                Send Verification OTP
              </button>

              <div className="relative py-2 text-center">
                <span className="px-3 bg-white text-[11px] font-bold text-stone-400 uppercase tracking-wider relative z-10">
                  Quick 1-Click Demo
                </span>
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoLogin('contractor')}
                  className="py-2 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Building className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Contractor Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoLogin('builder')}
                  className="py-2 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Builder Demo</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs">
                <span className="text-stone-500">OTP sent to: </span>
                <strong className="text-stone-900">+91 {phone}</strong>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-xs text-[#0c432d] hover:underline font-bold ml-2"
                >
                  Change
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Enter 6-digit OTP (Use: 123456)
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-center text-base font-black tracking-widest text-stone-900 focus:bg-white focus:outline-none focus:border-[#0c432d]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0c432d] hover:bg-[#083020] text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
              >
                Verify &amp; Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
