import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Navbar.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user in localStorage");
        localStorage.removeItem("user");
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : "U";
  };

  return (
    <div className="navbar-container">
      <motion.nav
        className="navbar"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
      >
        <div className="logo">
          <Link to="/doctors">
            Health<span>Clinic</span>
          </Link>
        </div>

        <ul className="nav-links">
          {user?.role === "admin" ? (
            <>
              <motion.li whileHover={{ scale: 1.05 }}><Link to="/appointments">All Bookings</Link></motion.li>
              <motion.li whileHover={{ scale: 1.05 }}><Link to="/manage-doctors">Manage Doctors</Link></motion.li>
              <motion.li whileHover={{ scale: 1.05 }}><Link to="/allusers">Users</Link></motion.li>
            </>
          ) : (
            <>
              <motion.li whileHover={{ scale: 1.05 }}><Link to="/appointments">My Bookings</Link></motion.li>
              <motion.li whileHover={{ scale: 1.05 }}><Link to="/doctors">Doctors</Link></motion.li>
            </>
          )}
        </ul>

        <div className="profile-container">
          {user ? (
            <>
              <Link to="/profile" className="profile-link">
                <motion.div
                  className="profile-avatar"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {getInitial(user.name)}
                </motion.div>
                <span className="profile-name">{user.name}</span>
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="logout-btn"
              >
                Logout
              </motion.button>
            </>
          ) : (
            <>
              <motion.li whileHover={{ scale: 1.05 }} style={{ listStyle: 'none' }}>
                <Link to="/" className="login-btn">Login</Link>
              </motion.li>
              <motion.li whileHover={{ scale: 1.05 }} style={{ listStyle: 'none' }}>
                <Link to="/signup">Register</Link>
              </motion.li>
            </>
          )}
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
