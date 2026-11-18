import React, { useState } from 'react';
import { CheckCircle2, Upload, ArrowLeft, ArrowRight, Save, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ALL_AMENITIES, BHOPAL_LOCALITIES, formatINR, HERO_IMAGE } from '../data/bhopalData';
import { FurnishingStatus, PropertyType, TenantPreference } from '../types';

const STEPS = [
  'Property Type',
  'Location',
  'Property Details',
  'Rent Details',
  'Furnishing & Amenities',
  'Tenant Preferences',
  'Photos',
  'Owner Info',
  'Preview',
  'Submitted',
];

export const ListPropertyWizard: React.FC = () => {
  const { currentUser, addProperty, navigate, showToast } = useApp();
  const [step, setStep] = useState(1);

  const [type, setType] = useState<PropertyType>('Apartment');
  const [title, setTitle] = useState('');
  const [locality, setLocality] = useState('Arera Colony');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('462016');
  const [bhk, setBhk] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [areaSqFt, setAreaSqFt] = useState(1150);
  const [floor, setFloor] = useState(2);
  const [totalFloors, setTotalFloors] = useState(5);
  const [propertyAge, setPropertyAge] = useState('1-2 years');
  const [rent, setRent] = useState(16000);
  const [deposit, setDeposit] = useState(32000);
  const [maintenance, setMaintenance] = useState(1200);
  const [negotiable, setNegotiable] = useState(true);
  const [furnishing, setFurnishing] = useState<FurnishingStatus>('Semi Furnished');
  const [amenities, setAmenities] = useState<string[]>(['Lift', 'Parking', 'Security', 'Water supply']);
  const [preferredTenants, setPreferredTenants] = useState<TenantPreference[]>(['Family']);
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([HERO_IMAGE]);
  const [ownerName, setOwnerName] = useState(currentUser?.fullName || 'Rajesh Sharma');
  const [ownerPhone, setOwnerPhone] = useState(currentUser?.phone || '+91 98260 11223');
  const [ownerEmail, setOwnerEmail] = useState(currentUser?.email || 'owner@bhopalnest.in');
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const toggleAmenity = (am: string) => {
    setAmenities((prev) => (prev.includes(am) ? prev.filter((a) => a !== am) : [...prev, am]));
  };

  const toggleTenantPref = (pref: TenantPreference) => {
    setPreferredTenants((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveDraft = () => {
    localStorage.setItem(
      'bhopalnest_property_draft',
      JSON.stringify({ type, title, locality, address, rent, deposit, bhk })
    );
    showToast('Draft saved locally!');
  };

  const handleSubmit = async () => {
    const finalTitle =
      title.trim() || `${bhk > 0 ? `${bhk} BHK ` : ''}${type} in ${locality}, Bhopal`;
    const created = await addProperty({
      title: finalTitle,
      type,
      locality,
      city: 'Bhopal',
      address: address.trim() || `${locality}, Bhopal, Madhya Pradesh`,
      pincode,
      rent,
      deposit,
      maintenance,
      negotiable,
      bhk: type === 'Commercial' ? 0 : bhk,
      bathrooms,
      areaSqFt,
      floor,
      totalFloors,
      propertyAge,
      furnishing,
      preferredTenants: preferredTenants.length > 0 ? preferredTenants : ['Anyone'],
      parking: amenities.includes('Parking') ? 'Car & Bike' : 'None',
      petFriendly: false,
      availableFrom: 'Immediate',
      amenities,
      description:
        description.trim() ||
        `Well-maintained ${type.toLowerCase()} located in ${locality}, Bhopal with ${furnishing.toLowerCase()} interiors and essential amenities.`,
      images: images.length > 0 ? images : [HERO_IMAGE],
      verified: false,
      listedBy: currentUser?.role === 'partner' ? 'Partner' : 'Owner',
      ownerId: currentUser?.uid || 'demo-owner-1',
      ownerName,
      ownerPhone,
      ownerEmail,
      status: 'Pending Verification',
    });
    setSubmittedId(created.id);
    setStep(10);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202822] tracking-tight">
            List Your Property in Bhopal
          </h1>
          <p className="text-sm text-[#747B75] mt-1">
            Step {step} of {STEPS.length} — {STEPS[step - 1]}
          </p>
        </div>
        {step < 10 && (
          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E6EAE6] rounded-lg text-xs font-semibold text-[#525B54] hover:border-[#163D32] cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> Save Draft
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-[#E6EAE6] rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-[#163D32] transition-all duration-300"
          style={{ width: `${(step / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6 sm:p-8">
        {/* Step 1: Property Type */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#202822]">Select Property Type</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(['Apartment', 'Independent House', 'Villa', 'PG & Hostel', 'Studio', 'Commercial'] as PropertyType[]).map(
                (t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`p-4 rounded-xl border text-left text-sm font-semibold transition-colors cursor-pointer ${
                      type === t
                        ? 'border-[#163D32] bg-[#163D32] text-white'
                        : 'border-[#E6EAE6] bg-[#F7F8F6] text-[#202822] hover:border-[#163D32]'
                    }`}
                  >
                    {t}
                  </button>
                )
              )}
            </div>
            <div className="pt-2">
              <label className="block text-xs font-semibold text-[#525B54] mb-1">Listing Headline</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`e.g. Spacious ${bhk} BHK ${type} in ${locality}`}
                className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
              />
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#202822]">Property Location (Bhopal, MP)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">City</label>
                <input
                  type="text"
                  disabled
                  value="Bhopal, Madhya Pradesh"
                  className="w-full px-3.5 py-2.5 bg-[#F7F8F6] border border-[#E6EAE6] rounded-xl text-sm text-[#747B75]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Locality</label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
                >
                  {BHOPAL_LOCALITIES.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#525B54] mb-1">Full Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="House/Flat No., Building Name, Landmark"
                className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
              />
            </div>
            <div className="w-40">
              <label className="block text-xs font-semibold text-[#525B54] mb-1">Pincode</label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm tabular-nums"
              />
            </div>
          </div>
        )}

        {/* Step 3: Property Details */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#202822]">Property Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">BHK</label>
                <input
                  type="number"
                  min={0}
                  max={6}
                  value={bhk}
                  onChange={(e) => setBhk(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Bathrooms</label>
                <input
                  type="number"
                  min={1}
                  max={6}
                  value={bathrooms}
                  onChange={(e) => setBathrooms(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Area (sq. ft.)</label>
                <input
                  type="number"
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Floor No.</label>
                <input
                  type="number"
                  min={0}
                  value={floor}
                  onChange={(e) => setFloor(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Total Floors</label>
                <input
                  type="number"
                  min={1}
                  value={totalFloors}
                  onChange={(e) => setTotalFloors(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Property Age</label>
                <select
                  value={propertyAge}
                  onChange={(e) => setPropertyAge(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
                >
                  <option>New (&lt; 1 year)</option>
                  <option>1-2 years</option>
                  <option>2-4 years</option>
                  <option>5+ years</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Rent Details */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#202822]">Rent & Deposit Details (INR)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Monthly Rent (₹)</label>
                <input
                  type="number"
                  value={rent}
                  onChange={(e) => setRent(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm tabular-nums"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Maintenance (₹/mo)</label>
                <input
                  type="number"
                  value={maintenance}
                  onChange={(e) => setMaintenance(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm tabular-nums"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-[#202822] pt-2 cursor-pointer">
              <input
                type="checkbox"
                checked={negotiable}
                onChange={(e) => setNegotiable(e.target.checked)}
                className="accent-[#163D32]"
              />
              <span>Rent is negotiable</span>
            </label>
          </div>
        )}

        {/* Step 5: Furnishing & Amenities */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-[#202822] mb-3">Furnishing Status</h2>
              <div className="grid grid-cols-3 gap-3">
                {(['Fully Furnished', 'Semi Furnished', 'Unfurnished'] as FurnishingStatus[]).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFurnishing(f)}
                    className={`py-3 px-3 rounded-xl border text-xs sm:text-sm font-semibold cursor-pointer ${
                      furnishing === f
                        ? 'bg-[#163D32] text-white border-[#163D32]'
                        : 'bg-[#F7F8F6] text-[#202822] border-[#E6EAE6]'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#202822] mb-3">Select Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {ALL_AMENITIES.map((am) => (
                  <label key={am} className="flex items-center gap-2 text-sm text-[#202822] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={amenities.includes(am)}
                      onChange={() => toggleAmenity(am)}
                      className="accent-[#163D32]"
                    />
                    <span>{am}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Tenant Preferences */}
        {step === 6 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#202822]">Preferred Tenants & Description</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {(
                ['Family', 'Bachelor', 'Working Professionals', 'Students', 'Male', 'Female', 'Anyone'] as TenantPreference[]
              ).map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => toggleTenantPref(pref)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                    preferredTenants.includes(pref)
                      ? 'bg-[#163D32] text-white border-[#163D32]'
                      : 'bg-[#F7F8F6] text-[#202822] border-[#E6EAE6]'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#525B54] mb-1">Property Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Highlight nearby landmarks in Bhopal, sunlight, ventilation, water supply..."
                className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
              />
            </div>
          </div>
        )}

        {/* Step 7: Photos */}
        {step === 7 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#202822]">Upload Property Photos</h2>
            <label className="border-2 border-dashed border-[#CFD6CF] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#163D32] bg-[#F7F8F6]">
              <Upload className="w-7 h-7 text-[#163D32] mb-2" />
              <span className="text-sm font-semibold text-[#202822]">Click to upload property photos</span>
              <span className="text-xs text-[#747B75] mt-1">JPG or PNG, first photo is used as cover image</span>
              <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-[#E6EAE6]">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute top-2 left-2 bg-[#163D32] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 8: Owner Information */}
        {step === 8 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#202822]">Owner Contact Information</h2>
            <div>
              <label className="block text-xs font-semibold text-[#525B54] mb-1">Owner Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Mobile Number (+91)</label>
                <input
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#525B54] mb-1">Email</label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#E6EAE6] rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 9: Preview */}
        {step === 9 && (
          <div className="space-y-5">
            <h2 className="text-lg font-bold text-[#202822]">Preview Your Listing</h2>
            <div className="bg-[#F7F8F6] rounded-xl p-5 space-y-3 text-sm">
              <div className="text-lg font-bold text-[#163D32]">
                {title || `${bhk > 0 ? `${bhk} BHK ` : ''}${type} in ${locality}, Bhopal`}
              </div>
              <div className="text-[#525B54]">{address || `${locality}, Bhopal`} — {pincode}</div>
              <div className="flex flex-wrap gap-4 pt-2 border-t border-[#E6EAE6] tabular-nums">
                <span><strong>Rent:</strong> {formatINR(rent)}/mo</span>
                <span><strong>Deposit:</strong> {formatINR(deposit)}</span>
                <span><strong>Area:</strong> {areaSqFt} sq. ft.</span>
                <span><strong>Furnishing:</strong> {furnishing}</span>
              </div>
              <div className="text-xs text-[#747B75]">
                Owner: {ownerName} · {ownerPhone}
              </div>
            </div>
          </div>
        )}

        {/* Step 10: Success */}
        {step === 10 && (
          <div className="text-center py-8 space-y-4">
            <CheckCircle2 className="w-14 h-14 text-[#2E8B57] mx-auto" />
            <h2 className="text-2xl font-extrabold text-[#202822]">Property Submitted Successfully</h2>
            <p className="text-sm text-[#747B75] max-w-md mx-auto">
              Listing <strong>{submittedId}</strong> is now in <strong>Pending Verification</strong>. Our Bhopal verification team will review and publish it shortly.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => navigate('owner-dashboard')}
                className="px-6 py-3 bg-[#163D32] text-white text-sm font-semibold rounded-xl hover:bg-[#1E4F41] cursor-pointer"
              >
                Go to Owner Dashboard
              </button>
              <button
                onClick={() => navigate('search')}
                className="px-6 py-3 bg-[#F7F8F6] text-[#202822] text-sm font-semibold rounded-xl cursor-pointer"
              >
                Browse Listings
              </button>
            </div>
          </div>
        )}

        {/* Navigation Footer */}
        {step < 10 && (
          <div className="mt-8 pt-6 border-t border-[#E6EAE6] flex items-center justify-between">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-[#525B54] disabled:opacity-40 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            {step < 9 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#163D32] text-white text-sm font-semibold rounded-xl hover:bg-[#1E4F41] cursor-pointer"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-[#2E8B57] text-white text-sm font-semibold rounded-xl hover:bg-[#257347] cursor-pointer"
              >
                Submit Property for Verification
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
