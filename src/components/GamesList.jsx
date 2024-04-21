import "./gamesList.css";
import Button from "@mui/material/Button";

const GamesList = ({ gameList }) => {
  if (gameList.length === 0 || gamesList === null) {
    return <h2>No games are available</h2>;
  }

  return (
    <div className="list-container">
      <div className="list-container">
        {gameList.map((game, index) => (
          <Button key={index}>{game}</Button>
        ))}
      </div>
    </div>
  );
};

export default GamesList;
