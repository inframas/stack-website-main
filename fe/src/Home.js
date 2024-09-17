import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Headerjamcost from './Headerjamcost';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [userId, setUserId] = useState(null); // State to store user_id

  const checkSession = async () => {
    try {
      // const response = await fetch('http://localhost:7070/check-session', {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/check-session`, {
        method: 'GET',
        credentials: 'include',  // Include cookies in the request
      });

      const data = await response.json();

      if (response.ok && data.status === 'active') {
        // Session is active, set the user_id
        setUserId(data.user_id); // Assuming your backend sends user_id in response
        setLoading(false);  // Stop loading once session is validated
      } else {
        // No active session, redirect to login
        console.error('No active session found, redirecting to login...');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during session check:', error.message);
      navigate('/login');
    }
  };

  useEffect(() => {
    checkSession();  // Check session status when component mounts
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>;  // Show a loading message while checking session
  }

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
    <div>
      <Headerjamcost />
      <div style={{ margin: '50px' }}>
        <h2>Welcome to the Home Page!</h2>
        <p>This is the home page. You are logged in.</p>
        {/* <button onClick={handleLogout}>Logout</button> */}
      </div>
    </div>
  );
};

export default Home;
