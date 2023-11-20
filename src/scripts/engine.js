const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBoxUm: document.getElementById("score-points-win"),
        scoreBoxDois: document.getElementById("score-points-lose"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },
    fieldCards: {
        player: document.getElementById("player-field-card"), 
        computer: document.getElementById("computer-field-card"), 
    },
    playerSides: {
        player1: "player-cards",
        player1Box: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards")
    },
    actions: {
        buttom: document.getElementById("next-duel")
    }
}
const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
}

const pathImages = "./src/assets/icons/";
const cardData = [
    {
        id:0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2]
    },
    {
        id:1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0]
    },
    {
        id:2,
        name: "Exodia",
        type: "Scissors",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1]
    },
]
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);/* */
    return cardData[randomIndex].id;
}
async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px"); /* */
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if(fieldSide === playerSides.player1){
        
        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });
        
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
    }
    
    return cardImage;
}

async function setCardsField(cardId){

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";
    
    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults);
}

async function drawButton(text) {
    state.actions.buttom.innerText = text.toUpperCase();
    state.actions.buttom.style.display = "block";
    /*state.actions.buttom.style.visibility = "visible";*/
}
async function updateScore() {
    state.score.scoreBoxUm.innerText = `Win: ${state.score.playerScore}`;
    state.score.scoreBoxDois.innerText = `Lose: ${state.score.computerScore}`;
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "draw";
    let playerCard = cardData[playerCardId];

    if(playerCard.winOf.includes(computerCardId)){
        duelResults = "win";
        state.score.playerScore++;
    } else if (playerCard.loseOf.includes(computerCardId)){
        duelResults = "lose";
        state.score.computerScore++;
    }
    await playAudio(duelResults);
    return duelResults;
}


async function removeAllCardsImages() {
    let {computerBox, player1Box} = state.playerSides;

    let imgElments = computerBox.querySelectorAll("img");
    imgElments.forEach((img) => img.remove());

    imgElments = player1Box.querySelectorAll("img");
    imgElments.forEach((img) => img.remove());
}

async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Atribute: " + cardData[index].type;
    

}

async function drawCards(cardNumbers, fieldSide) {
    for(let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

async function resetDuel() {
    state.cardSprites.avatar.src = "";
    state.actions.buttom.style.display = "none";
    /*visibility: hidden */

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function playAudio(status) {
    const audio = new Audio(`./src/assets/audios/${status}.wav`);
    audio.play();
}

function init () {
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

}

init ();