import Grid from "@mui/material/Unstable_Grid2";
import GridItem from "./GridItem";
import "./ticTacToe.css";
import { useEffect, useState } from "react";

const TicTacToe = () => {
  const initArr = Array.from({ length: 3 }, () => Array(3).fill(0));
  const [board, setBoard] = useState(initArr);
  const [myTurn, updateMyTurn] = useState(true);
  const [amX, setAmX] = useState(false);
  const [message, setMessage] = useState("");

  const initialSetup = () => {
    setAmX(Math.random() < 0.5);
    // updateMyTurn(amX); // X is the first player to move
  };

  useEffect(() => {
    initialSetup();
  }, []);

  return (
    <div>
      <h1>{message}</h1>
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
