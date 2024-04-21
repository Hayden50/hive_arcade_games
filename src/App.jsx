import { useEffect, useRef, useState } from "react";
import "./App.css";
import GameModal from "./components/GameModal";
import GamesList from "./components/GamesList";
import { Button } from "@mui/material";
import Peer from "peerjs";
import Banner from "./components/banner/Banner";

function App() {
  const [peerId, setPeerId] = useState("");
  const [opponentId, setOpponentId] = useState("");
  const [username, setUsername] = useState("");
  const [wordHuntOpen, setWordHuntOpen] = useState(false);
  const [gameJoinOpen, setGameJoinOpen] = useState(false);
  const [wordHuntScore, setWordHuntScore] = useState(0);
  const peerInstance = useRef(null);
  const connInstance = useRef(null);

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });
    peerInstance.current = peer;
    peer.on("connection", (conn) => {
      console.log("Connection received from peer:", conn.peer);
      connInstance.current = conn;
      conn.on("data", (data) => {
        console.log("Received", data);
        if (data.includes("WordHunt")) {
          setWordHuntOpen(true);
        }
        if (data.includes("Score")) {
          // setWordHuntOpen(false)
          let dataArr = data.split(":");
          if (dataArr[1] > wordHuntScore) {
            console.log("YOU LOST");
          } else if (dataArr[1] < wordHuntScore) {
            console.log("YOU WON");
          } else {
            console.log("YOU TIED");
          }
          let remoteId = dataArr[0].split(",")[0];
          var conn2 = peerInstance.current.connect(remoteId);
          conn2.on("open", function () {
            // Send messages
            console.log("Connection", conn);
            conn2.send("Opponent: ", wordHuntScore);
          });
          //console.log(dataArr[0].split(',')[0])
          setWordHuntScore(0);
        }
      });
    });
    return () => {
      peer.disconnect(); // Disconnect from the PeerServer when component unmounts
    };
  }, []);

  useEffect(() => {
    // console.log(connInstance.current, wordHuntOpen)
    if (connInstance.current && !wordHuntOpen) {
      connInstance.current.send(peerId + ", Score:" + wordHuntScore);
      //connInstance.current.send('Opponent Score:' + wordHuntScore)
      setWordHuntScore(0);
    }
  }, [wordHuntOpen]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await fetch("http://localhost:8000/getUserData");
        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    getUserData();
  }, []); // Empty dependency array ensures the effect runs only on mount

  const broadcastGame = async () => {
    fetch("http://localhost:8000/broadcast")
      .then((res) => res.json())
      .then((data) => {
        console.log(data.Data);
      });
  };

  const acceptGame = async (data) => {
    let dataList = data.split(":");
    // Only allow you to accept a game if you didn't create it
    if (peerId != dataList[2]) {
      const removeGameRequest = {
        requestingUser: dataList[1],
        gameType: dataList[0],
        peerId: dataList[2],
      };
      //Remove game from gameslist in backend so no one else can play
      fetch("http://localhost:8000/acceptGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(removeGameRequest),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.Data);
        });
      //Form the connection with the remote peer
      var conn = peerInstance.current.connect(dataList[2]);
      connInstance.current = conn;
      conn.on("open", function () {
        // Send messages
        console.log("Connection", conn);
        conn.send("Accepted " + dataList[0] + " Game!");
        if (dataList[0] == "WordHunt") {
          setWordHuntOpen(true);
        }
      });
    }
  };

  const handleBroadcastGame = async (gameType) => {
    const gameRequest = {
      User: username,
      GameType: gameType,
      PeerId: peerId,
    };
    fetch("http://localhost:8000/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gameRequest),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.Data);
      });
  };

  return (
    <div className="container">
      <Banner />
      <div className="title-container">
        <h1 className="title">Hive Arcade</h1>
        <p className="description">
          A decentralized game suite for Georgia Tech students
        </p>
      </div>
      <div className="modal-button">
        <Button
          variant="outlined"
          onClick={() => handleBroadcastGame("WordHunt")}
        >
          Create a Word Hunt Game
        </Button>
      </div>

      <div className="modal-button">
        <Button
          variant="outlined"
          onClick={() => handleBroadcastGame("TicTacToe")}
        >
          Create a Tic-Tac-Toe Game
        </Button>
      </div>

      <div className="modal-button">
        <GameModal
          id="CreateGame"
          title="Click to Join a Game"
          setOpenStatus={setGameJoinOpen}
          gameComponent={<GamesList acceptGame={acceptGame} />}
          openStatus={gameJoinOpen}
        />
      </div>
    </div>
  );
}

export default App;
