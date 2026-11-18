import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  Calendar,
  LogOut,
  PauseCircle,
  PlayCircle,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../data/bhopalData';

type Tab = 'overview' | 'listings' | 'inquiries' | 'visits';

export const OwnerDashboard: React.FC = () => {
  const {
    currentUser,
    properties,
    updatePropertyStatus,
    deleteProperty,
    inquiries,
    updateInquiryStatus,
    visits,
    navigate,
    logout,
  } = useApp();

  const [tab, setTab] = useState<Tab>('overview');

  const myListings = properties.filter(
    (p) => p.ownerId === currentUser?.uid || p.ownerId === 'demo-owner-1'
  );
  const myInquiries = inquiries.filter(
    (i) => i.ownerId === currentUser?.uid || i.ownerId === 'demo-owner-1'
  );
  const myVisits = visits.filter(
    (v) => v.ownerId === currentUser?.uid || v.ownerId === 'demo-owner-1'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white border border-[#E6EAE6] rounded-2xl p-4 space-y-1">
            <div className="px-3 py-3 border-b border-[#E6EAE6] mb-2">
              <div className="text-sm font-bold text-[#202822]">{currentUser?.fullName || 'Owner Account'}</div>
              <div className="text-xs text-[#747B75]">Property Owner · Bhopal</div>
            </div>
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'listings', label: `My Listings (${myListings.length})`, icon: Building2 },
              { id: 'inquiries', label: `Inquiries (${myInquiries.length})`, icon: MessageSquare },
              { id: 'visits', label: `Scheduled Visits (${myVisits.length})`, icon: Calendar },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id as Tab)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer ${
                    tab === item.id ? 'bg-[#163D32] text-white' : 'text-[#525B54] hover:bg-[#F7F8F6]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => navigate('list-property')}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-[#2E8B57] hover:bg-[#F7F8F6] cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" /> Add New Property
            </button>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 mt-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="lg:col-span-9 space-y-6">
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Properties', value: myListings.length },
                  { label: 'Active Listings', value: myListings.filter((p) => p.status === 'Active').length },
                  { label: 'Total Inquiries', value: myInquiries.length },
                  { label: 'Upcoming Visits', value: myVisits.length },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-[#E6EAE6] rounded-xl p-5">
                    <div className="text-xs text-[#747B75] font-medium">{stat.label}</div>
                    <div className="text-2xl font-extrabold text-[#163D32] mt-1 tabular-nums">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-[#202822]">Your Recent Listings</h2>
                  <button
                    onClick={() => navigate('list-property')}
                    className="px-4 py-2 bg-[#163D32] text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    + Add Property
                  </button>
                </div>
                <div className="divide-y divide-[#E6EAE6]">
                  {myListings.map((p) => (
                    <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-16 h-12 rounded-lg object-cover shrink-0"
                        />
                        <div>
                          <div className="text-sm font-bold text-[#202822]">{p.title}</div>
                          <div className="text-xs text-[#747B75] tabular-nums">
                            {formatINR(p.rent)}/mo · {p.locality} · {p.views} views · {p.leadsCount} leads
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#163D32]">{p.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 'listings' && (
            <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-extrabold text-[#202822]">Manage My Listings</h2>
                <button
                  onClick={() => navigate('list-property')}
                  className="px-4 py-2 bg-[#163D32] text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  + List Property
                </button>
              </div>
              <div className="divide-y divide-[#E6EAE6]">
                {myListings.map((p) => (
                  <div key={p.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img src={p.images[0]} alt="" className="w-20 h-14 rounded-lg object-cover shrink-0" />
                      <div>
                        <div className="text-sm font-bold text-[#202822]">{p.title}</div>
                        <div className="text-xs text-[#747B75] tabular-nums">
                          {p.id} · {formatINR(p.rent)}/mo · Status: <strong className="text-[#163D32]">{p.status}</strong>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {p.status === 'Active' ? (
                        <button
                          onClick={() => updatePropertyStatus(p.id, 'Paused')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F7F8F6] text-xs font-semibold rounded-lg hover:bg-[#EAEFEA] cursor-pointer"
                        >
                          <PauseCircle className="w-3.5 h-3.5" /> Pause
                        </button>
                      ) : (
                        <button
                          onClick={() => updatePropertyStatus(p.id, 'Active')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F7F8F6] text-xs font-semibold text-[#2E8B57] rounded-lg cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5" /> Activate
                        </button>
                      )}
                      <button
                        onClick={() => updatePropertyStatus(p.id, 'Rented')}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#F7F8F6] text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Mark Rented
                      </button>
                      <button
                        onClick={() => deleteProperty(p.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'inquiries' && (
            <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6">
              <h2 className="text-xl font-extrabold text-[#202822] mb-4">Tenant Inquiries</h2>
              <div className="divide-y divide-[#E6EAE6]">
                {myInquiries.map((inq) => (
                  <div key={inq.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-[#202822]">
                        {inq.tenantName} <span className="text-xs font-normal text-[#747B75]">({inq.tenantPhone})</span>
                      </div>
                      <div className="text-xs text-[#747B75]">{inq.propertyTitle}</div>
                      <p className="text-xs text-[#525B54] mt-1">&ldquo;{inq.message}&rdquo;</p>
                    </div>
                    <select
                      value={inq.status}
                      onChange={(e) => updateInquiryStatus(inq.id, e.target.value as typeof inq.status)}
                      className="px-3 py-1.5 border border-[#E6EAE6] rounded-lg text-xs font-semibold"
                    >
                      <option>Sent</option>
                      <option>Contacted</option>
                      <option>Visit Scheduled</option>
                      <option>Completed</option>
                    </select>
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
                  <div key={v.id} className="py-4 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-[#202822]">{v.propertyTitle}</div>
                      <div className="text-xs text-[#747B75]">
                        Tenant: {v.tenantName} · {v.visitDate} at {v.visitTime}
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#163D32]">{v.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
