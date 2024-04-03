import "./ticTacToe.css";
import { useState } from "react";

const GridItem = (props) => {
  const [clickable, setClickable] = useState(true);
  const [value, setValue] = useState(null);

  const handleClick = () => {
    if (clickable) {
      setClickable(false);
      setValue("x");
    }
  };

  return (
    <button className="selector-button" onClick={handleClick}>
      <h1 className="marking">{value}</h1>
    </button>
  );
};

export default GridItem;
