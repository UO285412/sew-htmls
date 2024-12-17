/* Nestor Fernandez Garcia UO285412 */

"use strict";

class Memoria {
    constructor() {
        this.cardsArray = [
            { element: "RedBull", source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
            { element: "McLaren", source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
            { element: "Alpine", source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
            { element: "AstonMartin", source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
            { element: "Ferrari", source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
            { element: "Mercedes", source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" }
        ];
        this.cardsArray = [...this.cardsArray, ...this.cardsArray]; // Duplicar para 12 cartas
        this.shuffleElements();
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
        this.createElements();
        this.addEventListeners();
    }

    // Bloque estático para inicializar la clase cuando el DOM esté listo
    static {
        window.addEventListener("DOMContentLoaded", () => new Memoria());
    }

    shuffleElements() {
        this.cardsArray.sort(() => Math.random() - 0.5);
    }

    createElements() {
        // Seleccionar la sección específica para el juego de memoria
        const gameBoard = document.querySelector("main > section");
        if (!gameBoard) {
            console.error("Contenedor del juego de memoria no encontrado.");
            return;
        }
        gameBoard.innerHTML = ""; // Vaciar tablero

        this.cardsArray.forEach(card => {
            const cardElement = document.createElement("article");
            cardElement.setAttribute("data-element", card.element);

            const frontFace = document.createElement("figcaption");
            frontFace.textContent = "Tarjeta de memoria";

            const backFace = document.createElement("img");
            backFace.src = card.source;
            backFace.alt = card.element;

            cardElement.appendChild(frontFace);
            cardElement.appendChild(backFace);
            gameBoard.appendChild(cardElement);
        });
    }

    addEventListeners() {
        // Seleccionar todas las tarjetas de memoria
        const cards = document.querySelectorAll("main > section article");
        cards.forEach(card => {
            card.addEventListener("click", () => this.flipCard(card));
        });

        // Seleccionar el botón de reinicio
        const resetButton = document.querySelector("button[aria-label='Reiniciar juego']");
        if (resetButton) {
            resetButton.addEventListener("click", () => this.resetGame());
        } else {
            console.warn("Botón de reinicio no encontrado.");
        }
    }

    flipCard(card) {
        if (this.lockBoard || card === this.firstCard || card.getAttribute("data-state") === "revealed") return;

        card.setAttribute("data-flipped", "true");

        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true;
            this.firstCard = card;
            return;
        }

        this.secondCard = card;
        this.checkForMatch();
    }

    checkForMatch() {
        const isMatch = this.firstCard.getAttribute("data-element") === this.secondCard.getAttribute("data-element");
        isMatch ? this.disableCards() : this.unflipCards();
    }

    disableCards() {
        this.firstCard.setAttribute("data-state", "revealed");
        this.secondCard.setAttribute("data-state", "revealed");
        this.resetBoard();
    }

    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.removeAttribute("data-flipped");
            this.secondCard.removeAttribute("data-flipped");
            this.resetBoard();
        }, 1000);
    }

    resetBoard() {
        [this.hasFlippedCard, this.lockBoard] = [false, false];
        [this.firstCard, this.secondCard] = [null, null];
    }

    resetGame() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;

        this.shuffleElements();

        const cards = document.querySelectorAll("main > section article");
        cards.forEach(card => {
            card.removeAttribute("data-flipped");
            card.removeAttribute("data-state");
        });

        this.createElements();
        this.addEventListeners();
    }
}
