import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';

const VideoLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Header minimal />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default VideoLayout;
