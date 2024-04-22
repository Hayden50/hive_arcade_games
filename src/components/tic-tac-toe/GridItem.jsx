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
  connInstance,
  setWon,
}) => {
  const [clickable, setClickable] = useState(true);
  const [value, setValue] = useState(null);

  // Updates the board when the opponent makes a move
  useEffect(() => {
    const row = Math.floor(id / 3);
    const col = id % 3;
    if (board[row][col] != 0 && value == null) {
      setValue(board[row][col] === -1 ? "O" : "X");
    }
    const hold = myTurn;
    useTurn();
    updateMyTurn(hold);
  }),
    [id, board, value];

  // Handles selecting a square on the board
  const handleClick = () => {
    if (clickable && myTurn && value === null) {
      const row = Math.floor(id / 3);
      const col = id % 3;
      if (board[row][col] === 0) {
        setClickable(false);
        const currVal = amX ? "X" : "O";
        // Visually update the board
        setValue(currVal);

        // Update the invisible-actual board
        setBoard((prevBoard) => {
          const newBoard = [...prevBoard];
          newBoard[row][col] = amX ? 1 : -1; // Assign 'x' if amX is true, otherwise assign 'o'
          return newBoard;
        });

        useTurn();
        connInstance.current.send(currVal + ":" + id);

        for (let i = 0; i < board.length; i++) {
          let rowString = "";
          for (let j = 0; j < board[0].length; j++) {
            rowString += board[i][j] + " | ";
          }
          console.log(rowString);
        }
      }
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

  const useTurn = () => {
    // Check to see if the game is now over
    let gameState = checkGameState();
    switch (gameState) {
      case -1:
        if (amX) {
          setMessage("You lose!! :(");
          setWon(false);
          setClickable(false);
        } else {
          setMessage("You Win!! :)");
          setWon(true);
          setClickable(false);
        }
        break;
      case 0:
        break;
      case 1:
        if (amX) {
          setMessage("You Win!! :)");
          setWon(true);
          setClickable(false);
        } else {
          setMessage("You lose!! :(");
          setClickable(false);
          setWon(false);
        }
        break;
      case 2:
        setMessage("It's a Tie!");
        setClickable(false);
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
