/* 
Keifer Buss
Last modified: 19 Jul 2025
Sources: [2], [3], [4]
*/

class Header extends HTMLElement {
    constructor() {
        super(); // Invoke superclass constructor
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
            h1.title {
                margin: 30px;
                font-family: "Verdana";
                text-align: center;
            }

            .header_list {
                list-style-type:none;
                overflow: hidden;
                padding: 0px;
                margin: 0px;
            }

            .header_element {
                float:left;
                padding: 10px 20px 10px 20px;
                border-style: outset;
            }
            </style>

            <h1 class="title">Keifer Buss's Website</h1>
            <hr style="margin: 0px;">
            <ul class="header_list">
                <li class="header_element"><a href="index.html">Home</a></li>
                <li class="header_element"><a href="about.html">About</a></li>
                <li class="header_element"><a href="experiments.html">Website Experiments</a></li>
                <li class="header_element"><a href="contact.html">Contact Me</a></li>
            </ul>
            <hr style="margin: 0px;">
        `
    }
}

customElements.define("create-header", Header);

// Thank you to Kristofer Koishigawa for the tutorial [1].