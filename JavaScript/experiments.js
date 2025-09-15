/* 
Keifer Buss
Last modified: 15 Sep 2025
Sources: [3], [4], [5], [6], [7], [8], [9]
*/

// Customizable dimensions
let currentWidth = 5;
let currentHeight = 5;
let cardCount = 5;

// Visible vars
let tileCount = (currentHeight * currentWidth);
let puzzleMoves = 0;
let lightCount = tileCount;
let inGame = true;
let currentHTML = "";

// Invisible vars
let currentId = 0;
let darkArray = [];

let cardArray = [];
let tempRank = undefined;
let tempStr = "";
for (let i = 0; i < 52; i++) {
    tempStr = "";
    tempRank = Math.floor(i / 4) + 1;
    if (tempRank < 10) tempStr += "0";
    tempStr += tempRank.toString();
    switch(i % 4) {
        case 0:
            tempStr += 'c';
            break;
        case 1:
            tempStr += 'd';
            break;
        case 2:
            tempStr += 'h';
            break;
        default:
            tempStr += 's';
    }
}

// Defining the custom element for HTML
class LightPuzzle extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        console.log("callback fired");
        currentHTML = "";
        for (let i = 0; i < currentHeight; i++) {
            currentHTML += "<div class='row'>"
            for (let j = 0; j < currentWidth; j++) {
                currentId = "piece" + (currentWidth * i + j);
                darkArray.push(0);
                currentHTML += "<button class='puzzle' id='" + currentId + "'></button>";
            }
            currentHTML += "</div>"
        }
        this.innerHTML = currentHTML;
        currentHTML = "";
        return;
    }
    connectedMoveCallback(){
        console.log("move callback fired");
        return;
    }
}
customElements.define("create-puzzle", LightPuzzle);

class HandDisplay extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        currentHTML = "<div class='poker_display'>";
        for (let i = 0; i < cardCount; i++) {
            currentHTML += "<div class='card_div' id='card" + i + 
            "'><img src=''>" + "</div>";
        }
        currentHTML += "</div>";
        this.innerHTML = currentHTML;
        currentHTML = "";
        return;
    }
}
customElements.define("hand-display", HandDisplay);

class Card {
    constructor(inputRank, inputSuit) {
        this.#rank = inputRank;
        this.#suit = inputSuit;
    }

    getRank() {
        return this.#rank;
    }

    getSuitRank() {
        switch (this.#suit) {
            case "Clubs":
                return 1;
            case "Diamonds":
                return 2;
            case "Hearts":
                return 3;
            default:
                return 4;
        }
        return undefined;
    }

    getSuitLetter() {
        return this.#suit.charAt(0).toLowerCase();
    }

    cardName() {
        let message = "";
        switch (this.#rank) {
            case 11:
                message += "Jack";
                break;
            case 12:
                message += "Queen";
                break;
            case 13:
                message += "King";
                break;
            case 14:
                message += "Ace";
                break;
            default:
                message += this.#rank;
        }
        return message + " of " + this.#suit.toLowerCase();
    }
    
    

    #rank = -Infinity;
    #suit = "";
}

class Deck {
    constructor() {
        for (let i = 2; i < 15; i++) {
            this.#ranks.push(i);
        }
        for (let i = 0; i < this.#suits.length; i++) {
            for (let j = 0; j < this.#ranks.length; j++) {
                let tempCard = new Card(this.#ranks[j], this.#suits[i])
                this.#cards.push(tempCard);
            }
        }
    }

    shuffle() {
        let tempArray = [];
        let randomIndex = 0;
        for (let i = (this.#cards.length); i > 0; i--) {
            randomIndex = Math.floor(Math.random() * i);
            tempArray.push(this.#cards[randomIndex]);
            this.#cards.splice(randomIndex, 1)
        }
        this.#cards = tempArray;
        // console.log(this.#cards);
        return;
    }

    draw() {
        return this.#cards.pop();
    }

    returnPile(somePile) {
        this.#cards = this.#cards.concat(somePile);
        return;
    }

    #ranks = [];
    #suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
    #cards = [];
}

// Card vars //
const pile = new Deck();
pile.shuffle();

let hand = [];
let discardPile = [];
let cardText;
let evalText;
///////////////

// wait for page to load before loading scripts [5]
window.onload = init;

// Loaded script
function init() {
    const p_moves = document.getElementById("puzzle_moves");
    const p_lights = document.getElementById("puzzle_num_lights")
    const btns = document.getElementsByClassName("puzzle");
    const reset_button = document.getElementById("puzzle_reset");
    const generate_button = document.getElementById("puzzle_generate")
    const whole_puzzle = document.getElementById("whole_puzzle");
    

    // Start initial puzzle
    updateText();
    addButtonListeners();

    // Card function
    cardText = document.getElementById("cards");
    evalText = document.getElementById("poker_eval")
    cardText.innerHTML = "";
    evalText.innerHTML = "No evaluation";
    dealCards();
    updateCardText();

    /* PUZZLE FUNCTIONS */
    // Resets the puzzle
    reset_button.addEventListener("click", function () {
        resetPuzzle();
    });

    // Generates a new puzzle
    generate_button.addEventListener("click", function () {
        removePuzzle();
        setDimensions();
        instantiatePuzzle();
        addButtonListeners();
        return;
    });

    // First step of reinitialization is removing the puzzle and the event listeners.
    // If we do not remove the event listeners, there will be extra event listeners
    // which not only take up unnecessary space but also could interfere with reinstantiation
    function removePuzzle() {
        for (let i = btns.length - 1; i >= 0; i--) {
            btns[i].removeEventListener("click", clickListener);
            btns[i].remove();
        }
        whole_puzzle.innerHTML = "";
        return;
    }

    // Validates form input and sets puzzle dimensions
    function setDimensions() {
        let x = document.forms["puzzle_dimensions"]["pWidthNum"].value;
        //console.log(x);
        if (x === NaN || x < 1 || x > 10) {
            document.getElementById("puzzle_error").innerHTML = "Failed: width must be between 1 and 10";
            return;
        }
        let y = document.forms["puzzle_dimensions"]["pHeightNum"].value;
        //console.log(y);
        if (y === NaN || y < 1 || y > 10) {
            document.getElementById("puzzle_error").innerHTML = "Failed: height must be between 1 and 10";
            return;
        }
        document.getElementById("puzzle_error").innerHTML = "";
        currentWidth = Number(x);
        currentHeight = Number(y);
    }

    function instantiatePuzzle() {
        // Reset variables
        tileCount = (currentHeight * currentWidth);
        puzzleMoves = 0;
        lightCount = tileCount;
        currentId = 0;
        currentHTML = "";
        darkArray = [];

        // Generate HTML block
        for (let i = 0; i < currentHeight; i++) {
            currentHTML += "<div class='row'>"
            for (let j = 0; j < currentWidth; j++) {
                currentId = "piece" + ((currentWidth * i) + j);
                darkArray.push(0);
                currentHTML += "<button class='puzzle' id='" + currentId + "'></button>";
            }
            currentHTML += "</div>"
        }

        // Update page elements
        updateText();
        whole_puzzle.innerHTML = currentHTML;
        inGame = true;
        currentHTML = "";
        return;
    }

    // Resets puzzle without changing dimensions
    function resetPuzzle() {
        puzzleMoves = 0;
        lightCount = tileCount;
        for (let i = 0; i < btns.length; i++) {
            darkArray[i] = 0;
            btns[i].style.backgroundColor = "white";
        }
        inGame = true;
        updateText();
        return;
    }

    // Replaces text in page with new stats
    function updateText() {
        p_moves.innerHTML = "Moves: " + puzzleMoves;
        p_lights.innerHTML = "Number of lights: " + lightCount;
        return;
    }

    // Separate function as the buttons need to exist before adding the listeners
    function addButtonListeners() {
        // All created tiles need a click function
        for (let i = 0; i < btns.length; i++) {
            btns[i].addEventListener("click", clickListener)
        }
        return;
    }

    // Puzzle button onclick listener
    // I will need this function for identification when removing the EventListener [7]
    function clickListener() {
        // Only allow change if game is ongoing
        if (!inGame) {return};
       
        // Index definition
        let e;

        // Find index of object
        for (let i = 0; i < btns.length; i++) {
            if (this === btns[i]) {e = i; break;}
        }

        // Find the appropriate neighbors
        let pieceArray = getNeighbors(e, currentWidth, currentHeight);

        // Toggle lights and change light count on found neighbors
        for (let n in pieceArray) {
            //console.log(pieceArray[n])
            if (darkArray[pieceArray[n]] === 0) {
                lightCount--;
                darkArray[pieceArray[n]] = 1;
                btns.item([pieceArray[n]]).style.backgroundColor = "black";
            } else {
                lightCount++;
                darkArray[pieceArray[n]] = 0;
                btns.item([pieceArray[n]]).style.backgroundColor = "white";
            }
        }

        // Update text with new stats
        puzzleMoves++;
        updateText();
        
        // Check if win condition is met (every tile is dark)
        if (lightCount === 0) {
            window.alert("You win!");
            inGame = false;
        } else if (lightCount < 0) {
            window.alert("how did you get negative lights");
        }
    }
}

// Get the applicable neighbors for a given tile. Width and height are assumed to be different
// Position is also included because the puzzle must also light the selected tile
function getNeighbors(pos, puzzleWidth, puzzleHeight) {
    let neighbors = [pos];

    // Left check
    if ((pos % puzzleWidth) - 1 >= 0) {
        neighbors.push(pos - 1);
    }
    
    // Right check
    if ((pos % puzzleWidth) + 1 < puzzleWidth) {
        neighbors.push(pos + 1);
    }

    // Up check
    if ((pos - puzzleWidth) >= 0) {
        neighbors.push(pos - puzzleWidth);
    }

    // Down check
    if ((pos + puzzleWidth) < (puzzleWidth * puzzleHeight)) {
        neighbors.push(pos + puzzleWidth);
    }

    return neighbors;
}

/* Initial function testing
console.log(getNeighbors(6, 4, 4));
console.log(getNeighbors(7, 4, 4));
console.log(getNeighbors(2, 4, 4));
console.log(getNeighbors(0, 4, 4));
console.log(getNeighbors(13, 4, 4));
console.log(getNeighbors(0, 1, 1)); */

// CARD FUNCTIONS //
function evaluateHand() {
    /*Tests 
    hand = [];
    for (let i = 2; i < 7; i++) {
        i === 6 ? hand.push(new Card(14, "Hearts")) : hand.push(new Card(i, "Diamonds"));
    }

    /* hand = [];
    let ranfren = Math.floor(Math.random() * 9) + 2
    for (let i = ranfren; i < ranfren + 5; i++) {
        hand.push(new Card(i, "Hearts"));
    } */

    /*
    hand.push(new Card(3, "Hearts"));
    hand.push(new Card(3, "Diamonds"));
    hand.push(new Card(11, "Spades"));
    hand.push(new Card(11, "Hearts"));
    hand.push(new Card(11, "Clubs"));
    */

    hand.sort(compare);

    console.log(hand);

    let uniqueCards = [];
    let possibleIndex;
    for (let i = 0; i < hand.length; i++) {
        possibleIndex = findCard(uniqueCards, hand[i]);
        if((possibleIndex + 1)) {
            uniqueCards[possibleIndex][1]++;
        } else {
            uniqueCards.push([hand[i].getRank(), 1])
        }
    }

    let isFlush = true;
    let isStraight = (uniqueCards.length >= 5);
    let numPairs = (uniqueCards[0][1] === 2) ? 1 : 0;
    let highestCount = uniqueCards[0][1];
    let lastRank = uniqueCards[0][0];
    let flushSuit = hand[0].getSuitRank();

    for (let i = 1; i < uniqueCards.length; i++) {
        highestCount = Math.max(highestCount, uniqueCards[i][1]);
        if (uniqueCards[i][1] === 2) numPairs++;
        if ((isStraight) && 
            ((uniqueCards[i][0]) != (uniqueCards[i - 1][0] + 1)) && 
            (!((uniqueCards[i - 1][0] === 5) && (uniqueCards[i][0] === 14)))) {
                isStraight = false;
        }
        if ((isFlush) && (hand[i].getSuitRank() != flushSuit)) {
            isFlush = false;
        }
    }

    if ((isStraight) && (uniqueCards[3][0] === 5) && (uniqueCards[4][0] === 14)) {
        hand.unshift(hand.pop());
    }

    if ((isStraight) && (isFlush)) {
        if (uniqueCards[0][0] === 10) {
            evalText.innerHTML = "Royal Flush (im so sorry you got this here)"
        } else {
            evalText.innerHTML = "Straight Flush!?"
        }
    } else if (highestCount === 4) {evalText.innerHTML = "Four of a Kind!!"}
    else if ((highestCount === 3) && (numPairs === 1)) {evalText.innerHTML = "Full House!"}
    else if (isFlush) {evalText.innerHTML = "Flush";}
    else if (isStraight) {evalText.innerHTML = "Straight";}
    else if (highestCount > 2) {evalText.innerHTML = "Three of a Kind";}
    else if (numPairs >= 2) {evalText.innerHTML = "Two Pair";}
    else if (numPairs >= 1) {evalText.innerHTML = "Pair";}
    else {evalText.innerHTML = "High Card";}

    console.log(hand);
    updateCardText();
    return;
}

function findCard(uniqueCards, card) {
    for (let i = 0; i < uniqueCards.length; i++) {
        if (uniqueCards[i][0] === card.getRank()) return i;
    }
    return -1;
}

function compare(cardA, cardB) {
    if (cardA.getRank() != cardB.getRank()) {
        return (cardA.getRank() - cardB.getRank());
    } else {
        return (cardA.getSuitRank() - cardB.getSuitRank());
    }
    return undefined;
}

function updateCardText() {
    let tempDiv;
    let tempCardText = "";
    for (let i = 0; i < hand.length; i++) {
        tempStr = "";
        tempDiv = document.getElementById("card" + i).firstElementChild;
        tempRank = (((hand[i].getRank() - 1) % 13) + 1);
        if(tempRank < 10) tempStr += "0";
        tempStr += tempRank;
        tempStr += hand[i].getSuitLetter();
        tempDiv.setAttribute('src', 'Images/cards/' + tempStr + ".png");
        tempCardText += hand[i].cardName();
        if (i != (hand.length - 1)) tempCardText += "<br>";
    }   
    cardText.innerHTML = tempCardText;
    return;
}

function restartGame() {
    for (let i = hand.length; i > 0; i--) {
        discardPile.push(hand.pop());
    }
    evalText.innerHTML = "No evaluation";
    pile.returnPile(discardPile);
    discardPile = [];
    pile.shuffle();
    dealCards();
    updateCardText();
    return;
}

function dealCards() {
    let newCard;
    for (let i = 0; i < 5; i++) {
        newCard = pile.draw();
        hand.push(newCard);
    }
    return;
}
////////////////////////////////