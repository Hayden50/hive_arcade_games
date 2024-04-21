import "./ticTacToe.css";
import { useState, useEffect } from "react";

const GridItem = ({ id, amX }) => {
  const [clickable, setClickable] = useState(true);
  const [value, setValue] = useState(null);

  const handleClick = () => {
    if (clickable) {
      setClickable(false);
      if (amX) {
        setValue("x");
      } else {
        setValue("o");
      }
      console.log(id);
    }
  };

  return (
    <button className="selector-button" onClick={handleClick}>
      <h1 className="marking">{value}</h1>
    </button>
  );
};

export default GridItem;
