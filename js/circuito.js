/* Nestor Fernandez Garcia UO285412 */

"use strict";

class Circuito {
    constructor() {
        // Reemplaza 'TU_MAPBOX_ACCESS_TOKEN' con tu Token de Acceso de Mapbox
        mapboxgl.accessToken = "pk.eyJ1IjoibmVzdG9yMjU0MCIsImEiOiJjbTNmMDhzNWQwanppMmxzYWR4NGhxdTg5In0.3yLmtGrb9H9BRfeqAq0rsQ";
        this.map = null;
        this.currentLineId = 'circuit-line';

        // Verificar soporte de la API File
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // Adjuntar eventos una vez que el DOM esté cargado
            this.initEventListeners();
        } else {
            this.mostrarError("¡¡¡ Este navegador NO soporta la API File y este programa puede no funcionar correctamente !!!");
            this.deshabilitarCargaDeFichero();
        }
    }

    deshabilitarCargaDeFichero() {
        this.deshabilitarCargaDeFicheroXML();
        this.deshabilitarCargaDeFicheroKML();
        this.deshabilitarCargaDeFicheroSVG();
    }

    deshabilitarCargaDeFicheroXML() {
        const xmlInput = document.querySelector("main > section:nth-of-type(1) input[type='file']");
        if (xmlInput) {
            xmlInput.disabled = true;
        }
    }

    deshabilitarCargaDeFicheroKML() {
        const kmlInput = document.querySelector("main > section:nth-of-type(2) input[type='file']");
        if (kmlInput) {
            kmlInput.disabled = true;
        }
    }

    deshabilitarCargaDeFicheroSVG() {
        const svgInput = document.querySelector("main > section:nth-of-type(3) input[type='file']");
        if (svgInput) {
            svgInput.disabled = true;
        }
    }

    initEventListeners() {
        // Seleccionar los inputs sin usar id ni class
        const xmlInput = document.querySelector("main > section:nth-of-type(1) input[type='file']");
        const kmlInput = document.querySelector("main > section:nth-of-type(2) input[type='file']");
        const svgInput = document.querySelector("main > section:nth-of-type(3) input[type='file']");

        if (xmlInput) {
            xmlInput.addEventListener('change', (event) => this.cargarXML(event));
        }

        if (kmlInput) {
            kmlInput.addEventListener('change', (event) => this.cargarKml(event));
        }

        if (svgInput) {
            svgInput.addEventListener('change', (event) => this.cargarSVG(event));
        }
    }

    // Manejo de la carga de archivos XML
    cargarXML(event) {
        const file = event.target.files[0];
        if (!file) return;

        const xmlType = "text/xml";

        if (file.type.match(xmlType) || file.name.endsWith('.xml')) {
            this.deshabilitarCargaDeFicheroXML();
            this.procesarXML(file);
        } else {
            this.mostrarError("Error: ¡¡¡ Archivo no válido, debe ser un XML !!!");
        }
    }

    procesarXML(file) {
        const lector = new FileReader();

        lector.onload = () => {
            const xmlContent = lector.result;
            this.displayXMLContent(xmlContent);
        };

        lector.onerror = () => {
            this.mostrarError("Error al leer el archivo XML.");
        };

        lector.readAsText(file);
    }

    displayXMLContent(xmlContent) {
        // Parsear el contenido XML
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlContent, "application/xml");

        // Verificar si hay errores en el parseo
        if (xmlDoc.getElementsByTagName("parsererror").length > 0) {
            this.mostrarError("Error al parsear el archivo XML.");
            return;
        }

        // Seleccionar el contenedor para mostrar el contenido XML
        const displayContainer = document.querySelector("main > section:nth-of-type(1) > article");
        if (!displayContainer) {
            console.error("Contenedor no encontrado para mostrar el contenido del XML.");
            return;
        }

        // Limpiar contenido previo
        displayContainer.innerHTML = "";

        // Extraer elementos y mostrar su contenido
        const elements = xmlDoc.getElementsByTagName("*"); // Obtener todos los elementos

        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            // Evitar mostrar el documento raíz si no es necesario
            if (element.parentNode === xmlDoc) continue;

            const p = document.createElement("p");
            p.textContent = `${element.nodeName}: ${element.textContent.trim()}`;
            displayContainer.appendChild(p);
        }
    }

    // Manejo de la carga de archivos KML
    cargarKml(event) {
        const files = event.target.files;
        if (files.length === 0) {
            this.mostrarError('Por favor, selecciona un archivo KML.');
            return;
        }

        const file = files[0];
        if (file.type !== 'application/vnd.google-earth.kml+xml' && !file.name.endsWith('.kml')) {
            this.mostrarError('Por favor, sube un archivo en formato KML.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const kmlText = e.target.result;
            this.procesarKml(kmlText);
        };
        reader.readAsText(file);
    }

    procesarKml(kmlText) {
        // Parsear el texto KML a un documento XML
        const parser = new DOMParser();
        const xml = parser.parseFromString(kmlText, "application/xml");

        // Verificar si hay errores en el parseo
        const parserError = xml.getElementsByTagName("parsererror");
        if (parserError.length > 0) {
            this.mostrarError('Error al parsear el archivo KML.');
            return;
        }

        // Extraer las coordenadas del LineString
        const coordinatesElements = xml.getElementsByTagName("coordinates");
        if (coordinatesElements.length === 0) {
            this.mostrarError('No se encontraron coordenadas en el archivo KML.');
            return;
        }

        const coordinatesText = coordinatesElements[0].textContent.trim();
        const coordLines = coordinatesText.split('\n');
        const path = [];

        coordLines.forEach(line => {
            const parsed = this.parseKMLCoordinate(line.trim());
            if (parsed) {
                path.push(parsed); // [lon, lat]
            }
        });

        if (path.length === 0) {
            this.mostrarError('No se encontraron coordenadas válidas en el archivo KML.');
            return;
        }

        // Mostrar e inicializar el mapa
        this.mostrarMapa(path);
    }

    mostrarMapa(path) {
        // Seleccionar el contenedor del mapa usando <article>
        const mapContainer = document.querySelector("main > section:nth-of-type(2) > article");

        if (!mapContainer) {
            console.error("Contenedor del mapa no encontrado.");
            return;
        }

        // Insertar un elemento que permita a Mapbox renderizar el mapa
        // Utilizamos el propio <article> como contenedor del mapa
        mapContainer.innerHTML = ''; // Limpiar contenido previo

        // Inicializar el mapa
        this.map = new mapboxgl.Map({
            container: mapContainer, // Referencia al contenedor del mapa
            style: 'mapbox://styles/mapbox/streets-v11', // Estilo del mapa
            center: path[0], // Centrar el mapa en la primera coordenada
            zoom: 15
        });

        // Agregar controles de navegación
        this.map.addControl(new mapboxgl.NavigationControl());

        // Añadir la ruta al mapa una vez que se haya cargado
        this.map.on('load', () => {
            this.addRutaAlMapa(path);
            this.map.resize(); // Asegurar que el mapa se adapte al contenedor
        });
    }

    addRutaAlMapa(path) {
        // Crear GeoJSON LineString
        const geojson = {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": path
            }
        };

        // Si ya existe la fuente y capa, eliminarlas antes de agregar una nueva
        if (this.map.getSource(this.currentLineId)) {
            this.map.removeLayer(this.currentLineId);
            this.map.removeSource(this.currentLineId);
        }

        // Añadir el GeoJSON como una fuente
        this.map.addSource(this.currentLineId, {
            "type": "geojson",
            "data": geojson
        });

        // Añadir una capa para la línea
        this.map.addLayer({
            "id": this.currentLineId,
            "type": "line",
            "source": this.currentLineId,
            "layout": {
                "line-join": "round",
                "line-cap": "round"
            },
            "paint": {
                "line-color": "#FF0000",
                "line-width": 5
            }
        });

        // Ajustar el mapa para que muestre toda la polilínea
        const bounds = new mapboxgl.LngLatBounds();
        path.forEach(coord => bounds.extend(coord));
        this.map.fitBounds(bounds, { padding: 20 });
    }

    parseKMLCoordinate(coordStr) {
        // Ejemplo de coordStr: "121.216998°E,31.336619°N,3"
        // Objetivo: Convertir a [lon, lat]

        // Separar por comas
        const parts = coordStr.split(',');
        if (parts.length < 2) return null;

        // Parsear longitud
        let lonStr = parts[0].trim();
        let latStr = parts[1].trim();

        const lonMatch = lonStr.match(/^([\d.]+)°([EW])$/);
        const latMatch = latStr.match(/^([\d.]+)°([NS])$/);

        if (!lonMatch || !latMatch) return null;

        let lon = parseFloat(lonMatch[1]);
        const lonDir = lonMatch[2];
        if (lonDir === 'W') lon = -lon;

        let lat = parseFloat(latMatch[1]);
        const latDir = latMatch[2];
        if (latDir === 'S') lat = -lat;

        return [lon, lat];
    }

    // Manejo de la carga de archivos SVG
    cargarSVG(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.name.endsWith('.svg')) {
            this.deshabilitarCargaDeFicheroSVG();
            this.procesarSVG(file);
        } else {
            this.mostrarError("Error: ¡¡¡ Archivo no válido, debe ser un SVG !!!");
        }
    }

    procesarSVG(file) {
        const lector = new FileReader();

        lector.onload = () => {
            const svgContent = lector.result;
            this.crearCamposSVG(svgContent);
        };

        lector.onerror = () => {
            this.mostrarError("Error al leer el archivo SVG.");
        };

        lector.readAsText(file);
    }

    crearCamposSVG(svgContent) {
        // Seleccionar el contenedor del SVG usando <figure>
        const seccion = document.querySelector("main > section:nth-of-type(3) > figure");

        if (!seccion) {
            console.error("Contenedor del SVG no encontrado.");
            return;
        }

        // Insertar el SVG directamente en <figure>
        seccion.innerHTML = svgContent;


    }

  
}

(() => {
    new Circuito();
})();
