// Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import '../styles/Navbar.css'; // Assuming you have a CSS file for styling

const Navbar = ({ user }) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Clinic</Link>
      </div>
      <ul>
        {user?.role === "admin" ? (
          <>
            <li><Link to="/bookings">All Bookings</Link></li>
            <li><Link to="/doctors">Manage Doctors</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/appointments">My Bookings</Link></li>
            <li><Link to="/doctors">Doctors</Link></li>
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
