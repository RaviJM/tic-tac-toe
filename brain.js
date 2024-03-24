const gameBoard = (function (){
    let dimension = 3;
    let gameBoardArray = [];

    function returnDimension(){
        return dimension;
    }

    // to create gameboard array initially
    const createGameBoard = () => {
        for (let i=0;i<dimension;i++){
            gameBoardArray[i] = [];
            for (let j=0;j<dimension;j++){
                gameBoardArray[i][j] = "";
            }
        }
    };

    // to mark a cell in array when player takes a turn
    const markChosenCell = (row, column, marker) => {
        gameBoardArray[row][column] = marker;
    };
    
    // to check if board is full or not
    const boardFull = () => {
        for (let i=0;i<dimension;i++){
            for (let j=0;j<dimension;j++){
                if (gameBoardArray[i][j] === ""){
                    return false;
                }
            }
        }
        return true;
    };
    
    // to check winner
    const checkWinner = (player) => {
        // check 3 dirn
        // horizontal check
        for (let i=0;i<dimension;i++){
            if ((gameBoardArray[i][0] === gameBoardArray[i][1]) && (gameBoardArray[i][1] === gameBoardArray[i][2]) && gameBoardArray[i][2] !== ""){
                return true;
            }
        }

        // vertical check
        for (let i=0;i<dimension;i++){
            if ((gameBoardArray[0][i] === gameBoardArray[1][i]) && (gameBoardArray[1][i] === gameBoardArray[2][i] && gameBoardArray[2][i] !== "")){
                return true;
            }
        }

        //diagonal check
        if (((gameBoardArray[0][0] === gameBoardArray[1][1]) && (gameBoardArray[1][1] === gameBoardArray[2][2]) && gameBoardArray[2][2] !== "") || ((gameBoardArray[2][0] === gameBoardArray[1][1]) && (gameBoardArray[1][1] === gameBoardArray[0][2]) && gameBoardArray[0][2] !== "")){
            return true;
        }
        return false;
    };
    
    // to return gameboard array (for other functions to use the array inside them, as this ins't accessible inside them directly)
    const getBoard = () => {
        return gameBoardArray;
    };

    return {returnDimension, createGameBoard, markChosenCell, boardFull, checkWinner, getBoard};
})();













const players = (function (){
    const playerList = [];
    let playerTurnIndex = 1;
    let markerIndex = 0;
    
    const askForPlayerNames = () => {
        let name1 = prompt("Enter Player-1 Name:");
        // let name1 = "Ravi";
        let marker1 = 'X';
        let name2 = prompt("Enter Player-2 Name:");
        // let name2 = "Priya";
        let marker2 = 'O';

        createPlayer(name1, marker1);
        createPlayer(name2, marker2);
    };

    const createPlayer = (name, marker) => {
        let obj = {};
        obj.name = name;
        obj.marker = marker;
        obj.winner = "false";
        
        playerList.push(obj);
    };

    const getPlayerList = () => {
        return playerList;
    };

    const getMarkerIndex = () => {
        return markerIndex;
    }

    const updateMarkerIndex = () => {
        if (markerIndex == 1){
            markerIndex = 0;
        }
        else{
            markerIndex = 1;
        }
    }

    return {askForPlayerNames, createPlayer, getPlayerList, getMarkerIndex, updateMarkerIndex};
})();










const gameController = (function (){

    //executed when a button is pressed (cell)
    function playTurn(){
        
        let playerList = players.getPlayerList();
        if (!gameBoard.boardFull() && (playerList[0]["winner"] === "false") && (playerList[1]["winner"] === "false") ){
            // if cell is empty, then only allow for round, otherwise alert (else)
            if (this.textContent == ""){

                //show player turn
                viewController.showPlayerTurn();
                const cell = this;
                let iPosition = cell.getAttribute("iPosition");
                let jPosition = cell.getAttribute("jPosition");
                let markerIndex = players.getMarkerIndex();     // to get current marker index (which player's turn it is: 0 or 1)
                let marker = playerList[markerIndex]["marker"];     // to get the marker symbol
                
                // updating the array
                gameBoard.markChosenCell(iPosition, jPosition, marker);
                
                //updating the display, according to the array
                viewController.updateAndDisplayBoard();
                
                if (gameBoard.checkWinner()){   
                    // print winner and also update the player object in playerList, so that no further rounds are executed
                    playerList[markerIndex]["winner"] = "true";
                    const container = document.querySelector(".turn-showing-container");
                    container.textContent.content = "";
                    container.textContent = `${playerList[markerIndex]["name"]} wins!`;
                    alert(`${playerList[markerIndex]["name"]} wins!`);
                }

                players.updateMarkerIndex();    // to change the marker from 0 to 1 or 1 to 0, for switching turns between players
            }
            else{
                // display that you cannot place your marker in this box!
                alert("Place marker elsewhere!")
            }
        }
    };

    return {playTurn};
})();










const viewController = (function(){
    
    const dimension = gameBoard.returnDimension();
    const playerList = players.getPlayerList();
    
    function addEventToCells(){
        const cells = document.querySelectorAll(".cell");
        cells.forEach( (cell) => {
            cell.addEventListener("click", gameController.playTurn);    //when any button is clicked, a round is played (playTurn function), where only the array is updated, and then another function is called to re-render the display
        });
    };

    // called again and again after every turn, to update the display from the array
    function updateAndDisplayBoard(){
        let updatedGameBoardArray = gameBoard.getBoard();
        let dimension = gameBoard.returnDimension();

        let newGameBoard = document.querySelector(".gameboard-container");
        // empty the gameboard container
        newGameBoard.textContent = "";

        // make the new updated gameBoard from the array
        for (let i=0;i<dimension;i++){
            for (let j=0;j<dimension;j++){
                let cell = document.createElement("button");
                cell.classList = "cell";
                cell.setAttribute("iPosition", i);
                cell.setAttribute("jPosition", j);
                
                // adding event listener to the cell (button)
                cell.addEventListener("click", gameController.playTurn);

                cell.textContent = updatedGameBoardArray[i][j];
                
                newGameBoard.appendChild(cell);
            }
        }
    };

    // used to create the initial gameboard
    function createGameBoard(){
        for (let i=0;i<dimension;i++){
            for (let j=0;j<dimension;j++){
                let cell = document.createElement("button");
                cell.classList = "cell";
                cell.setAttribute("iPosition", i);
                cell.setAttribute("jPosition", j);
                const gameBoardContainer = document.querySelector(".gameboard-container");
                gameBoardContainer.appendChild(cell);
            }
        }
        let container = document.querySelector(".turn-showing-container");
        let indexOfCurrentTurnPlayer = players.getMarkerIndex();
        let playersName = playerList[indexOfCurrentTurnPlayer]["name"];

        container.textContent = `It is ${playersName}'s turn.`;
    };

    function showPlayerTurn(){
        let container = document.querySelector(".turn-showing-container");
        let indexOfCurrentTurnPlayer = players.getMarkerIndex();
        indexOfCurrentTurnPlayer = Math.abs(indexOfCurrentTurnPlayer - 1);
        let playersName = playerList[indexOfCurrentTurnPlayer]["name"];

        container.textContent = `It is ${playersName}'s turn.`;
    }

    function showPlayersDetails(){
        const container = document.querySelector(".player-details-container");
        
        //Player-1
        const player1Div = document.createElement("div");
        player1Div.style.width = "20rem";
        player1Div.style.border = "inset 0.5rem";
        player1Div.style.borderRadius = "4rem";
        player1Div.style.textAlign = "center";
        const p11 = document.createElement("p");
        p11.textContent = "Player-1 Details:";
        p11.style.textDecoration = "underline";
        const p12 = document.createElement("p");
        p12.textContent = `Name: ${playerList[0].name}`;
        const p13 = document.createElement("p");
        p13.textContent = `Marker: ${playerList[0].marker}`;
        player1Div.appendChild(p11);
        player1Div.appendChild(p12);
        player1Div.appendChild(p13);
        p11.style.fontSize = "1.5rem";
        container.appendChild(player1Div);
        
        //Player-2
        const player2Div = document.createElement("div");
        const p21 = document.createElement("p");
        p21.textContent = "Player-2 Details:";
        p21.style.textDecoration = "underline";
        const p22 = document.createElement("p");
        p22.textContent = `Name: ${playerList[1].name}`;
        const p23 = document.createElement("p");
        player2Div.style.width = "20rem";
        player2Div.style.border = "inset 0.5rem";
        player2Div.style.borderRadius = "4rem";
        player2Div.style.textAlign = "center";
        p23.textContent = `Marker: ${playerList[1].marker}`;
        player2Div.appendChild(p21);
        player2Div.appendChild(p22);
        player2Div.appendChild(p23);
        p21.style.fontSize = "1.5rem";
        container.appendChild(player2Div);
        
        
        
    };

    return {addEventToCells, updateAndDisplayBoard, createGameBoard, showPlayerTurn, showPlayersDetails};
})();








function playGame(){
    players.askForPlayerNames();            // for prompt asking for players names
    gameBoard.createGameBoard();            // to initially create the gameboard array
    viewController.createGameBoard();       // to initially create the gameboatd display
    viewController.showPlayersDetails();    // to show players' details
    viewController.addEventToCells();       // adding event listeners (functions to play rounds upon clicking) to all cells (buttons)
};


playGame();
