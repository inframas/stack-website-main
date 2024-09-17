// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Home from './Home'; // Assuming you have a Home component
import Root from './Root';  // Import the Root component
import Regist from './Regist';  // Import the Root component
import Deckcard from './Deckcard';  // Import the Root component
// import Directtest from './Directtest';  // Import the Root component
import Battle from './Battle';  // Import the Root component
import Leaderboard from './Leaderboard';  // Import the Root component
import Battlebot from './Battlebot';  // Import the Root component
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/regist" element={<Regist />} />
        <Route path="/deckcard" element={<Deckcard />} />
        {/* <Route path="/directtest" element={<Directtest />} /> */}
        <Route path="/battle" element={<Battle />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/battlebot" element={<Battlebot />} />


        {/* Add other routes here */}
      </Routes>
    </Router>
  );
};

export default App;
