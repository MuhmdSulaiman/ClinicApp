// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './user/Navbar';

function Layout() {
  return (
    <>
      <div className="layout-navbar">
  <Navbar />
  
</div>
<main>
  <Outlet />
</main>

    </>
  );
}

export default Layout;
