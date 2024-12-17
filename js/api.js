class APIManager {
    constructor() {
        this.init();
    }

    // Método inicial
    init() {
        this.sections = document.querySelectorAll("main > section");
        this.geolocationButton = this.sections[0].querySelector("button");
        this.geolocationArticle = this.sections[0].querySelector("article");
        this.fileInput = this.sections[1].querySelector("input[type='file']");
        this.fileContentArticle = this.sections[1].querySelector("article");
        this.storedCircuitArticle = this.sections[2].querySelector("article");

        this.showStoredCircuit();
        this.setupGeolocation();
        this.setupFileInput();
    }

    // Mostrar circuito almacenado
    showStoredCircuit() {
        const storedCircuit = localStorage.getItem("lastCircuit");
        if (storedCircuit) {
            this.storedCircuitArticle.innerHTML = `<p>Último circuito: ${storedCircuit}</p>`;
        }
    }

    // Configurar la API de Geolocalización
    setupGeolocation() {
        this.geolocationButton.addEventListener("click", () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => this.displayGeolocation(position),
                    () => alert("No se pudo obtener la ubicación."),
                    { enableHighAccuracy: true }
                );
            } else {
                alert("Geolocalización no soportada por este navegador.");
            }
        });
    }

    displayGeolocation(position) {
        const { latitude, longitude } = position.coords;
        const paragraphs = this.geolocationArticle.querySelectorAll("p span:last-child");
        paragraphs[0].textContent = latitude.toFixed(6);
        paragraphs[1].textContent = longitude.toFixed(6);
    }

    // Configurar la API de File
    setupFileInput() {
        this.fileInput.addEventListener("change", (event) => this.readFile(event));
    }

    readFile(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                this.fileContentArticle.innerHTML = `<p>${reader.result}</p>`;
                localStorage.setItem("lastCircuit", file.name);
                this.storedCircuitArticle.innerHTML = `<p>Último circuito: ${file.name}</p>`;
            };
            reader.readAsText(file);
        }
    }
}
