import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import {
  AppPage,
  AppNotification,
  CommissionRecord,
  Inquiry,
  InquiryStatus,
  LeadStatus,
  ListingStatus,
  PartnerApplication,
  PartnerLead,
  Property,
  ScheduledVisit,
  SearchFilters,
  ToastMessage,
  UserProfile,
  UserRole,
  VisitStatus,
} from '../types';
import {
  INITIAL_DEMO_COMMISSIONS,
  INITIAL_DEMO_INQUIRIES,
  INITIAL_DEMO_LEADS,
  INITIAL_DEMO_PARTNER_APPS,
  INITIAL_DEMO_PROPERTIES,
  INITIAL_DEMO_USERS,
  INITIAL_DEMO_VISITS,
} from '../data/bhopalData';

const DEFAULT_FILTERS: SearchFilters = {
  location: '',
  minRent: 0,
  maxRent: 100000,
  propertyType: 'All',
  bhk: 'All',
  furnishing: 'All',
  preferredTenant: 'All',
  bathrooms: 'All',
  parking: false,
  petFriendly: false,
  ownerOnly: false,
  verifiedOnly: false,
  sortBy: 'recommended',
};

interface AppContextValue {
  currentPage: AppPage;
  navigate: (page: AppPage, propertyId?: string) => void;
  selectedPropertyId: string | null;
  currentUser: UserProfile | null;
  authLoading: boolean;
  loginWithGoogle: (preferredRole?: UserRole) => Promise<void>;
  loginDemoRole: (role: UserRole, customDetails?: Partial<UserProfile>) => void;
  logout: () => Promise<void>;
  properties: Property[];
  addProperty: (prop: Omit<Property, 'id' | 'createdAt' | 'views' | 'leadsCount'>) => Promise<Property>;
  updatePropertyStatus: (id: string, status: ListingStatus, rejectionReason?: string, verified?: boolean) => Promise<void>;
  deleteProperty: (id: string) => Promise<void>;
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  recentlyViewed: string[];
  markViewed: (propertyId: string) => void;
  filters: SearchFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  resetFilters: () => void;
  inquiries: Inquiry[];
  createInquiry: (property: Property, message: string) => Promise<void>;
  updateInquiryStatus: (id: string, status: InquiryStatus, assignedPartnerId?: string) => void;
  visits: ScheduledVisit[];
  scheduleVisit: (property: Property, visitDate: string, visitTime: string, notes?: string) => Promise<void>;
  updateVisit: (id: string, status: VisitStatus, newDate?: string, newTime?: string) => void;
  partnerApplications: PartnerApplication[];
  submitPartnerApplication: (app: Omit<PartnerApplication, 'id' | 'status' | 'createdAt'>) => Promise<void>;
  reviewPartnerApplication: (id: string, status: 'Approved' | 'Rejected') => void;
  partnerLeads: PartnerLead[];
  updatePartnerLead: (id: string, updates: Partial<PartnerLead>) => void;
  addPartnerLead: (lead: Omit<PartnerLead, 'id'>) => void;
  commissions: CommissionRecord[];
  users: UserProfile[];
  toggleUserStatus: (uid: string) => void;
  notifications: AppNotification[];
  markAllNotificationsRead: () => void;
  toasts: ToastMessage[];
  showToast: (text: string, type?: ToastMessage['type']) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<AppPage>('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [properties, setProperties] = useState<Property[]>(INITIAL_DEMO_PROPERTIES);
  const [favorites, setFavorites] = useState<string[]>(['BN-101', 'BN-103']);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(['BN-101', 'BN-102']);
  const [filters, setFilters] = useState<SearchFilters>(DEFAULT_FILTERS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_DEMO_INQUIRIES);
  const [visits, setVisits] = useState<ScheduledVisit[]>(INITIAL_DEMO_VISITS);
  const [partnerApplications, setPartnerApplications] = useState<PartnerApplication[]>(INITIAL_DEMO_PARTNER_APPS);
  const [partnerLeads, setPartnerLeads] = useState<PartnerLead[]>(INITIAL_DEMO_LEADS);
  const [commissions] = useState<CommissionRecord[]>(INITIAL_DEMO_COMMISSIONS);
  const [users, setUsers] = useState<UserProfile[]>(INITIAL_DEMO_USERS);
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'N-1',
      userId: 'all',
      title: 'Welcome to BhopalNest',
      message: 'Explore verified flats, villas, PGs, and commercial spaces across Bhopal.',
      read: false,
      createdAt: new Date().toISOString(),
    },
  ]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: ToastMessage['type'] = 'success') => {
    const id = 'toast-' + Date.now() + Math.random().toString(36).slice(2, 6);
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  };

  // Sync Firebase Auth & load any persisted Firestore properties
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const isAdminEmail = fbUser.email === 'yashkushwah.advertising360@gmail.com';
        const profile: UserProfile = {
          uid: fbUser.uid,
          fullName: fbUser.displayName || fbUser.email?.split('@')[0] || 'BhopalNest User',
          email: fbUser.email || '',
          phone: fbUser.phoneNumber || '+91 98260 00000',
          role: isAdminEmail ? 'admin' : 'tenant',
          status: 'active',
          city: 'Bhopal',
          createdAt: new Date().toISOString(),
        };
        setCurrentUser((prev) => prev && prev.uid === fbUser.uid ? prev : profile);
      }
      setAuthLoading(false);
    });

    // Fetch live Firestore properties and merge with demo properties
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'properties'));
        if (!snap.empty) {
          const liveProps = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Property, 'id'>) }));
          setProperties((prev) => {
            const existingIds = new Set(liveProps.map((p) => p.id));
            return [...liveProps, ...prev.filter((p) => !existingIds.has(p.id))];
          });
        }
      } catch {
        // Fallback silently to demo dataset if Firestore is empty or offline
      }
    })();

    return () => unsub();
  }, []);

  const navigate = (page: AppPage, propertyId?: string) => {
    if (propertyId) {
      setSelectedPropertyId(propertyId);
      markViewed(propertyId);
    }
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loginWithGoogle = async (preferredRole: UserRole = 'tenant') => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const isAdminEmail = res.user.email === 'yashkushwah.advertising360@gmail.com';
      const role: UserRole = isAdminEmail ? 'admin' : preferredRole;
      const profile: UserProfile = {
        uid: res.user.uid,
        fullName: res.user.displayName || 'BhopalNest User',
        email: res.user.email || '',
        phone: res.user.phoneNumber || '+91 98260 55112',
        role,
        status: 'active',
        city: 'Bhopal',
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(profile);
      try {
        await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${profile.uid}`);
      }
      showToast(`Signed in as ${profile.fullName}`);
      navigate(
        role === 'admin'
          ? 'admin-dashboard'
          : role === 'owner'
          ? 'owner-dashboard'
          : role === 'partner'
          ? 'partner-dashboard'
          : 'tenant-dashboard'
      );
    } catch {
      showToast('Google Sign-In was cancelled or blocked. You can use +91 OTP / Demo Login below.', 'info');
    }
  };

  const loginDemoRole = (role: UserRole, customDetails?: Partial<UserProfile>) => {
    const preset = INITIAL_DEMO_USERS.find((u) => u.role === role) || INITIAL_DEMO_USERS[0];
    const user: UserProfile = {
      ...preset,
      ...customDetails,
      role,
    };
    setCurrentUser(user);
    setUsers((prev) => (prev.some((u) => u.uid === user.uid) ? prev : [user, ...prev]));
    showToast(`Welcome, ${user.fullName} (${role.toUpperCase()})`);
    navigate(
      role === 'admin'
        ? 'admin-dashboard'
        : role === 'owner'
        ? 'owner-dashboard'
        : role === 'partner'
        ? 'partner-dashboard'
        : 'tenant-dashboard'
    );
  };

  const logout = async () => {
    try {
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch {
      // ignore
    }
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
    navigate('home');
  };

  const addProperty = async (
    prop: Omit<Property, 'id' | 'createdAt' | 'views' | 'leadsCount'>
  ): Promise<Property> => {
    const id = 'BN-' + Math.floor(200 + Math.random() * 799);
    const newProp: Property = {
      ...prop,
      id,
      views: 1,
      leadsCount: 0,
      createdAt: new Date().toISOString(),
    };
    setProperties((prev) => [newProp, ...prev]);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'properties', id), { ...newProp, ownerId: auth.currentUser.uid });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `properties/${id}`);
      }
    }

    setNotifications((prev) => [
      {
        id: 'N-' + Date.now(),
        userId: prop.ownerId,
        title: 'Property Submitted',
        message: `"${prop.title}" is now Pending Verification.`,
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    showToast('Property submitted for verification!');
    return newProp;
  };

  const updatePropertyStatus = async (
    id: string,
    status: ListingStatus,
    rejectionReason?: string,
    verified?: boolean
  ) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              rejectionReason: rejectionReason ?? p.rejectionReason,
              verified: verified !== undefined ? verified : status === 'Active' ? true : p.verified,
            }
          : p
      )
    );
    if (auth.currentUser) {
      try {
        await updateDoc(doc(db, 'properties', id), { status });
      } catch {
        // Demo property not in Firestore
      }
    }
    showToast(`Listing ${id} updated to ${status}`);
  };

  const deleteProperty = async (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    if (auth.currentUser) {
      try {
        await deleteDoc(doc(db, 'properties', id));
      } catch {
        // Demo property
      }
    }
    showToast(`Listing ${id} removed`, 'info');
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(propertyId);
      showToast(exists ? 'Removed from saved properties' : 'Saved to your shortlist', 'info');
      return exists ? prev.filter((id) => id !== propertyId) : [propertyId, ...prev];
    });
  };

  const markViewed = (propertyId: string) => {
    setRecentlyViewed((prev) => [propertyId, ...prev.filter((id) => id !== propertyId)].slice(0, 8));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const createInquiry = async (property: Property, message: string) => {
    const user = currentUser || INITIAL_DEMO_USERS[0];
    const id = 'INQ-' + Math.floor(500 + Math.random() * 499);
    const inq: Inquiry = {
      id,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocality: property.locality,
      propertyRent: property.rent,
      tenantId: user.uid,
      tenantName: user.fullName,
      tenantPhone: user.phone,
      ownerId: property.ownerId,
      ownerName: property.ownerName,
      message,
      status: 'Sent',
      createdAt: new Date().toISOString(),
    };
    setInquiries((prev) => [inq, ...prev]);
    setProperties((prev) =>
      prev.map((p) => (p.id === property.id ? { ...p, leadsCount: p.leadsCount + 1 } : p))
    );
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'inquiries', id), { ...inq, tenantId: auth.currentUser.uid });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `inquiries/${id}`);
      }
    }
    showToast('Inquiry sent to property owner!');
  };

  const updateInquiryStatus = (id: string, status: InquiryStatus, assignedPartnerId?: string) => {
    setInquiries((prev) =>
      prev.map((inq) =>
        inq.id === id
          ? { ...inq, status, assignedPartnerId: assignedPartnerId ?? inq.assignedPartnerId }
          : inq
      )
    );
    showToast(`Inquiry ${id} marked as ${status}`);
  };

  const scheduleVisit = async (
    property: Property,
    visitDate: string,
    visitTime: string,
    notes?: string
  ) => {
    const user = currentUser || INITIAL_DEMO_USERS[0];
    const id = 'VIS-' + Math.floor(700 + Math.random() * 299);
    const visit: ScheduledVisit = {
      id,
      propertyId: property.id,
      propertyTitle: property.title,
      propertyLocality: property.locality,
      tenantId: user.uid,
      tenantName: user.fullName,
      ownerId: property.ownerId,
      ownerName: property.ownerName,
      visitDate,
      visitTime,
      status: 'Scheduled',
      notes,
      createdAt: new Date().toISOString(),
    };
    setVisits((prev) => [visit, ...prev]);
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'visits', id), { ...visit, tenantId: auth.currentUser.uid });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `visits/${id}`);
      }
    }
    showToast(`Visit scheduled for ${visitDate} at ${visitTime}`);
  };

  const updateVisit = (id: string, status: VisitStatus, newDate?: string, newTime?: string) => {
    setVisits((prev) =>
      prev.map((v) =>
        v.id === id
          ? {
              ...v,
              status,
              visitDate: newDate || v.visitDate,
              visitTime: newTime || v.visitTime,
            }
          : v
      )
    );
    showToast(`Visit ${status.toLowerCase()}`);
  };

  const submitPartnerApplication = async (
    app: Omit<PartnerApplication, 'id' | 'status' | 'createdAt'>
  ) => {
    const id = 'PA-' + Math.floor(600 + Math.random() * 399);
    const newApp: PartnerApplication = {
      ...app,
      id,
      status: 'Pending Review',
      createdAt: new Date().toISOString(),
    };
    setPartnerApplications((prev) => [newApp, ...prev]);
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'partnerApplications', id), { ...newApp, userId: auth.currentUser.uid });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, `partnerApplications/${id}`);
      }
    }
    showToast('Partner application submitted successfully!');
  };

  const reviewPartnerApplication = (id: string, status: 'Approved' | 'Rejected') => {
    const partnerCode = status === 'Approved' ? 'BNP-' + Math.floor(300 + Math.random() * 699) : undefined;
    setPartnerApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, assignedPartnerId: partnerCode } : a))
    );
    showToast(`Partner application ${status}${partnerCode ? ` (ID: ${partnerCode})` : ''}`);
  };

  const updatePartnerLead = (id: string, updates: Partial<PartnerLead>) => {
    setPartnerLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    showToast('Lead updated');
  };

  const addPartnerLead = (lead: Omit<PartnerLead, 'id'>) => {
    const id = 'LD-' + Math.floor(400 + Math.random() * 599);
    setPartnerLeads((prev) => [{ ...lead, id }, ...prev]);
    showToast('New lead added to your pipeline');
  };

  const toggleUserStatus = (uid: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.uid === uid ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u
      )
    );
    showToast('User account status updated');
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        selectedPropertyId,
        currentUser,
        authLoading,
        loginWithGoogle,
        loginDemoRole,
        logout,
        properties,
        addProperty,
        updatePropertyStatus,
        deleteProperty,
        favorites,
        toggleFavorite,
        recentlyViewed,
        markViewed,
        filters,
        setFilters,
        resetFilters,
        inquiries,
        createInquiry,
        updateInquiryStatus,
        visits,
        scheduleVisit,
        updateVisit,
        partnerApplications,
        submitPartnerApplication,
        reviewPartnerApplication,
        partnerLeads,
        updatePartnerLead,
        addPartnerLead,
        commissions,
        users,
        toggleUserStatus,
        notifications,
        markAllNotificationsRead,
        toasts,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
