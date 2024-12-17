class Pais {
    nombrePais;
    nombreCapital;
    cantidadPoblacion;
    nombreCircuito;
    tipoGobierno;
    coordenadasMetaLatitud;
    coordenadasMetaLongitud;
    religionMayoritaria;

    constructor(nombrePais, nombreCapital, cantidadPoblacion) {
        this.nombrePais = nombrePais;
        this.nombreCapital = nombreCapital;
        this.cantidadPoblacion = cantidadPoblacion;
    }
   
    rellenarInformacionRestante()
    {
        this.nombreCircuito = "Shanghai";
        this.tipoGobierno = "Gobierno popular estatal";
        this.coordenadasMetaLatitud = "31.337238171688075"
        this.coordenadasMetaLongitud = "121.22028643578226";
        this.religionMayoritaria ="Budismo";
    }

    getNombrePais()
    {
        return ""+this.nombrePais;
    }

    getNombreCapital()
    {
        return ""+this.nombreCapital;
    }

    getInformacionSecundaria()
    {
        
        return ""+
        "<ul>"+
            "<li>"+
                "<h4>Nombre del circuito:</h4>"+
                "<p>"+this.nombreCircuito+"</p>"+
            "</li>"+
            "<li>"+
                "<h4>Cantidad de poblacion:</h4>"+
                "<p>"+this.cantidadPoblacion+"</p>"+
            "</li>"+
            "<li>"+
                "<h4>Forma de gobierno:</h4>"+
                "<p>"+this.tipoGobierno+"</p>"+
            "</li>"+
            "<li>"+
                "<h4>Religión mayoritaria:</h4>"+
                "<p>"+this.religionMayoritaria+"</p>"+
            "</li>"+
        "</ul>";
    }

    escribeCoordenadas()
    {
        document.write(
            "<p>Latitud: "+this.coordenadasLineaMetaLatitud+"</p>"+
            "<p>Longitud: "+this.coordenadasLineaMetaLongitud+"</p>"
        );
    }
    obtenerPrevisionTiempo() {
        const meteorologia = {
            apiKey: "d2b34fee546c2de560551f6b17f107ce",
            lat: 31.33721258891535,
            lon: 121.22029650718295,
            url: "https://api.openweathermap.org/data/2.5/forecast?" +
                 "lat=31.33721258891535&lon=121.22029650718295&" +
                 "mode=xml&lang=es&units=metric&appid=d2b34fee546c2de560551f6b17f107ce"
        };

        $.ajax({
            url: meteorologia.url,
            method: 'GET',
            dataType: 'xml',
            success: (data) => {
                this.procesarPrevisionTiempo(data);
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.error(`Error al obtener la previsión del tiempo: ${textStatus}, ${errorThrown}`);
            }
        });
    }

    procesarPrevisionTiempo(xmlData) {
        console.log(xmlData);
        const $xml = $(xmlData);
        const $prevision = $('main').first();

        // Limpiar contenido previo
        $prevision.empty();

        const pronosticos = $xml.find('time[from$="12:00:00"]'); // Pronósticos del mediodía

        pronosticos.each(function(index) {
            if (index < 5) { // Próximos 5 días
                const $this = $(this);

                const fecha = $this.attr('from').split('T')[0];
                const tempMax = $this.find('temperature').attr('max');
                const tempMin = $this.find('temperature').attr('min');
                const humedad = $this.find('humidity').attr('value');
                const simboloClima = $this.find('symbol').attr('var');
                const iconUrl = `https://openweathermap.org/img/wn/${simboloClima}@2x.png`;
                const lluvia = $this.find('precipitation').attr('value') || 'No disponible';

                const $article = $('<article></article>');
                $article.append(
                    `<h2>${fecha}</h2>`,
                    `<img src="${iconUrl}" alt="Icono del clima">`,
                    `<p>Temperatura Máxima: ${tempMax} °C</p>`,
                    `<p>Temperatura Mínima: ${tempMin} °C</p>`,
                    `<p>Humedad: ${humedad}%</p>`,
                    `<p>Lluvia: ${lluvia}</p>`
                );

                $prevision.append($article);
            }
        });
    }
}

