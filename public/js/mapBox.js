/*eslint-disable*/
const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken =
  'pk.eyJ1Ijoic2VuMW9yZGV2ZWxvcGVyIiwiYSI6ImNreXJpcnNmdzB1M28ycG81ODV5cXA1YTUifQ.PqSiPS9-R8hL24cgvQOdfw';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11'
});
