/* 
Keifer Buss
Last modified: 23 Jul 2025
Sources: [3], [4], [5], [6]
*/

let darkCount
let darkArray = [];
let currentWidth = 5;
let currentHeight = 5;
let currentId = 0;
let currentHTML = "";

// Defining the custom element for HTML
class LightPuzzle extends HTMLElement {
    constructor() {
        super();
    }
    connectedCallback() {
        for (let i = 0; i < currentHeight; i++) {
            this.innerHTML += "<div class='row'>"
            for (let j = 0; j < currentWidth; j++) {
                currentId = "piece" + (currentWidth * i + j);
                darkArray.push(0);
                this.innerHTML += "<button class='puzzle' id='" + currentId + "'></button>";
            }
            this.innerHTML += "</div>"
        }
    }
}
customElements.define("create-puzzle", LightPuzzle)

// wait for page to load before loading scripts [5]
window.onload = init;

// Loaded script
function init() {
    const btns = document.getElementsByClassName("puzzle");
    //console.log(btns);

    // All created tiles need a click function
    for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", function () {
            // Find the appropriate neighbors
            let pieceArray = getNeighbors(i, currentWidth, currentHeight);

            // Toggle lights on found neighbors
            for (let n in pieceArray) {
                //console.log(pieceArray[n])
                if (darkArray[pieceArray[n]] === 0) {
                    darkArray[pieceArray[n]] = 1;
                    btns[pieceArray[n]].style.backgroundColor = "black";
                } else {
                    darkArray[pieceArray[n]] = 0;
                    btns[pieceArray[n]].style.backgroundColor = "white";
                }
            }
        })
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
    if (pos - puzzleWidth >= 0) {
        neighbors.push(pos - puzzleWidth);
    }

    // Down check
    if (pos + puzzleWidth < puzzleWidth * puzzleHeight) {
        neighbors.push(pos + puzzleWidth);
    }

    return neighbors;
}

// Initial function testing
console.log(getNeighbors(6, 4, 4));
console.log(getNeighbors(7, 4, 4));
console.log(getNeighbors(2, 4, 4));
console.log(getNeighbors(0, 4, 4));
console.log(getNeighbors(13, 4, 4));
console.log(getNeighbors(0, 1, 1));