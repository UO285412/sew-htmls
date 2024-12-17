// Archivo: semaforo.js

class Semaforo {
    constructor() {
        this.levels = [0.2, 0.5, 0.8]; // Dificultades del juego
        this.lights = 4; // Número de luces del semáforo
        this.unload_moment = null; // Momento de inicio de la secuencia de apagado
        this.click_moment = null; // Momento en el que el usuario pulsa el botón de reacción

        // Inicializa la dificultad del juego de forma aleatoria
        this.difficulty = this.levels[Math.floor(Math.random() * this.levels.length)];

        this.createStructure(); // Genera la estructura del semáforo al instanciar
    }

    createStructure() {
        const main = document.querySelector("main");
        const section = document.createElement("section");

        // Encabezado del juego
        const header = document.createElement("h2");
        header.textContent = "Juego de tiempo de reacción";
        section.appendChild(header);

        // Crear luces del semáforo
        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement("div");
            light.classList.add('light'); // Clase para facilitar el estilo
            section.appendChild(light);
        }

        // Botón de arranque
        const startButton = document.createElement("button");
        startButton.textContent = "Arranque";
        startButton.type = "button";
        startButton.setAttribute("onclick", "semaforo.initSequence()"); // Asignar evento onclick
        section.appendChild(startButton);

        // Botón de reacción
        const reactionButton = document.createElement("button");
        reactionButton.textContent = "Reacción";
        reactionButton.type = "button";
        reactionButton.disabled = true;
        reactionButton.setAttribute("onclick", "semaforo.stopReaction()"); // Asignar evento onclick
        section.appendChild(reactionButton);

        main.appendChild(section);

        // Guardar referencias a los botones
        this.startButton = startButton;
        this.reactionButton = reactionButton;
    }

    initSequence() {
        const main = document.querySelector("main");
        main.classList.add("load"); // Añade la clase para encender las luces
        this.startButton.disabled = true; // Deshabilita el botón de arranque

        // Inicia la secuencia de apagado después de un tiempo calculado
        setTimeout(() => {
            this.unload_moment = new Date(); // Marca el momento de inicio del apagado
            this.endSequence();
        }, 2000 + this.difficulty * 100); // Duración total del encendido + tiempo aleatorio
    }

    endSequence() {
        const main = document.querySelector("main");
        main.classList.remove("load"); // Quita la clase de encendido
        main.classList.add("unload"); // Añade la clase para apagar las luces

        this.reactionButton.disabled = false; // Habilita el botón de reacción
    }

    stopReaction() {
        this.click_moment = new Date(); // Marca el momento del clic del usuario
        const reactionTime = ((this.click_moment - this.unload_moment) / 1000).toFixed(3); // Tiempo de reacción en segundos

        // Crear y mostrar el párrafo con el tiempo de reacción
        const paragraph = document.createElement("p");
        paragraph.textContent = `Tiempo de reacción: ${reactionTime} segundos`;
        document.querySelector("section").appendChild(paragraph);

        // Quitar las clases de encendido y apagado
        const main = document.querySelector("main");
        main.classList.remove("load");
        main.classList.remove("unload");

        // Habilita el botón de arranque y deshabilita el de reacción
        this.startButton.disabled = false;
        this.reactionButton.disabled = true;
    }
}

