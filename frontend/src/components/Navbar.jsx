import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        {/* Link to home route */}
        <Link to="/">Picture App</Link>
      </div>
      <div className="navbar-links">
        {isLoading ? (
          <span>Loading...</span>
        ) : isAuthenticated ? (
          <>
            <span className="navbar-user">Welcome, {user?.name || 'User'}!</span>
            {/* Links for authenticated users only */}
            <Link to="/upload" className="navbar-link">Upload</Link>
            <Link to="/forum" className="navbar-link">Forum</Link>
            {/* Add more authenticated-only links as needed */}
            <button onClick={handleLogout} className="navbar-button">Logout</button>
          </>
        ) : (
          <>
            {/* Links for guests (not authenticated) */}
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/signup" className="navbar-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
