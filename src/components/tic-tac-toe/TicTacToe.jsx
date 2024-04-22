import Grid from "@mui/material/Unstable_Grid2";
import GridItem from "./GridItem";
import "./ticTacToe.css";
import { useEffect, useState } from "react";
import { useRef } from "react";

const TicTacToe = ({
  connInstance,
  peerId,
  updateTrophies,
  setUpdateTrophies,
}) => {
  const initArr = Array.from({ length: 3 }, () => Array(3).fill(0));
  const [board, setBoard] = useState(initArr);
  const [myTurn, updateMyTurn] = useState(false);
  const [amX, setAmX] = useState(false);
  const [message, setMessage] = useState("");
  const [won, setWon] = useState(null);
  const wonRef = useRef(won);

  const [localPeerId, setLocalPeerId] = useState("");
  const [connPeerId, setConnPeerId] = useState("");

  useEffect(() => {
    setBoard(Array.from({ length: 3 }, () => Array(3).fill(0)));
    connInstance.current.send("ID:" + peerId);
    setLocalPeerId(peerId);
  }, []);

  useEffect(() => {
    // Update score ref when score changes
    wonRef.current = won;
  }, [won]);

  useEffect(() => {
    designateLetter();
    connInstance.current.on("data", (data) => {
      console.log("Received: " + data);
      const dataArr = data.split(":");
      const commandType = dataArr[0];

      if (commandType === "ID") {
        setConnPeerId(dataArr[1]);
      } else if (
        ((!amX && commandType === "X") || (amX && commandType === "O")) &&
        !myTurn
      ) {
        const gridId = dataArr[1];
        setBoard((prevBoard) => {
          const newBoard = [...prevBoard];
          const row = Math.floor(gridId / 3);
          const col = gridId % 3;
          newBoard[row][col] = commandType === "X" ? 1 : -1; // Assign 'x' if amX is true, otherwise assign 'o'
          return newBoard;
        });

        updateMyTurn(true);
      }
    });
  });

  const designateLetter = () => {
    const localIdNumber = stringToNumber(localPeerId);
    const connIdNumber = stringToNumber(connPeerId);

    setAmX(localIdNumber > connIdNumber);

    if (amX) {
      updateMyTurn(true);
    }
  };

  const stringToNumber = (str) => {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
      result += str.charCodeAt(i);
    }
    return result;
  };

  useEffect(() => () => {
    // Calls Flask API to update the trophy count associated with the account
    if (wonRef.current !== null) {
      const trophyData = {
        trophies: wonRef.current ? 10 : -10,
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
    }
    setUpdateTrophies(!updateTrophies);
    wonRef.current = null;
  });

  return (
    <div>
      <div className="word-box">
        <p>{message}</p>
        <p>{amX ? "Your Letter: X" : "Your Letter: O"}</p>
      </div>
      <Grid container spacing={2} sx={borderStyling}>
        {[...Array(9)].map((_, index) => (
          <Grid key={index} xs={4} minHeight={160}>
            <GridItem
              id={index}
              amX={amX}
              myTurn={myTurn}
              setBoard={setBoard}
              board={board}
              updateMyTurn={updateMyTurn}
              setMessage={setMessage}
              connInstance={connInstance}
              setWon={setWon}
            ></GridItem>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

const borderStyling = {
  "--Grid-borderWidth": "2px",
  borderTop: "var(--Grid-borderWidth) solid",
  borderLeft: "var(--Grid-borderWidth) solid",
  borderColor: "divider",
  "& > div": {
    borderRight: "var(--Grid-borderWidth) solid",
    borderBottom: "var(--Grid-borderWidth) solid",
    borderColor: "divider",
  },
};

export default TicTacToe;
