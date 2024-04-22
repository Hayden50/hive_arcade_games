import React from "react";
import { useEffect, useState } from "react";
import Grid from "./Grid";
import Alert from "./Alert";
import { Button } from "@mui/material";
import checkWord from "check-if-word";

export default function WordHunt({ score, setScore, connInstance, peerId }) {
  const words = checkWord("en");
  const [guess, setGuess] = useState("");
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
        if (score == oppVal) {
          console.log(score + ":" + oppVal + " TIE");
        } else if (score < oppVal) {
          console.log(score + ":" + oppVal + " LOSS");
        } else {
          console.log(score + ":" + oppVal + " WIN");
        }
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
      // Add any actions you want to perform here
    }
  }, [timerExpired]);

  return (
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
  );
}
