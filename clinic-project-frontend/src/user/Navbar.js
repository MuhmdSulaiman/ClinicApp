// Navbar.js
import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Clinic</Link>
      </div>
      <ul>
        {user?.role === "admin" ? (
          <>
            <li><Link to="/admin/bookings">All Bookings</Link></li>
            <li><Link to="/admin/doctors">Manage Doctors</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/my-bookings">My Bookings</Link></li>
            <li><Link to="/doctors-list">Doctors</Link></li>
          </>
        )}
        <li className="profile">
          <span>{user?.name}</span>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
