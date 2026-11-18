import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X, RotateCcw, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BHOPAL_LOCALITIES, formatINR } from '../data/bhopalData';
import { PropertyCard } from '../components/PropertyCard';
import { FurnishingStatus, PropertyType, TenantPreference } from '../types';

export const SearchPage: React.FC = () => {
  const { properties, filters, setFilters, resetFilters } = useApp();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredProperties = useMemo(() => {
    return properties
      .filter((p) => p.status === 'Active')
      .filter((p) => {
        if (
          filters.location &&
          !p.locality.toLowerCase().includes(filters.location.toLowerCase()) &&
          !p.title.toLowerCase().includes(filters.location.toLowerCase())
        ) {
          return false;
        }
        if (p.rent < filters.minRent || p.rent > filters.maxRent) return false;
        if (filters.propertyType !== 'All' && p.type !== filters.propertyType) return false;
        if (filters.bhk !== 'All') {
          if (filters.bhk === 4) {
            if (p.bhk < 4) return false;
          } else if (p.bhk !== filters.bhk) {
            return false;
          }
        }
        if (filters.furnishing !== 'All' && p.furnishing !== filters.furnishing) return false;
        if (
          filters.preferredTenant !== 'All' &&
          !p.preferredTenants.includes(filters.preferredTenant) &&
          !p.preferredTenants.includes('Anyone')
        ) {
          return false;
        }
        if (filters.bathrooms !== 'All' && p.bathrooms < filters.bathrooms) return false;
        if (filters.parking && p.parking === 'None') return false;
        if (filters.petFriendly && !p.petFriendly) return false;
        if (filters.ownerOnly && p.listedBy !== 'Owner') return false;
        if (filters.verifiedOnly && !p.verified) return false;
        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price_asc') return a.rent - b.rent;
        if (filters.sortBy === 'price_desc') return b.rent - a.rent;
        if (filters.sortBy === 'recent') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        // recommended: verified first, then views
        return (b.verified ? 1 : 0) - (a.verified ? 1 : 0) || b.views - a.views;
      });
  }, [properties, filters]);

  const FilterPanel = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-[#202822]">Filters</h2>
        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-1 text-xs font-semibold text-[#2E8B57] hover:text-[#163D32] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset all
        </button>
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs font-semibold text-[#525B54] mb-1.5">Locality in Bhopal</label>
        <select
          value={filters.location}
          onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
          className="w-full px-3 py-2 text-sm bg-[#F7F8F6] border border-[#E6EAE6] rounded-lg focus:outline-none focus:border-[#163D32]"
        >
          <option value="">All Bhopal Localities</option>
          {BHOPAL_LOCALITIES.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-xs font-semibold text-[#525B54] mb-1.5">Property Type</label>
        <select
          value={filters.propertyType}
          onChange={(e) => setFilters((f) => ({ ...f, propertyType: e.target.value as PropertyType | 'All' }))}
          className="w-full px-3 py-2 text-sm bg-[#F7F8F6] border border-[#E6EAE6] rounded-lg focus:outline-none focus:border-[#163D32]"
        >
          <option value="All">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Independent House">Independent House</option>
          <option value="Villa">Villa</option>
          <option value="PG & Hostel">PG & Hostel</option>
          <option value="Studio">Studio</option>
          <option value="Commercial">Commercial</option>
        </select>
      </div>

      {/* Rent Range */}
      <div>
        <div className="flex items-center justify-between text-xs font-semibold text-[#525B54] mb-1.5">
          <span>Max Monthly Rent</span>
          <span className="text-[#163D32] tabular-nums">{formatINR(filters.maxRent)}</span>
        </div>
        <input
          type="range"
          min={5000}
          max={100000}
          step={2500}
          value={filters.maxRent}
          onChange={(e) => setFilters((f) => ({ ...f, maxRent: Number(e.target.value) }))}
          className="w-full accent-[#163D32] cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-[#747B75] tabular-nums">
          <span>₹5,000</span>
          <span>₹1,00,000</span>
        </div>
      </div>

      {/* BHK */}
      <div>
        <label className="block text-xs font-semibold text-[#525B54] mb-2">BHK</label>
        <div className="grid grid-cols-5 gap-1.5">
          {(['All', 1, 2, 3, 4] as const).map((b) => (
            <button
              key={String(b)}
              onClick={() => setFilters((f) => ({ ...f, bhk: b }))}
              className={`py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                filters.bhk === b
                  ? 'bg-[#163D32] text-white border-[#163D32]'
                  : 'bg-white text-[#525B54] border-[#E6EAE6] hover:border-[#163D32]'
              }`}
            >
              {b === 'All' ? 'Any' : b === 4 ? '4+' : `${b}`}
            </button>
          ))}
        </div>
      </div>

      {/* Furnishing */}
      <div>
        <label className="block text-xs font-semibold text-[#525B54] mb-1.5">Furnishing</label>
        <select
          value={filters.furnishing}
          onChange={(e) => setFilters((f) => ({ ...f, furnishing: e.target.value as FurnishingStatus | 'All' }))}
          className="w-full px-3 py-2 text-sm bg-[#F7F8F6] border border-[#E6EAE6] rounded-lg focus:outline-none focus:border-[#163D32]"
        >
          <option value="All">Any Furnishing</option>
          <option value="Fully Furnished">Fully Furnished</option>
          <option value="Semi Furnished">Semi Furnished</option>
          <option value="Unfurnished">Unfurnished</option>
        </select>
      </div>

      {/* Preferred Tenants */}
      <div>
        <label className="block text-xs font-semibold text-[#525B54] mb-1.5">Preferred Tenants</label>
        <select
          value={filters.preferredTenant}
          onChange={(e) =>
            setFilters((f) => ({ ...f, preferredTenant: e.target.value as TenantPreference | 'All' }))
          }
          className="w-full px-3 py-2 text-sm bg-[#F7F8F6] border border-[#E6EAE6] rounded-lg focus:outline-none focus:border-[#163D32]"
        >
          <option value="All">Anyone</option>
          <option value="Family">Family</option>
          <option value="Bachelor">Bachelor</option>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
          <option value="Working Professionals">Working Professionals</option>
          <option value="Students">Students</option>
        </select>
      </div>

      {/* Toggles */}
      <div className="space-y-3 pt-2 border-t border-[#E6EAE6]">
        {[
          { key: 'verifiedOnly', label: 'Verified properties only' },
          { key: 'ownerOnly', label: 'Direct owner listings' },
          { key: 'parking', label: 'Parking available' },
          { key: 'petFriendly', label: 'Pet friendly' },
        ].map((item) => (
          <label key={item.key} className="flex items-center gap-2.5 text-sm text-[#202822] cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(filters[item.key as keyof typeof filters])}
              onChange={(e) => setFilters((f) => ({ ...f, [item.key]: e.target.checked }))}
              className="w-4 h-4 accent-[#163D32] rounded cursor-pointer"
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6EAE6]">
        <div>
          <h1 className="text-2xl font-extrabold text-[#202822] tracking-tight">
            {filters.location ? `Rentals in ${filters.location}, Bhopal` : 'Rental Properties in Bhopal'}
          </h1>
          <p className="text-sm text-[#747B75] mt-1 tabular-nums">
            Showing {filteredProperties.length} verified & active {filteredProperties.length === 1 ? 'listing' : 'listings'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E6EAE6] rounded-lg text-sm font-semibold text-[#202822]"
          >
            <SlidersHorizontal className="w-4 h-4" /> Filters
          </button>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters((f) => ({ ...f, sortBy: e.target.value as typeof f.sortBy }))}
            className="px-3.5 py-2 bg-white border border-[#E6EAE6] rounded-lg text-sm font-medium text-[#202822] focus:outline-none focus:border-[#163D32] cursor-pointer"
          >
            <option value="recommended">Sort: Recommended</option>
            <option value="price_asc">Rent: Low to High</option>
            <option value="price_desc">Rent: High to Low</option>
            <option value="recent">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6 sticky top-24">
            {FilterPanel}
          </div>
        </aside>

        {/* Listing Grid */}
        <div className="lg:col-span-9">
          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProperties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-[#E6EAE6] rounded-2xl p-12 text-center">
              <Search className="w-10 h-10 text-[#9AA19B] mx-auto mb-3" />
              <h3 className="text-lg font-bold text-[#202822]">No properties match your filters</h3>
              <p className="text-sm text-[#747B75] mt-1 max-w-md mx-auto">
                Try increasing your budget or clearing a few filters to see more rental homes across Bhopal.
              </p>
              <button
                onClick={resetFilters}
                className="mt-5 px-5 py-2.5 bg-[#163D32] text-white text-sm font-semibold rounded-lg hover:bg-[#1E4F41] cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden flex justify-end">
          <div className="bg-white w-full max-w-sm h-full overflow-y-auto p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E6EAE6]">
                <span className="text-lg font-bold text-[#202822]">Filter Properties</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-2 text-[#747B75] hover:text-[#202822]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {FilterPanel}
            </div>
            <button
              onClick={() => setMobileFilterOpen(false)}
              className="mt-6 w-full py-3 bg-[#163D32] text-white font-semibold text-sm rounded-xl"
            >
              Show {filteredProperties.length} Properties
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
