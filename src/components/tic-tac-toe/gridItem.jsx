import "./ticTacToe.css";

const GridItem = (props) => {
  return (
    <div>
      <button>{props.id}</button>
    </div>
  );
};

export default GridItem;
