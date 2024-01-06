import React, { useState } from "react";
import "./App.css";
import TicTacToe from "./TicTacToe";

const App = () => {
  const [page, setPage] = useState(1);
  const [players, setPlayers] = useState(null);
  const [symbol, setSymbol] = useState(null);

  const handlePlayerSelect = (numPlayers) => {
    setPlayers(numPlayers);
    setPage(3);
  };

  const handleSymbolSelect = (selectedSymbol) => {
    setSymbol(selectedSymbol);
    setPage(4);
  };

  const handleReset = () => {
    setPage(1);
    setPlayers(null);
    setSymbol(null);
  };

  const renderPage = () => {
    switch (page) {
      case 1:
        return (
          <div className="center">
            <h1>Tic-tac-toe</h1>
            <button onClick={() => setPage(2)}>Start Game</button>
          </div>
        );
      case 2:
        return (
          <div className="center">
            <h2>Choose Number of Players</h2>
            <button onClick={() => handlePlayerSelect(1)}>1-Player</button>
            <button onClick={() => handlePlayerSelect(2)}>2-Player</button>
          </div>
        );
      case 3:
        return (
          <div className="center">
            <h2>Choose Symbol</h2>
            <button
              className="XOchoose"
              onClick={() => handleSymbolSelect("X")}
            >
              X
            </button>
            <button
              className="XOchoose"
              onClick={() => handleSymbolSelect("O")}
            >
              O
            </button>
          </div>
        );
      case 4:
        // Render the Tic Tac Toe game component with selected options
        return (
          <TicTacToe players={players} symbol={symbol} onReset={handleReset} />
        );
      default:
        return null;
    }
  };

  return <div className="App">{renderPage()}</div>;
};

export default App;
