import { useStore } from './store/useStore';
import { EmergencyBanner } from './components/common/EmergencyBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';

// Patient & Public Pages
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { ChatPage } from './pages/ChatPage';
import { HistoryPage } from './pages/HistoryPage';
import { SymptomDiaryPage } from './pages/SymptomDiaryPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Admin Page
import { AdminDashboard } from './pages/admin/AdminDashboard';

export default function App() {
  const { currentPage } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-teal-600 selection:text-white">
      {/* 24/7 Medical Emergency Banner */}
      <EmergencyBanner />

      {/* Top Clinical Navigation Bar */}
      <Navbar />

      {/* Primary Application Router */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'chat' && <ChatPage />}
        {currentPage === 'history' && <HistoryPage />}
        {currentPage === 'diary' && <SymptomDiaryPage />}
        {currentPage === 'resources' && <ResourcesPage />}
        {currentPage === 'privacy' && <PrivacyPage />}
        {currentPage === 'profile' && <ProfilePage />}
        {currentPage === 'login' && <LoginPage />}
        {currentPage === 'register' && <RegisterPage />}
        {currentPage === 'admin' && <AdminDashboard />}
      </main>

      {/* Global Clinical Toast Container */}
      <ToastContainer />

      {/* Medical Disclaimer & Safety Governance Footer */}
      <Footer />
    </div>
  );
}
