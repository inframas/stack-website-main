import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Headerjamcost from './Headerjamcost';
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS

const Deckcard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // State to store user_id

  // Function to check the session
  const checkSession = async () => {
    try {
      const response = await fetch('http://localhost:7070/check-session', {
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

  // Check session when the component mounts
  useEffect(() => {
    checkSession();
  }, [navigate]);

  if (loading) {
    return <p>Loading...</p>;  // Show a loading message while checking session
  }

  return (
    <div>
      <Headerjamcost />
      <div className="container my-4">
        <div className="row">


          {/* Card for Online Battle */}
          <div className="col-md-6 mb-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Rank Battle</h5>
                <p className="card-text">Challenge other players from around the world for the throphy.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate('/battle-online')}
                >
                  Start Rank Battle
                </button>
              </div>
            </div>
          </div>


          {/* Card for VS Bot */}
          <div className="col-md-6 mb-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Battle VS Bot</h5>
                <p className="card-text">Test your skills against a computer-controlled opponent.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate('/battlebot')}
                >
                  Start VS Bot
                </button>
              </div>
            </div>
          </div>

          {/* Card for Online Battle */}
          <div className="col-md-6 mb-4">
            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-title">Online Battle</h5>
                <p className="card-text">Challenge other players from around the world.</p>
                <button 
                  className="btn btn-primary" 
                  onClick={() => navigate('/battle-online')}
                >
                  Start Online Battle
                </button>
              </div>
            </div>
          </div>





        </div>
      </div>
    </div>
  );
};

export default Deckcard;
