import React from 'react';
import { Outlet, useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CommunitySidebar from '../components/community/CommunitySidebar';
import MemberList from '../components/community/MemberList';
import { useWindowSize } from '../hooks/useWindowSize';
import { selectIsAuthenticated } from '../store/authSlice';

const CommunityLayout = () => {
  const { isDesktop, isWide } = useWindowSize();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Left: Community + Channel sidebar */}
      <CommunitySidebar />

      {/* Center: Channel content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar min-w-0">
        <Outlet />
      </main>

      {/* Right: Members list (desktop only) */}
      {isWide && (
        <aside className="w-60 shrink-0 border-l border-gray-800 bg-gray-900 overflow-y-auto custom-scrollbar">
          <MemberList />
        </aside>
      )}
    </div>
  );
};

export default CommunityLayout;
