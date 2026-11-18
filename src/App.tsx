import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { HomePage } from './pages/HomePage';
import { SearchPage } from './pages/SearchPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { AuthPage } from './pages/AuthPage';
import { ListPropertyWizard } from './pages/ListPropertyWizard';
import { BecomePartnerPage } from './pages/BecomePartnerPage';
import { TenantDashboard } from './pages/TenantDashboard';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { PartnerDashboard } from './pages/PartnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

const AppRouter: React.FC = () => {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'search':
        return <SearchPage />;
      case 'property-detail':
        return <PropertyDetailPage />;
      case 'auth':
        return <AuthPage />;
      case 'list-property':
        return <ListPropertyWizard />;
      case 'become-partner':
        return <BecomePartnerPage />;
      case 'tenant-dashboard':
        return <TenantDashboard />;
      case 'owner-dashboard':
        return <OwnerDashboard />;
      case 'partner-dashboard':
        return <PartnerDashboard />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F8F6] text-[#202822]">
      <Navbar />
      <div className="flex-1">{renderPage()}</div>
      {currentPage !== 'auth' && <Footer />}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <AppRouter />
      </AppProvider>
    </ErrorBoundary>
  );
}
