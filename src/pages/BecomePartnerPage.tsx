import React, { useState } from 'react';
import { CheckCircle2, Users, TrendingUp, ShieldCheck, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BHOPAL_LOCALITIES } from '../data/bhopalData';
import { PartnerType } from '../types';

const PARTNER_TYPES: PartnerType[] = [
  'Real Estate Broker',
  'Property Consultant',
  'Rental Agent',
  'Local Property Connector',
  'Builder & Developer',
  'Property Management Partner',
];

export const BecomePartnerPage: React.FC = () => {
  const { currentUser, submitPartnerApplication, navigate, showToast } = useApp();
  const [submitted, setSubmitted] = useState(false);

  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [partnerType, setPartnerType] = useState<PartnerType>('Real Estate Broker');
  const [operatingAreas, setOperatingAreas] = useState<string[]>(['Arera Colony', 'MP Nagar']);
  const [yearsExperience, setYearsExperience] = useState(3);
  const [agencyName, setAgencyName] = useState('');
  const [reraNumber, setReraNumber] = useState('');
  const [about, setAbout] = useState('');
  const [referralSource, setReferralSource] = useState('Google Search');
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [terms, setTerms] = useState(true);

  const toggleArea = (area: string) => {
    setOperatingAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!terms) {
      showToast('Please accept the partner program terms', 'error');
      return;
    }
    await submitPartnerApplication({
      userId: currentUser?.uid || 'guest-partner-' + Date.now(),
      fullName,
      phone: '+91 ' + phone,
      email,
      city: 'Bhopal',
      operatingAreas,
      partnerType,
      yearsExperience,
      agencyName,
      reraNumber,
      panProvided: false,
      about,
      referralSource,
    });
    setSubmitted(true);
  };

  const benefits = [
    { icon: Users, title: 'Verified Bhopal Rental Leads', desc: 'Receive qualified tenant inquiries in your operating localities.' },
    { icon: Briefcase, title: 'Dedicated Partner Dashboard', desc: 'Track leads, schedule visits, and manage follow-ups in one place.' },
    { icon: TrendingUp, title: 'Transparent Commission Tracking', desc: 'Monitor pending and paid commissions across every closed rental.' },
    { icon: ShieldCheck, title: 'RERA & Brand Credibility', desc: 'Stand out as a verified BhopalNest partner with local marketing support.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="bg-[#163D32] text-white rounded-2xl p-8 sm:p-14 mb-12">
        <p className="text-xs font-semibold text-[#F4B740] mb-3">BhopalNest Partner Network</p>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight max-w-2xl leading-tight">
          Grow with us. Earn with every connection.
        </h1>
        <p className="text-base text-white/80 mt-4 max-w-2xl leading-relaxed">
          Join our rental network and help people find the right property across Bhopal while building your own business.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {benefits.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.title} className="bg-white border border-[#E6EAE6] rounded-xl p-6">
              <div className="w-10 h-10 rounded-lg bg-[#F7F8F6] text-[#163D32] flex items-center justify-center mb-4">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#202822]">{b.title}</h3>
              <p className="text-xs text-[#747B75] mt-2 leading-relaxed">{b.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Registration Form */}
      <div className="max-w-3xl mx-auto bg-white border border-[#E6EAE6] rounded-2xl p-6 sm:p-10">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <CheckCircle2 className="w-14 h-14 text-[#2E8B57] mx-auto" />
            <h2 className="text-2xl font-extrabold text-[#202822]">
              Your partner application has been submitted successfully.
            </h2>
            <p className="text-sm text-[#747B75]">
              Application Status: <strong className="text-[#163D32]">Pending Review</strong>. Our onboarding team will verify your details and assign your Partner ID.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => navigate('partner-dashboard')}
                className="px-6 py-3 bg-[#163D32] text-white text-sm font-semibold rounded-xl cursor-pointer"
              >
                Preview Partner Dashboard
              </button>
              <button
                onClick={() => navigate('home')}
                className="px-6 py-3 bg-[#F7F8F6] text-[#202822] text-sm font-semibold rounded-xl cursor-pointer"
              >
                Return Home
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-[#202822]">Partner Registration</h2>
              <p className="text-sm text-[#747B75] mt-1">
                Complete the form below to join the BhopalNest Rental Partner Program.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Mobile Number (+91) *</label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-[#F7F8F6] border border-r-0 border-[#E6EAE6] rounded-l-xl text-sm font-semibold">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-r-xl text-sm tabular-nums"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Partner Type *</label>
                <select
                  value={partnerType}
                  onChange={(e) => setPartnerType(e.target.value as PartnerType)}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
                >
                  {PARTNER_TYPES.map((pt) => (
                    <option key={pt} value={pt}>
                      {pt}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Agency Name (Optional)</label>
                <input
                  type="text"
                  value={agencyName}
                  onChange={(e) => setAgencyName(e.target.value)}
                  placeholder="e.g. LakeCity Homes"
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">MP RERA Number (Optional)</label>
                <input
                  type="text"
                  value={reraNumber}
                  onChange={(e) => setReraNumber(e.target.value)}
                  placeholder="e.g. MP-RERA-A-2024-..."
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Years of Experience</label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">How did you hear about us?</label>
                <select
                  value={referralSource}
                  onChange={(e) => setReferralSource(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
                >
                  <option>Google Search</option>
                  <option>WhatsApp / Referral</option>
                  <option>Local Bhopal Network</option>
                  <option>Social Media</option>
                </select>
              </div>
            </div>

            {/* Operating Areas */}
            <div>
              <label className="block text-xs font-semibold text-[#525B54] mb-2">
                Preferred Operating Areas in Bhopal
              </label>
              <div className="flex flex-wrap gap-2">
                {BHOPAL_LOCALITIES.slice(0, 10).map((loc) => (
                  <button
                    type="button"
                    key={loc}
                    onClick={() => toggleArea(loc)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                      operatingAreas.includes(loc)
                        ? 'bg-[#163D32] text-white border-[#163D32]'
                        : 'bg-[#F7F8F6] text-[#525B54] border-[#E6EAE6]'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#525B54] mb-1">About Yourself / Experience</label>
              <textarea
                rows={3}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Tell us about the types of rental properties you specialize in across Bhopal..."
                className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
              />
            </div>

            {/* Quick OTP Verification */}
            <div className="bg-[#F7F8F6] p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-xs text-[#525B54]">
                <strong>Mobile OTP Verification:</strong>{' '}
                {otpVerified ? 'Verified (+91 ' + phone + ')' : 'Verify your mobile number before submitting.'}
              </div>
              {!otpVerified && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="OTP (123456)"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-28 px-2.5 py-1.5 bg-white border border-[#E6EAE6] rounded-lg text-xs tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setOtpVerified(true);
                      showToast('Mobile number verified!');
                    }}
                    className="px-3 py-1.5 bg-[#163D32] text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Verify
                  </button>
                </div>
              )}
            </div>

            <label className="flex items-start gap-2 text-xs text-[#747B75] cursor-pointer">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="mt-0.5 accent-[#163D32]"
              />
              <span>
                I agree to BhopalNest&apos;s Partner Program Terms. PAN & payout details will be collected securely only after approval.
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#163D32] hover:bg-[#1E4F41] text-white font-bold text-sm rounded-xl cursor-pointer"
            >
              Submit Partner Application
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
