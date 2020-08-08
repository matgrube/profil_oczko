const gameLogic = (activePlayer) => {
    let isWon = false;
    if (playersScore[activePlayer][0] = 21) {
        isWon = true;
    };
    return isWon;
}

function checkIfDoubleAce(playersScore, currentPlayer) {
    let winners = [];
    let res = playersScore[currentPlayer][3].reduce((a, b) => {return (a.code.slice(0,1) + b.code.slice(0,1))});
    if (res == "AA") winners.push(currentPlayer);
}

async function getDeck() {
    let res;
    let deck = fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(response => response.json())
    .then(data => {return data});
    
    res = await deck;
    return res;
}

async function drawCard(id) {
    let res;
    let card = fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`)
    .then(response => response.json())
    .then(data => {return data});
    res = await card;
    return res;
}

function didPlayerLose(playersScore, currentPlayer) {

    const cardValues = {
        "ACE": 11,
        "KING": 4,
        "QUEEN": 3,
        "JACK": 2
    };
    let currentCard = playersScore[currentPlayer][1] - 1;
    if (isNaN(Number(playersScore[currentPlayer][3][currentCard].value))) {
        let entries = Object.entries(cardValues);
        entries.forEach((item) => {if(item[0] == playersScore[currentPlayer][3][currentCard].value) playersScore[currentPlayer][3][currentCard].value = item[1]}); 
    }
    playersScore[currentPlayer][1] < 2 ? playersScore[currentPlayer][0] = Number(playersScore[currentPlayer][3][0].value) : playersScore[currentPlayer][0] = playersScore[currentPlayer][3].reduce((a, b) => {return (Number(a.value) + Number(b.value))});
    if(playersScore[currentPlayer][0] > 21) playersScore[currentPlayer][2] = true;
    console.log(playersScore[currentPlayer][0]);
    if(playersScore[currentPlayer][1] == 2) checkIfDoubleAce(playersScore, currentPlayer);
}

async function playAsPlayer(deckId, playersScore, currentPlayer) {
    let newCard = await drawCard(deckId);
    
    playersScore[currentPlayer][1] += 1;
    
    await playersScore[currentPlayer][3].push(newCard.cards[0]);
    console.log(typeof(playersScore[currentPlayer][3]));
    console.log(playersScore);
    if (playersScore[currentPlayer][1] == 1) playAsPlayer(deckId, playersScore, currentPlayer);
    didPlayerLose(playersScore, currentPlayer);
}

async function playGame(playersScore) {
    let currentPlayer = 0;
    let deck = await getDeck();
    console.log(deck.deck_id);

    // playersScore.forEach(element => {
    //     element[0] = 0;
    // });

    playAsPlayer(deck.deck_id, playersScore, currentPlayer);
}


const gamePlay = (playersScore) => {
    const addPlayer = document.getElementById('addPlayer');
    
    const playerAdd = () => {
        playersScore.length < 4 ? playersScore.push([0, 0, false, []]) : console.log("Max players already!");
        };
    addPlayer.onclick = playerAdd;

    console.log(playersScore);
}



(function table () {

    let activePlayer = 0;
    const playersScore = [[0, 0, false, []]];
    
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

    const playersCards = moduleMaker('div', `player_${activePlayer}_hand`);

    game.appendChild(gameElement);
    gameElement.appendChild(tableElement);
    tableElement.appendChild(addPlayer);
    tableElement.appendChild(startGame);
    
    startGame.onclick = () => {
        tableElement.removeChild(addPlayer);
        tableElement.removeChild(startGame);
        console.log(playersScore);
    }

    playGame(playersScore);

    
    gamePlay(playersScore);
    console.log(playersScore);
})();

