export type UserRole = 'tenant' | 'owner' | 'partner' | 'admin';

export type PropertyType =
  | 'Apartment'
  | 'Independent House'
  | 'Villa'
  | 'PG & Hostel'
  | 'Studio'
  | 'Commercial';

export type FurnishingStatus = 'Fully Furnished' | 'Semi Furnished' | 'Unfurnished';

export type TenantPreference =
  | 'Family'
  | 'Bachelor'
  | 'Female'
  | 'Male'
  | 'Working Professionals'
  | 'Students'
  | 'Anyone';

export type ListingStatus =
  | 'Pending Verification'
  | 'Active'
  | 'Rejected'
  | 'Paused'
  | 'Rented';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'suspended';
  city: string;
  partnerId?: string;
  createdAt: string;
  isDemo?: boolean;
}

export interface Property {
  id: string;
  title: string;
  type: PropertyType;
  locality: string;
  city: string;
  address: string;
  pincode: string;
  rent: number;
  deposit: number;
  maintenance: number;
  negotiable: boolean;
  bhk: number; // 0 for Commercial/PG single
  bathrooms: number;
  areaSqFt: number;
  floor: number;
  totalFloors: number;
  propertyAge: string;
  furnishing: FurnishingStatus;
  preferredTenants: TenantPreference[];
  parking: 'None' | 'Bike' | 'Car' | 'Car & Bike';
  petFriendly: boolean;
  availableFrom: string;
  amenities: string[];
  description: string;
  images: string[];
  verified: boolean;
  isDemoListing?: boolean;
  listedBy: 'Owner' | 'Agent' | 'Partner';
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerEmail: string;
  status: ListingStatus;
  rejectionReason?: string;
  views: number;
  leadsCount: number;
  createdAt: string;
  lat?: number;
  lng?: number;
}

export type InquiryStatus = 'Sent' | 'Contacted' | 'Visit Scheduled' | 'Completed';

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocality: string;
  propertyRent: number;
  tenantId: string;
  tenantName: string;
  tenantPhone: string;
  ownerId: string;
  ownerName: string;
  assignedPartnerId?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export type VisitStatus = 'Scheduled' | 'Rescheduled' | 'Completed' | 'Cancelled';

export interface ScheduledVisit {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyLocality: string;
  tenantId: string;
  tenantName: string;
  ownerId: string;
  ownerName: string;
  visitDate: string;
  visitTime: string;
  status: VisitStatus;
  notes?: string;
  createdAt: string;
}

export type PartnerType =
  | 'Real Estate Broker'
  | 'Property Consultant'
  | 'Rental Agent'
  | 'Local Property Connector'
  | 'Builder & Developer'
  | 'Property Management Partner';

export interface PartnerApplication {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  operatingAreas: string[];
  partnerType: PartnerType;
  yearsExperience: number;
  agencyName?: string;
  reraNumber?: string;
  panProvided: boolean;
  about: string;
  referralSource: string;
  status: 'Pending Review' | 'Approved' | 'Rejected';
  assignedPartnerId?: string;
  createdAt: string;
}

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'Qualified'
  | 'Visit Scheduled'
  | 'Converted'
  | 'Lost';

export interface PartnerLead {
  id: string;
  partnerId: string;
  customerName: string;
  mobile: string;
  interestedLocation: string;
  budget: number;
  propertyType: PropertyType;
  leadSource: string;
  date: string;
  status: LeadStatus;
  notes: string;
  followUpDate: string;
  isDemo?: boolean;
}

export interface CommissionRecord {
  id: string;
  partnerId: string;
  propertyTitle: string;
  tenantName: string;
  amount: number;
  status: 'Paid' | 'Pending';
  date: string;
  isDemo?: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface SearchFilters {
  location: string;
  minRent: number;
  maxRent: number;
  propertyType: PropertyType | 'All';
  bhk: number | 'All'; // 1, 2, 3, 4 (4+)
  furnishing: FurnishingStatus | 'All';
  preferredTenant: TenantPreference | 'All';
  bathrooms: number | 'All';
  parking: boolean;
  petFriendly: boolean;
  ownerOnly: boolean;
  verifiedOnly: boolean;
  sortBy: 'recommended' | 'price_asc' | 'price_desc' | 'recent';
}

export type AppPage =
  | 'home'
  | 'search'
  | 'property-detail'
  | 'auth'
  | 'list-property'
  | 'become-partner'
  | 'tenant-dashboard'
  | 'owner-dashboard'
  | 'partner-dashboard'
  | 'admin-dashboard';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}
