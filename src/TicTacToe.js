import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./App.css";
import WinnerAnimation from "./WinnerAnimation";

const useInitialXIsNext = (players, symbol) => {
  return useState(players === 1 ? true : symbol === "X");
};

const TicTacToe = ({ players, symbol, onReset }) => {
  const [xIsNext, setXIsNext] = useInitialXIsNext(players, symbol);
  const [board, setBoard] = useState(Array(9).fill(null));
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [winner, setWinner] = useState(null);

  const handleClick = (i) => {
    if (calculateWinner(board) || board[i] || (players === 1 && !xIsNext)) {
      return;
    }

    const newBoard = board.slice();
    newBoard[i] = players === 1 ? symbol : xIsNext ? "X" : "O";

    setBoard(newBoard);

    if (players === 1 && !calculateWinner(newBoard) && !xIsNext) {
      // AI's turn
      const aiSymbol = symbol === "X" ? "O" : "X";
      const bestMove = calculateBestMove(newBoard, aiSymbol);
      if (bestMove !== null) {
        newBoard[bestMove] = aiSymbol;
        setBoard(newBoard);
        setXIsNext(true);
      }
    } else {
      setXIsNext(!xIsNext);
    }
  };

  const handleReset = () => {
    const winner = calculateWinner(board);
    if (winner) {
      setScore((prevScore) => ({
        ...prevScore,
        [winner]: prevScore[winner] + 1,
      }));
    }
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  useEffect(() => {
    const makeAIMove = () => {
      if (players === 1 && !calculateWinner(board) && !xIsNext) {
        // AI's turn
        const aiSymbol = symbol === "X" ? "O" : "X";
        const bestMove = calculateBestMove(board, aiSymbol);
        if (bestMove !== null) {
          const newBoard = board.slice();
          newBoard[bestMove] = aiSymbol;
          setBoard(newBoard);
          setXIsNext(true); // Toggle back to player's turn after AI move
        }
      }
    };

    // Check if either X or O has won three times
    if (score.X === 3 || score.O === 3) {
      const winner = score.X === 3 ? "X" : "O";
      setWinner(winner);
      handleReset();
      setScore({ X: 0, O: 0 });
    }

    // Delay AI move if it's AI's turn
    if (players === 1 && !calculateWinner(board) && !xIsNext) {
      const delay = setTimeout(() => {
        makeAIMove();
      }, 500);

      // Cleanup the timeout to avoid side effects
      return () => {
        clearTimeout(delay);
      };
    }
  }, [board, players, xIsNext, symbol, score, handleReset]);

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }

    return null;
  };

  const calculateBestMove = (currentBoard, player) => {
    const availableMoves = currentBoard
      .map((square, index) => (square === null ? index : null))
      .filter((index) => index !== null);

    if (availableMoves.length === 0) {
      return null; // No available moves
    }

    const bestMove = minimax(currentBoard, player);
    return bestMove.move;
  };

  const minimax = (currentBoard, player) => {
    const availableMoves = currentBoard
      .map((square, index) => (square === null ? index : null))
      .filter((index) => index !== null);

    const winner = calculateWinner(currentBoard);

    if (winner === "X") {
      return { score: -1 };
    }
    if (winner === "O") {
      return { score: 1 };
    }
    if (availableMoves.length === 0) {
      return { score: 0 };
    }

    const moves = availableMoves.map((move) => {
      const newBoard = currentBoard.slice();
      newBoard[move] = player;

      const result = minimax(newBoard, player === "X" ? "O" : "X");
      return { move, score: result.score };
    });

    let bestMove;
    if (player === "O") {
      const maxScore = Math.max(...moves.map((m) => m.score));
      bestMove = moves.find((m) => m.score === maxScore);
    } else {
      const minScore = Math.min(...moves.map((m) => m.score));
      bestMove = moves.find((m) => m.score === minScore);
    }

    return bestMove;
  };

  return (
    <div className="center">
      {winner && (
        <WinnerAnimation
          winner={winner}
          onReset={() => setWinner(null)}
          onResetScore={handleReset}
        />
      )}
      <div className="score">
        <span>X: {score.X}</span>
        <span>O: {score.O}</span>
      </div>
      <h1>Tic-tac-toe</h1>
      <div className="board">
        {board.map((square, i) => (
          <button className="XOboard" key={i} onClick={() => handleClick(i)}>
            {square}
          </button>
        ))}
      </div>
      <div className="status">
        {calculateWinner(board)
          ? `Winner: ${calculateWinner(board)}`
          : `Next player: ${xIsNext ? "X" : "O"}`}
      </div>
      <button className="resetbtn" onClick={handleReset}>
        Reset Game
      </button>
      <button onClick={onReset}>Home</button>
    </div>
  );
};
TicTacToe.propTypes = {
  players: PropTypes.number.isRequired,
  symbol: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default TicTacToe;
