import React, { useState } from 'react';
import {
  LayoutDashboard,
  Heart,
  MessageSquare,
  Calendar,
  Clock,
  Bell,
  User,
  LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PropertyCard } from '../components/PropertyCard';
import { formatINR } from '../data/bhopalData';

type Tab = 'overview' | 'saved' | 'inquiries' | 'visits' | 'recent' | 'notifications' | 'profile';

export const TenantDashboard: React.FC = () => {
  const {
    currentUser,
    properties,
    favorites,
    recentlyViewed,
    inquiries,
    visits,
    updateVisit,
    notifications,
    markAllNotificationsRead,
    navigate,
    logout,
  } = useApp();

  const [tab, setTab] = useState<Tab>('overview');

  const savedProps = properties.filter((p) => favorites.includes(p.id));
  const recentProps = properties.filter((p) => recentlyViewed.includes(p.id));
  const myInquiries = inquiries.filter(
    (i) => !currentUser || i.tenantId === currentUser.uid || i.tenantId === 'demo-tenant-1'
  );
  const myVisits = visits.filter(
    (v) => !currentUser || v.tenantId === currentUser.uid || v.tenantId === 'demo-tenant-1'
  );

  const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'saved', label: `Saved (${savedProps.length})`, icon: Heart },
    { id: 'inquiries', label: `Inquiries (${myInquiries.length})`, icon: MessageSquare },
    { id: 'visits', label: `Scheduled Visits (${myVisits.length})`, icon: Calendar },
    { id: 'recent', label: 'Recently Viewed', icon: Clock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white border border-[#E6EAE6] rounded-2xl p-4 space-y-1">
            <div className="px-3 py-3 border-b border-[#E6EAE6] mb-2">
              <div className="text-sm font-bold text-[#202822]">{currentUser?.fullName || 'Tenant Account'}</div>
              <div className="text-xs text-[#747B75]">{currentUser?.email || 'tenant@bhopalnest.in'}</div>
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTab(item.id);
                    if (item.id === 'notifications') markAllNotificationsRead();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    tab === item.id
                      ? 'bg-[#163D32] text-white'
                      : 'text-[#525B54] hover:bg-[#F7F8F6] hover:text-[#202822]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 mt-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9 space-y-6">
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Profile Completion', value: '90%' },
                  { label: 'Saved Properties', value: savedProps.length },
                  { label: 'Active Inquiries', value: myInquiries.length },
                  { label: 'Upcoming Visits', value: myVisits.filter((v) => v.status === 'Scheduled').length },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-[#E6EAE6] rounded-xl p-5">
                    <div className="text-xs text-[#747B75] font-medium">{stat.label}</div>
                    <div className="text-2xl font-extrabold text-[#163D32] mt-1 tabular-nums">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#202822]">Upcoming Property Visits</h2>
                  <button
                    onClick={() => navigate('search')}
                    className="text-xs font-semibold text-[#163D32] hover:underline cursor-pointer"
                  >
                    Explore more homes
                  </button>
                </div>
                {myVisits.length === 0 ? (
                  <p className="text-sm text-[#747B75]">No scheduled visits yet.</p>
                ) : (
                  <div className="divide-y divide-[#E6EAE6]">
                    {myVisits.slice(0, 3).map((v) => (
                      <div key={v.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="text-sm font-bold text-[#202822]">{v.propertyTitle}</div>
                          <div className="text-xs text-[#747B75]">
                            {v.propertyLocality} · {v.visitDate} at {v.visitTime} · Status: <strong>{v.status}</strong>
                          </div>
                        </div>
                        {v.status === 'Scheduled' && (
                          <button
                            onClick={() => updateVisit(v.id, 'Cancelled')}
                            className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                          >
                            Cancel Visit
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {tab === 'saved' && (
            <div>
              <h2 className="text-xl font-extrabold text-[#202822] mb-4">Saved Properties</h2>
              {savedProps.length === 0 ? (
                <div className="bg-white border border-[#E6EAE6] rounded-2xl p-10 text-center text-sm text-[#747B75]">
                  You haven&apos;t saved any properties yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedProps.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'inquiries' && (
            <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6">
              <h2 className="text-xl font-extrabold text-[#202822] mb-4">Property Inquiries</h2>
              <div className="divide-y divide-[#E6EAE6]">
                {myInquiries.map((inq) => (
                  <div key={inq.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-[#202822]">{inq.propertyTitle}</div>
                      <div className="text-xs text-[#747B75] mt-0.5">
                        Owner/Agent: {inq.ownerName} · {formatINR(inq.propertyRent)}/mo · {inq.propertyLocality}
                      </div>
                      <p className="text-xs text-[#525B54] mt-1.5">&ldquo;{inq.message}&rdquo;</p>
                    </div>
                    <span className="text-xs font-bold text-[#163D32] shrink-0">{inq.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'visits' && (
            <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6">
              <h2 className="text-xl font-extrabold text-[#202822] mb-4">Scheduled Visits</h2>
              <div className="divide-y divide-[#E6EAE6]">
                {myVisits.map((v) => (
                  <div key={v.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-[#202822]">{v.propertyTitle}</div>
                      <div className="text-xs text-[#747B75] mt-0.5">
                        {v.visitDate} · {v.visitTime} · Owner: {v.ownerName}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-[#163D32]">{v.status}</span>
                      {v.status !== 'Cancelled' && (
                        <>
                          <button
                            onClick={() => updateVisit(v.id, 'Rescheduled', '2026-11-24', '04:30 PM')}
                            className="px-3 py-1.5 bg-[#F7F8F6] text-xs font-semibold rounded-lg hover:bg-[#EAEFEA] cursor-pointer"
                          >
                            Reschedule
                          </button>
                          <button
                            onClick={() => updateVisit(v.id, 'Cancelled')}
                            className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'recent' && (
            <div>
              <h2 className="text-xl font-extrabold text-[#202822] mb-4">Recently Viewed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentProps.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          )}

          {tab === 'notifications' && (
            <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6">
              <h2 className="text-xl font-extrabold text-[#202822] mb-4">Notifications</h2>
              <div className="divide-y divide-[#E6EAE6]">
                {notifications.map((n) => (
                  <div key={n.id} className="py-3.5">
                    <div className="text-sm font-bold text-[#202822]">{n.title}</div>
                    <div className="text-xs text-[#747B75] mt-0.5">{n.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'profile' && (
            <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6 space-y-4">
              <h2 className="text-xl font-extrabold text-[#202822]">My Profile</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-[#747B75]">Full Name</div>
                  <div className="font-semibold text-[#202822]">{currentUser?.fullName || 'Aarav Tiwari'}</div>
                </div>
                <div>
                  <div className="text-xs text-[#747B75]">Email</div>
                  <div className="font-semibold text-[#202822]">{currentUser?.email || 'aarav.tiwari@example.com'}</div>
                </div>
                <div>
                  <div className="text-xs text-[#747B75]">Mobile</div>
                  <div className="font-semibold text-[#202822]">{currentUser?.phone || '+91 98261 44556'}</div>
                </div>
                <div>
                  <div className="text-xs text-[#747B75]">City</div>
                  <div className="font-semibold text-[#202822]">Bhopal, Madhya Pradesh</div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
