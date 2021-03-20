/* global L:readonly */
import {getRentPopup} from './popup.js';
import {fetchMapData, onFetchError} from './fetch.js';

const addressInput = document.querySelector('#address');
const mapCenterLatLng = {
  lat: 35.6895000,
  lng: 139.6917100,
};

const map = L.map('map-canvas')
  .setView(mapCenterLatLng, 10);

const markers = L.layerGroup().addTo(map);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
).addTo(map);

const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const pinIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const mainPinMarker = L.marker(
  map.getCenter(),
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

mainPinMarker.addTo(map);

mainPinMarker.on('moveend', (evt) => {
  addressInput.value = `${evt.target.getLatLng().lat.toFixed(5)}, ${evt.target.getLatLng().lng.toFixed(5)}`;
});

map.on('adv-form-submitted', () => {
  map.setView(mapCenterLatLng, 10);
  mainPinMarker.setLatLng(mapCenterLatLng).fire('moveend');
});

const renderMarkers = function (rents) {
  markers.clearLayers();

  rents.forEach((rent) => {
    markers.addLayer(rent.pointerMarker);
  })
}

const onFetchSuccess = function (rents) {
  rents.forEach((rent) => {
    const popupHtml = getRentPopup(rent, true);

    const pinMarker = L.marker(
      {
        lat: rent.location.lat,
        lng: rent.location.lng,
      },
      {
        icon: pinIcon,
      });

    const helperDiv = document.createElement('div');
    helperDiv.appendChild(popupHtml);

    pinMarker.bindPopup(helperDiv.innerHTML);

    rent.pointerMarker = pinMarker;
  })

  map.fire('load-all-data', {rents: rents});
};

map.addHandler('load', function () {
  addressInput.setAttribute('readonly', '');
  addressInput.value = `${mainPinMarker.getLatLng().lat.toFixed(5)}, ${mainPinMarker.getLatLng().lng.toFixed(5)}`;

  fetchMapData(onFetchSuccess, onFetchError);
});

export {map, renderMarkers};
