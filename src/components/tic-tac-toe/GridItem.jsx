import "./ticTacToe.css";
import { useState, useEffect } from "react";

const GridItem = ({
  id,
  amX,
  myTurn,
  setBoard,
  board,
  updateMyTurn,
  setMessage,
}) => {
  const [clickable, setClickable] = useState(true);
  const [value, setValue] = useState(null);

  const handleClick = () => {
    if (clickable && myTurn) {
      setClickable(false);
      // Visually update the board
      setValue(amX ? "x" : "o");

      // Update the invisible-actual board
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        const row = Math.floor(id / 3);
        const col = id % 3;
        newBoard[row][col] = amX ? 1 : -1; // Assign 'x' if amX is true, otherwise assign 'o'
        return newBoard;
      });

      useTurn();
    }
  };

  // RETURNS: 1 if X won the game, -1 if O won the game, 0 if still playable, 2 if board is full
  const checkGameState = () => {
    // Check rows
    for (let i = 0; i < 3; i++) {
      if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
        if (board[i][0] !== 0) {
          return board[i][0]; // Return the winner (1 for 'x', -1 for 'o')
        }
      }
    }

    // Check columns
    for (let i = 0; i < 3; i++) {
      if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
        if (board[0][i] !== 0) {
          return board[0][i]; // Return the winner (1 for 'x', -1 for 'o')
        }
      }
    }

    // Check diagonals
    if (
      (board[0][0] === board[1][1] && board[1][1] === board[2][2]) ||
      (board[0][2] === board[1][1] && board[1][1] === board[2][0])
    ) {
      if (board[1][1] !== 0) {
        return board[1][1]; // Return the winner (1 for 'x', -1 for 'o')
      }
    }

    let zeroExists = false;
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] === 0) zeroExists = true;
      }
    }

    // No one won but the board is full
    if (!zeroExists) return 2;

    // Board still playable
    return 0;
  };

  // Calls Flask API to update the trophy count associated with the account
  const updateTrophies = (newVal) => {
    const trophyData = {
      trophies: newVal,
    };
    fetch("http://localhost:8000/updateTrophies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trophyData),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  };

  const useTurn = () => {
    // Check to see if the game is now over
    let gameState = checkGameState();
    switch (gameState) {
      case -1:
        if (amX) {
          updateTrophies(-10);
          setMessage("You lose!! :(");
        } else {
          updateTrophies(10);
          setMessage("You Win!! :)");
        }
        break;
      case 0:
        break;
      case 1:
        if (amX) {
          updateTrophies(10);
          setMessage("You Win!! :)");
        } else {
          updateTrophies(-10);
          setMessage("You lose!! :(");
        }
        break;
      case 2:
        setMessage("It's a Tie!");
        break;
    }
    // Handle results of game state
    updateMyTurn(false);
  };

  return (
    <button className="selector-button" onClick={handleClick}>
      <h1 className="marking">{value}</h1>
    </button>
  );
};

export default GridItem;
