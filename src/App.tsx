import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';
import { PageLoader } from './components/common/PageLoader';

// Code-split pages for high performance and minimal initial bundle size
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const DashboardPage = lazy(() => import('./pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const AssistantPage = lazy(() => import('./pages/AssistantPage').then(m => ({ default: m.AssistantPage })));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage').then(m => ({ default: m.DocumentsPage })));
const KnowledgeVaultPage = lazy(() => import('./pages/KnowledgeVaultPage').then(m => ({ default: m.KnowledgeVaultPage })));
const TaskPlannerPage = lazy(() => import('./pages/TaskPlannerPage').then(m => ({ default: m.TaskPlannerPage })));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));

const AppRoutes: React.FC = () => {
  const { isWorkspaceEntered } = useApp();

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Landing page explicitly accessible */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Main App Layout */}
        <Route
          path="/"
          element={
            !isWorkspaceEntered ? (
              <Navigate to="/landing" replace />
            ) : (
              <AppLayout />
            )
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="assistant" element={<AssistantPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="vault" element={<KnowledgeVaultPage />} />
          <Route path="tasks" element={<TaskPlannerPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
