import React, { useEffect } from 'react';
import axios from 'axios';

const DirectTest = () => {

  useEffect(() => {
    
    const checkSession = async () => {
      try {
        const response = await axios.get('http://localhost:7070/check-session-new', {
          withCredentials: true  // Ensure cookies are sent
        });

        if (response.data.status === 'active') {
          // Print user_id to the console if session is active
          console.log('User ID:', response.data.user); // Assuming `user` contains the user_id
        } else {
          // Print a message if session is not active
          console.log('Session is inactive');
        }
      } catch (error) {
        console.error('Failed to check session:', error);
        // Optionally handle errors here
      }
    };

    checkSession();
  }, []); // Empty dependency array means this runs once on component mount

  return null; // Or render some loading component if needed
};

export default DirectTest;
    