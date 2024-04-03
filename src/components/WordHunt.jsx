import React from 'react'
import { useEffect, useState } from 'react'
import Grid from './Grid';
import Alert from './Alert';
import { Button } from '@mui/material';

export default function WordHunt( {} ) {
    const [guess, setGuess] = useState("");
    const [matrix, setMatrix] = useState(Array.from({length: 4}, ()=> Array.from({length: 4}, ()=> String.fromCharCode(97 + Math.floor(Math.random() * 26)))));
    const [score, setScore] = useState(0);
    const [wordExist, setWordExist] = useState('');
    const [pointsForWord, setPointsForWords] = useState(0);
    const [foundWords, setFoundWords] = useState({});

    const handleSubmit = (currWord) => {
        //Reset matrix back to all lower case (which is used to show which is selected in Grid.js)
        const updatedMatrix = matrix.map((x, currRowIndex) => {
            return x.map((y, currColIndex) => {
                return y.toLowerCase();
            })
        })
        setMatrix(updatedMatrix);

        //If word is too short don't allow it
        if(currWord.length < 3) {
            setWordExist('tooShort');
            setGuess('');
            setPointsForWords(0);
            return
        
        //If word has already been found don't allow it
        } else if(foundWords[currWord]) {
            setWordExist('found');
            setGuess('');
            setPointsForWords(0);
            return
        }
        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${currWord}`)
        .then(function(response) {
        //If word exists in dictionary api, add score n stuff
        if(response.ok) {
            setWordExist('success');
            setPointsForWords(((currWord.length-2)**2) * 100)
            setScore(score + ((currWord.length-2)**2) * 100);
            setFoundWords(words => ({
                ...words,
                [currWord]: true,
            }))
        //Otherwise make it a failure
        } else {
            setWordExist('failure');
            setPointsForWords(0);
        }
        })
        setGuess('');
    }


    return (
        <>
        <h1 className="score">Score: {score}</h1>
        <Grid board={matrix} setBoard={setMatrix} guess={guess} setGuess={setGuess}></Grid>
        <h1 className="currentGuess">{guess}</h1>
        <Button onClick={()=>handleSubmit(guess)}>Submit</Button>
        <Alert success={wordExist} points={pointsForWord} setSuccess={setWordExist} />
        </>
    )
}