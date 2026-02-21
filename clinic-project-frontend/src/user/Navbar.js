import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">Clinic</Link>
      </div>
      <ul>
        {user?.role === "admin" ? (
          <>
            <li><Link to="/appointments">All Bookings</Link></li>
            <li><Link to="/manage-doctors">Manage Doctors</Link></li>
            <li><Link to="/allusers">Users</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/appointments">My Bookings</Link></li>
            <li><Link to="/doctors">Doctors</Link></li>
          </>
        )}
        {user ? (
          <li className="profile">
             <Link to="/profile" className="profile-link">
            <span>{user.name}</span></Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </li>
        ) : (
          <>
            <li><Link to="/">Login</Link></li>
            <li><Link to="/signup">Register</Link></li>
          </>
        )}
        <link to ="/users">
        <button>Users</button>
        </link>
      </ul>
    </nav>
  );
};

export default Navbar;
