import Grid from "@mui/material/Unstable_Grid2";
import GridItem from "./GridItem";
import "./ticTacToe.css";

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

const TicTacToe = () => {
  return (
    <Grid container spacing={2} sx={borderStyling}>
      {[...Array(9)].map((_, index) => (
        <Grid key={index} xs={4} minHeight={160}>
          <GridItem id={index}></GridItem>
        </Grid>
      ))}
    </Grid>
  );
};

export default TicTacToe;
