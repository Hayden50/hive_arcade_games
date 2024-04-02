import "./ticTacToe.css";

const GridItem = (props) => {
  return (
    <div className="grid-item-body">
      <button>{props.id}</button>
    </div>
  );
};

export default GridItem;
