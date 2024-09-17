import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS

const Header = () => {
  const navigate = useNavigate();  // Move useNavigate inside the component

  const handleLogout = async () => {
    try {
      // Call the logout endpoint to clear the session
      // await fetch('http://localhost:7070/logout', {
        await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        method: 'GET',
        credentials: 'include'  // Include cookies in the request
      });

      // Redirect to the login page after logout
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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
                <Link className="nav-link text-white" to="/home">HOME</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/battle">BATTLE</Link>
              </li> 
              <li className="nav-item">
                <Link className="nav-link text-white" to="/deckcard">DECK CARD</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/leaderboard">LEADERBOARD</Link>
              </li>
              {/* <li className="nav-item">
                <Link className="nav-link text-white" to="/deckcard">LEADERBOARD</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/deckcard">FRIENDS</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white" to="/deckcard">MARKET</Link>
              </li> */}
              {/* Add more menu items here */}
            </ul>
          </div>

          <div className="d-flex gap-2">
            {/* Login Button */}
            {/* <Link to="/login" className="btn btn-light">Login</Link> */}
            {/* Register Button */}
            {/* <Link to="/register" className="btn btn-light">Register</Link> */}
            <Link onClick={handleLogout} className="btn btn-light" to="#">Logout</Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
