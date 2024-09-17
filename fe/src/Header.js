// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS

const Header = () => {
  return (
    <header className="bg-dark text-white py-3">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          {/* Logo */}
          <div>
            <img 
              src="logo192.png" 
              alt="Logo" 
              style={{ height: '40px' }}  // Adjust size as needed
            />
          </div>

          {/* Menu */}
          <div className="text-center flex-grow-1">
            <ul className="nav justify-content-center">
              <li className="nav-item">
                <Link className="nav-link text-white" to="/">DASHBOARD</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/home">HOME</Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link text-white" to="/games">GAMES</Link>
              </li> */}
              {/* Add more menu items here */}
            </ul>
          </div>

          <div className="d-flex gap-2">
            {/* Login Button */}
            <Link to="/login" className="btn btn-light">Login</Link>
            {/* Register Button */}
            <Link to="/regist" className="btn btn-light">Register</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
