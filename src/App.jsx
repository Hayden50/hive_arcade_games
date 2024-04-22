import { useEffect, useRef, useState } from "react";
import "./App.css";
import GameModal from "./components/GameModal";
import GamesList from "./components/GamesList";
import { Button } from "@mui/material";
import Peer from "peerjs";
import Banner from "./components/banner/Banner";
import WordHunt from "./components/WordHunt";
import TicTacToe from "./components/tic-tac-toe/TicTacToe";

function App() {
  const [peerId, setPeerId] = useState("");
  const [username, setUsername] = useState("");
  const [wordHuntOpen, setWordHuntOpen] = useState(false);
  const [tictactoeOpen, setTictactoeOpen] = useState(false);
  const [gameJoinOpen, setGameJoinOpen] = useState(false);
  const [wordHuntScore, setWordHuntScore] = useState(0);
  const peerInstance = useRef(null);
  const connInstance = useRef(null);

  // On startup, get the user's data and save it to a local variable
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

  // Generate all information about the local network connection and define listeners
  // for possible actions
  useEffect(() => {
    const peer = new Peer();

    // On creation of peer, save the peer ID
    peer.on("open", (id) => {
      setPeerId(id);
    });

    peerInstance.current = peer;

    // On connection to another peer, save connection instance & set info on
    // what happens when there is data transmission
    peer.on("connection", (conn) => {
      console.log("Connection received from peer:", conn.peer);
      connInstance.current = conn;

      // On data transmission reception, check what the data includes and respond
      // accordingly. RECEIVER SIDE:
      conn.on("data", (data) => {
        // console.log("Received", data);
        if (data.includes("WordHunt")) {
          setWordHuntOpen(true);
        } else if (data.includes("TicTacToe")) {
          setTictactoeOpen(true);
        }

        if (data.includes("Score")) {
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

  // If Word Hunt closes, send over the score and then reset the local score to 0
  useEffect(() => {
    if (connInstance.current && !wordHuntOpen) {
      connInstance.current.send(peerId + ", Score:" + wordHuntScore);
      setWordHuntScore(0);
    }
  }, [wordHuntOpen]);

  // Async function to take a game from the list of games and accept it
  const acceptGame = async (data) => {
    let dataList = data.split(":");
    // Only allow you to accept a game if you didn't create it
    if (peerId != dataList[2]) {
      const removeGameRequest = {
        requestingUser: dataList[1],
        gameType: dataList[0],
        peerId: dataList[2],
      };

      // Remove game from gameslist in backend so no one else can play
      fetch("http://localhost:8000/acceptGame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(removeGameRequest),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.trophies);
        });

      // Form the connection with the remote peer
      // dataList[2] is the peerID of the person who created the game
      var conn = peerInstance.current.connect(dataList[2]);
      connInstance.current = conn;
      conn.on("open", function () {
        // Send messages
        console.log("Connection", conn);

        // This is the specific string that the receiver sees to open
        conn.send("Accepted " + dataList[0] + " Game!");

        // Check what the name of the game is and open that game
        // SENDER SIDE:
        if (dataList[0] == "WordHunt") {
          setWordHuntOpen(true);
          setGameJoinOpen(false);
        } else if (dataList[0] === "TicTacToe") {
          setTictactoeOpen(true);
          setGameJoinOpen(false);
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

      <GameModal
        id="WordHunt"
        title="Tic-Tac-Toe"
        gameComponent={
          <TicTacToe connInstance={connInstance} peerId={peerId} />
        }
        setOpenStatus={setTictactoeOpen}
        openStatus={tictactoeOpen}
      />

      <GameModal
        id="WordHunt "
        key={wordHuntOpen}
        title="Word Hunt"
        duration={3000000}
        gameComponent={
          <WordHunt
            score={wordHuntScore}
            setScore={setWordHuntScore}
            connInstance={connInstance}
            peerId={peerId}
          />
        }
        openStatus={wordHuntOpen}
        setOpenStatus={setWordHuntOpen}
      />
    </div>
  );
}

export default App;
