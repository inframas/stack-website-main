import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS
import Header from './Header';

const Regist = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    // Ensure the birthdate is formatted as YYYY-MM-DD (though native date input provides this format)
    const formattedBirthdate = new Date(birthdate).toISOString().split('T')[0];

    try {
      // const response = await axios.post('http://localhost:7070/register', {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/register`, {
        username,
        email,
        birthdate: formattedBirthdate,  // Send the formatted birthdate
        password
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        // withCredentials: true
      });

      if (response.status === 200) {
        setMessage('Registration successful');
        navigate('/login');  // Redirect to login page after successful registration
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.detail || 'Registration failed');
      } else {
        setMessage('Server error');
      }
    }
  };

  return (
    <div>
      <Header />
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div className="card p-4 shadow-sm" style={{ maxWidth: '500px', width: '100%' }}>
        <h2 className="card-title text-center mb-4">Regist</h2>
        {message && <p className={`text-center ${message.includes('failed') ? 'text-danger' : 'text-success'}`}>{message}</p>}
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
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="birthdate" className="form-label">Birthdate</label>
            <input
              type="date"
              id="birthdate"
              className="form-control"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
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

          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">Regist</button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Regist;
