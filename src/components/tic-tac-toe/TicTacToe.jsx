import Grid from "@mui/material/Unstable_Grid2";
import GridItem from "./GridItem";
import "./ticTacToe.css";
import { useEffect, useState } from "react";

const TicTacToe = () => {
  const [myTurn, updateMyTurn] = useState(false);
  const [amX, setAmX] = useState(false);

  useEffect(() => {
    setAmX(Math.random() < 0.5);
    // updateMyTurn(amX);
    console.log("AM X: ", amX);
  });

  return (
    <Grid container spacing={2} sx={borderStyling}>
      {[...Array(9)].map((_, index) => (
        <Grid key={index} xs={4} minHeight={160}>
          <GridItem id={index} amX={amX}></GridItem>
        </Grid>
      ))}
    </Grid>
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
