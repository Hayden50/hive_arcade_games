import GridItem from "./gridItem";
import "./ticTacToe.css";

const TicTacToe = () => {
  return (
    <div className="grid-container">
      <div className="div1">
        <GridItem id="1" />
      </div>
      <div className="div2"> 2 </div>
      <div className="div3"> 3 </div>
      <div className="div4"> 4 </div>
      <div className="div5"> 5 </div>
      <div className="div6"> 6 </div>
      <div className="div7"> 7 </div>
      <div className="div8"> 8 </div>
      <div className="div9"> 9 </div>
    </div>
  );
};

export default TicTacToe;
