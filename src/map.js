let map;

export function createMap() {
  mapboxgl.accessToken = 'pk.eyJ1Ijoib21lbHlhbml1ayIsImEiOiJja2wwcmwwaHowN3p3Mm50N3QybjVtaWRuIn0.AVN6lIafsOvMEBxSgpv3iQ'; //API key

  map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: [37.6156, 55.7522], // starting position [lng, lat]
    zoom: 8 // starting zoom
  });
}

export function updateMap(coord) {
  map.jumpTo({center: [coord.lon, coord.lat]});
}
