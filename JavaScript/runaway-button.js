/*
Keifer Buss
Last modified: 19 Jul 2025
Sources: [1], [3], [4]
*/

// Offset button to mouse position on detected mouse movement. Y pos should stay
addEventListener("mousemove", (event) => {
    const runawayButton = document.getElementById("runaway");
    let runawayRect = runawayButton.getBoundingClientRect();

    const textd = document.getElementById("pageY")
    const textb = document.getElementById("pageB")
    textb.innerText = "Button Y: " + (runawayRect.y + window.scrollY);

    if (event.y + 20 > runawayRect.y) {
        textd.innerText = "Mouse Y: " + event.pageY + "!";
        runawayButton.style.top = event.pageY + 20 + "px";
    } else {
        textd.innerText = "Mouse Y: " + event.pageY;
    }
})  

// If one manages to click the button
function alertA() { window.alert("Congratulations. You pressed the button"); }
function alertB() { window.alert("How"); }