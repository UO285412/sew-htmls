class Noticias {
    constructor() {
          // Comprobar si el navegador soporta la API File
          if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
            alert("Lo siento, tu navegador no soporta la API File necesaria para este ejercicio.");
            return; // Salir del constructor si no hay soporte
        }
      

          // Crear y añadir input para carga de archivo
        const main = document.querySelector("main");
        const seccionCarga = document.createElement("section");
        
        const tituloCarga = document.createElement("h2");
        tituloCarga.textContent = "Cargar archivo de noticias";
        
        const fileInput = document.createElement("input");
        fileInput.setAttribute("type", "file");
        fileInput.setAttribute("aria-label", "Cargar archivo de noticias");
        fileInput.addEventListener("change", (event) => this.readInputFile(event));
        
        seccionCarga.appendChild(tituloCarga);
        seccionCarga.appendChild(fileInput);
        main.appendChild(seccionCarga);
         // Crear sección para mostrar información de archivo y contenido
        this.createDisplaySection();
        const sections = document.querySelectorAll("main > section");
        this.newsContainer = sections[0].querySelector("article");
        this.addNewsForm = sections[1].querySelector("form");
        this.addNewsButton = this.addNewsForm.querySelector("button");

        // Configura el evento para el botón
        this.addNewsButton.addEventListener("click", () => this.addNews());
    }

    createDisplaySection() {
        const main = document.querySelector("main");
        
        // Sección de información del archivo
        const seccionInfo = document.createElement("section");
        const tituloInfo = document.createElement("h2");
   
        seccionInfo.appendChild(tituloInfo);

        this.nombreArchivo = document.createElement("p");
        this.tamañoArchivo = document.createElement("p");
        this.tipoArchivo = document.createElement("p");
        this.ultimaModificacion = document.createElement("p");

        seccionInfo.append(this.nombreArchivo, this.tamañoArchivo, this.tipoArchivo, this.ultimaModificacion);
        main.appendChild(seccionInfo);

        // Sección de contenido del archivo
        const seccionContenido = document.createElement("section");
        const tituloContenido = document.createElement("h2");
        tituloContenido.textContent = "Contenido del archivo de texto";
        seccionContenido.appendChild(tituloContenido);

        this.areaVisualizacion = document.createElement("pre");
        this.areaVisualizacion.setAttribute("aria-label", "Área de visualización del contenido");
        
        this.errorArchivo = document.createElement("p");
      
        
        seccionContenido.append(this.areaVisualizacion, this.errorArchivo);
     
    }

    readInputFile(event) {
        const archivo = event.target.files[0];
        if (!archivo) return;
    
        this.nombreArchivo.innerText = `Nombre del archivo: ${archivo.name}`;
        this.tamañoArchivo.innerText = `Tamaño del archivo: ${archivo.size} bytes`;
        this.tipoArchivo.innerText = `Tipo del archivo: ${archivo.type}`;
        this.ultimaModificacion.innerText = `Fecha de la última modificación: ${archivo.lastModifiedDate}`;
    
        const tipoTexto = /text.*/;
    
        if (archivo.type.match(tipoTexto)) {
            const lector = new FileReader();
            lector.onload = (evento) => {
                const contenido = evento.target.result;
                this.errorArchivo.innerText = ""; // Limpia cualquier error anterior
                this.areaVisualizacion.innerText = contenido;
    
                // Procesar las noticias del archivo
                const lineas = contenido.split("\n");
                lineas.forEach((linea) => {
                    const [titulo, contenido, autor] = linea.split("_");
                    if (titulo && contenido && autor) {
                        const article = document.createElement("article");
                        article.innerHTML = `
                            <h4>${titulo.trim()}</h4>
                            <p>${contenido.trim()}</p>
                            <footer><strong>Autor:</strong> ${autor.trim()}</footer>
                        `;
    
                        // Insertar las noticias del archivo al inicio
                        this.newsContainer.insertBefore(article, this.newsContainer.firstChild);
                    }
                });
            };
            lector.readAsText(archivo);
        } else {
            this.errorArchivo.innerText = "Error: ¡¡¡ Archivo no válido !!!";
            this.areaVisualizacion.innerText = "";
        }
    }
    


// Método para añadir una nueva noticia
addNews() {
    // Obtén los valores de los inputs
    const titleInput = this.addNewsForm.querySelector("input[name='titulo']");
    const contentInput = this.addNewsForm.querySelector("textarea[name='contenido']");
    const authorInput = this.addNewsForm.querySelector("input[name='autor']");

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const author = authorInput.value.trim();

    // Validar que no estén vacíos
    if (!title || !content || !author) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    // Crear un nuevo artículo
    const newArticle = document.createElement("article");
    newArticle.innerHTML = `
        <h4>${title}</h4>
        <p>${content}</p>
        <footer><strong>Autor:</strong> ${author}</footer>
    `;

    // Añadirlo al contenedor de noticias
    this.newsContainer.appendChild(newArticle);

    // Limpia los campos del formulario
    titleInput.value = "";
    contentInput.value = "";
    authorInput.value = "";
}
}

