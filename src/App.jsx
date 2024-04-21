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
  const [opponentId, setOpponentId] = useState('')
  const [wordHuntOpen, setWordHuntOpen] = useState(false)
  const [tictactoeOpen, setTictactoeOpen] = useState(false)
  const [gameStartOpen, setGameStartOpen] = useState(false) 
  const [wordHuntScore, setWordHuntScore] = useState(0)
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
      connInstance.current=conn;
      //console.log('Connection', conn)
      conn.on('data', (data) => {
        console.log('Received', data);
        if(data.includes('WordHunt')) {
          setWordHuntOpen(true)
        }
        if(data.includes('Score')) {
          // setWordHuntOpen(false)
          let dataArr = data.split(':')
          if(dataArr[1] > wordHuntScore) {
            console.log('YOU LOST')
          } else if (dataArr[1] < wordHuntScore) {
            console.log('YOU WON')
          }else {
            console.log('YOU TIED')
          }
          let remoteId = dataArr[0].split(',')[0]
          var conn2 = peerInstance.current.connect(remoteId)
          conn2.on('open', function() {
            // Send messages
            console.log('Connection', conn)
            conn2.send('Opponent: ', wordHuntScore);
          });
          //console.log(dataArr[0].split(',')[0])
          setWordHuntScore(0)
        }
      });
    });
    return () => {
      peer.disconnect(); // Disconnect from the PeerServer when component unmounts
    };
  }, [])

  useEffect(() => {
    // console.log(connInstance.current, wordHuntOpen)
    if(connInstance.current && !wordHuntOpen) {
      connInstance.current.send(peerId+', Score:' + wordHuntScore)
      //connInstance.current.send('Opponent Score:' + wordHuntScore)
      setWordHuntScore(0)
    }
  }, [wordHuntOpen])

  const broadcastGame = async() => {
    fetch("http://localhost:5000/broadcast").then(res => res.json()).then(data => {
      console.log(data.Data);
    })
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
      //Remove game from gameslist in backend so no one else can play
      fetch("http://localhost:5000/acceptGame", {
          method: "POST", 
          headers:{
              "Content-Type": "application/json"
          },
          body: JSON.stringify(removeGameRequest)
      }).then(res => res.json()).then(data => {
          console.log(data.Data);
      })
      //Form the connection with the remote peer
      var conn = peerInstance.current.connect(dataList[2])
      connInstance.current = conn
      conn.on('open', function() {
        // Send messages
        console.log('Connection', conn)
        conn.send('Accepted '+ dataList[0] +' Game!');
        if(dataList[0] == 'WordHunt'){
          setWordHuntOpen(true)
        }
      });
    }
  }

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
        key={wordHuntOpen}
        title="Word Hunt"
        duration={30000}
        gameComponent={<WordHunt score={wordHuntScore} setScore={setWordHuntScore} />}
        openStatus={wordHuntOpen}
        setOpenStatus={setWordHuntOpen}
      />
      <GameModal
        id="WordHunt"
        title="Tic-Tac-Toe"
        gameComponent={<TicTacToe />}
        setOpenStatus={setTictactoeOpen}
        openStatus={tictactoeOpen}
      />
      <GameModal
        id="CreateGame"
        title="Create Game"
        setOpenStatus={setGameStartOpen}
        gameComponent={<CreateGame peerId={peerId}/>}
        openStatus={gameStartOpen}
      />
      <List>
        {existingGames.map(function(data) {
          return (
            <ListItem disablePadding key={data}>
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