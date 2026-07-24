import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Loader from '../components/ui/Loader';
import ErrorBoundary from '../components/layout/ErrorBoundary';
import ProtectedRoute from './ProtectedRoute';

// Lazy-loaded pages for production code splitting
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Machines = lazy(() => import('../pages/Machines'));
const Alerts = lazy(() => import('../pages/Alerts'));
const History = lazy(() => import('../pages/History'));
const Readings = lazy(() => import('../pages/Readings'));
const AddReading = lazy(() => import('../pages/AddReading'));
const Profile = lazy(() => import('../pages/Profile'));
const Settings = lazy(() => import('../pages/Settings'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const NotFound = lazy(() => import('../pages/NotFound'));
const OeeDashboard = lazy(() => import('../pages/OeeDashboard'));
const Maintenance = lazy(() => import('../pages/Maintenance'));
const PlatformOverview = lazy(() => import('../pages/PlatformOverview'));

export const AppRoutes = () => {
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <Loader size="lg" label="Initializing VibeGuard AI Telemetry..." />
          </div>
        }
      >
        <Routes>
          {/* Public Standalone Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Main SaaS Nested Routes wrapped in MainLayout */}
          <Route element={<ProtectedRoute />}>
            
            {/* Overview stands alone without Sidebar */}
            <Route path="/overview" element={<PlatformOverview />} />

            <Route element={<MainLayout />}>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/machines" element={<Machines />} />
              <Route path="/readings" element={<Readings />} />
              <Route path="/readings/new" element={<AddReading />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/oee" element={<OeeDashboard />} />
              <Route path="/maintenance" element={<Maintenance />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          {/* 404 Catch All */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default AppRoutes;
