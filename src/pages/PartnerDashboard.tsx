import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Wallet,
  Building2,
  LogOut,
  Plus,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BHOPAL_LOCALITIES, formatINR } from '../data/bhopalData';
import { LeadStatus, PropertyType } from '../types';

type Tab = 'overview' | 'leads' | 'commissions' | 'properties';

export const PartnerDashboard: React.FC = () => {
  const {
    currentUser,
    partnerLeads,
    updatePartnerLead,
    addPartnerLead,
    commissions,
    properties,
    navigate,
    logout,
  } = useApp();

  const [tab, setTab] = useState<Tab>('overview');
  const [leadFilter, setLeadFilter] = useState<LeadStatus | 'All'>('All');
  const [leadSearch, setLeadSearch] = useState('');
  const [showAddLead, setShowAddLead] = useState(false);

  const [newCustomer, setNewCustomer] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newLoc, setNewLoc] = useState('Arera Colony');
  const [newBudget, setNewBudget] = useState(18000);
  const [newType, setNewType] = useState<PropertyType>('Apartment');

  const filteredLeads = partnerLeads.filter((l) => {
    if (leadFilter !== 'All' && l.status !== leadFilter) return false;
    if (
      leadSearch &&
      !l.customerName.toLowerCase().includes(leadSearch.toLowerCase()) &&
      !l.interestedLocation.toLowerCase().includes(leadSearch.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const paidCommission = commissions
    .filter((c) => c.status === 'Paid')
    .reduce((acc, c) => acc + c.amount, 0);
  const pendingCommission = commissions
    .filter((c) => c.status === 'Pending')
    .reduce((acc, c) => acc + c.amount, 0);

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    addPartnerLead({
      partnerId: currentUser?.uid || 'demo-partner-1',
      customerName: newCustomer,
      mobile: '+91 ' + newMobile,
      interestedLocation: newLoc,
      budget: newBudget,
      propertyType: newType,
      leadSource: 'Manual Entry',
      date: new Date().toISOString().slice(0, 10),
      status: 'New',
      notes: 'Added via Partner CRM.',
      followUpDate: new Date().toISOString().slice(0, 10),
    });
    setShowAddLead(false);
    setNewCustomer('');
    setNewMobile('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-3">
          <div className="bg-white border border-[#E6EAE6] rounded-2xl p-4 space-y-1">
            <div className="px-3 py-3 border-b border-[#E6EAE6] mb-2">
              <div className="text-sm font-bold text-[#202822]">{currentUser?.fullName || 'Vikram Patel'}</div>
              <div className="text-xs text-[#747B75]">Rental Partner · ID: {currentUser?.partnerId || 'BNP-204'}</div>
            </div>
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboard },
              { id: 'leads', label: `Leads (${partnerLeads.length})`, icon: Users },
              { id: 'commissions', label: 'Earnings & Commissions', icon: Wallet },
              { id: 'properties', label: 'My Properties', icon: Building2 },
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
                  { label: 'Active Leads', value: partnerLeads.length },
                  { label: 'Converted Deals', value: partnerLeads.filter((l) => l.status === 'Converted').length },
                  { label: 'Paid Commission', value: formatINR(paidCommission) },
                  { label: 'Pending Payout', value: formatINR(pendingCommission) },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-[#E6EAE6] rounded-xl p-5">
                    <div className="text-xs text-[#747B75] font-medium">{stat.label}</div>
                    <div className="text-2xl font-extrabold text-[#163D32] mt-1 tabular-nums">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6">
                <h2 className="text-lg font-bold text-[#202822] mb-4">Recent Tenant Leads</h2>
                <div className="divide-y divide-[#E6EAE6]">
                  {partnerLeads.slice(0, 4).map((l) => (
                    <div key={l.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-[#202822]">{l.customerName}</div>
                        <div className="text-xs text-[#747B75] tabular-nums">
                          {l.interestedLocation} · Budget {formatINR(l.budget)} · {l.propertyType} · Follow-up: {l.followUpDate}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#163D32]">{l.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 'leads' && (
            <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-xl font-extrabold text-[#202822]">Leads Management</h2>
                <button
                  onClick={() => setShowAddLead(!showAddLead)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#163D32] text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Lead
                </button>
              </div>

              {showAddLead && (
                <form onSubmit={handleAddLead} className="bg-[#F7F8F6] p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    required
                    placeholder="Customer Name"
                    value={newCustomer}
                    onChange={(e) => setNewCustomer(e.target.value)}
                    className="px-3 py-2 bg-white border border-[#E6EAE6] rounded-lg text-xs"
                  />
                  <input
                    required
                    placeholder="10-digit Mobile"
                    value={newMobile}
                    onChange={(e) => setNewMobile(e.target.value)}
                    className="px-3 py-2 bg-white border border-[#E6EAE6] rounded-lg text-xs"
                  />
                  <select
                    value={newLoc}
                    onChange={(e) => setNewLoc(e.target.value)}
                    className="px-3 py-2 bg-white border border-[#E6EAE6] rounded-lg text-xs"
                  >
                    {BHOPAL_LOCALITIES.map((loc) => (
                      <option key={loc}>{loc}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Budget (₹)"
                    value={newBudget}
                    onChange={(e) => setNewBudget(Number(e.target.value))}
                    className="px-3 py-2 bg-white border border-[#E6EAE6] rounded-lg text-xs"
                  />
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as PropertyType)}
                    className="px-3 py-2 bg-white border border-[#E6EAE6] rounded-lg text-xs"
                  >
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Independent House</option>
                    <option>Commercial</option>
                  </select>
                  <button
                    type="submit"
                    className="py-2 bg-[#2E8B57] text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Save Lead
                  </button>
                </form>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Search by customer or locality..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="flex-1 px-3.5 py-2 border border-[#E6EAE6] rounded-lg text-sm"
                />
                <select
                  value={leadFilter}
                  onChange={(e) => setLeadFilter(e.target.value as LeadStatus | 'All')}
                  className="px-3 py-2 border border-[#E6EAE6] rounded-lg text-sm"
                >
                  <option value="All">All Statuses</option>
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Qualified</option>
                  <option>Visit Scheduled</option>
                  <option>Converted</option>
                  <option>Lost</option>
                </select>
              </div>

              <div className="divide-y divide-[#E6EAE6]">
                {filteredLeads.map((l) => (
                  <div key={l.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-[#202822]">
                        {l.customerName} <span className="text-xs font-normal text-[#747B75]">· {l.mobile}</span>
                      </div>
                      <div className="text-xs text-[#747B75] tabular-nums mt-0.5">
                        {l.interestedLocation} · {l.propertyType} · Budget {formatINR(l.budget)} · Source: {l.leadSource}
                      </div>
                      <p className="text-xs text-[#525B54] mt-1">{l.notes}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <select
                        value={l.status}
                        onChange={(e) => updatePartnerLead(l.id, { status: e.target.value as LeadStatus })}
                        className="px-3 py-1.5 border border-[#E6EAE6] rounded-lg text-xs font-semibold"
                      >
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Qualified</option>
                        <option>Visit Scheduled</option>
                        <option>Converted</option>
                        <option>Lost</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'commissions' && (
            <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6 space-y-5">
              <div>
                <h2 className="text-xl font-extrabold text-[#202822]">Commission Tracking</h2>
                <p className="text-xs text-[#747B75] mt-1">
                  Sample partner payout ledger (demo data until live payment gateway rules are configured).
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#F7F8F6] rounded-xl p-4">
                  <div className="text-xs text-[#747B75]">Total Earnings</div>
                  <div className="text-xl font-extrabold text-[#163D32] tabular-nums mt-1">
                    {formatINR(paidCommission + pendingCommission)}
                  </div>
                </div>
                <div className="bg-[#F7F8F6] rounded-xl p-4">
                  <div className="text-xs text-[#747B75]">Paid Commission</div>
                  <div className="text-xl font-extrabold text-[#2E8B57] tabular-nums mt-1">
                    {formatINR(paidCommission)}
                  </div>
                </div>
                <div className="bg-[#F7F8F6] rounded-xl p-4">
                  <div className="text-xs text-[#747B75]">Pending Commission</div>
                  <div className="text-xl font-extrabold text-[#202822] tabular-nums mt-1">
                    {formatINR(pendingCommission)}
                  </div>
                </div>
              </div>
              <div className="divide-y divide-[#E6EAE6]">
                {commissions.map((c) => (
                  <div key={c.id} className="py-3.5 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-[#202822]">{c.propertyTitle}</div>
                      <div className="text-xs text-[#747B75]">Tenant: {c.tenantName} · {c.date}</div>
                    </div>
                    <div className="text-right tabular-nums">
                      <div className="text-sm font-extrabold text-[#163D32]">{formatINR(c.amount)}</div>
                      <div className="text-xs font-semibold text-[#747B75]">{c.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'properties' && (
            <div className="bg-white border border-[#E6EAE6] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-extrabold text-[#202822]">Partner-Managed Properties</h2>
                <button
                  onClick={() => navigate('list-property')}
                  className="px-4 py-2 bg-[#163D32] text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  + Add Property
                </button>
              </div>
              <div className="divide-y divide-[#E6EAE6]">
                {properties
                  .filter((p) => p.listedBy === 'Partner' || p.listedBy === 'Agent')
                  .map((p) => (
                    <div key={p.id} className="py-3.5 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-bold text-[#202822]">{p.title}</div>
                        <div className="text-xs text-[#747B75] tabular-nums">
                          {p.locality} · {formatINR(p.rent)}/mo · {p.status}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate('property-detail', p.id)}
                        className="text-xs font-semibold text-[#163D32] hover:underline cursor-pointer"
                      >
                        View
                      </button>
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
