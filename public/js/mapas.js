// import
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const lat = document.querySelector('#lat').value || 19.43196563715849;
const lng = document.querySelector('#lng').value || -99.13328914153018;
const address = document.querySelector('#direccion').value || 'Plaza de la Constitución';
const map = L.map('mapa').setView([lat, lng], 15);
let markers = new L.FeatureGroup().addTo(map);
let marker;

/* utilizar el provider y geocoder*/
const geocodeService = L.esri.Geocoding.geocodeService();

/* colocar el pin en edición */
if (lat && lng) {
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(map)
        .bindPopup(address)
        .openPopup();

    //asiganr al contenedor marker
    markers.addLayer(marker);

    // detectar el movimiento del marker
    marker.on('moveend', function (e) {
        marker = e.target;
        const posicion = marker.getLatLng();
        map.panTo(new L.LatLng(posicion.lat, posicion.lng));
        geocodeService.reverse().latlng(posicion, 15).run(function (error, result) {
            llenarDireccion(result);
            marker.bindPopup(result.address.LongLabel);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {

    const mapaDiv = document.querySelector('#mapa');

    if (mapaDiv) {

        /* mapas */

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        /* L.marker([lat, lng]).addTo(map)
            .bindPopup('Escribe una dirección.')
            .openPopup(); */

        /* buscar la dirección */
        const buscador = document.querySelector('#formbuscador');
        buscador.addEventListener('input', buscarDireccion);
    }
});

const buscarDireccion = function (e) {
    if (e.target.value.length > 5) {
        /* si existe un pin anterior, limpiarlo */
        markers.clearLayers();
        if (marker) {
            map.removeLayer(marker);
        }

        
        const provider = new OpenStreetMapProvider();

        // search
        provider.search({ query: e.target.value })
            .then((res) => {
                geocodeService.reverse().latlng(res[0].bounds[0], 15).run(function (error, result) {
                    llenarDireccion(result);
                    /* L.marker(result.latlng).addTo(map).bindPopup(result.address.Match_addr).openPopup(); */
                    // mostrar el mapa
                    map.setView(res[0].bounds[0], 15);
                    // agregar el pin
                    marker = new L.marker(res[0].bounds[0], {
                        draggable: true,
                        autoPan: true
                    }).addTo(map)
                        .bindPopup(res[0].label)
                        .openPopup();

                    //asiganr al contenedor marker
                    markers.addLayer(marker);

                    // detectar el movimiento del marker
                    marker.on('moveend', function (e) {
                        marker = e.target;
                        const posicion = marker.getLatLng();
                        map.panTo(new L.LatLng(posicion.lat, posicion.lng));
                        geocodeService.reverse().latlng(posicion, 15).run(function (error, result) {
                            llenarDireccion(result);
                            marker.bindPopup(result.address.LongLabel);
                        });
                    });
                });


            });
    }
}

const llenarDireccion = function (result) {
    document.querySelector('#direccion').value = result.address.LongLabel || '';
    document.querySelector('#ciudad').value = result.address.City || '';
    document.querySelector('#estado').value = result.address.Region || '';
    document.querySelector('#pais').value = result.address.CountryCode || '';
    document.querySelector('#lat').value = result.latlng.lat || '';
    document.querySelector('#lng').value = result.latlng.lng || '';
}
