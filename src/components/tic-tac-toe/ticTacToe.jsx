import GridItem from "./gridItem";
import "./ticTacToe.css";

const TicTacToe = () => {
  return (
    <div className="grid-container">
      <div className="div1">
        <GridItem id="1" />
      </div>
      <div className="div2">
        <GridItem id="2" />
      </div>
      <div className="div3">
        <GridItem id="3" />
      </div>
      <div className="div4">
        <GridItem id="4" />
      </div>
      <div className="div5">
        <GridItem id="5" />
      </div>
      <div className="div6">
        <GridItem id="6" />
      </div>
      <div className="div7">
        <GridItem id="7" />
      </div>
      <div className="div8">
        <GridItem id="8" />
      </div>
      <div className="div9">
        <GridItem id="9" />
      </div>
    </div>
  );
};

export default TicTacToe;
