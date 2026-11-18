import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Phone,
  Calendar,
  Check,
  X,
  Images,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildWhatsAppUrl, formatINR } from '../data/bhopalData';

export const PropertyDetailPage: React.FC = () => {
  const {
    selectedPropertyId,
    properties,
    navigate,
    favorites,
    toggleFavorite,
    createInquiry,
    scheduleVisit,
    showToast,
  } = useApp();

  const property = properties.find((p) => p.id === selectedPropertyId) || properties[0];
  const isFav = favorites.includes(property.id);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [visitModalOpen, setVisitModalOpen] = useState(false);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

  const [visitDate, setVisitDate] = useState('2026-11-22');
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [visitNotes, setVisitNotes] = useState('');
  const [inquiryMsg, setInquiryMsg] = useState(
    `Hi, I am interested in "${property.title}" in ${property.locality}, Bhopal. Please share availability and visit timings.`
  );

  const handleScheduleVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    await scheduleVisit(property, visitDate, visitTime, visitNotes);
    setVisitModalOpen(false);
    setVisitNotes('');
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    await createInquiry(property, inquiryMsg);
    setInquiryModalOpen(false);
  };

  const specs = [
    { label: 'Property Type', value: property.type },
    { label: 'Configuration', value: property.bhk > 0 ? `${property.bhk} BHK` : 'Commercial' },
    { label: 'Bathrooms', value: `${property.bathrooms}` },
    { label: 'Carpet Area', value: `${property.areaSqFt.toLocaleString('en-IN')} sq. ft.` },
    { label: 'Floor', value: `${property.floor === 0 ? 'Ground' : property.floor} of ${property.totalFloors}` },
    { label: 'Furnishing', value: property.furnishing },
    { label: 'Parking', value: property.parking },
    { label: 'Available From', value: property.availableFrom },
    { label: 'Preferred Tenants', value: property.preferredTenants.join(', ') },
    { label: 'Property Age', value: property.propertyAge },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-12">
      {/* Back Nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('search')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#525B54] hover:text-[#163D32] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Bhopal listings
        </button>

        <button
          onClick={() => toggleFavorite(property.id)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E6EAE6] rounded-lg text-sm font-semibold text-[#202822] hover:border-[#163D32] cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
          <span>{isFav ? 'Saved' : 'Save'}</span>
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 rounded-2xl overflow-hidden relative">
        <div
          onClick={() => {
            setActiveImageIdx(0);
            setGalleryOpen(true);
          }}
          className="md:col-span-2 aspect-[16/10] bg-[#EAEFEA] cursor-pointer overflow-hidden"
        >
          <img
            src={property.images[0]}
            alt={property.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
        <div className="hidden md:grid grid-rows-2 gap-3">
          {[1, 2].map((idx) => (
            <div
              key={idx}
              onClick={() => {
                setActiveImageIdx(property.images[idx] ? idx : 0);
                setGalleryOpen(true);
              }}
              className="bg-[#EAEFEA] cursor-pointer overflow-hidden"
            >
              <img
                src={property.images[idx] || property.images[0]}
                alt={`${property.title} view ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-[1.02] transition-transform duration-300"
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => setGalleryOpen(true)}
          className="absolute bottom-4 right-4 inline-flex items-center gap-2 px-4 py-2 bg-white/95 text-[#202822] text-xs font-bold rounded-lg shadow-md hover:bg-white cursor-pointer"
        >
          <Images className="w-4 h-4" /> View all photos ({property.images.length})
        </button>
      </div>

      {/* Details + Sticky Contact Panel */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Header */}
          <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#747B75] mb-2">
              <span className="text-[#163D32] font-bold">ID: {property.id}</span>
              <span>·</span>
              <span>Listed by {property.listedBy}</span>
              {property.verified && (
                <>
                  <span>·</span>
                  <span className="inline-flex items-center gap-1 text-[#2E8B57] font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" /> Verified Listing
                  </span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#202822] tracking-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-[#525B54] mt-2">
              <MapPin className="w-4 h-4 text-[#2E8B57] shrink-0" />
              <span>{property.address} — {property.pincode}</span>
            </div>

            {/* Pricing Strip */}
            <div className="mt-6 pt-6 border-t border-[#E6EAE6] grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <div className="text-xs text-[#747B75] font-medium">Monthly Rent</div>
                <div className="text-2xl font-extrabold text-[#163D32] tabular-nums mt-0.5">
                  {formatINR(property.rent)}
                  <span className="text-xs font-medium text-[#747B75]"> / month</span>
                </div>
                {property.negotiable && (
                  <div className="text-xs text-[#2E8B57] font-medium mt-0.5">Negotiable</div>
                )}
              </div>
              <div>
                <div className="text-xs text-[#747B75] font-medium">Security Deposit</div>
                <div className="text-xl font-bold text-[#202822] tabular-nums mt-0.5">
                  {formatINR(property.deposit)}
                </div>
              </div>
              <div>
                <div className="text-xs text-[#747B75] font-medium">Maintenance</div>
                <div className="text-xl font-bold text-[#202822] tabular-nums mt-0.5">
                  {property.maintenance > 0 ? `${formatINR(property.maintenance)} / mo` : 'Included'}
                </div>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[#202822] mb-5">Property Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-6">
              {specs.map((s) => (
                <div key={s.label}>
                  <div className="text-xs text-[#747B75]">{s.label}</div>
                  <div className="text-sm font-semibold text-[#202822] mt-0.5">{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[#202822] mb-3">About this property</h2>
            <p className="text-sm text-[#525B54] leading-relaxed">{property.description}</p>
          </div>

          {/* Amenities */}
          <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[#202822] mb-5">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities.map((am) => (
                <div key={am} className="flex items-center gap-2 text-sm text-[#202822]">
                  <Check className="w-4 h-4 text-[#2E8B57] shrink-0" />
                  <span>{am}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Locality & Map Overview */}
          <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[#202822] mb-2">Neighborhood — {property.locality}, Bhopal</h2>
            <p className="text-sm text-[#747B75] mb-5">
              Well-connected residential neighbourhood in Bhopal with easy access to schools, hospitals, BRTS corridor, and daily conveniences.
            </p>
            <div className="bg-[#F7F8F6] border border-[#E6EAE6] rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-sm font-bold text-[#163D32]">{property.address}</div>
                <div className="text-xs text-[#747B75] mt-1">Bhopal, Madhya Pradesh {property.pincode}</div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${property.locality}, Bhopal, Madhya Pradesh`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-white border border-[#E6EAE6] rounded-lg text-xs font-semibold text-[#163D32] hover:border-[#163D32] whitespace-nowrap"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Sticky Contact Panel */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6 sticky top-24 space-y-5">
            <div>
              <div className="text-xs font-semibold text-[#747B75]">Listed by {property.listedBy}</div>
              <div className="text-lg font-bold text-[#202822] mt-0.5">{property.ownerName}</div>
            </div>

            <div className="space-y-2.5">
              <a
                href={buildWhatsAppUrl(property)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-[#2E8B57] hover:bg-[#257347] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Inquiry
              </a>

              <button
                onClick={() => setVisitModalOpen(true)}
                className="w-full py-3 px-4 bg-[#163D32] hover:bg-[#1E4F41] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Calendar className="w-4 h-4" /> Schedule a Visit
              </button>

              <button
                onClick={() => setInquiryModalOpen(true)}
                className="w-full py-3 px-4 bg-[#F7F8F6] hover:bg-[#EAEFEA] text-[#202822] font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Phone className="w-4 h-4" /> Contact Owner / Callback
              </button>
            </div>

            <div className="pt-4 border-t border-[#E6EAE6] text-xs text-[#747B75] leading-relaxed">
              Tip: Always inspect the property in person before paying any token or security deposit.
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#E6EAE6] px-4 py-3 flex items-center gap-3">
        <a
          href={buildWhatsAppUrl(property)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2.5 bg-[#2E8B57] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5"
        >
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </a>
        <button
          onClick={() => setVisitModalOpen(true)}
          className="flex-1 py-2.5 bg-[#163D32] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5"
        >
          <Calendar className="w-4 h-4" /> Schedule Visit
        </button>
      </div>

      {/* Full-Screen Gallery Modal */}
      {galleryOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setGalleryOpen(false)}
            className="absolute top-5 right-5 p-2 bg-white/15 text-white rounded-full hover:bg-white/25 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={property.images[activeImageIdx]}
            alt={property.title}
            referrerPolicy="no-referrer"
            className="max-h-[75vh] max-w-4xl w-full object-contain rounded-xl"
          />
          <div className="flex items-center gap-3 mt-4">
            {property.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImageIdx(i)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 cursor-pointer ${
                  i === activeImageIdx ? 'border-[#F4B740]' : 'border-transparent opacity-60'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Visit Modal */}
      {visitModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleScheduleVisit}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#202822]">Schedule Property Visit</h3>
              <button
                type="button"
                onClick={() => setVisitModalOpen(false)}
                className="text-[#747B75] hover:text-[#202822]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#747B75]">{property.title} · {property.locality}</p>
            <div>
              <label className="block text-xs font-semibold text-[#525B54] mb-1">Preferred Date</label>
              <input
                type="date"
                required
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#E6EAE6] rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#525B54] mb-1">Preferred Time</label>
              <select
                value={visitTime}
                onChange={(e) => setVisitTime(e.target.value)}
                className="w-full px-3 py-2 border border-[#E6EAE6] rounded-lg text-sm"
              >
                <option>10:00 AM</option>
                <option>11:00 AM</option>
                <option>02:00 PM</option>
                <option>04:30 PM</option>
                <option>06:00 PM</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#525B54] mb-1">Notes (Optional)</label>
              <textarea
                rows={2}
                value={visitNotes}
                onChange={(e) => setVisitNotes(e.target.value)}
                placeholder="Any specific questions or timing preferences..."
                className="w-full px-3 py-2 border border-[#E6EAE6] rounded-lg text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#163D32] text-white font-semibold text-sm rounded-xl hover:bg-[#1E4F41] cursor-pointer"
            >
              Confirm Visit Request
            </button>
          </form>
        </div>
      )}

      {/* Inquiry Modal */}
      {inquiryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSendInquiry}
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#202822]">Contact Owner / Request Callback</h3>
              <button
                type="button"
                onClick={() => setInquiryModalOpen(false)}
                className="text-[#747B75] hover:text-[#202822]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#747B75]">
              Direct contact for {property.ownerName} ({property.listedBy})
            </p>
            <div>
              <label className="block text-xs font-semibold text-[#525B54] mb-1">Your Message</label>
              <textarea
                rows={4}
                required
                value={inquiryMsg}
                onChange={(e) => setInquiryMsg(e.target.value)}
                className="w-full px-3 py-2 border border-[#E6EAE6] rounded-lg text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#163D32] text-white font-semibold text-sm rounded-xl hover:bg-[#1E4F41] cursor-pointer"
            >
              Send Inquiry
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
