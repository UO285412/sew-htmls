

class Semaforo {
    constructor() {
        this.levels = [0.2, 0.5, 0.8]; // Dificultades del juego
        this.lights = 4; // Número de luces del semáforo
        this.unload_moment = null; // Momento de inicio de la secuencia de apagado
        this.click_moment = null; // Momento en el que el usuario pulsa el botón de reacción

        // Inicializa la dificultad del juego de forma aleatoria
        this.difficulty = this.levels[Math.floor(Math.random() * this.levels.length)];
        this.createStructure();
      
    }

    createStructure() {
        const main = document.querySelector("main");
        const section = document.createElement("section");
        section.classList.add("semaforo-section");
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
        this.semaforoSection = section; // Guardamos la referencia a la sección
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
        this.click_moment = new Date();
        const reactionTime = ((this.click_moment - this.unload_moment) / 1000).toFixed(3);
    
        const paragraph = document.createElement("p");
        paragraph.textContent = `Tiempo de reacción: ${reactionTime} segundos`;
        this.semaforoSection.appendChild(paragraph);
    
        const main = document.querySelector("main");
        main.classList.remove("load");
        main.classList.remove("unload");
    
        this.startButton.disabled = false;
        this.reactionButton.disabled = true;
    
        // Ahora creamos y añadimos el formulario desde aquí
        this.createRecordForm(reactionTime, this.difficulty);
    }
    

    

    createRecordForm(reactionTime, difficulty) {
        console.log("Creando formulario para registrar récord...");
        // Crear el formulario usando JavaScript puro
        const form = document.createElement('form');
        form.method = "POST";
        form.action = "semaforo.php";

        const fieldset = document.createElement('fieldset');
        const legend = document.createElement('legend');
        legend.textContent = "Registrar Récord";

        // Nombre
        const labelNombre = document.createElement('label');
        labelNombre.textContent = "Nombre:";
        const inputNombre = document.createElement('input');
        inputNombre.type = "text";
        inputNombre.name = "nombre";
        inputNombre.required = true;
        labelNombre.appendChild(document.createElement('br'));
        labelNombre.appendChild(inputNombre);

        // Apellidos
        const labelApellidos = document.createElement('label');
        labelApellidos.textContent = "Apellidos:";
        const inputApellidos = document.createElement('input');
        inputApellidos.type = "text";
        inputApellidos.name = "apellidos";
        inputApellidos.required = true;
        labelApellidos.appendChild(document.createElement('br'));
        labelApellidos.appendChild(inputApellidos);

        // Nivel
        const labelNivel = document.createElement('label');
        labelNivel.textContent = "Nivel:";
        const inputNivel = document.createElement('input');
        inputNivel.type = "text";
        inputNivel.name = "nivel";
        inputNivel.value = difficulty;
        inputNivel.readOnly = true;
        labelNivel.appendChild(document.createElement('br'));
        labelNivel.appendChild(inputNivel);

        // Tiempo de reacción
        const labelTiempo = document.createElement('label');
        labelTiempo.textContent = "Tiempo de reacción (segundos):";
        const inputTiempo = document.createElement('input');
        inputTiempo.type = "text";
        inputTiempo.name = "tiempo";
        inputTiempo.value = reactionTime;
        inputTiempo.readOnly = true;
        labelTiempo.appendChild(document.createElement('br'));
        labelTiempo.appendChild(inputTiempo);

        // Botón de envío
        const submitButton = document.createElement('button');
        submitButton.type = "submit";
        submitButton.textContent = "Guardar Récord";

        // Añadir todos los elementos al fieldset
        fieldset.appendChild(legend);
        fieldset.appendChild(labelNombre);
        fieldset.appendChild(document.createElement('br'));
        fieldset.appendChild(labelApellidos);
        fieldset.appendChild(document.createElement('br'));
        fieldset.appendChild(labelNivel);
        fieldset.appendChild(document.createElement('br'));
        fieldset.appendChild(labelTiempo);
        fieldset.appendChild(document.createElement('br'));
        fieldset.appendChild(submitButton);

        // Añadir fieldset al form
        form.appendChild(fieldset);

        // Añadir el formulario debajo del semáforo (en main)
        const main = document.querySelector('main');
        this.semaforoSection.appendChild(form);
        console.log("Formulario de récord creado.");
        }
}

