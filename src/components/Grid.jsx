import React, { useState } from 'react'

export default function Grid({board, setBoard, guess, setGuess}) {

    const [clickedIndices, setClickedIndices] = useState([]);
    
    const stringify = (rowInd, colInd) => `${rowInd},${colInd}`;

    const isUpperCase = str => str === str.toUpperCase();

    //Handles everything when you click a letter
    const handleClick = (letter, rowIndex, colIndex) => {
        //Since we are setting clicked letters to capital letters to mark boxes, we need to modify original matrix
        const updatedMatrix = board.map((x, currRowIndex) => {
            return x.map((y, currColIndex) => {
                //If the current index is the index we just clicked
                if (currRowIndex == rowIndex && currColIndex == colIndex) {
                    //If the box has already been selected (is green)
                    if(y == y.toUpperCase()) {
                        //If the current index clicked was the most recent then we can deselect it
                        if(clickedIndices[clickedIndices.length-1] == stringify(rowIndex,colIndex)) {
                            setClickedIndices(
                                clickedIndices.filter(a => 
                                    a !== stringify(rowIndex,colIndex))
                            )
                            setGuess(guess.slice(0,-1))
                            return y.toLowerCase();
                        //Else we can't deselect it since it wasn't most recent and do nothing
                        } else {
                            return y;
                        }
                    //If the box has not already been selected, make it capital (marking box green)
                    } else {
                        setClickedIndices([
                            ...clickedIndices,
                            stringify(currRowIndex,currColIndex)
                        ])
                        setGuess(guess + letter);
                        return y.toUpperCase();
                    }
                //If we don't click on that box, just keep it the same
                } else {
                    return y;
                }
            })
        })
        setBoard(updatedMatrix);
    }

    return (
        <div>
            {board.map((x, rowIndex) => {
                return (
                    <div className="row" key={x}>
                        {x.map((y, colIndex) => <div 
                        //If it is uppercase in the grid, it is selected, make it green
                        className={isUpperCase(y)?`selected`:`col`}
                        key={colIndex} 
                        data-id={colIndex}
                        onClick={()=>handleClick(y,rowIndex,colIndex)}
                        >
                            {y}
                        </div>)}
                    </div>
                )
            })}
        </div>
    )
}