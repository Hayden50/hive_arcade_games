import { useEffect, useState } from "react";
import Grid from "./Grid";
import Alert from "./Alert";
import { Button } from "@mui/material";
import checkWord from "check-if-word";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Login } from "@mui/icons-material";
import { useRef } from "react";

export default function WordHunt({ score, setScore, connInstance, peerId }) {
  const words = checkWord("en");
  const [guess, setGuess] = useState("");
  const [resultsOpen, setResultsOpen] = useState(false);
  const [opponentVal, setOpponentVal] = useState(0);
  const [matrix, setMatrix] = useState(
    Array.from({ length: 4 }, () =>
      Array.from({ length: 4 }, () =>
        String.fromCharCode(97 + Math.floor(Math.random() * 26)),
      ),
    ),
  );
  const [wordExist, setWordExist] = useState("");
  const [pointsForWord, setPointsForWords] = useState(0);
  const [foundWords, setFoundWords] = useState({});
  const [timerExpired, setTimerExpired] = useState(false);

  const scoreRef = useRef(score);
  const opponentScoreRef = useRef(0); // Initialize opponent score ref with 0

  useEffect(() => {
    // Update score ref when score changes
    scoreRef.current = score;
  }, [score]);

  const handleSubmit = (currWord) => {
    //Reset matrix back to all lower case (which is used to show which is selected in Grid.js)
    const updatedMatrix = matrix.map((x, currRowIndex) => {
      return x.map((y, currColIndex) => {
        return y.toLowerCase();
      });
    });
    setMatrix(updatedMatrix);

    //If word is too short don't allow it
    if (currWord.length < 3) {
      setWordExist("tooShort");
      setGuess("");
      setPointsForWords(0);
      return;

      //If word has already been found don't allow it
    } else if (foundWords[currWord]) {
      setWordExist("found");
      setGuess("");
      setPointsForWords(0);
      return;
    }

    //If word exists in dictionary api, add score n stuff
    if (words.check(currWord)) {
      setWordExist("success");
      setPointsForWords((currWord.length - 2) ** 2 * 100);
      setScore(score + (currWord.length - 2) ** 2 * 100);
      setFoundWords((words) => ({
        ...words,
        [currWord]: true,
      }));
      //Otherwise make it a failure
    } else {
      setWordExist("failure");
      setPointsForWords(0);
    }
    setGuess("");
  };

  useEffect(() => {
    connInstance.current.send("ID:" + peerId);
  }, []);

  useEffect(() => {
    connInstance.current.on("data", (data) => {
      const dataArr = data.split(":");
      const commandType = dataArr[0];

      if (commandType === "RES") {
        const oppVal = parseInt(dataArr[1]);
        // Update opponent score ref when receiving opponent score
        opponentScoreRef.current = oppVal;
        setOpponentVal(oppVal);
      }
    });
  }),
    [];

  useEffect(() => {
    const timer = setTimeout(() => {
      // Set timerExpired to true when timer runs out
      setTimerExpired(true);
    }, 29500); // Assuming 30000 milliseconds (30 seconds) is your timer duration
    // Clear the timer if the component unmounts or when the modal is closed
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (timerExpired) {
      // Perform actions when the timer runs out
      // For example, close the modal or trigger a function
      console.log("WORD HUNT SCORE: " + score);
      connInstance.current.send("RES:" + score);
      setResultsOpen(true);
      // Add any actions you want to perform here
    }
  }, [timerExpired]);

  const getResultTag = (currScore, oppScore) => {
    if (currScore == oppScore) {
      return "It's a Tie!";
    } else if (currScore < oppScore) {
      return "You Lose!";
    } else {
      return "You Win!";
    }
  };

  useEffect(
    () => () => {
      console.log(
        "Score: " + scoreRef.current,
        " OPP: " + opponentScoreRef.current,
      );
      let updateTrophyReq;
      if (scoreRef.current > opponentScoreRef.current) {
        console.log("ADDING");
        updateTrophyReq = {
          trophies: 10,
        };
      }
      if (scoreRef.current < opponentScoreRef.current) {
        console.log("REMOVING");
        updateTrophyReq = {
          trophies: -10,
        };
      }
      fetch("http://localhost:8000/updateTrophies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateTrophyReq),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.Data);
        });
    },
    [],
  );

  return (
    <>
      {resultsOpen && (
        <div>
          <h1>{getResultTag(score, opponentVal)}</h1>
          <div>Your Score: {score}</div>
          <div>Opponent Score: {opponentVal}</div>
        </div>
      )}

      {!resultsOpen && (
        <>
          <h1 className="score">Score: {score}</h1>
          <Grid
            board={matrix}
            setBoard={setMatrix}
            guess={guess}
            setGuess={setGuess}
          ></Grid>
          <h1 className="currentGuess">{guess}</h1>
          <Button onClick={() => handleSubmit(guess)}>Submit</Button>
          <Alert
            success={wordExist}
            points={pointsForWord}
            setSuccess={setWordExist}
          />
        </>
      )}
    </>
  );
}
