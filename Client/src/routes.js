import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from './store/authSlice';
import LoadingSpinner from './components/common/LoadingSpinner';

// ── Layouts (eager load) ──────────────────────────────────────────────────────
import MainLayout from './layouts/MainLayout';
import VideoLayout from './layouts/VideoLayout';
import CommunityLayout from './layouts/CommunityLayout';
import AuthLayout from './layouts/AuthLayout';

// ── Lazy-loaded Pages ─────────────────────────────────────────────────────────
const Home            = lazy(() => import('./pages/Home'));
const Watch           = lazy(() => import('./pages/Watch'));
const Shorts          = lazy(() => import('./pages/Shorts'));
const Channel         = lazy(() => import('./pages/Channel'));
const Upload          = lazy(() => import('./pages/Upload'));
const Search          = lazy(() => import('./pages/Search'));
const Subscriptions   = lazy(() => import('./pages/Subscriptions'));
const History         = lazy(() => import('./pages/History'));
const Playlist        = lazy(() => import('./pages/Playlist'));
const Chat            = lazy(() => import('./pages/Chat'));
const Community       = lazy(() => import('./pages/Community'));
const CommunityChannel= lazy(() => import('./pages/CommunityChannel'));
const WatchPartyPage  = lazy(() => import('./pages/WatchPartyPage'));
const Profile         = lazy(() => import('./pages/Profile'));
const Settings        = lazy(() => import('./pages/Settings'));
const Login           = lazy(() => import('./pages/Login'));
const Register        = lazy(() => import('./pages/Register'));
const NotFound        = lazy(() => import('./pages/NotFound'));

// ── Protected Route Guard ─────────────────────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// ── Public-only Route (redirect if logged in) ─────────────────────────────────
const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

// ── Page Suspense Wrapper ─────────────────────────────────────────────────────
const Page = ({ children }) => (
  <Suspense fallback={<LoadingSpinner fullScreen />}>
    {children}
  </Suspense>
);

// ── App Routes ────────────────────────────────────────────────────────────────
const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Auth Routes ─────────────────────────────────────────── */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Page><Login /></Page>
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Page><Register /></Page>
            </PublicRoute>
          }
        />
      </Route>

      {/* ── Main App Routes ─────────────────────────────────────── */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Page><Home /></Page>} />
        <Route path="/shorts" element={<Page><Shorts /></Page>} />
        <Route path="/search" element={<Page><Search /></Page>} />

        {/* Private */}
        <Route path="/upload" element={<PrivateRoute><Page><Upload /></Page></PrivateRoute>} />
        <Route path="/subscriptions" element={<PrivateRoute><Page><Subscriptions /></Page></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><Page><History /></Page></PrivateRoute>} />
        <Route path="/playlist/:id" element={<PrivateRoute><Page><Playlist /></Page></PrivateRoute>} />
        <Route path="/profile/:id" element={<Page><Profile /></Page>} />
        <Route path="/settings" element={<PrivateRoute><Page><Settings /></Page></PrivateRoute>} />
        <Route path="/channel/:id" element={<Page><Channel /></Page>} />
      </Route>

      {/* ── Video Layout ────────────────────────────────────────── */}
      <Route element={<VideoLayout />}>
        <Route path="/watch/:id" element={<Page><Watch /></Page>} />
      </Route>

      {/* ── Chat Routes ─────────────────────────────────────────── */}
      <Route
        path="/chat/*"
        element={
          <PrivateRoute>
            <Page><Chat /></Page>
          </PrivateRoute>
        }
      />
      <Route
        path="/chat/:chatId"
        element={
          <PrivateRoute>
            <Page><Chat /></Page>
          </PrivateRoute>
        }
      />

      {/* ── Community Routes ────────────────────────────────────── */}
      <Route element={<CommunityLayout />}>
        <Route
          path="/community/:communityId"
          element={
            <PrivateRoute>
              <Page><Community /></Page>
            </PrivateRoute>
          }
        />
        <Route
          path="/community/:communityId/channel/:channelId"
          element={
            <PrivateRoute>
              <Page><CommunityChannel /></Page>
            </PrivateRoute>
          }
        />
      </Route>

      {/* ── Watch Party Routes ──────────────────────────────────── */}
      <Route
        path="/watch-party/:partyId"
        element={
          <PrivateRoute>
            <Page><WatchPartyPage /></Page>
          </PrivateRoute>
        }
      />

      {/* ── 404 ─────────────────────────────────────────────────── */}
      <Route path="*" element={<Page><NotFound /></Page>} />
    </Routes>
  );
};

export default AppRoutes;
