import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Headerjamcost from './Headerjamcost';
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS

const Deckcard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [userId, setUserId] = useState(null); // State to store user_id

  // Function to check the session
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

  // Function to fetch user cards
  const fetchUserCards = async () => {
    if (!userId) return; // Exit if user_id is not set

    try {
      // const response = await fetch('http://localhost:7070/cards/get-user-card-all', {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/cards/get-user-card-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),  // Use the user_id from the session
        credentials: 'include',  // Include cookies in the request
      });

      const data = await response.json();
      if (response.ok) {
        setCards(data); // Set the response directly to cards
        console.log('Success to fetch user cards:');
      } else {
        console.error('Failed to fetch user cards:', data.message);
      }
    } catch (error) {
      console.error('Error during fetching user cards:', error.message);
    }
  };

  // Check session when the component mounts
  useEffect(() => {
    checkSession();
  }, [navigate]);

  // Fetch user cards after the session is confirmed active and userId is available
  useEffect(() => {
    if (!loading && userId) {
      fetchUserCards();
    }
  }, [loading, userId]);

  if (loading) {
    return <p>Loading...</p>;  // Show a loading message while checking session
  }

  return (
    <div>
      <Headerjamcost />
      <div className="container my-4">
        <div className="row">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div className="col-md-3" key={card._id}>
                <div className="card mb-3">
                  <img
                    src={`/${card._id}.png`}  // You can customize this to use card images
                    className="card-img-top"
                    alt={`Card image of ${card.name}`}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{card.name}</h5>
                    <p className="card-text">{card.description}</p>
                    <p className="card-text"><strong>Health:</strong> {card.health}</p>
                    <p className="card-text"><strong>Attack:</strong> {card.attack}</p>
                    <p className="card-text"><strong>Defense:</strong> {card.defense}</p>
                    <p className="card-text"><strong>Element:</strong> {card.element.join(', ')}</p>
                    <p className="card-text"><strong>Rarity:</strong> {card.rarity}</p>
                    <p className="card-text"><strong>Price:</strong> {card.price}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No cards found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Deckcard;
