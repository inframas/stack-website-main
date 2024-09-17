// src/Protected.js
import React from 'react';
import axios from 'axios';

const Protected = () => {
  const [message, setMessage] = React.useState('');

  React.useEffect(() => {
    // Fetch protected data or verify authentication
    // axios.get('http://localhost:7070/protected', { withCredentials: true })
    axios.get(`${process.env.REACT_APP_API_URL}/protected`, { withCredentials: true })
      .then(response => {
        setMessage(response.data.message);
      })
      .catch(error => {
        if (error.response) {
          setMessage(error.response.data.detail || 'Access denied');
        } else {
          setMessage('Server error');
        }
      });
  }, []);

  return (
    <div style={{ margin: '50px' }}>
      <h2>Protected Page</h2>
      <p>{message}</p>
    </div>
  );
};

export default Protected;
