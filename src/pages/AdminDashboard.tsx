import React, { useState } from 'react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  MessageSquare,
  ShieldAlert,
  Check,
  X,
  LogOut,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../data/bhopalData';

type Tab = 'overview' | 'properties' | 'partners' | 'users' | 'inquiries';

export const AdminDashboard: React.FC = () => {
  const {
    currentUser,
    properties,
    updatePropertyStatus,
    deleteProperty,
    partnerApplications,
    reviewPartnerApplication,
    users,
    toggleUserStatus,
    inquiries,
    updateInquiryStatus,
    visits,
    navigate,
    logout,
  } = useApp();

  const [tab, setTab] = useState<Tab>('overview');
  const [userRoleFilter, setUserRoleFilter] = useState('all');

  // Strict admin authorization gate
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="bg-white border border-[#E6EAE6] rounded-2xl p-8 space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-600 mx-auto" />
          <h1 className="text-xl font-extrabold text-[#202822]">Admin Access Restricted</h1>
          <p className="text-sm text-[#747B75]">
            You must be signed in with an authorized BhopalNest Admin account to access this panel.
          </p>
          <button
            onClick={() => navigate('auth')}
            className="px-5 py-2.5 bg-[#163D32] text-white text-sm font-semibold rounded-xl cursor-pointer"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const pendingProps = properties.filter((p) => p.status === 'Pending Verification');
  const filteredUsers = users.filter(
    (u) => userRoleFilter === 'all' || u.role === userRoleFilter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white border border-[#E6EAE6] rounded-2xl p-4 space-y-1">
            <div className="px-3 py-3 border-b border-[#E6EAE6] mb-2">
              <div className="text-sm font-bold text-[#163D32]">BhopalNest Admin</div>
              <div className="text-xs text-[#747B75] truncate">{currentUser.email}</div>
            </div>
            {[
              { id: 'overview', label: 'Overview & Reports', icon: LayoutDashboard },
              { id: 'properties', label: `Properties (${pendingProps.length} pending)`, icon: Building2 },
              { id: 'partners', label: `Partner Apps (${partnerApplications.length})`, icon: Briefcase },
              { id: 'users', label: `Users (${users.length})`, icon: Users },
              { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: MessageSquare },
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
                  { label: 'Total Users', value: users.length },
                  { label: 'Active Properties', value: properties.filter((p) => p.status === 'Active').length },
                  { label: 'Pending Verification', value: pendingProps.length },
                  { label: 'Scheduled Visits', value: visits.length },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-[#E6EAE6] rounded-xl p-5">
                    <div className="text-xs text-[#747B75] font-medium">{stat.label}</div>
                    <div className="text-2xl font-extrabold text-[#163D32] mt-1 tabular-nums">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6">
                <h2 className="text-lg font-bold text-[#202822] mb-4">Pending Listing Verification Queue</h2>
                {pendingProps.length === 0 ? (
                  <p className="text-sm text-[#747B75]">All listings are reviewed.</p>
                ) : (
                  <div className="divide-y divide-[#E6EAE6]">
                    {pendingProps.map((p) => (
                      <div key={p.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="text-sm font-bold text-[#202822]">{p.title}</div>
                          <div className="text-xs text-[#747B75] tabular-nums">
                            {p.locality} · {formatINR(p.rent)}/mo · Owner: {p.ownerName}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updatePropertyStatus(p.id, 'Active', undefined, true)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#2E8B57] text-white text-xs font-semibold rounded-lg cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5" /> Verify & Approve
                          </button>
                          <button
                            onClick={() => updatePropertyStatus(p.id, 'Rejected', 'Incomplete address details')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg cursor-pointer"
                          >
                            <X className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {tab === 'properties' && (
            <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6">
              <h2 className="text-xl font-extrabold text-[#202822] mb-4">All Property Listings</h2>
              <div className="divide-y divide-[#E6EAE6]">
                {properties.map((p) => (
                  <div key={p.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-[#202822]">{p.title}</div>
                      <div className="text-xs text-[#747B75] tabular-nums">
                        {p.id} · {p.locality} · {formatINR(p.rent)}/mo · Status: <strong>{p.status}</strong>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {p.status !== 'Active' && (
                        <button
                          onClick={() => updatePropertyStatus(p.id, 'Active', undefined, true)}
                          className="px-3 py-1.5 bg-[#2E8B57] text-white text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => updatePropertyStatus(p.id, 'Rented')}
                        className="px-3 py-1.5 bg-[#F7F8F6] text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        Mark Rented
                      </button>
                      <button
                        onClick={() => deleteProperty(p.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'partners' && (
            <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6">
              <h2 className="text-xl font-extrabold text-[#202822] mb-4">Partner Applications</h2>
              <div className="divide-y divide-[#E6EAE6]">
                {partnerApplications.map((app) => (
                  <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-[#202822]">
                        {app.fullName} · <span className="text-[#2E8B57]">{app.partnerType}</span>
                      </div>
                      <div className="text-xs text-[#747B75]">
                        {app.phone} · {app.operatingAreas.join(', ')} · Status: <strong>{app.status}</strong>
                        {app.assignedPartnerId && ` (${app.assignedPartnerId})`}
                      </div>
                    </div>
                    {app.status === 'Pending Review' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => reviewPartnerApplication(app.id, 'Approved')}
                          className="px-3 py-1.5 bg-[#163D32] text-white text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          Approve & Assign ID
                        </button>
                        <button
                          onClick={() => reviewPartnerApplication(app.id, 'Rejected')}
                          className="px-3 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-[#202822]">User Management</h2>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-1.5 border border-[#E6EAE6] rounded-lg text-xs font-semibold"
                >
                  <option value="all">All Roles</option>
                  <option value="tenant">Tenants</option>
                  <option value="owner">Owners</option>
                  <option value="partner">Partners</option>
                  <option value="admin">Admins</option>
                </select>
              </div>
              <div className="divide-y divide-[#E6EAE6]">
                {filteredUsers.map((u) => (
                  <div key={u.uid} className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-[#202822]">{u.fullName}</div>
                      <div className="text-xs text-[#747B75]">
                        {u.email} · {u.role.toUpperCase()} · Status: <strong>{u.status}</strong>
                      </div>
                    </div>
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => toggleUserStatus(u.uid)}
                        className="px-3 py-1.5 bg-[#F7F8F6] text-xs font-semibold rounded-lg hover:bg-[#EAEFEA] cursor-pointer"
                      >
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'inquiries' && (
            <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6">
              <h2 className="text-xl font-extrabold text-[#202822] mb-4">Inquiry Management</h2>
              <div className="divide-y divide-[#E6EAE6]">
                {inquiries.map((inq) => (
                  <div key={inq.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-bold text-[#202822]">{inq.propertyTitle}</div>
                      <div className="text-xs text-[#747B75]">
                        Tenant: {inq.tenantName} ({inq.tenantPhone}) · Owner: {inq.ownerName}
                      </div>
                    </div>
                    <select
                      value={inq.status}
                      onChange={(e) => updateInquiryStatus(inq.id, e.target.value as typeof inq.status, 'BNP-204')}
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
        </main>
      </div>
    </div>
  );
};
