import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';  // Import Bootstrap CSS
import Headerjamcost from './Headerjamcost';
import './Leaderboard.css'; // Import your custom CSS

const Leaderboard = () => {
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);

  // Function to fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
    //   const response = await fetch('http://localhost:7070/leaderboard', {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/leaderboard`, {
        method: 'GET',
        credentials: 'include',  // Include cookies in the request
      });

      const data = await response.json();
      if (response.ok) {
        setLeaderboard(data);
        console.log('Leaderboard fetched successfully:', data);
      } else {
        console.error('Failed to fetch leaderboard:', data.message);
      }
    } catch (error) {
      console.error('Error during fetching leaderboard:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch leaderboard data when the component mounts
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) {
    return <p>Loading...</p>;  // Show a loading message while fetching data
  }

  // Function to determine the color based on rank
  const getRankColor = (index) => {
    if (index === 0) return 'gold';
    if (index === 1) return 'silver';
    if (index === 2) return 'bronze';
    return 'black'; // Default color for ranks beyond top 3
  };

  // Log the colors being applied for debugging
  console.log('Leaderboard:', leaderboard.map((user, index) => ({
    rank: index + 1,
    color: getRankColor(index)
  })));

  return (
    <div>
      <Headerjamcost />
      <div className="container my-4">
        <h3 className="text-center mb-4">Leaderboard</h3>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Throphy</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={user._id}>
                <td style={{ color: getRankColor(index) }}>
                  {index + 1}
                  {/* {console.log(index)} */}
                </td>
                <td>{user.username}</td>
                <td>{user.throphy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
