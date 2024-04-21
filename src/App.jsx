import { useEffect, useRef, useState } from "react";
import "./App.css";
import GameModal from "./components/GameModal";
import TicTacToe from "./components/tic-tac-toe/TicTacToe";
import WordHunt from "./components/WordHunt";
import { Button, IconButton, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';
import CreateGame from "./components/CreateGame";
import Peer from 'peerjs';

function App() {

  const [existingGames, setExistingGames] = useState([]);
  const [peerId, setPeerId] = useState('');
  const peerInstance = useRef(null);
  const connInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on('open', (id) => {
      setPeerId(id)
    });
    peerInstance.current = peer;
    peer.on('connection', (conn) => {
      console.log('Connection received from peer:', conn.peer);

      conn.on('data', (data) => {
        console.log('Received:', data);
      });
    });
    return () => {
      peer.disconnect(); // Disconnect from the PeerServer when component unmounts
    };
  }, [])

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

  const acceptGame = async(data) => {
    let dataList = data.split(":")
    // Only allow you to accept a game if you didn't create it
    if(peerId != dataList[2]) {
      const removeGameRequest = {
          'requestingUser': dataList[1],
          'gameType': dataList[0],
          'peerId': dataList[2],
      }
      fetch("http://localhost:5000/acceptGame", {
          method: "POST", 
          headers:{
              "Content-Type": "application/json"
          },
          body: JSON.stringify(removeGameRequest)
      }).then(res => res.json()).then(data => {
          console.log(data.Data);
      })
      var conn = peerInstance.current.connect(dataList[2])
      connInstance.current = conn
      conn.on('open', function() {
        // Send messages
        conn.send('Accepted '+ dataList[0] +' Game!');
      });
    }
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
        gameComponent={<CreateGame peerId={peerId}/>}
      />
      <List>
        {existingGames.map(function(data) {
          return (
            <ListItem disablePadding>
              <ListItemButton onClick={() => acceptGame(data)}>
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
