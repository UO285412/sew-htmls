class Fondo {
    constructor(nombrePais, nombreCapital, nombreCircuito) {
        this.nombrePais = nombrePais;
        this.nombreCapital = nombreCapital;
        this.nombreCircuito = nombreCircuito;
        this.apiKey = 'f3a69d2c5dc8783a4194ba3ffd9b167d'; 
    }

    getImagenFondo() {
        const flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
        $.getJSON(flickrAPI, 
            {
                tags: "shanghai,f1",
                tagmode: "all",
                format: "json"
            }
        ).done(function(data) {
            $.each(data.items, function(i, item) {
                $("<img />").attr("src", item.media.m.replace("_m","_b")).attr("alt","Fondo pantalla")
                    .attr("alt", "Imagen fondo pantalla")
                    .css({
                        "width": "100%",
                        "height": "auto"
                    })
                    .appendTo("body > main");
                if (i == 0) {
                    return false;
                }
            });
        });
    }
}

