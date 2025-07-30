/* 
Keifer Buss
Last modified: 30 Jul 2025
Sources: [3], [4], [5], [6], [7]
*/

// Customizable dimensions
let currentWidth = 5;
let currentHeight = 5;

// Visible vars
let tileCount = (currentHeight * currentWidth);
let puzzleMoves = 0;
let lightCount = tileCount;
let inGame = true;
let currentHTML = "";

// Invisible vars
let currentId = 0;
let darkArray = [];

// Defining the custom element for HTML
class LightPuzzle extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        console.log("callback fired");
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
customElements.define("create-puzzle", LightPuzzle)

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
        if (inGame === false) {return};
       
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
            window.alert("Your are winner");
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