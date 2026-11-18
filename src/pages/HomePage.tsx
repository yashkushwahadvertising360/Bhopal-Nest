import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Building2,
  Home,
  BedDouble,
  Briefcase,
  Sofa,
  ShieldCheck,
  CalendarCheck,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BHOPAL_LOCALITIES, HERO_IMAGE } from '../data/bhopalData';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyType } from '../types';

export const HomePage: React.FC = () => {
  const { navigate, properties, setFilters, resetFilters } = useApp();
  const [locationQuery, setLocationQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedType, setSelectedType] = useState<PropertyType | 'All'>('All');
  const [maxBudget, setMaxBudget] = useState<number>(100000);

  const filteredLocalities = BHOPAL_LOCALITIES.filter((loc) =>
    loc.toLowerCase().includes(locationQuery.toLowerCase())
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    resetFilters();
    setFilters((prev) => ({
      ...prev,
      location: locationQuery,
      propertyType: selectedType,
      maxRent: maxBudget,
    }));
    navigate('search');
  };

  const handleCategoryClick = (type: PropertyType | 'All', furnishedOnly?: boolean) => {
    resetFilters();
    setFilters((prev) => ({
      ...prev,
      propertyType: type,
      furnishing: furnishedOnly ? 'Fully Furnished' : 'All',
    }));
    navigate('search');
  };

  const featuredProperties = properties
    .filter((p) => p.status === 'Active')
    .slice(0, 6);

  const categories = [
    { label: 'Flats & Apartments', sub: '1, 2 & 3 BHK residences', icon: Building2, action: () => handleCategoryClick('Apartment') },
    { label: 'Independent Houses', sub: 'Private floors & duplexes', icon: Home, action: () => handleCategoryClick('Independent House') },
    { label: 'Villas', sub: 'Gated luxury townships', icon: Home, action: () => handleCategoryClick('Villa') },
    { label: 'PG & Hostels', sub: 'Students & professionals', icon: BedDouble, action: () => handleCategoryClick('PG & Hostel') },
    { label: 'Furnished Homes', sub: 'Move-in ready spaces', icon: Sofa, action: () => handleCategoryClick('All', true) },
    { label: 'Commercial Spaces', sub: 'Offices & retail showrooms', icon: Briefcase, action: () => handleCategoryClick('Commercial') },
  ];

  const trustPoints = [
    {
      title: 'Verified Listings',
      desc: 'Every active listing is reviewed for accurate rent, deposit, and locality details.',
    },
    {
      title: 'No Fake Listings',
      desc: 'Zero duplicate spam or bait-and-switch pricing across Bhopal neighbourhoods.',
    },
    {
      title: 'Easy Visit Scheduling',
      desc: 'Book a physical walkthrough online and manage or reschedule visits from your dashboard.',
    },
    {
      title: 'Direct Owner Contact',
      desc: 'Connect directly with verified Bhopal property owners via WhatsApp or callback.',
    },
    {
      title: 'Transparent Rental Terms',
      desc: 'Clear upfront breakdown of monthly rent, security deposit, and maintenance charges.',
    },
    {
      title: 'Local Bhopal Expertise',
      desc: 'Curated coverage from Arera Colony and Shahpura to Kolar Road, MP Nagar, and AIIMS.',
    },
  ];

  const steps = [
    { num: '01', title: 'Search your preferred locality', desc: 'Filter by Arera Colony, Kolar Road, MP Nagar, BHK, and budget.' },
    { num: '02', title: 'Explore verified homes', desc: 'Compare photos, carpet area, furnishing, and deposit terms.' },
    { num: '03', title: 'Connect with owner or partner', desc: 'Send an inquiry or start a pre-filled WhatsApp chat instantly.' },
    { num: '04', title: 'Schedule a visit', desc: 'Pick a convenient date and time slot for an on-site visit.' },
    { num: '05', title: 'Move into your new home', desc: 'Finalize transparent terms and settle in with confidence.' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-[#163D32] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Modern sunlit residential apartment in Bhopal"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#163D32] via-[#163D32]/70 to-[#163D32]/40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#F4B740] tracking-wide mb-3">
              Bhopal, Madhya Pradesh · Verified Rentals
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Find a place that feels like home.
            </h1>
            <p className="text-lg sm:text-xl text-white/85 mt-5 max-w-2xl leading-relaxed">
              Discover verified rental homes, apartments, PGs and commercial spaces across Bhopal.
            </p>
          </div>

          {/* Search Interface */}
          <form
            onSubmit={handleSearch}
            className="mt-10 bg-white rounded-2xl p-3 shadow-xl max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-3"
          >
            {/* Location Autocomplete */}
            <div className="md:col-span-5 relative">
              <label className="block text-xs font-semibold text-[#747B75] px-3 pt-1">
                Locality in Bhopal
              </label>
              <div className="flex items-center px-3 pb-1">
                <MapPin className="w-4 h-4 text-[#2E8B57] shrink-0 mr-2" />
                <input
                  type="text"
                  value={locationQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 180)}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Arera Colony, Kolar Road, MP Nagar..."
                  className="w-full text-sm font-medium text-[#202822] placeholder:text-[#9AA19B] focus:outline-none py-1"
                />
              </div>
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#E6EAE6] rounded-xl shadow-lg max-h-60 overflow-y-auto z-30 py-1">
                  {filteredLocalities.length > 0 ? (
                    filteredLocalities.map((loc) => (
                      <button
                        type="button"
                        key={loc}
                        onMouseDown={() => {
                          setLocationQuery(loc);
                          setShowSuggestions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-[#202822] hover:bg-[#F7F8F6] flex items-center gap-2 cursor-pointer"
                      >
                        <MapPin className="w-3.5 h-3.5 text-[#747B75]" />
                        <span>{loc}, Bhopal</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-xs text-[#747B75]">No matching locality</div>
                  )}
                </div>
              )}
            </div>

            {/* Property Type */}
            <div className="md:col-span-3 md:border-l border-[#E6EAE6] px-3 py-1">
              <label className="block text-xs font-semibold text-[#747B75]">Property Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as PropertyType | 'All')}
                className="w-full text-sm font-medium text-[#202822] bg-transparent focus:outline-none py-1 cursor-pointer"
              >
                <option value="All">All Property Types</option>
                <option value="Apartment">Flats & Apartments</option>
                <option value="Independent House">Independent House</option>
                <option value="Villa">Villa</option>
                <option value="PG & Hostel">PG & Hostel</option>
                <option value="Studio">Studio</option>
                <option value="Commercial">Commercial Space</option>
              </select>
            </div>

            {/* Budget */}
            <div className="md:col-span-2 md:border-l border-[#E6EAE6] px-3 py-1">
              <label className="block text-xs font-semibold text-[#747B75]">Max Budget</label>
              <select
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full text-sm font-medium text-[#202822] bg-transparent focus:outline-none py-1 cursor-pointer tabular-nums"
              >
                <option value={100000}>Any Budget</option>
                <option value={10000}>Up to ₹10,000</option>
                <option value={15000}>Up to ₹15,000</option>
                <option value={25000}>Up to ₹25,000</option>
                <option value={40000}>Up to ₹40,000</option>
                <option value={60000}>Up to ₹60,000</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="md:col-span-2 flex items-center">
              <button
                type="submit"
                className="w-full h-full min-h-[48px] bg-[#163D32] hover:bg-[#1E4F41] text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Popular locality quick links */}
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/80">
            <span className="text-white/60">Popular in Bhopal:</span>
            {['Arera Colony', 'MP Nagar', 'Kolar Road', 'Shahpura', 'Bawadia Kalan', 'Saket Nagar'].map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  resetFilters();
                  setFilters((prev) => ({ ...prev, location: loc }));
                  navigate('search');
                }}
                className="hover:text-[#F4B740] underline underline-offset-4 decoration-white/30 transition-colors cursor-pointer"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Property Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202822] tracking-tight">
              Browse by property category
            </h2>
            <p className="text-sm text-[#747B75] mt-1">
              From family apartments in Arera Colony to executive PGs near MP Nagar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.label}
                onClick={cat.action}
                className="bg-white border border-[#E6EAE6] rounded-xl p-5 text-left hover:border-[#163D32] hover:shadow-sm transition-all group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F7F8F6] text-[#163D32] flex items-center justify-center mb-4 group-hover:bg-[#163D32] group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-sm font-bold text-[#202822]">{cat.label}</div>
                <div className="text-xs text-[#747B75] mt-1">{cat.sub}</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202822] tracking-tight">
              Featured rental homes in Bhopal
            </h2>
            <p className="text-sm text-[#747B75] mt-1">
              Handpicked active listings with transparent rent and deposit terms.
            </p>
          </div>
          <button
            onClick={() => {
              resetFilters();
              navigate('search');
            }}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#163D32] hover:text-[#2E8B57] whitespace-nowrap shrink-0 cursor-pointer"
          >
            View all properties <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white border border-[#E6EAE6] rounded-2xl p-8 sm:p-12">
          <div className="max-w-2xl mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202822] tracking-tight">
              Why Bhopal residents trust BhopalNest
            </h2>
            <p className="text-sm text-[#747B75] mt-2">
              Designed specifically for the Indian rental experience — clear deposits, verified owners, and zero guesswork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trustPoints.map((pt) => (
              <div key={pt.title} className="space-y-2">
                <div className="flex items-center gap-2 text-[#163D32] font-bold text-base">
                  <CheckCircle2 className="w-4 h-4 text-[#2E8B57] shrink-0" />
                  <span>{pt.title}</span>
                </div>
                <p className="text-sm text-[#747B75] leading-relaxed pl-6">{pt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#202822] tracking-tight">
            How it works
          </h2>
          <p className="text-sm text-[#747B75] mt-1">
            Five simple steps from searching your locality to moving in.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((s) => (
            <div key={s.num} className="bg-white border border-[#E6EAE6] rounded-xl p-6">
              <div className="text-xs font-extrabold text-[#2E8B57] tabular-nums mb-3">
                {s.num}
              </div>
              <h3 className="text-base font-bold text-[#202822]">{s.title}</h3>
              <p className="text-xs text-[#747B75] mt-2 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Owner & Partner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#163D32] rounded-2xl p-8 sm:p-14 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Have a property to rent?
            </h2>
            <p className="text-base text-white/80 mt-3 leading-relaxed">
              Find reliable tenants and list your property with ease, or join our Bhopal Rental Partner Network to earn with every verified connection.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 shrink-0">
            <button
              onClick={() => navigate('list-property')}
              className="px-6 py-3.5 bg-[#F4B740] text-[#163D32] font-bold text-sm rounded-xl hover:bg-[#e5a832] transition-colors cursor-pointer"
            >
              List Your Property
            </button>
            <button
              onClick={() => navigate('become-partner')}
              className="px-6 py-3.5 bg-white/10 text-white border border-white/25 font-semibold text-sm rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
            >
              Become a Partner
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
