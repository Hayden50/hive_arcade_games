import { useState } from "react";
import "./gamesList.css";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useEffect } from "react";

const GamesList = ({ acceptGame }) => {
  const [existingGames, setExistingGames] = useState([]);

  useEffect(() => {
    const findGames = async () => {
      fetch("http://localhost:8000/findNodes", { method: "GET" })
        .then((res) => res.json())
        .then((data) => {
          setExistingGames(data.Data);
          console.log(data.Data);
        });
    };

    findGames();
  }, []);

  if (existingGames.length === 0) {
    return <h2>No games are available</h2>;
  }

  return (
    <List>
      {existingGames.map(function (data) {
        const splitData = data.split(":");
        const buttonTitle =
          splitData[0] +
          " with " +
          splitData[1] +
          " (" +
          (Math.random() + 1).toString(36).substring(3) +
          ")";
        return (
          <ListItem disablePadding key={data}>
            <ListItemButton onClick={() => acceptGame(data)}>
              <ListItemText primary={buttonTitle} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default GamesList;
