class Header extends HTMLElement {
    constructor() {
        super(); // Invoke superclass constructor
    }

    connectedCallback() {
        this.innerHTML = `
            <style>
            .header_list {
                list-style-type:none;
                overflow: hidden;
                padding:0px;
            }

            .header_element {
                float:left;
                padding-right:8px;
            }
            </style>

            <h1 style="text-align: center;">Keifer Buss's Website</h1>
            <ul class="header_list">
                <li class="header_element"><a href="index.html">Home</a></li>
                <li class="header_element"><a href="about.html">About</a></li>
                <li class="header_element"><a href="experiments.html">Website Experiments</a></li>
                <li class="header_element"><a href="contact.html">Contact Me</a></li>
            </ul>
            <hr>
        `
    }
}

customElements.define("create-header", Header);

// Thank you to Kristofer Koishigawa for the tutorial [1].