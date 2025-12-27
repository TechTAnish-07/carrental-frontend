import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import Profileicon from '../assets/Profileicon.png';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [clickedNav, setClickedNav] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, [location]);
  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);
  }, [location]);

  const scrollToHomeSection = (sectionId) => {
    if (location.pathname === '/') {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition - offset,
          behavior: 'smooth'
        });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  useEffect(() => {
    if (clickedNav) {
      document.title = `${clickedNav}`;
    }
  }, [clickedNav]);

  useEffect(() => {
    const handleHashLink = () => {
      if (location.pathname === '/' && window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        setTimeout(() => {
          scrollToHomeSection(sectionId);
        }, 100);
      }
    };

    handleHashLink();
  }, [location]);

  return (
    <nav className="navbar">
      <div className="logo">SAngRAj<span> Rental</span></div>

      <div className={`nav-links ${isOpen ? 'active' : ''}`}>
        <NavLink
          to="/"
          className={({ isActive }) => isActive ? 'active' : ''}
          onClick={() => { setClickedNav('Home'); setIsOpen(false); }}
        >
          Home
        </NavLink>

      {currentUser?.role !== "ROLE_ADMIN" && (
        <NavLink
          to="/Cars"
          className={({ isActive }) => isActive ? 'active' : ''}
          onClick={() => { setClickedNav('Cars'); setIsOpen(false); }}
        >
          Cars
        </NavLink>
      )}

        {isLoggedIn && currentUser?.role === "ROLE_USER" && (
          <NavLink
            to="/user/bookings"
            className={({ isActive }) => (isActive ? "active" : "")}
            onClick={() => {
              setClickedNav("My Bookings");
              setIsOpen(false);
            }}
          >
            My Bookings
          </NavLink>
        )}



        <span
          onClick={() => {
            setClickedNav('Contact');
            setIsOpen(false);
            scrollToHomeSection('contact');
          }}
          className="nav-link"
        >
          Contact
        </span>
        {(() => {
          if (!isLoggedIn) {
            return (
              <NavLink
                to="/signin"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => {
                  setClickedNav('Login');
                  setIsOpen(false);
                }}
              >
                <button className="login-btn">Login</button>
              </NavLink>
            );
          } else if (currentUser?.role === "ROLE_ADMIN") {
            return (
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => {
                  setClickedNav('Admin');
                  setIsOpen(false);
                }}
              >
                <button className="login-btn">Admin</button>
              </NavLink>
            );
          } else {
            return (
              <NavLink
                to="/user/dashboard"
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => {
                  setClickedNav('Profile');
                  setIsOpen(false);
                }}
              >
                <button className="login-btn">
                  <img src={Profileicon} alt="Profile" className="profile-icon" />
                </button>
              </NavLink>
            );
          }
        })()}

      </div>


      <div
        className="menu-icon"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label="Toggle navigation"
      >
        ☰
      </div>
    </nav>
  );
}

export default Navbar;
