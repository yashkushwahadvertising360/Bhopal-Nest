import React from 'react';
import { useApp } from '../context/AppContext';
import { BHOPAL_LOCALITIES } from '../data/bhopalData';

export const Footer: React.FC = () => {
  const { navigate, setFilters, resetFilters } = useApp();

  const searchLocality = (loc: string) => {
    resetFilters();
    setFilters((prev) => ({ ...prev, location: loc }));
    navigate('search');
  };

  return (
    <footer className="bg-[#163D32] text-white/90 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="text-2xl font-extrabold tracking-tight text-white">BhopalNest</div>
            <p className="text-sm text-white/75 mt-3 leading-relaxed">
              Bhopal&apos;s trusted rental platform connecting families, students, and businesses with verified homes, PGs, and commercial spaces across Madhya Pradesh.
            </p>
            <p className="text-xs text-white/60 mt-4">
              E-4 Arera Colony, Bhopal, MP 462016
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Popular Bhopal Localities</h4>
            <ul className="space-y-2 text-sm text-white/75">
              {BHOPAL_LOCALITIES.slice(0, 6).map((loc) => (
                <li key={loc}>
                  <button
                    onClick={() => searchLocality(loc)}
                    className="hover:text-[#F4B740] transition-colors cursor-pointer"
                  >
                    Rentals in {loc}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li>
                <button onClick={() => navigate('search')} className="hover:text-[#F4B740] transition-colors cursor-pointer">
                  Search Properties
                </button>
              </li>
              <li>
                <button onClick={() => navigate('list-property')} className="hover:text-[#F4B740] transition-colors cursor-pointer">
                  List Your Property (Owners)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('become-partner')} className="hover:text-[#F4B740] transition-colors cursor-pointer">
                  Rental Partner Program
                </button>
              </li>
              <li>
                <button onClick={() => navigate('auth')} className="hover:text-[#F4B740] transition-colors cursor-pointer">
                  Tenant & Owner Login
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white mb-4">Support & Legal</h4>
            <ul className="space-y-2 text-sm text-white/75">
              <li>About BhopalNest</li>
              <li>Bhopal Rental Guide & Agreement Tips</li>
              <li>FAQs & Verification Process</li>
              <li>Privacy Policy & Terms of Service</li>
              <li className="pt-2 text-xs text-white/60">
                Support: support@bhopalnest.in
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
          <span>© {new Date().getFullYear()} BhopalNest Technologies Pvt. Ltd. All rights reserved.</span>
          <span>Made for Bhopal, Madhya Pradesh</span>
        </div>
      </div>
    </footer>
  );
};
