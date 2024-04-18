import { useEffect, useState } from "react";
import "./App.css";
import GameModal from "./components/GameModal";
import TicTacToe from "./components/tic-tac-toe/TicTacToe";
import WordHunt from "./components/WordHunt";
import { Button, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';
import CreateGame from "./components/CreateGame";

function App() {

  const [existingGames, setExistingGames] = useState([]);

  const broadcastGame = async() => {
    fetch("http://localhost:5000/broadcast").then(res => res.json()).then(data => {
      console.log(data.Data);
    })
    // fetch("http://localhost:5000/findNodes").then(res => res.json()).then(data => {
    //   console.log(data.Data);
    // })
  }

  const findGames = async() => {
    fetch("http://localhost:5000/findNodes", {method: "GET"}).then(res => res.json()).then(data => {
      setExistingGames(data.Data);
      console.log(data.Data);
    })
  }

  // useEffect(() => {
  //   broadcastGame()
  // },[])

  return (
    <>
      <div>
        <p>This will be the landing page for the application!</p>
      </div>
      <IconButton variant="outlined" onClick={findGames}>
        <ReplayIcon></ReplayIcon>
      </IconButton>
      <GameModal
        id="WordHunt "
        title="Word Hunt"
        gameComponent={<WordHunt />}
      />
      <GameModal
        id="WordHunt"
        title="Tic-Tac-Toe"
        gameComponent={<TicTacToe />}
      />
      <GameModal
        id="CreateGame"
        title="Create Game"
        gameComponent={<CreateGame/>}
      />
      <List>
        {existingGames.map(function(data) {
          return (
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary={data} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </>
  );
}

export default App;
