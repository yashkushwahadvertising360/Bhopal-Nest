import React, { useState } from 'react';
import { Menu, X, User, LogOut, LayoutDashboard, PlusCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppPage } from '../types';

export const Navbar: React.FC = () => {
  const { currentPage, navigate, currentUser, logout, setFilters, resetFilters } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCategoryNav = (type: 'All' | 'PG & Hostel' | 'Commercial') => {
    resetFilters();
    if (type !== 'All') {
      setFilters((prev) => ({ ...prev, propertyType: type }));
    }
    navigate('search');
    setMobileOpen(false);
  };

  const getDashboardPage = (): AppPage => {
    if (!currentUser) return 'auth';
    if (currentUser.role === 'admin') return 'admin-dashboard';
    if (currentUser.role === 'owner') return 'owner-dashboard';
    if (currentUser.role === 'partner') return 'partner-dashboard';
    return 'tenant-dashboard';
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E6EAE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          onClick={() => navigate('home')}
          className="text-xl font-extrabold tracking-tight text-[#163D32] whitespace-nowrap shrink-0 cursor-pointer"
        >
          BhopalNest
        </button>

        {/* Zone 2: Concise single-line nav links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#202822]">
          <button
            onClick={() => handleCategoryNav('All')}
            className={`hover:text-[#163D32] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'search' ? 'text-[#163D32] font-semibold' : 'text-[#525B54]'
            }`}
          >
            Rent Properties
          </button>
          <button
            onClick={() => handleCategoryNav('PG & Hostel')}
            className="text-[#525B54] hover:text-[#163D32] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            PG & Hostels
          </button>
          <button
            onClick={() => handleCategoryNav('Commercial')}
            className="text-[#525B54] hover:text-[#163D32] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Commercial
          </button>
          <button
            onClick={() => navigate('list-property')}
            className={`hover:text-[#163D32] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'list-property' ? 'text-[#163D32] font-semibold' : 'text-[#525B54]'
            }`}
          >
            List Property
          </button>
          <button
            onClick={() => navigate('become-partner')}
            className={`hover:text-[#163D32] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentPage === 'become-partner' ? 'text-[#163D32] font-semibold' : 'text-[#525B54]'
            }`}
          >
            Become a Partner
          </button>
        </nav>

        {/* Zone 3: Primary Action / Account */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(getDashboardPage())}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#163D32] rounded-lg hover:bg-[#1E4F41] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{currentUser.fullName.split(' ')[0]} · {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}</span>
              </button>
              <button
                onClick={logout}
                title="Logout"
                className="p-2 text-[#747B75] hover:text-[#202822] rounded-lg hover:bg-[#F7F8F6] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('auth')}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#163D32] rounded-lg hover:bg-[#1E4F41] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Login / Sign Up
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Menu"
          className="lg:hidden p-2 text-[#202822] rounded-lg hover:bg-[#F7F8F6]"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-b border-[#E6EAE6] px-4 py-4 space-y-2">
          <button
            onClick={() => {
              navigate('home');
              setMobileOpen(false);
            }}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#202822] rounded-lg hover:bg-[#F7F8F6]"
          >
            Home
          </button>
          <button
            onClick={() => handleCategoryNav('All')}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#202822] rounded-lg hover:bg-[#F7F8F6]"
          >
            Rent Properties
          </button>
          <button
            onClick={() => handleCategoryNav('PG & Hostel')}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#202822] rounded-lg hover:bg-[#F7F8F6]"
          >
            PG & Hostels
          </button>
          <button
            onClick={() => handleCategoryNav('Commercial')}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#202822] rounded-lg hover:bg-[#F7F8F6]"
          >
            Commercial Spaces
          </button>
          <button
            onClick={() => {
              navigate('list-property');
              setMobileOpen(false);
            }}
            className="flex items-center gap-2 w-full text-left px-3 py-2.5 text-sm font-semibold text-[#163D32] rounded-lg hover:bg-[#F7F8F6]"
          >
            <PlusCircle className="w-4 h-4" /> List Your Property
          </button>
          <button
            onClick={() => {
              navigate('become-partner');
              setMobileOpen(false);
            }}
            className="block w-full text-left px-3 py-2.5 text-sm font-medium text-[#202822] rounded-lg hover:bg-[#F7F8F6]"
          >
            Become a Partner
          </button>
          <div className="pt-3 border-t border-[#E6EAE6]">
            {currentUser ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    navigate(getDashboardPage());
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-white bg-[#163D32] rounded-lg"
                >
                  <User className="w-4 h-4" /> Go to {currentUser.role} Dashboard
                </button>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full py-2 text-sm font-medium text-[#747B75]"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  navigate('auth');
                  setMobileOpen(false);
                }}
                className="w-full py-2.5 text-sm font-semibold text-white bg-[#163D32] rounded-lg"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
