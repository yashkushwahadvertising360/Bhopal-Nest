import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ShieldCheck, Smartphone, Mail } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HERO_IMAGE } from '../data/bhopalData';
import { UserRole } from '../types';

export const AuthPage: React.FC = () => {
  const { loginWithGoogle, loginDemoRole, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loginMethod, setLoginMethod] = useState<'otp' | 'email'>('otp');

  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [role, setRole] = useState<UserRole>('tenant');
  const [acceptedTerms, setAcceptedTerms] = useState(true);

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSendOtp = () => {
    if (phone.replace(/\D/g, '').length < 10) {
      showToast('Please enter a valid 10-digit Indian mobile number', 'error');
      return;
    }
    setOtpSent(true);
    setCountdown(30);
    showToast('6-digit OTP sent to +91 ' + phone + ' (Demo OTP: 123456)', 'info');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      showToast('Please accept the Terms & Privacy Policy', 'error');
      return;
    }
    if (mode === 'login' && loginMethod === 'otp') {
      if (!otpSent) {
        handleSendOtp();
        return;
      }
      if (otpValue.length !== 6) {
        showToast('Please enter the 6-digit OTP', 'error');
        return;
      }
    }
    loginDemoRole(role, {
      fullName: fullName || (role === 'owner' ? 'Rajesh Sharma' : role === 'partner' ? 'Vikram Patel' : 'Aarav Tiwari'),
      email: email || `${role}@bhopalnest.in`,
      phone: phone ? `+91 ${phone}` : '+91 98261 44556',
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid grid-cols-1 lg:grid-cols-2">
      {/* Left Split Imagery */}
      <div className="hidden lg:block relative bg-[#163D32]">
        <img
          src={HERO_IMAGE}
          alt="Bhopal residential home"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#163D32] via-[#163D32]/50 to-transparent flex flex-col justify-end p-12 text-white">
          <div className="text-3xl font-extrabold leading-tight max-w-md">
            Verified homes, direct owners, and trusted Bhopal partners.
          </div>
          <p className="text-sm text-white/80 mt-3 max-w-md">
            Sign in to save properties, schedule visits, list your property, or manage your rental partner leads.
          </p>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-[#F7F8F6]">
        <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6 sm:p-8 max-w-md w-full">
          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#F7F8F6] rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                mode === 'login' ? 'bg-white text-[#163D32] shadow-sm' : 'text-[#747B75]'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              className={`py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                mode === 'signup' ? 'bg-white text-[#163D32] shadow-sm' : 'text-[#747B75]'
              }`}
            >
              Sign Up
            </button>
          </div>

          <h1 className="text-2xl font-extrabold text-[#202822]">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-xs text-[#747B75] mt-1 mb-6">
            {mode === 'login'
              ? 'Sign in with Google, +91 Mobile OTP, or Email.'
              : 'Join BhopalNest as a tenant, property owner, or rental partner.'}
          </p>

          {/* Google Sign-In (Real Firebase Auth) */}
          <button
            type="button"
            onClick={() => loginWithGoogle(role)}
            className="w-full py-2.5 px-4 bg-white border border-[#E6EAE6] hover:border-[#163D32] text-[#202822] text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer mb-5"
          >
            <ShieldCheck className="w-4 h-4 text-[#2E8B57]" />
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center my-5">
            <div className="border-t border-[#E6EAE6] w-full" />
            <span className="bg-white px-3 text-xs text-[#747B75] whitespace-nowrap">or continue with</span>
            <div className="border-t border-[#E6EAE6] w-full" />
          </div>

          {mode === 'login' && (
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setLoginMethod('otp')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginMethod === 'otp'
                    ? 'border-[#163D32] bg-[#163D32]/5 text-[#163D32]'
                    : 'border-[#E6EAE6] text-[#747B75]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" /> +91 Mobile OTP
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('email')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg border flex items-center justify-center gap-1.5 cursor-pointer ${
                  loginMethod === 'email'
                    ? 'border-[#163D32] bg-[#163D32]/5 text-[#163D32]'
                    : 'border-[#E6EAE6] text-[#747B75]'
                }`}
              >
                <Mail className="w-3.5 h-3.5" /> Email & Password
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#525B54] mb-1.5">Account Type</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full px-3 py-2.5 bg-[#F7F8F6] border border-[#E6EAE6] rounded-xl text-sm font-medium text-[#202822]"
              >
                <option value="tenant">Looking for a Property (Tenant)</option>
                <option value="owner">Property Owner</option>
                <option value="partner">Broker / Agent / Rental Partner</option>
              </select>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Tiwari"
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
                />
              </div>
            )}

            {(mode === 'signup' || loginMethod === 'otp') && (
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Mobile Number</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-[#F7F8F6] border border-r-0 border-[#E6EAE6] rounded-l-xl text-sm font-semibold text-[#525B54]">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="98260 12345"
                    className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-r-xl text-sm tabular-nums"
                  />
                </div>
              </div>
            )}

            {mode === 'login' && loginMethod === 'otp' && otpSent && (
              <div className="bg-[#F7F8F6] p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#202822]">Enter 6-digit OTP</span>
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="text-[#2E8B57] font-semibold cursor-pointer"
                  >
                    Change number
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full px-3.5 py-2 bg-white border border-[#E6EAE6] rounded-lg text-center tracking-[0.4em] font-bold text-base tabular-nums"
                />
                <div className="flex justify-between text-xs text-[#747B75]">
                  <span>{countdown > 0 ? `Resend in ${countdown}s` : 'Did not receive OTP?'}</span>
                  {countdown === 0 && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-[#163D32] font-semibold cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
            )}

            {(mode === 'signup' || loginMethod === 'email') && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-[#525B54] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#525B54] mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPwd ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-2.5 text-[#747B75]"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            <label className="flex items-start gap-2 text-xs text-[#747B75] cursor-pointer">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="mt-0.5 accent-[#163D32]"
              />
              <span>I agree to BhopalNest&apos;s Terms of Service and Privacy Policy.</span>
            </label>

            <button
              type="submit"
              className="w-full py-3 bg-[#163D32] hover:bg-[#1E4F41] text-white font-semibold text-sm rounded-xl transition-colors cursor-pointer"
            >
              {mode === 'login' && loginMethod === 'otp' && !otpSent
                ? 'Send 6-Digit OTP'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
            </button>
          </form>

          {/* Quick Role Switcher for Testing All Dashboards */}
          <div className="mt-6 pt-5 border-t border-[#E6EAE6]">
            <div className="text-xs font-semibold text-[#747B75] mb-2.5">
              Quick Demo Access (Explore Dashboards)
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['tenant', 'owner', 'partner', 'admin'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => loginDemoRole(r)}
                  className="py-2 px-3 bg-[#F7F8F6] hover:bg-[#163D32] hover:text-white text-[#202822] text-xs font-semibold rounded-lg transition-colors capitalize cursor-pointer"
                >
                  {r} Demo
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
