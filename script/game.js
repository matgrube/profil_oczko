const gameLogic = (activePlayer) => {
    let isWon = false;
    if (playersScore[activePlayer][0] = 21) {
        isWon = true;
    };
    return isWon;
}


const gamePlay = (playersScore) => {
    const addPlayer = document.getElementById('addPlayer');
    
    const playerAdd = () => {
        playersScore.length < 4 ? playersScore.push([0, 0]) : console.log("Max players already!");
        };
    addPlayer.onclick = playerAdd;

    console.log(playersScore);
}



(function table () {

    const playersScore = [[0,0]];
    
    function moduleMaker(type, moduleClass, id) {
        const result = document.createElement(type);
        result.classList.add(moduleClass);
        if (id) result.id = id;
        return result;
    }
    
    const game = document.getElementById("GAME");
    
    const gameElement = moduleMaker('div', 'game', 'blackjack');

    const tableElement = moduleMaker('div', 'table');

    const addPlayer = moduleMaker('button', 'addPlayer', 'addPlayer');
    addPlayer.innerText = "Dodaj gracza";

    const startGame = moduleMaker('button', 'startGame', 'startGame');
    startGame.innerText = "Rozpocznij grę";

    game.appendChild(gameElement);
    gameElement.appendChild(tableElement);
    tableElement.appendChild(addPlayer);
    tableElement.appendChild(startGame);
    
    startGame.onclick = () => {
        tableElement.removeChild(addPlayer);
        tableElement.removeChild(startGame);
        console.log(playersScore);
    }

    gamePlay(playersScore);
})();

