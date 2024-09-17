import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS
import Header from './Header';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        username,
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
  
      if (response.status === 200) {
        setMessage('Login successful');
        setLoggedIn(true);  // Update the state to reflect logged-in status
        navigate('/home');  // Redirect to /home page
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail || 'Login failed');
      } else {
        setMessage('Server error');
      }
    }
  };
  

  // const checkSession = async () => {
  //   try {
  //     const response = await axios.get('http://localhost:7070/', {
  //       withCredentials: true  // Ensure cookies are sent
  //     });

  //     if (response.status === 200) {
  //       setLoggedIn(true);
  //       navigate('/home');  // Redirect to /home page if session is active
  //     }
  //   } catch (error) {
  //     // Handle cases where session is not active
  //     setLoggedIn(false);
  //   }
  // };


  const checkSession = async () => {
    try {
      // const response = await axios.get('http://localhost:7070/check-session', {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/check-session`, {
        withCredentials: true  // Ensure cookies are sent
      });

      if (response.data.status === 'active') {
        // Print user_id to the console if session is active
        console.log('User ID:', response.data.user); // Assuming `user` contains the user_id
        navigate('/home');  // Redirect to /home page if session is active
      } else {
        // Print a message if session is not active
        console.log('Session is inactive');
      }
    } catch (error) {
      console.error('Failed to check session:', error);
      // Optionally handle errors here
    }
  };

  useEffect(() => {
    if (!loggedIn) {
      checkSession();  // Check session only if the user is not logged in
    }
  }, [loggedIn, navigate]);

  return (
    <div>
      <Header />
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="card p-4 shadow-sm" style={{ maxWidth: '400px', width: '100%' }}>
          <h2 className="card-title text-center mb-4">Login</h2>
          {loggedIn && <p className="text-success text-center">{message}</p>}
          {!loggedIn ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">Login</button>
            </form>
          ) : (
            <p className="text-center">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
