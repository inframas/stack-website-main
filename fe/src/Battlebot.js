import React, { useState } from 'react';
import Headerjamcost from './Headerjamcost';

const BotBattle = () => {
  // Define bot1 and bot2 directly in this file
  const bot1 = {
    name: 'Bot 1',
    health: 200,
    attack: function () {
      return Math.floor(Math.random() * 20) + 1;  // Random damage between 1 and 20
    },
  };

  const bot2 = {
    name: 'Bot 2',
    health: 100,
    attack: function () {
      return Math.floor(Math.random() * 90) + 1;
    },
  };

  // Define the battle function in this file
  const battle = (botA, botB) => {
    let log = [];
    while (botA.health > 0 && botB.health > 0) {
      const damageToBotB = botA.attack();
      botB.health -= damageToBotB;
      log.push(`${botA.name} hits ${botB.name} for ${damageToBotB} damage. ${botB.name} health: ${botB.health}`);

      if (botB.health <= 0) break;

      const damageToBotA = botB.attack();
      botA.health -= damageToBotA;
      log.push(`${botB.name} hits ${botA.name} for ${damageToBotA} damage. ${botA.name} health: ${botA.health}`);
    }

    const winner = botA.health > 0 ? botA.name : botB.name;
    log.push(`Winner: ${winner}`);
    return log;
  };

  const [battleLog, setBattleLog] = useState([]); // State to store the battle log
  const [winner, setWinner] = useState(''); // State to store the winner

  const handleBattle = () => {
    // Clone the bots to reset their health for each battle
    const botA = { ...bot1, health: 200 };
    const botB = { ...bot2, health: 100 };

    // Run the battle and get the log
    const log = battle(botA, botB);

    // Update the battle log and the winner
    setBattleLog(log);
    setWinner(log[log.length - 1]); // The last log entry contains the winner
  };

  return (
    <div>
      <Headerjamcost />
    <div className="container my-4">
      <h2 className="text-center">Bot Battle</h2>

      {/* Button to start the battle */}
      <div className="text-center">
        <button className="btn btn-primary" onClick={handleBattle}>
          Start Battle
        </button>
      </div>

      {/* Display the battle log */}
      <div className="battle-log mt-4">
        <h4>Battle Log</h4>
        <ul>
          {battleLog.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>

      {/* Display the winner */}
      {winner && (
        <div className="winner mt-4 text-center">
          <h3>{winner}</h3>
        </div>
      )}
    </div>
    </div>
  );
};

export default BotBattle;
