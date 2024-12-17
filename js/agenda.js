// agenda.js

class Agenda {
    constructor() {
        this.apiUrl = 'https://ergast.com/api/f1/current.json';
    }

    obtenerCarreras() {
        $.ajax({
            url: this.apiUrl,
            dataType: 'json',
            success: (info) => {
                this.procesarDatos(info);
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error('Error al obtener los datos:', textStatus, errorThrown);
            }
        });
    }

    procesarDatos(data) {
        const races = data.MRData.RaceTable.Races;
        const $contenedor = $('main > section').first();

        // Limpiamos el contenido que pueda haber
        $contenedor.empty();

        races.forEach((race) => {
            const nombreCarrera = race.raceName;
            const nombreCircuito = race.Circuit.circuitName;
            const latitud = race.Circuit.Location.lat;
            const longitud = race.Circuit.Location.long;
            const fecha = race.date;
            const hora = race.time || 'No especificada';

            // Creamos elementos HTML
            const $article = $('<article></article>');
            const $nombreCarrera = $('<h2></h2>').text(nombreCarrera);
            const $nombreCircuito = $('<p></p>').text(`Circuito: ${nombreCircuito}`);
            const $coordenadas = $('<p></p>').text(`Coordenadas: ${latitud}, ${longitud}`);
            const $fechaHora = $('<p></p>').text(`Fecha y hora: ${fecha} ${hora}`);

            // Añadimos los elementos al artículo
            $article.append($nombreCarrera, $nombreCircuito, $coordenadas, $fechaHora);

            // Añadimos el artículo al contenedor
            $contenedor.append($article);
        });
    }
}
