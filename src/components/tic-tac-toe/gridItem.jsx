import "./ticTacToe.css";

const GridItem = (props) => {
  return <button className="selector-button">{props.id}</button>;
};

export default GridItem;
