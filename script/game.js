function moduleMaker(type, moduleClass, id) {
    const result = document.createElement(type);
    result.classList.add(moduleClass);
    if (id) result.id = id;
    return result;
}

function firstRound (deckId, playersScore) {
    playersScore.forEach((item, index) => playAsPlayer(deckId, playersScore, index));
}



function gameModules(tableElement, playersScore) {
    for(let i = 0; i < playersScore.length; i++) {
        component = moduleMaker('div', `player${i}hand`);
        tableElement.appendChild(component);
    }
}

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
    if(playersScore[currentPlayer][1] == 2) checkIfDoubleAce(playersScore, currentPlayer);
}

async function playAsPlayer(deckId, playersScore, currentPlayer) {
    let newCard = await drawCard(deckId);
    playersScore[currentPlayer][1] += 1;
    await playersScore[currentPlayer][3].push(newCard.cards[0]);
    if (playersScore[currentPlayer][1] == 1) playAsPlayer(deckId, playersScore, currentPlayer);
    didPlayerLose(playersScore, currentPlayer);
}

function nextPlayer(playersScore, currentPlayer) {
    currentPlayer == playersScore.length ? currentPlayer = 0 : currentPlayer += 1;
}


async function everyNextRound (deckId, playersScore, currentPlayer, activePlayers, buttonHitMe, buttonCheck) {
    await buttonHitMe.onClick(playAsPlayer(deckId, playersScore, currentPlayer));
    buttonCheck.onClick(activePlayers[currentPlayer][1] = false);
    nextPlayer(playersScore, currentPlayer);
}

async function playGame(playersScore, tableElement) {
    let currentPlayer = 0;
    let activePlayers = [];

    for(let i = 0; i < playersScore.length; i++) {
        activePlayers.push(true);
    }

    const buttonsGame = moduleMaker('div', 'buttons_game');

    const buttonHitMe = moduleMaker('button', 'button_game');
    buttonHitMe.innerText = "Dobierz kartę";
    const buttonCheck = moduleMaker('button', 'button_game');
    buttonCheck.innerText = "Pas";
        
    tableElement.appendChild(buttonsGame);
    buttonsGame.appendChild(buttonHitMe);
    buttonsGame.appendChild(buttonCheck);

    console.log(playersScore);
    console.log(activePlayers);
    let deck = await getDeck();
    console.log(deck.deck_id);
    firstRound(deck.deck_id, playersScore);
    console.log(playersScore);

    activePlayers[currentPlayer][1] == false ? nextPlayer(playersScore, currentPlayer) : everyNextRound(deck.deck_id, playersScore, currentPlayer, activePlayers, buttonHitMe, buttonCheck);
}


(function table () {

    let currentPlayer = 0;
    const playersScore = [[0, 0, false, []]];
    
    const game = document.getElementById("GAME");
    
    const gameElement = moduleMaker('div', 'game', 'blackjack');

    const tableElement = moduleMaker('div', 'table');

    const buttonsElement = moduleMaker('div', 'button_box');

    const titleElement = moduleMaker('h3', 'title');
    titleElement.innerText = "Oczko: The Game";

    const addPlayer = moduleMaker('button', 'button_basic', 'addPlayer');
    addPlayer.innerText = "Dodaj gracza";

    const startGame = moduleMaker('button', 'button_basic', 'startGame');
    startGame.innerText = "Rozpocznij grę";

    const playersNum = moduleMaker('h4', 'num_of_players');
    playersNum.innerText = `Liczba graczy: ${playersScore.length}`;

    game.appendChild(gameElement);
    gameElement.appendChild(tableElement);
    tableElement.appendChild(buttonsElement);
    buttonsElement.appendChild(titleElement);
    buttonsElement.appendChild(addPlayer);
    buttonsElement.appendChild(startGame);
    buttonsElement.appendChild(playersNum);

    addPlayer.onclick = () => {
        playersScore.length < 4 ? playersScore.push([0, 0, false, []]) : console.log("Max players already!");
        playersNum.innerText = `Liczba graczy: ${playersScore.length}`;
    }
    startGame.onclick = () => {
        tableElement.removeChild(buttonsElement);
        gameModules(tableElement, playersScore);
        
        playGame(playersScore, tableElement);
    }

    console.log(playersScore);
})();

