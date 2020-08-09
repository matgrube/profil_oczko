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

function checkIfDoubleAce(playersScore, currentPlayer) {
    let winners = [];
    let res = playersScore[currentPlayer][3].reduce((a, b) => {return (a.code.slice(0,1) + b.code.slice(0,1))});
    if (res == "AA") winners.push(currentPlayer);
}

async function getDeck() {
    let deck = fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then(response => response.json())
    .then(data => {return data});
    
    let res = await deck;
    return res;
}

async function drawCard(id) {
    let card = fetch(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=1`)
    .then(response => response.json())
    .then(data => {return data});
    let res = await card;
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
    
    playersScore[currentPlayer][0] += Number(playersScore[currentPlayer][3][currentCard].value);
    
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
    return currentPlayer == playersScore.length - 1 ? 0 : currentPlayer += 1;
}

function showHand(playersScore, currentPlayer) {
    let hand = document.querySelectorAll(`div.player${currentPlayer}hand`);
    for(let i = 0; i < playersScore[currentPlayer][1]; i++) {
        card = moduleMaker('img', 'card');
        card.src = playersScore[currentPlayer][3][i].image;
        hand.appendChild(card);
    };
}

async function everyNextRound (deckId, playersScore, currentPlayer, activePlayers, buttonHitMe, buttonCheck) {
    
    buttonHitMe.addEventListener("click", () => {
        if(activePlayers[currentPlayer]) {
            playAsPlayer(deckId, playersScore, currentPlayer);
        }
        currentPlayer = nextPlayer(playersScore, currentPlayer);
    });
    buttonCheck.addEventListener("click", () => {
        activePlayers[currentPlayer] = false;
        currentPlayer = nextPlayer(playersScore, currentPlayer);
    });
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

    let deck = await getDeck();
    firstRound(deck.deck_id, playersScore);

    !activePlayers[currentPlayer] ? currentPlayer = nextPlayer(playersScore, currentPlayer) : everyNextRound(deck.deck_id, playersScore, currentPlayer, activePlayers, buttonHitMe, buttonCheck);
    showHand(playersScore, currentPlayer);
}


(function table () {
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
})();

