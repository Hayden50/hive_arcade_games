import { Button } from '@mui/material'
import React from 'react'
import { useEffect, useState } from 'react'


export default function CreateGame( {} ) {
    const handleBroadcastGame = async (gameType) => {
        const gameRequest = {
            'User': Date.now(),
            'GameType': gameType
        }
        fetch("http://localhost:5000/broadcast", {
            method: "POST", 
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify(gameRequest)
        }).then(res => res.json()).then(data => {
            console.log(data.Data);
        })
    }

    return (
        <>
        <Button variant="outlined" onClick={() => { handleBroadcastGame('WordHunt') }}>
            WordHunt
        </Button>
        <Button variant="outlined" onClick={() => { handleBroadcastGame('TicTacToe') }}>
            TicTacToe
        </Button>
        </>
    )
}