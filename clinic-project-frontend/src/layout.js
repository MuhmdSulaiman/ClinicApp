// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './user/Navbar';

function Layout() {
  return (
    <>
      <Navbar />
      <Outlet /> {/* This is where each page will be shown */}
    </>
  );
}

export default Layout;
