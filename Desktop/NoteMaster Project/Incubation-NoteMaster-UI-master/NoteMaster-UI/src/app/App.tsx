import React, { useState } from 'react';
import { AppProvider, useApp } from '@/app/context/AppContext';
import { Toaster } from 'sonner';
import { LoginScreen } from '@/app/screens/LoginScreen';
import { AdminDashboard } from '@/app/screens/AdminDashboard';
import { VerticalsScreen } from '@/app/screens/VerticalsScreen';
import { VerticalDetailScreen } from '@/app/screens/VerticalDetailScreen';
import { SubtitleDetailScreen } from '@/app/screens/SubtitleDetailScreen';
import { SubtitlesScreen } from '@/app/screens/SubtitlesScreen';
import { UsersScreen } from '@/app/screens/UsersScreen';
import { ApprovalsScreen } from '@/app/screens/ApprovalsScreen';
import { UserHomeScreen } from '@/app/screens/UserHomeScreen';
import { Layout } from '@/app/components/Layout';

function Main() {
  const { currentUser } = useApp();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedVerticalId, setSelectedVerticalId] = useState<string | null>(null);
  const [selectedSubtitleId, setSelectedSubtitleId] = useState<string | null>(null);

  if (!currentUser) {
    return <LoginScreen />;
  }

  const renderView = () => {
    const isAdmin = currentUser.role === 'ADMIN';

    // Shared Views Logic
    if (currentView === 'verticals') {
        return <VerticalsScreen onNavigate={(id) => { setSelectedVerticalId(id); setCurrentView('vertical_detail'); }} />;
    }

    if (currentView === 'vertical_detail') {
        if (!selectedVerticalId) {
            setCurrentView('verticals');
            return <VerticalsScreen onNavigate={(id) => { setSelectedVerticalId(id); setCurrentView('vertical_detail'); }} />;
        }
        return <VerticalDetailScreen 
                  verticalId={selectedVerticalId} 
                  onBack={() => setCurrentView('verticals')} 
                  onNavigateToSubtitle={(id) => { setSelectedSubtitleId(id); setCurrentView('subtitle_detail'); }}
               />;
    }

    if (currentView === 'subtitle_detail') {
        if (!selectedSubtitleId) {
            setCurrentView('vertical_detail');
            return null;
        }
        return <SubtitleDetailScreen 
                  subtitleId={selectedSubtitleId} 
                  onBack={() => setCurrentView('vertical_detail')} 
               />;
    }

    // Role-Specific Views
    if (isAdmin) {
        switch (currentView) {
            case 'admin_dashboard': return <AdminDashboard />;
            case 'subtitles': return <SubtitlesScreen />;
            case 'users': return <UsersScreen />;
            case 'approvals': return <ApprovalsScreen />;
            case 'user_dashboard': return <UserHomeScreen />; // Admin can preview user dash
            case 'dashboard': return <AdminDashboard />; // Default
            default: return <AdminDashboard />;
        }
    } else {
        // Standard User Views
        switch (currentView) {
            case 'user_dashboard': return <UserHomeScreen />;
            case 'dashboard': return <UserHomeScreen />; // Default
            default: return <UserHomeScreen />;
        }
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Main />
      <Toaster position="top-right" richColors />
    </AppProvider>
  );
}
