class Viajes {
    constructor() {
        this.latitude = null;
        this.longitude = null;
        this.errorMessage = null;

        this.initGeolocation();
    }

    initGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this.storePosition.bind(this),
                this.handleError.bind(this)
            );
        } else {
            this.errorMessage = "Geolocalización no soportada por el navegador.";
            this.displayError();
        }
    }

    storePosition(position) {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.displayPosition();
        this.displayStaticMap(); // Añade esta línea
        this.displayDynamicMap(); // Y esta línea
    }

    handleError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.errorMessage = "Permiso denegado para geolocalización.";
                break;
            case error.POSITION_UNAVAILABLE:
                this.errorMessage = "Información de geolocalización no disponible.";
                break;
            case error.TIMEOUT:
                this.errorMessage = "Tiempo de espera agotado para obtener la ubicación.";
                break;
            case error.UNKNOWN_ERROR:
                this.errorMessage = "Error desconocido en la geolocalización.";
                break;
        }
        this.displayError();
    }

    displayPosition() {
        const locationArticle = document.querySelector("main > article:nth-of-type(2)");
        
        var a = document.createElement("p");
        var texto = document.createTextNode("Latitud: " + this.latitude);
        a.appendChild(texto);

        var b = document.createElement("p");
        texto = document.createTextNode("Longitud: " + this.longitude);
        b.appendChild(texto);
        
        locationArticle.appendChild(a);
        locationArticle.appendChild(b); 
        
    }

    displayError() {
        const main = document.querySelector("main");
        const errorParagraph = document.createElement("p");
        errorParagraph.textContent = this.errorMessage;
        main.appendChild(errorParagraph);
    }

    displayStaticMap() {
        const mapArticle = document.querySelector("main > article:nth-of-type(3) > div");

        const mapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+fb0e55(${this.longitude},${this.latitude})/${this.longitude},${this.latitude},16,0/400x500?access_token=pk.eyJ1IjoibmVzdG9yMjU0MCIsImEiOiJjbTNmMDhzNWQwanppMmxzYWR4NGhxdTg5In0.3yLmtGrb9H9BRfeqAq0rsQ`;

        mapArticle.innerHTML = `<img src=${mapUrl} alt="Mapa estático de Mapbox">`;
    }

    displayDynamicMap() {
        const mapContainer = document.querySelector("main > article:nth-of-type(4) > div");

        mapboxgl.accessToken = "pk.eyJ1IjoibmVzdG9yMjU0MCIsImEiOiJjbTNmMDhzNWQwanppMmxzYWR4NGhxdTg5In0.3yLmtGrb9H9BRfeqAq0rsQ";

        const map = new mapboxgl.Map({
            container: mapContainer,
            style: "mapbox://styles/mapbox/streets-v9",
            center: [this.longitude, this.latitude],
            zoom: 14
        });

        new mapboxgl.Marker()
            .setLngLat([this.longitude, this.latitude])
            .addTo(map);
    }




    
    inicializarCarrusel() {
        const slides = document.querySelectorAll("article:nth-of-type(1) > img");

        // select next slide button
        const nextSlide = document.querySelector("article:nth-of-type(1) button:nth-of-type(1)");

        // current slide counter
        let curSlide = 0;
        // maximum number of slides
        let maxSlide = slides.length - 1;

        // add event listener and navigation functionality
        nextSlide.addEventListener("click", function () {
        // check if current slide is the last and reset current slide
        if (curSlide === maxSlide) {
            curSlide = 0;
        } else {
            curSlide++;
        }

        //   move slide by -100%
        slides.forEach((slide, indx) => {
  	    var trans = 100 * (indx - curSlide);
        $(slide).css('transform', 'translateX(' + trans + '%)')
        });
    });

    // select next slide button
    const prevSlide = document.querySelector("article:nth-of-type(1) button:nth-of-type(2)");

    // add event listener and navigation functionality
    prevSlide.addEventListener("click", function () {
    // check if current slide is the first and reset current slide to last
    if (curSlide === 0) {
        curSlide = maxSlide;
    } else {
        curSlide--;
    }

    //   move slide by 100%
    slides.forEach((slide, indx) => {
  	var trans = 100 * (indx - curSlide);
    $(slide).css('transform', 'translateX(' + trans + '%)')
    });
    });

        /* const imagenesCarrusel = document.querySelectorAll("article img");
    
        // Posicionar las imágenes inicialmente
        imagenesCarrusel.forEach((imagen, indice) => {
            $(imagen).css('transform', `translateX(${indice * 100}%)`);
        });
    
        const botonSiguiente = document.querySelector("article > button:nth-of-type(1)");
        const botonAnterior = document.querySelector("article > button:nth-of-type(2)");
    
        let indiceActual = 0; // Indice de la imagen visible actual
        const totalImagenes = imagenesCarrusel.length;
    
        const actualizarPosiciones = () => {
            imagenesCarrusel.forEach((imagen, indice) => {
                const desplazamiento = 100 * (indice - indiceActual);
                $(imagen).css('transform', `translateX(${desplazamiento}%)`);
            });
        };
    
        // Inicializar las posiciones
        actualizarPosiciones();
    
        botonSiguiente.addEventListener("click", () => {
            indiceActual = (indiceActual + 1) % totalImagenes; // Avanza y reinicia al llegar al final
            actualizarPosiciones();
        });
    
        botonAnterior.addEventListener("click", () => {
            indiceActual = (indiceActual - 1 + totalImagenes) % totalImagenes; // Retrocede y reinicia al llegar al inicio
            actualizarPosiciones();
        }); */
    }
}
