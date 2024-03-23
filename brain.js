const gameBoard = (function (){
    let dimension = 3;
    let gameBoardArray = [];

    const createGameBoard = () => {
        for (let i=0;i<dimension;i++){
            gameBoardArray[i] = [];
            for (let j=0;j<dimension;j++){
                gameBoardArray[i][j] = "";
            }
        }
    };

    const emptyBoard = () => {
        for (let i=0;i<dimension;i++){
            for (let j=0;j<dimension;j++){
                gameBoardArray[i][j] = "";
            }
        }
    };

    const getBoard = () => {
        return gameBoardArray;
    };

    const markChosenCell = (row, column, marker) => {
        gameBoardArray[row][column] = marker;
    }

    const boardFull = () => {
        for (let i=0;i<dimension;i++){
            for (let j=0;j<dimension;j++){
                if (gameBoardArray[i][j] === ""){
                    return false;
                }
            }
        }
        return true;
    }
    
    const checkWinner = (player) => {
        //check in 3 dirn
    }

})();




// players:
//     askForPlayerName
//     createPlayer
//     getPlayerList

// gameController:
//?    playTurn

// viewController:
//?    addEventToCells
//?    updatePlayerIndex
//     displayBoard
//     displayPlayerNames
//     displayMessage
//     showAgainPrompt
//     hideAgainPrompt
//     displayWinner

//? playGame
//? playRound

// (calls playGame)
